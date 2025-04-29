
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant pour gérer les transitions de pages ultra-fluides 
 * avec le support de l'animation de dispersion du logo.
 */
export default function PageTransitionEffect() {
  const location = useLocation();
  const lastPathRef = useRef<string>(location.pathname);
  const initialRenderRef = useRef<boolean>(true);
  
  // Suivre l'état initial de rendu pour éviter l'animation automatique au premier chargement
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    }
  }, []);

  // Ce composant ne fait plus d'animation directe, car OptimizedDisperseLogo gère toute la navigation
  return null;
}
