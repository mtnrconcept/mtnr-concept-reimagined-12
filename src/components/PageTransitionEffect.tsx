
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createSmokeEffect } from '@/lib/transitions';
import { pageTransitionPreset } from '@/components/effects/smoke-presets';
import { DispersingLogo } from '@/components/home/DispersingLogo';

export default function PageTransitionEffect() {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const contentRef = useRef<HTMLElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const [triggerLogoDispersion, setTriggerLogoDispersion] = useState(false);
  
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
      
      // Déclencher la dispersion du logo
      setTriggerLogoDispersion(true);
      
      // Trouver le logo pour l'effet de dispersion
      const logo = document.querySelector('.navbar-logo img') as HTMLImageElement;
      
      // Utiliser un délai court pour permettre au navigateur de traiter les changements visuels
      transitionTimeoutRef.current = window.setTimeout(() => {
        // Appliquer l'effet de fumée directement sur le contenu
        if (contentRef.current) {
          // Appliquer l'effet sur le contenu principal
          createSmokeEffect(contentRef.current);
        }
        
        // Réinitialiser l'indicateur de transition après la fin de l'effet
        setTimeout(() => {
          setIsTransitioning(false);
          // Réinitialiser le déclencheur de dispersion du logo
          setTriggerLogoDispersion(false);
        }, pageTransitionPreset.duration || 1200);
      }, 150); // Court délai pour le début de transition
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname]);
  
  // Ce composant ne rend qu'un élément invisible pour la dispersion du logo
  return (
    <div className="fixed pointer-events-none" style={{ visibility: 'hidden' }}>
      {/* Composant invisible pour gérer la dispersion du logo */}
      <DispersingLogo 
        triggerDispersion={triggerLogoDispersion} 
        imageSrc="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        onDispersionComplete={() => {
          // Callback après la dispersion du logo (peut être utilisé pour d'autres synchronisations)
        }}
      />
    </div>
  );
}
