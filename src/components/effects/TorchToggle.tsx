
import React from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { Flashlight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive } = useTorch();
  const { uvMode, toggleUVMode } = useUVMode();

  const handleToggleTorch = () => {
    if (uvMode) {
      // Si le mode UV est actif, le désactiver d'abord
      toggleUVMode();
      // Puis activer la torche après un léger délai
      setTimeout(() => {
        setIsTorchActive(true);
      }, 100);
    } else {
      // Sinon, simplement inverser l'état de la torche
      setIsTorchActive(!isTorchActive);
    }
  };

  const handleToggleUV = () => {
    // Add small vibration on mobile if supported
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.log("Vibration not supported", e);
      }
    }
    
    // Si la torche est active, la désactiver d'abord
    if (isTorchActive) {
      setIsTorchActive(false);
    }
    
    // Puis basculer le mode UV après un léger délai
    setTimeout(() => {
      toggleUVMode();
    }, 100);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
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
      >
        <Flashlight className="w-6 h-6" />
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
    </div>
  );
};
