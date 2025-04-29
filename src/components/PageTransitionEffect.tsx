
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
  
  useEffect(() => {
    // Suivre l'état initial de rendu pour éviter l'animation automatique au premier chargement
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log('Premier rendu de la page détecté, pas d\'animation de transition');
    } else {
      // Changement de page détecté
      console.log(`Changement de page: ${lastPathRef.current} -> ${location.pathname}`);
      lastPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  return null;
}
