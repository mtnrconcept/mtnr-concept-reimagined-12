
import { useState, useEffect, useRef } from 'react';
import { createSmokeTextEffect } from '@/lib/transitions';
import { SmokeTextOptions } from '@/lib/transitions/particles/types';

// Renommer l'interface pour éviter les conflits
export interface SmokeEffectOptions {
  baseColor: string;
  accentColor: string;
  particleCount: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'radial' | 'custom';
  customAngle?: number;
  speed: number;
  intensity: number;
  turbulence: number;
  duration: number;
  colorVariation: boolean;
  blurAmount: number;
}

export interface SmokeEffectHookProps {
  shouldTrigger?: boolean;
  isPageTransition?: boolean;
  presets?: SmokeEffectOptions[];
  logoRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  onEffectComplete?: () => void;
}

// Hook personnalisé pour gérer l'effet de fumée
export function useSmokeEffect({
  shouldTrigger = false,
  isPageTransition = false,
  presets,
  logoRef,
  containerRef,
  onEffectComplete
}: SmokeEffectHookProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const effectInstanceRef = useRef<{ cancel: () => void } | null>(null);
  const tempLogoRef = useRef<HTMLImageElement | null>(null);
  
  const [currentOptions, setCurrentOptions] = useState<SmokeEffectOptions>(
    presets?.[0] || {
      baseColor: '#FFD700', // Jaune
      accentColor: '#FFFFFF',
      particleCount: 150,
      direction: 'radial',
      speed: 1,
      intensity: 1.5,
      turbulence: 0.6,
      duration: 3000,
      colorVariation: true,
      blurAmount: 1.2,
    }
  );

  // Nettoyer toute animation en cours lors du démontage
  useEffect(() => {
    return () => {
      if (effectInstanceRef.current) {
        effectInstanceRef.current.cancel();
        effectInstanceRef.current = null;
      }
      
      // Retirer tout logo temporaire
      if (tempLogoRef.current && containerRef.current?.contains(tempLogoRef.current)) {
        containerRef.current.removeChild(tempLogoRef.current);
        tempLogoRef.current = null;
      }
    };
  }, [containerRef]);

  // Fonction pour faire tourner les effets pour que chaque animation soit différente
  const rotateEffectOptions = () => {
    if (!presets || presets.length === 0) return;
    
    // Choisir un préréglage au hasard
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    
    setCurrentOptions(prev => ({
      ...prev,
      ...randomPreset,
      duration: 2500 + Math.random() * 500, // Entre 2.5 et 3 secondes (réduit le max pour plus de fluidité)
    }));
  };

  // Appliquer l'effet de fumée
  const triggerSmokeEffect = () => {
    // Ne pas déclencher l'animation si une transition de page est en cours
    // et que ce n'est pas une animation de transition de page
    if ((window as any).pageTransitionInProgress && !isPageTransition) {
      return { cancel: () => {} };
    }
    
    // Ne pas déclencher si une animation est déjà en cours
    if (isAnimating) {
      return { cancel: () => {} };
    }
    
    // Nettoyer toute animation précédente
    if (effectInstanceRef.current) {
      effectInstanceRef.current.cancel();
      effectInstanceRef.current = null;
    }
    
    // Retirer tout logo temporaire précédent
    if (tempLogoRef.current && containerRef.current?.contains(tempLogoRef.current)) {
      containerRef.current.removeChild(tempLogoRef.current);
      tempLogoRef.current = null;
    }
    
    if (logoRef.current && isVisible) {
      // Indiquer que le logo est en cours d'animation
      setIsVisible(false);
      setIsAnimating(true);
      
      // Créer une copie temporaire du logo pour l'effet
      tempLogoRef.current = logoRef.current.cloneNode(true) as HTMLImageElement;
      tempLogoRef.current.style.position = 'absolute';
      tempLogoRef.current.style.top = '0';
      tempLogoRef.current.style.left = '0';
      tempLogoRef.current.style.width = '100%';
      tempLogoRef.current.style.height = '100%';
      tempLogoRef.current.style.objectFit = 'contain'; // Assure que l'image n'est pas déformée
      
      if (containerRef.current) {
        containerRef.current.appendChild(tempLogoRef.current);
      }
      
      // Optimiser les paramètres pour une meilleure fluidité
      const optimizedOptions = {
        ...currentOptions,
        particleCount: Math.min(currentOptions.particleCount, 120), // Limiter le nombre de particules
        speed: Math.min(currentOptions.speed, 1.2),  // Vitesse raisonnable
        turbulence: Math.min(currentOptions.turbulence, 0.7) // Moins de turbulence pour plus de fluidité
      };
      
      // Appliquer l'effet de fumée avec les options actuelles
      effectInstanceRef.current = createSmokeTextEffect(tempLogoRef.current, {
        particleCount: optimizedOptions.particleCount,
        duration: optimizedOptions.duration,
        baseColor: optimizedOptions.baseColor,
        accentColor: optimizedOptions.accentColor,
        direction: optimizedOptions.direction,
        customAngle: optimizedOptions.customAngle,
        intensity: optimizedOptions.intensity,
        speed: optimizedOptions.speed,
        colorVariation: optimizedOptions.colorVariation,
        blurAmount: optimizedOptions.blurAmount,
        turbulence: optimizedOptions.turbulence,
        particleMix: { 
          smoke: 0.6,  // Plus de fumée
          spark: 0.25, // Moins d'étincelles
          ember: 0.15  // Moins de braises
        },
        onComplete: () => {
          // Réinitialiser l'effet après un délai
          setTimeout(() => {
            if (tempLogoRef.current && containerRef.current?.contains(tempLogoRef.current)) {
              containerRef.current.removeChild(tempLogoRef.current);
              tempLogoRef.current = null;
            }
            setIsVisible(true);
            setIsAnimating(false);
            
            // Changer les options pour la prochaine animation
            rotateEffectOptions();
            
            if (onEffectComplete) {
              onEffectComplete();
            }
          }, 500); // Réduit le délai pour plus de réactivité
        }
      });
      
      return effectInstanceRef.current;
    }
    
    return { cancel: () => {} };
  };

  return {
    isVisible,
    isAnimating,
    currentOptions,
    triggerSmokeEffect,
    setCurrentOptions
  };
}
