
import { create } from 'zustand';
import { useEffect, useRef } from 'react';
import { useUVMode } from './UVModeContext';

// Type d'état du magasin pour les vidéos
type VideoState = {
  play: (() => void) | null;
  pause: (() => void) | null;
  currentMode: 'normal' | 'uv';
  setMode: (mode: 'normal' | 'uv') => void;
};

// Création du magasin Zustand pour la gestion des vidéos
export const useVideoStore = create<VideoState>((set) => ({
  play: null,
  pause: null,
  currentMode: 'normal',
  setMode: (mode) => set({ currentMode: mode }),
}));

export const BackgroundVideoManager = () => {
  // Références aux éléments vidéos
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  
  // Récupération du context du mode UV
  const { uvMode } = useUVMode();
  
  // Référence pour éviter les mises à jour en boucle
  const prevUvModeRef = useRef<boolean>(uvMode);
  const storeInitializedRef = useRef<boolean>(false);
  
  // Initialiser les méthodes de contrôle vidéo une seule fois
  useEffect(() => {
    if (storeInitializedRef.current) return;
    
    // Définir les fonctions de contrôle dans le store
    useVideoStore.setState({
      play: () => {
        const videoToPlay = uvMode ? uvVideoRef.current : normalVideoRef.current;
        if (videoToPlay) {
          console.log(`Lecture vidéo ${uvMode ? 'UV' : 'normale'}`);
          videoToPlay.currentTime = 0; // Réinitialiser la position
          videoToPlay.play().catch(e => console.error('Erreur de lecture vidéo:', e));
        }
      },
      pause: () => {
        // Mettre en pause les deux vidéos
        if (normalVideoRef.current) normalVideoRef.current.pause();
        if (uvVideoRef.current) uvVideoRef.current.pause();
      }
    });
    
    storeInitializedRef.current = true;
  }, []);

  // Mettre à jour uniquement le mode du store quand uvMode change
  useEffect(() => {
    // Ne mettre à jour le store que si uvMode a changé
    if (prevUvModeRef.current !== uvMode) {
      useVideoStore.getState().setMode(uvMode ? 'uv' : 'normal');
      prevUvModeRef.current = uvMode;
    }
  }, [uvMode]);

  // Mise à jour de l'opacité des vidéos
  useEffect(() => {
    // Afficher/masquer la vidéo appropriée
    if (normalVideoRef.current) {
      normalVideoRef.current.style.opacity = uvMode ? '0' : '1';
    }
    if (uvVideoRef.current) {
      uvVideoRef.current.style.opacity = uvMode ? '1' : '0';
    }
  }, [uvMode]);

  // Gestion de la fin de lecture (onEnded)
  const handleVideoEnded = () => {
    console.log('Vidéo terminée');
    if (normalVideoRef.current) normalVideoRef.current.pause();
    if (uvVideoRef.current) uvVideoRef.current.pause();
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Vidéo mode normal */}
      <video
        ref={normalVideoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        preload="auto"
        playsInline
        muted
        src="/lovable-uploads/Video fond normale.mp4"
        onEnded={handleVideoEnded}
        style={{ opacity: uvMode ? 0 : 1 }}
      />
      
      {/* Vidéo mode UV */}
      <video
        ref={uvVideoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        preload="auto"
        playsInline
        muted
        src="/lovable-uploads/Video fond UV.mp4"
        onEnded={handleVideoEnded}
        style={{ opacity: uvMode ? 1 : 0 }}
      />
    </div>
  );
};
