
import React, { useEffect } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { Flashlight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TorchToggle = () => {
  const { isTorchActive, setIsTorchActive } = useTorch();
  const { uvMode, toggleUVMode } = useUVMode();
  
  // Vérifier si l'utilisateur a déjà visité la page Artists
  const hasVisitedArtistsPage = localStorage.getItem('hasVisitedArtistsPage') === 'true';

  // Fonction pour suivre la visite de la page Artists
  // Cette fonction sera appelée ailleurs, dans le composant approprié
  const checkAndRecordArtistsVisit = (pathname: string) => {
    if (pathname === "/artists") {
      localStorage.setItem('hasVisitedArtistsPage', 'true');
    }
  };

  const handleToggleTorch = () => {
    // Activer/désactiver uniquement la torche classique
    // La torche UV reste inchangée
    setIsTorchActive(!isTorchActive);
    
    // Si le mode UV est activé, le désactiver quand on éteint la torche
    if (isTorchActive && uvMode) {
      toggleUVMode();
    }
  };

  const handleToggleUV = () => {
    // Vibration pour feedback tactile
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.warn("Vibration non supportée :", e);
      }
    }

    // Si on désactive le mode UV, on désactive également la torche
    if (uvMode) {
      setIsTorchActive(false);
      toggleUVMode();
    } else {
      // Si on active le mode UV, on s'assure que la torche est active
      setIsTorchActive(true);
      toggleUVMode();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[250] flex gap-2">
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

      {/* Bouton UV - visible uniquement si l'utilisateur a visité la page Artists */}
      {hasVisitedArtistsPage && (
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
      )}
    </div>
  );
};

// Exporter cette fonction pour l'utiliser dans les composants qui ont accès au router
export const recordArtistsVisit = (pathname: string) => {
  if (pathname === "/artists") {
    localStorage.setItem('hasVisitedArtistsPage', 'true');
  }
};
