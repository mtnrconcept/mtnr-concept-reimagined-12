
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant optimisé pour des transitions de pages ultra-fluides 
 * et une dispersion de logo esthétiquement satisfaisante.
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

  // Plus besoin de code supplémentaire ici car OptimizedDisperseLogo gère la navigation
  return null;
}
