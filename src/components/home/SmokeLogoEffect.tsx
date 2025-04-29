
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { createSmokeTextEffect } from '@/lib/transitions';
import { AnimatePresence, motion } from 'framer-motion';

export const SmokeLogoEffect = () => {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [shouldDisperse, setShouldDisperse] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
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
    const disperseTimeout = setTimeout(() => {
      setShouldDisperse(true);
    }, 2000); // Attendre 2 secondes avant de disperser
    
    return () => clearTimeout(disperseTimeout);
  }, []);

  // Appliquer l'effet de fumée
  useEffect(() => {
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
      
      // Appliquer l'effet de fumée
      const cleanup = createSmokeTextEffect(tempLogo, {
        particleCount: 150,
        duration: 3000,
        baseColor: '#FFD700', // Jaune
        accentColor: '#FFFFFF', // Blanc
        direction: 'radial',
        intensity: 1.5,
        onComplete: () => {
          // Réinitialiser l'effet après un délai
          setTimeout(() => {
            if (containerRef.current && containerRef.current.contains(tempLogo)) {
              containerRef.current.removeChild(tempLogo);
            }
            setIsLogoVisible(true);
            setShouldDisperse(false);
          }, 500);
        }
      });
      
      return () => {
        cleanup.cancel();
        if (containerRef.current && containerRef.current.contains(tempLogo)) {
          containerRef.current.removeChild(tempLogo);
        }
      };
    }
  }, [shouldDisperse, isLogoVisible]);
  
  return (
    <div ref={containerRef} className="w-full flex justify-center items-center py-12 relative z-30">
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
                if (!shouldDisperse) {
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
