
import React from "react";
import { useTorch } from "./TorchContext";
import { Flashlight } from "lucide-react";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive } = useTorch();

  return (
    <button
      onClick={() => setIsTorchActive(!isTorchActive)}
      className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
        isTorchActive 
          ? "bg-yellow-400 text-black shadow-yellow-400/50" 
          : "bg-gray-800 text-yellow-400"
      }`}
      aria-label="Toggle flashlight"
    >
      <Flashlight className="w-6 h-6" />
    </button>
  );
};
