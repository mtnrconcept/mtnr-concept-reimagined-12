
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createPageTransitionEffect } from '@/lib/transitions';

/**
 * Composant unifié pour gérer toutes les transitions de pages
 * avec support pour effets de particules et autres animations
 */
export default function PageTransitionEffect() {
  const location = useLocation();
  const lastPathRef = useRef<string>(location.pathname);
  const initialRenderRef = useRef<boolean>(true);
  const containerRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Référence au conteneur principal pour les transitions
    containerRef.current = document.getElementById('main-content');
    
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
      
      // Créer l'effet de transition
      createPageTransitionEffect(containerRef.current);
    }
  }, [location.pathname]);

  return null;
}
