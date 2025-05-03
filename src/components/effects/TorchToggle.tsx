
import React, { useCallback, useRef } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { Flashlight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive } = useTorch();
  const { uvMode, toggleUVMode } = useUVMode();
  const isHandlingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer les timeouts lors du démontage
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleToggleTorch = useCallback(() => {
    // Éviter les clics multiples rapides
    if (isHandlingRef.current) return;
    isHandlingRef.current = true;
    
    // Activer/désactiver la torche classique
    setIsTorchActive(!isTorchActive);
    
    // Si le mode UV est activé et qu'on éteint la torche, désactiver le mode UV aussi
    if (isTorchActive && uvMode) {
      toggleUVMode();
    }
    
    console.log(`Torch toggled: ${!isTorchActive}`);
    
    // Réinitialiser le drapeau après un délai
    timeoutRef.current = setTimeout(() => {
      isHandlingRef.current = false;
    }, 300);
  }, [isTorchActive, uvMode, setIsTorchActive, toggleUVMode]);

  const handleToggleUV = useCallback(() => {
    // Éviter les clics multiples rapides
    if (isHandlingRef.current) return;
    isHandlingRef.current = true;
    
    // Vibration pour feedback tactile si disponible
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.warn("Vibration non supportée :", e);
      }
    }

    // Si on active le mode UV, on s'assure que la torche est active également
    if (!uvMode) {
      // Activer la torche si elle n'est pas déjà active
      if (!isTorchActive) {
        setIsTorchActive(true);
      }
      
      // Ajouter un délai pour s'assurer que la torche est activée avant le mode UV
      timeoutRef.current = setTimeout(() => {
        toggleUVMode();
        console.log("UV mode on, torch activated");
        
        // Réinitialiser le drapeau
        timeoutRef.current = setTimeout(() => {
          isHandlingRef.current = false;
        }, 300);
      }, 100);
    } else {
      // Si on désactive le mode UV, on laisse la torche classique active
      toggleUVMode();
      console.log("UV mode off, torch remains active");
      
      // Réinitialiser le drapeau
      timeoutRef.current = setTimeout(() => {
        isHandlingRef.current = false;
      }, 300);
    }
  }, [isTorchActive, uvMode, setIsTorchActive, toggleUVMode]);

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex gap-2">
      {/* Bouton Torche classique */}
      <Button
        onClick={handleToggleTorch}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
          isTorchActive
            ? "bg-yellow-400 text-black shadow-yellow-400/50"
            : "bg-gray-800 text-yellow-400"
        }`}
        aria-label="Activer/désactiver la lampe torche"
        variant="outline"
        size="icon"
        style={{ isolation: "isolate" }}
        disabled={isHandlingRef.current} // Désactiver pendant les transitions
      >
        <Flashlight className="w-6 h-6" />
      </Button>

      {/* Bouton UV */}
      <Button
        onClick={handleToggleUV}
        className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 relative ${
          uvMode
            ? "bg-blue-600 text-white shadow-blue-600/50"
            : "bg-gray-800 text-purple-400"
        }`}
        aria-label="Activer/désactiver le mode UV"
        variant="outline"
        size="icon"
        style={{ isolation: "isolate" }}
        disabled={(!isTorchActive && uvMode) || isHandlingRef.current} // Désactiver pendant les transitions
      >
        <Eye className={`w-6 h-6 ${uvMode ? 'animate-pulse' : ''}`} />
        
        {uvMode && (
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
