"use client";

import { useState } from "react";
import PixelInput from "@/components/pixelInput";
import { MNISTOutput } from "@/components/mnistOutput";

export function Interface() {
  const [output, setOutput] = useState<number[]>(
    Array.from({ length: 728 }, () => 0),
  );

  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 md:gap-0">
      <div className="w-[70%] relative">
        <PixelInput setOutput={setOutput} />
      </div>
      <MNISTOutput data={output} />
    </div>
  );
}
