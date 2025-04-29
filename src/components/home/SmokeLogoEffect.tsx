
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { createSmokeTextEffect } from '@/lib/transitions';
import { AnimatePresence, motion } from 'framer-motion';

// Interface pour les options de l'effet
interface SmokeEffectOptions {
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

export const SmokeLogoEffect = () => {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [shouldDisperse, setShouldDisperse] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [effectOptions, setEffectOptions] = useState<SmokeEffectOptions>({
    baseColor: '#FFD700',   // Jaune
    accentColor: '#FFFFFF', // Blanc
    particleCount: 150,
    direction: 'radial',
    speed: 1,
    intensity: 1.5,
    turbulence: 0.6,
    duration: 3000,
    colorVariation: true,
    blurAmount: 1.2,
  });
  
  const logoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Effet de scintillement du néon
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(Math.random() * 0.4 + 0.8); // Variation entre 0.8 et 1.2
    }, 50); // Scintillement rapide

    return () => clearInterval(interval);
  }, []);

  // Déclenchement automatique de l'effet de dispersion après un délai
  useEffect(() => {
    // Ne pas déclencher l'effet si une transition de page est en cours
    if ((window as any).pageTransitionInProgress) return;
    
    const disperseTimeout = setTimeout(() => {
      setShouldDisperse(true);
    }, 2000); // Attendre 2 secondes avant de disperser
    
    return () => clearTimeout(disperseTimeout);
  }, []);

  // Appliquer l'effet de fumée
  useEffect(() => {
    // Ne pas déclencher l'animation si une transition de page est en cours
    if ((window as any).pageTransitionInProgress) return;
    
    if (shouldDisperse && logoRef.current && isLogoVisible) {
      // Indiquer que le logo est en cours d'animation
      setIsLogoVisible(false);
      
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
      
      // Appliquer l'effet de fumée avec les options personnalisées
      const cleanup = createSmokeTextEffect(tempLogo, {
        particleCount: effectOptions.particleCount,
        duration: effectOptions.duration,
        baseColor: effectOptions.baseColor,
        accentColor: effectOptions.accentColor,
        direction: effectOptions.direction,
        customAngle: effectOptions.customAngle,
        intensity: effectOptions.intensity,
        speed: effectOptions.speed,
        colorVariation: effectOptions.colorVariation,
        blurAmount: effectOptions.blurAmount,
        turbulence: effectOptions.turbulence,
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
            setIsLogoVisible(true);
            setShouldDisperse(false);
            
            // Changer les options pour la prochaine animation
            rotateEffectOptions();
          }, 800);
        }
      });
      
      return () => {
        cleanup.cancel();
        if (containerRef.current && containerRef.current.contains(tempLogo)) {
          containerRef.current.removeChild(tempLogo);
        }
      };
    }
  }, [shouldDisperse, isLogoVisible, effectOptions]);
  
  // Fonction pour faire tourner les effets pour que chaque animation soit différente
  const rotateEffectOptions = () => {
    // Liste de préréglages pour varier les effets
    const presets = [
      {
        baseColor: '#FFD700', // Jaune
        accentColor: '#FFFFFF',
        direction: 'radial' as const,
        speed: 1,
        intensity: 1.5,
        particleCount: 150,
        turbulence: 0.6,
      },
      {
        baseColor: '#F5DD00', // Jaune légèrement différent
        accentColor: '#FFFFCC', // Jaune pâle
        direction: 'up' as const,
        speed: 1.2,
        intensity: 1.3,
        particleCount: 180,
        turbulence: 0.8,
      },
      {
        baseColor: '#FFD700',
        accentColor: '#FFFFFF',
        direction: 'custom' as const,
        customAngle: 45, // 45 degrés (en haut à droite)
        speed: 0.9,
        intensity: 1.6,
        particleCount: 130,
        turbulence: 0.4,
      }
    ];
    
    // Choisir un préréglage au hasard
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    
    setEffectOptions(prev => ({
      ...prev,
      ...randomPreset,
      duration: 2500 + Math.random() * 1000, // Entre 2.5 et 3.5 secondes
    }));
  };
  
  return (
    <div ref={containerRef} className="smoke-logo-container w-full flex justify-center items-center py-12 relative z-30">
      <AnimatePresence mode="wait">
        {isLogoVisible && (
          <motion.div 
            key="logo"
            className={cn(
              "relative w-[500px] max-w-[90vw]",
              "transition-all duration-50 ease-in-out"
            )}
            style={{
              filter: `drop-shadow(0 0 5px rgba(255, 221, 0, ${glowIntensity * 0.5}))
                      drop-shadow(0 0 10px rgba(255, 221, 0, ${glowIntensity * 0.3}))
                      drop-shadow(0 0 15px rgba(255, 221, 0, ${glowIntensity * 0.2}))`
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              ref={logoRef}
              src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
              alt="MTNR Concept"
              className="w-full h-auto"
              draggable={false}
              onLoad={() => {
                // Déclencher l'effet après le chargement complet de l'image
                if (!shouldDisperse && !window.pageTransitionInProgress) {
                  setShouldDisperse(true);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
