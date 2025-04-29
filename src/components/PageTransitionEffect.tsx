
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { createParticleEffect, createSmokeEffect } from '@/lib/transition-effects';

export default function PageTransitionEffect() {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const contentRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Trouver le conteneur principal de la page
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    contentRef.current = mainContent;
    
    // Si c'est un changement de route (pas le chargement initial)
    if (prevPathRef.current !== location.pathname) {
      // Appliquer l'effet de particules sur l'ancien contenu
      createParticleEffect(contentRef.current);
      
      // Légère attente pour permettre aux particules de se disperser avant d'afficher le nouveau contenu
      setTimeout(() => {
        // Appliquer l'effet de fumée sur le nouveau contenu
        createSmokeEffect(contentRef.current);
      }, 300);
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname]);
  
  // Ce composant ne rend rien visuellement
  return null;
}
