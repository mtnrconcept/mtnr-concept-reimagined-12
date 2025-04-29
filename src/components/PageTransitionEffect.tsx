
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createParticleEffect, createSmokeEffect } from '@/lib/transitions';
import { pageTransitionPreset } from '@/components/effects/smoke-presets';
import { createSmokeTextEffect } from '@/lib/transitions';

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
      
      // Trouver le logo (s'il existe sur la page)
      const logoContainer = document.querySelector('.smoke-logo-container');
      const logoImg = logoContainer?.querySelector('img');
      
      // Ne pas avoir plusieurs animations en même temps
      // Prioriser l'effet de particules pour une transition rapide
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          if (contentRef.current) {
            createParticleEffect(contentRef.current);
          }
        }, { timeout: 50 });  // Timeout plus court pour démarrer plus vite
      } else {
        setTimeout(() => {
          if (contentRef.current) {
            createParticleEffect(contentRef.current);
          }
        }, 10);
      }
      
      // Attendre que l'effet de particule se disperse avant d'afficher le nouveau contenu
      transitionTimeoutRef.current = window.setTimeout(() => {
        // Appliquer l'effet de fumée au nouveau contenu
        if (contentRef.current) {
          createSmokeEffect(contentRef.current);
        }
        
        // Réinitialiser l'indicateur de transition
        setIsTransitioning(false);
      }, 500); // Transition plus rapide
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname]);
  
  // Ce composant ne rend rien visuellement
  return null;
}
