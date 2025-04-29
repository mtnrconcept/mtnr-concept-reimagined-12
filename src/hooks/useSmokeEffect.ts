
import { useState, useEffect } from 'react';
import { createSmokeTextEffect } from '@/lib/transitions';

// Types pour les préréglages et options
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

  // Fonction pour faire tourner les effets pour que chaque animation soit différente
  const rotateEffectOptions = () => {
    if (!presets || presets.length === 0) return;
    
    // Choisir un préréglage au hasard
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    
    setCurrentOptions(prev => ({
      ...prev,
      ...randomPreset,
      duration: 2500 + Math.random() * 1000, // Entre 2.5 et 3.5 secondes
    }));
  };

  // Appliquer l'effet de fumée
  const triggerSmokeEffect = () => {
    // Ne pas déclencher l'animation si une transition de page est en cours
    // et que ce n'est pas une animation de transition de page
    if ((window as any).pageTransitionInProgress && !isPageTransition) return;
    
    if (logoRef.current && isVisible) {
      // Indiquer que le logo est en cours d'animation
      setIsVisible(false);
      setIsAnimating(true);
      
      // Créer une copie temporaire du logo pour l'effet
      const tempLogo = logoRef.current.cloneNode(true) as HTMLImageElement;
      tempLogo.style.position = 'absolute';
      tempLogo.style.top = '0';
      tempLogo.style.left = '0';
      tempLogo.style.width = '100%';
      tempLogo.style.height = '100%';
      
      if (containerRef.current) {
        containerRef.current.appendChild(tempLogo);
      }
      
      // Appliquer l'effet de fumée avec les options actuelles
      const cleanup = createSmokeTextEffect(tempLogo, {
        particleCount: currentOptions.particleCount,
        duration: currentOptions.duration,
        baseColor: currentOptions.baseColor,
        accentColor: currentOptions.accentColor,
        direction: currentOptions.direction,
        customAngle: currentOptions.customAngle,
        intensity: currentOptions.intensity,
        speed: currentOptions.speed,
        colorVariation: currentOptions.colorVariation,
        blurAmount: currentOptions.blurAmount,
        turbulence: currentOptions.turbulence,
        particleMix: { 
          smoke: 0.5, 
          spark: 0.3, 
          ember: 0.2 
        },
        onComplete: () => {
          // Réinitialiser l'effet après un délai
          setTimeout(() => {
            if (containerRef.current && containerRef.current.contains(tempLogo)) {
              containerRef.current.removeChild(tempLogo);
            }
            setIsVisible(true);
            setIsAnimating(false);
            
            // Changer les options pour la prochaine animation
            rotateEffectOptions();
            
            if (onEffectComplete) {
              onEffectComplete();
            }
          }, 800);
        }
      });
      
      return cleanup;
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
