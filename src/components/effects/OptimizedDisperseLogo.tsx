
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { createLogoDisperseEffect } from '@/lib/transitions/particle-effect';

interface OptimizedDisperseLogoProps {
  onTransitionComplete?: () => void;
}

export function OptimizedDisperseLogo({ onTransitionComplete }: OptimizedDisperseLogoProps) {
  const location = useLocation();
  const [isDisperseActive, setIsDisperseActive] = useState(false);
  const [previousPath, setPreviousPath] = useState(location.pathname);
  const logoRef = useRef<HTMLImageElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  // Surveillance des changements de route
  useEffect(() => {
    // Ignorer le premier montage
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Activer la dispersion uniquement lors d'un changement de page
    if (location.pathname !== previousPath) {
      console.log('Route changed:', previousPath, '->', location.pathname);
      setIsDisperseActive(true);
      
      // Mise à jour pour le prochain changement
      setPreviousPath(location.pathname);
    }
  }, [location.pathname, previousPath]);

  // Gérer l'effet de dispersion
  useEffect(() => {
    if (!isDisperseActive || !logoRef.current) return;

    const dispersionEffect = createLogoDisperseEffect(logoRef.current, {
      particleCount: 800, // Réduire le nombre de particules pour améliorer les performances
      dispersionStrength: 2.5,
      duration: 1200, // Animation plus rapide
      colorPalette: ['#FFD700', '#222222', '#FFFFFF'], // Jaune, noir, blanc
      onComplete: () => {
        setIsDisperseActive(false);
        onTransitionComplete?.();
      }
    });

    // Nettoyage
    return () => {
      dispersionEffect.cancel();
    };
  }, [isDisperseActive, onTransitionComplete]);

  return (
    <div 
      ref={logoContainerRef}
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        opacity: isDisperseActive ? 1 : 0,
        transition: 'opacity 0.3s ease',
        visibility: isDisperseActive ? 'visible' : 'hidden'
      }}
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        <img
          ref={logoRef}
          src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
          alt="Logo"
          className="w-full h-auto object-contain"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            willChange: 'transform, opacity'
          }}
        />
      </div>
    </div>
  );
}
