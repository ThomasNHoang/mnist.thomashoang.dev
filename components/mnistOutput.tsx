"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProbabilityChart } from "@/components/probabilityChart";

// Types
type Layer = {
  weights: number[][];
  biases: number[];
};

type Model = Layer[];

type ModelConfig = {
  modelPath: string;
  title?: string;
};

// Helper Functions
function sigmoid(x: number): number {
  if (x < -709) return 0;
  if (x > 709) return 1;
  return 1 / (1 + Math.exp(-x));
}

function relu(x: number): number {
  return Math.max(0, x);
}

function softmax(arr: number[]): number[] {
  const maxVal = Math.max(...arr);
  const expValues = arr.map((x) => Math.exp(x - maxVal));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  return expValues.map((exp) => exp / sumExp);
}

function matMul(
  vector: number[],
  matrix: number[][],
  bias: number[],
): number[] {
  return matrix[0].map((_, colIndex) => {
    const sum = vector.reduce((acc, val, rowIndex) => {
      const product = val * matrix[rowIndex][colIndex];
      return acc + (isFinite(product) ? product : 0);
    }, 0);
    return isFinite(sum) ? sum + bias[colIndex] : bias[colIndex];
  });
}

function predict(
  input: number[],
  weightsBiases: Model,
): { probabilities: number[]; predictedClass: number } {
  let hidden1 = matMul(
    input,
    weightsBiases[0].weights,
    weightsBiases[0].biases,
  );
  hidden1 = hidden1.map(sigmoid);

  let hidden2 = matMul(
    hidden1,
    weightsBiases[1].weights,
    weightsBiases[1].biases,
  );
  hidden2 = hidden2.map(relu);

  const output = matMul(
    hidden2,
    weightsBiases[2].weights,
    weightsBiases[2].biases,
  );
  const probabilities = softmax(output);

  const predictedClass = probabilities.reduce(
    (maxIndex, current, currentIndex, arr) =>
      current > arr[maxIndex] ? currentIndex : maxIndex,
    0,
  );

  return {
    probabilities,
    predictedClass,
  };
}

// Model Loading
async function loadModelWeights(url: string): Promise<Model> {
  const response = await fetch(url);
  const weightsBiases: Layer[] = await response.json();
  return weightsBiases;
}

const modelCache: Map<string, Model> = new Map();

// Neural Output Component
type NeuralOutputProps = {
  data: number[];
  modelConfig: ModelConfig;
  className?: string;
};

export function NeuralOutput({
  data,
  modelConfig,
  className = "",
}: NeuralOutputProps) {
  const [probabilities, setProbabilities] = useState<number[]>(
    Array.from({ length: 10 }, () => 0),
  );
  const [predictedClass, setPredictedClass] = useState<number | null>(null); // Added state for predicted class
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        if (!modelCache.has(modelConfig.modelPath)) {
          const model = await loadModelWeights(modelConfig.modelPath);
          modelCache.set(modelConfig.modelPath, model);
        }
        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Error loading model:", err);
        setError(
          `Failed to load model: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setIsModelLoaded(false);
      }
    };

    loadModel();
  }, [modelConfig.modelPath]);

  useEffect(() => {
    if (!isModelLoaded || !modelCache.has(modelConfig.modelPath)) return;

    const performPrediction = () => {
      const isAllZeros = data.every((element) => element === 0);

      if (isAllZeros) {
        setProbabilities(Array.from({ length: 10 }, () => 0));
        setPredictedClass(null); // Reset predicted class
        return;
      }

      try {
        const model = modelCache.get(modelConfig.modelPath)!;
        const result = predict(data, model);
        // console.log(
        //   "Model:",
        //   modelConfig.modelPath,
        //   "Probabilities:",
        //   result.probabilities,
        //   "Predicted:",
        //   result.predictedClass
        // );
        setProbabilities(result.probabilities);
        setPredictedClass(result.predictedClass); // Set predicted class
        setError(null);
      } catch (err) {
        console.error("Prediction error:", err);
        setError(
          `Prediction failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    };

    performPrediction();
  }, [data, isModelLoaded, modelConfig]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={className}>
      {modelConfig.title && (
        <h3 className="text-lg font-semibold mb-2">{modelConfig.title}</h3>
      )}
      <ProbabilityChart
        chartData={probabilities.map((probability, index) => ({
          number: index,
          probability: probability * 100,
        }))}
      />
      {predictedClass !== null && ( // Display predicted number if available
        <p className="text-lg font-bold mt-4">
          Predicted Number: {predictedClass}
        </p>
      )}
    </div>
  );
}

// MNIST Output Component
export function MNISTOutput({ data }: { data: number[] }) {
  const models: { [key: string]: { modelPath: string; title: string } } = {
    original: {
      modelPath: "/model_weights_biases.json",
      title: "Original Model",
    },
    v1: {
      modelPath: "/model_weights_biasesv1.json",
      title: "Model 1",
    },
    v2: {
      modelPath: "/model_weights_biasesv2.json",
      title: "Model 2",
    },
    v3: {
      modelPath: "/model_weights_biasesv3.json",
      title: "Model 3",
    },
  } as const;

  const [selectedModel, setSelectedModel] = useState<keyof typeof models>("v2");

  const currentModel = models[selectedModel];

  return (
    <div className="gap-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Select Model</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Models</DropdownMenuLabel>
          {Object.keys(models).map((key) => (
            <DropdownMenuItem key={key} onClick={() => setSelectedModel(key)}>
              {models[key as keyof typeof models].title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <NeuralOutput
        data={data}
        modelConfig={{
          modelPath: currentModel.modelPath,
          title: currentModel.title,
        }}
      />
    </div>
  );
}
