
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
  
  // Référence globale pour indiquer une transition en cours
  // Utilisée par d'autres composants pour synchroniser leurs animations
  useEffect(() => {
    window.pageTransitionInProgress = isTransitioning;
    
    // Nettoyer lors du démontage
    return () => {
      window.pageTransitionInProgress = false;
    };
  }, [isTransitioning]);
  
  useEffect(() => {
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
      
      // Appliquer l'effet de fumée sur le logo d'abord s'il existe
      if (logoImg && logoImg instanceof HTMLImageElement) {
        createSmokeTextEffect(logoImg, {
          ...pageTransitionPreset,
          onComplete: () => {
            // Après la dispersion du logo, appliquer l'effet de particules au reste du contenu
            if (window.requestIdleCallback) {
              window.requestIdleCallback(() => {
                createParticleEffect(contentRef.current);
              }, { timeout: 100 });
            } else {
              setTimeout(() => {
                createParticleEffect(contentRef.current);
              }, 10);
            }
          }
        });
      } else {
        // Si pas de logo, appliquer directement l'effet de particules au contenu
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            createParticleEffect(contentRef.current);
          }, { timeout: 100 });
        } else {
          setTimeout(() => {
            createParticleEffect(contentRef.current);
          }, 10);
        }
      }
      
      // Attendre que l'effet de particule se disperse avant d'afficher le nouveau contenu
      setTimeout(() => {
        // Appliquer l'effet de fumée au nouveau contenu
        createSmokeEffect(contentRef.current);
        
        // Réinitialiser l'indicateur de transition
        setIsTransitioning(false);
      }, 600);
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname]);
  
  // Ce composant ne rend rien visuellement
  return null;
}
