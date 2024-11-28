"use client";

import { Button } from "@/components/ui/button";
import { HelpDialog } from "@/components/helpDialog";
import { Eraser, HelpCircle, Pencil, Trash } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";

const GRID_SIZE = 28;
const CELL_SIZE = 15;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const SAVE_INTERVAL = 500; // Save interval in milliseconds

export default function PixelInput({
  setOutput,
}: {
  setOutput: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDrawnCell = useRef<{ x: number; y: number } | null>(null);

  const updateOutput = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const binaryArray = new Array(GRID_SIZE * GRID_SIZE).fill(0);

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const imageData = ctx.getImageData(x * CELL_SIZE, y * CELL_SIZE, 1, 1);
        const index = y * GRID_SIZE + x;
        binaryArray[index] = imageData.data[0] === 0 ? 1 : 0;
      }
    }

    setOutput(binaryArray);
  }, [setOutput]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE; i++) {
      const position = i * CELL_SIZE - 0.5;

      ctx.beginPath();
      ctx.moveTo(position, 0);
      ctx.lineTo(position, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, position);
      ctx.lineTo(CANVAS_SIZE, position);
      ctx.stroke();
    }
  }, []);

  const drawCell = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      // Prevent drawing the same cell multiple times
      if (lastDrawnCell.current?.x === x && lastDrawnCell.current?.y === y) {
        return;
      }

      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        ctx.fillStyle = isEraseMode ? "white" : "black";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        // Redraw grid lines for the affected cell
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 1;

        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE - 0.5, y * CELL_SIZE);
        ctx.lineTo(x * CELL_SIZE - 0.5, (y + 1) * CELL_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((x + 1) * CELL_SIZE - 0.5, y * CELL_SIZE);
        ctx.lineTo((x + 1) * CELL_SIZE - 0.5, (y + 1) * CELL_SIZE);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, y * CELL_SIZE - 0.5);
        ctx.lineTo((x + 1) * CELL_SIZE, y * CELL_SIZE - 0.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, (y + 1) * CELL_SIZE - 0.5);
        ctx.lineTo((x + 1) * CELL_SIZE, (y + 1) * CELL_SIZE - 0.5);
        ctx.stroke();

        lastDrawnCell.current = { x, y };
      }
    },
    [isEraseMode],
  );

  const getCoordinates = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>,
      canvas: HTMLCanvasElement,
    ) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX: number, clientY: number;
      if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      const x = Math.floor(((clientX - rect.left) * scaleX) / CELL_SIZE);
      const y = Math.floor(((clientY - rect.top) * scaleY) / CELL_SIZE);

      return { x, y };
    },
    [],
  );

  const draw = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = getCoordinates(e, canvas);

      // For single clicks/taps or when starting to draw
      if (
        !isDrawing &&
        "type" in e &&
        (e.type === "mousedown" || e.type === "touchstart")
      ) {
        drawCell(ctx, x, y);
        updateOutput();
        return;
      }

      // For dragging
      if (isDrawing) {
        drawCell(ctx, x, y);
      }
    },
    [isDrawing, drawCell, getCoordinates, updateOutput],
  );

  const startDrawing = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      setIsDrawing(true);
      lastDrawnCell.current = null; // Reset last drawn cell
      draw(e);

      if (saveIntervalRef.current === null) {
        saveIntervalRef.current = setInterval(updateOutput, SAVE_INTERVAL);
      }
    },
    [draw, updateOutput],
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastDrawnCell.current = null; // Reset last drawn cell

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    updateOutput();
  }, [updateOutput]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawGrid(ctx);
    setOutput(Array.from({ length: GRID_SIZE * GRID_SIZE }, () => 0));
  }, [drawGrid, setOutput]);

  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawGrid(ctx);
  }, [drawGrid]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEraseMode(false)}
              variant={isEraseMode ? "outline" : "default"}
              className="w-24"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Draw
            </Button>
            <Button
              onClick={() => setIsEraseMode(true)}
              variant={isEraseMode ? "default" : "outline"}
              className="w-24"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Erase
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={clearCanvas} variant="outline" className="w-24">
              <Trash className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <HelpDialog
              trigger={
                <Button variant="outline" className="w-24">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Tips
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border border-gray-300 w-full aspect-square touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={(e) => {
          startDrawing(e);
        }}
        onTouchMove={(e) => {
          draw(e);
        }}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
