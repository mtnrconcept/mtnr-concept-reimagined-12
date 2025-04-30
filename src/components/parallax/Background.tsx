
import React, { useState, useEffect } from 'react';
import BackgroundVideoController from '../effects/BackgroundVideoController';
import Parallax3DEffect from './Parallax3DEffect';

interface BackgroundProps {
  depth?: number;
}

export const Background = ({ depth = 0.08 }: BackgroundProps) => {
  const [reduced, setReduced] = useState(false);
  
  // Détecter les appareils à faible performance
  useEffect(() => {
    // Vérifier si le dispositif est probablement à faible puissance
    const checkPerformance = () => {
      const lowPerformance = 
        // Téléphones mobiles et tablettes
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        // Vérifier si le nombre de cœurs logiques est faible
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
      
      setReduced(lowPerformance);
    };
    
    checkPerformance();
    
    // Vérifier également les baisses de FPS
    let lastTime = performance.now();
    let frames = 0;
    let lowFpsCount = 0;
    
    const checkFrameRate = () => {
      frames++;
      const now = performance.now();
      
      // Calculer le FPS toutes les secondes
      if (now - lastTime >= 1000) {
        const fps = frames * 1000 / (now - lastTime);
        // Si le FPS est bas plusieurs fois de suite, réduire la qualité
        if (fps < 30) {
          lowFpsCount++;
          if (lowFpsCount > 2) {
            setReduced(true);
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1);
        }
        
        frames = 0;
        lastTime = now;
      }
      
      // Continuer la vérification seulement si on n'a pas déjà réduit la qualité
      if (!reduced) {
        requestAnimationFrame(checkFrameRate);
      }
    };
    
    const checkId = requestAnimationFrame(checkFrameRate);
    
    return () => cancelAnimationFrame(checkId);
  }, [reduced]);
  
  return (
    <>
      {/* Video background with controller */}
      <BackgroundVideoController videoSrc="/lovable-uploads/ascensceur.mp4" />
      
      {/* Enhanced 3D Parallax Effect */}
      <Parallax3DEffect depth={reduced ? depth/2 : depth}>
        <div className="absolute inset-0 pointer-events-none">
          {/* Conditionnellement réduire les éléments selon les performances */}
          {!reduced && (
            <div className="absolute inset-0 parallax-grid-pattern"></div>
          )}
          
          {/* Éléments décoratifs avec couleurs jaune/noir en nombre réduit pour perf */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-500/10 to-transparent blur-xl depth-4"></div>
          
          {/* Points lumineux avec effet 3D - réduits sur appareils faibles */}
          {!reduced ? (
            <>
              <div className="absolute top-1/6 left-1/5 w-4 h-4 rounded-full bg-yellow-300/30 animate-pulse-yellow parallax-element depth-2"></div>
              <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-yellow-300/20 animate-pulse-yellow parallax-element depth-3"></div>
              <div className="absolute top-1/3 right-1/5 w-2 h-2 rounded-full bg-yellow-400/40 animate-pulse-yellow parallax-element depth-5"></div>
            </>
          ) : (
            <div className="absolute top-1/6 left-1/5 w-4 h-4 rounded-full bg-yellow-300/30 animate-pulse-yellow"></div>
          )}
          
          {/* Grille de profondeur jaune simplifiée */}
          <div className="absolute inset-0 bg-grid-pattern"></div>
          
          {/* Vignette pour accentuer l'effet 3D */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/30 pointer-events-none"></div>
        </div>
      </Parallax3DEffect>
    </>
  );
};
