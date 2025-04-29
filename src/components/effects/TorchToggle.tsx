
import React from "react";
import { useTorch } from "./TorchContext";
import { use3DTorch } from "./Torch3DContext";
import { Flashlight, Box, Eye } from "lucide-react";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive, uvMode, toggleUVMode } = useTorch();
  const { is3DModeActive, toggle3DMode } = use3DTorch();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => setIsTorchActive(!isTorchActive)}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
          isTorchActive 
            ? "bg-yellow-400 text-black shadow-yellow-400/50" 
            : "bg-gray-800 text-yellow-400"
        }`}
        aria-label="Toggle flashlight"
      >
        <Flashlight className="w-6 h-6" />
      </button>
      
      {isTorchActive && (
        <>
          <button
            onClick={toggle3DMode}
            className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
              is3DModeActive 
                ? "bg-yellow-400 text-black shadow-yellow-400/50" 
                : "bg-gray-800 text-yellow-400"
            }`}
            aria-label="Toggle 3D mode"
          >
            <Box className="w-6 h-6" />
          </button>
          
          <button
            onClick={toggleUVMode}
            className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
              uvMode 
                ? "bg-purple-600 text-white shadow-purple-600/50" 
                : "bg-gray-800 text-purple-400"
            }`}
            aria-label="Toggle UV mode"
          >
            <Eye className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};
