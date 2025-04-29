
import React from "react";
import { useTorch } from "./TorchContext";
import { use3DTorch } from "./Torch3DContext";
import { Flashlight, Box, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive, uvMode, toggleUVMode } = useTorch();
  const { is3DModeActive, toggle3DMode } = use3DTorch();

  const handleToggleUV = () => {
    // Ajouter une petite vibration sur mobile si supporté
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.log("Vibration non supportée", e);
      }
    }
    
    toggleUVMode();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Button
        onClick={() => setIsTorchActive(!isTorchActive)}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
          isTorchActive 
            ? "bg-yellow-400 text-black shadow-yellow-400/50" 
            : "bg-gray-800 text-yellow-400"
        }`}
        aria-label="Toggle flashlight"
        variant="outline"
        size="icon"
      >
        <Flashlight className="w-6 h-6" />
      </Button>
      
      {isTorchActive && (
        <>
          <Button
            onClick={toggle3DMode}
            className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
              is3DModeActive 
                ? "bg-yellow-400 text-black shadow-yellow-400/50" 
                : "bg-gray-800 text-yellow-400"
            }`}
            aria-label="Toggle 3D mode"
            variant="outline"
            size="icon"
          >
            <Box className="w-6 h-6" />
          </Button>
          
          <Button
            onClick={handleToggleUV}
            className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 relative ${
              uvMode 
                ? "bg-blue-600 text-white shadow-blue-600/50" 
                : "bg-gray-800 text-purple-400"
            }`}
            aria-label="Toggle UV mode"
            variant="outline"
            size="icon"
          >
            <Eye className={`w-6 h-6 ${uvMode ? 'animate-pulse' : ''}`} />
            {uvMode && (
              <span className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-30"></span>
            )}
            {uvMode && (
              <span className="absolute text-[8px] font-bold -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                UV
              </span>
            )}
          </Button>
        </>
      )}
    </div>
  );
};
