
import React from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { Flashlight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive } = useTorch();
  const { uvMode, toggleUVMode } = useUVMode();

  const handleToggleTorch = () => {
    if (!isTorchActive || uvMode) {
      setIsTorchActive(true);
      if (uvMode) toggleUVMode(); // Quitte le mode UV si actif
    } else {
      setIsTorchActive(false);
    }
  };

  const handleToggleUV = () => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.warn("Vibration non supportée :", e);
      }
    }

    // Active la torche si UV est déclenché seul
    if (!isTorchActive) {
      setIsTorchActive(false);
    }

    toggleUVMode();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex gap-2">
      {/* Bouton Torche classique */}
      <Button
        onClick={handleToggleTorch}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
          isTorchActive && !uvMode
            ? "bg-yellow-400 text-black shadow-yellow-400/50"
            : "bg-gray-800 text-yellow-400"
        }`}
        aria-label="Activer/désactiver la lampe torche"
        variant="outline"
        size="icon"
        style={{ isolation: "isolate" }}
      >
        <Flashlight className="w-6 h-6" />
      </Button>

      {/* Bouton UV */}
      <Button
        onClick={handleToggleUV}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 relative ${
          isTorchActive && uvMode
            ? "bg-blue-600 text-white shadow-blue-600/50"
            : "bg-gray-800 text-purple-400"
        }`}
        aria-label="Activer/désactiver le mode UV"
        variant="outline"
        size="icon"
        style={{ isolation: "isolate" }}
      >
        <Eye className={`w-6 h-6 ${uvMode ? 'animate-pulse' : ''}`} />
        
        {uvMode && isTorchActive && (
          <>
            <span className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping scale-110"></span>
            <span className="absolute text-[8px] font-bold -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
              UV
            </span>
          </>
        )}
      </Button>
    </div>
  );
};

