
import React from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { Flashlight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive } = useTorch();
  const { uvMode, toggleUVMode } = useUVMode();

  const handleToggleTorch = () => {
    if (!isTorchActive) {
      setIsTorchActive(true);
      if (uvMode) toggleUVMode(); // Désactive le mode UV si on active la torche normale
    } else {
      setIsTorchActive(false);
    }
  };

  const handleToggleUV = () => {
    // Ajout petite vibration sur mobile si supporté
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.log("Vibration not supported", e);
      }
    }
    
    // Active également la torche si elle n'est pas déjà active
    if (!isTorchActive) {
      setIsTorchActive(true);
    }
    
    toggleUVMode();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex gap-2">
      <Button
        onClick={handleToggleTorch}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
          isTorchActive && !uvMode
            ? "bg-yellow-400 text-black shadow-yellow-400/50" 
            : "bg-gray-800 text-yellow-400"
        }`}
        aria-label="Toggle flashlight"
        variant="outline"
        size="icon"
        style={{ isolation: "isolate" }} /* Empêche les effets de la torche d'affecter le bouton */
      >
        <Flashlight className="w-6 h-6" />
      </Button>
      
      <Button
        onClick={handleToggleUV}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 relative ${
          isTorchActive && uvMode
            ? "bg-blue-600 text-white shadow-blue-600/50" 
            : "bg-gray-800 text-purple-400"
        }`}
        aria-label="Toggle UV mode"
        variant="outline"
        size="icon"
        style={{ isolation: "isolate" }} /* Empêche les effets de la torche d'affecter le bouton */
      >
        <Eye className={`w-6 h-6 ${uvMode ? 'animate-pulse' : ''}`} />
        {uvMode && isTorchActive && (
          <span className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-30"></span>
        )}
        {uvMode && isTorchActive && (
          <span className="absolute text-[8px] font-bold -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
            UV
          </span>
        )}
      </Button>
    </div>
  );
};
