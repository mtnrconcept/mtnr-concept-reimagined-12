
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant unifié pour gérer toutes les transitions de pages
 * Version simplifiée sans effet de particules
 */
export default function PageTransitionEffect() {
  const location = useLocation();
  const lastPathRef = useRef<string>(location.pathname);
  const initialRenderRef = useRef<boolean>(true);
  
  useEffect(() => {
    // Éviter l'animation au premier chargement
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log('Premier rendu de la page détecté, pas d\'animation de transition');
      return;
    }
    
    // Changement de page détecté
    if (lastPathRef.current !== location.pathname) {
      console.log(`Changement de page: ${lastPathRef.current} -> ${location.pathname}`);
      lastPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  return null;
}
