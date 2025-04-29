
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createSmokeEffect } from '@/lib/transitions';
import { pageTransitionPreset } from '@/components/effects/smoke-presets';

export default function PageTransitionEffect() {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const contentRef = useRef<HTMLElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  
  // Référence globale pour indiquer une transition en cours
  // Utilisée par d'autres composants pour synchroniser leurs animations
  useEffect(() => {
    window.pageTransitionInProgress = isTransitioning;
    
    // Nettoyer lors du démontage
    return () => {
      window.pageTransitionInProgress = false;
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [isTransitioning]);
  
  useEffect(() => {
    // Nettoyer tout timeout existant pour éviter les chevauchements
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    
    // Trouver le conteneur de contenu principal
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    contentRef.current = mainContent;
    
    // Si c'est un changement de route (pas le chargement initial)
    if (prevPathRef.current !== location.pathname) {
      // Indiquer qu'une transition est en cours
      setIsTransitioning(true);
      
      // Utiliser un délai court pour permettre au navigateur de traiter les changements visuels
      transitionTimeoutRef.current = window.setTimeout(() => {
        // Appliquer l'effet de fumée directement sur le contenu
        if (contentRef.current) {
          // Correction: fusionner les options avec l'élément dans un seul objet
          createSmokeEffect({
            element: contentRef.current,
            ...pageTransitionPreset
          });
        }
        
        // Réinitialiser l'indicateur de transition après la fin de l'effet
        setTimeout(() => {
          setIsTransitioning(false);
        }, pageTransitionPreset.duration || 1000);
      }, 150); // Court délai pour le début de transition
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname]);
  
  // Ce composant ne rend rien visuellement
  return null;
}
