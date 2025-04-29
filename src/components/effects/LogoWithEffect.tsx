
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface LogoWithEffectProps {
  src: string;
  alt: string;
  width?: string;
  className?: string;
  glowEffect?: boolean;
  glowColor?: string;
  onLoad?: () => void;
  isVisible: boolean;
  logoRef: React.RefObject<HTMLImageElement>;
}

export default function LogoWithEffect({
  src,
  alt,
  width = "500px",
  className,
  glowEffect = true,
  glowColor = "255, 221, 0", // Jaune par défaut
  onLoad,
  isVisible,
  logoRef
}: LogoWithEffectProps) {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  // Nettoyer les intervalles lors du démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  // Effet de scintillement du néon si activé
  useEffect(() => {
    if (!glowEffect) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Éviter les intervalles multiples
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      setGlowIntensity(Math.random() * 0.3 + 0.85); // Variation entre 0.85 et 1.15 (moins extrême)
    }, 80); // Scintillement plus subtil

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [glowEffect]);

  // Gérer le chargement de l'image
  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          key="logo"
          className={cn(
            "relative",
            "max-w-[90vw] max-h-[30vh]", // Limiter la taille pour éviter les déformations
            "transition-all duration-300 ease-in-out", // Transition plus lente et fluide
            className
          )}
          style={glowEffect && imageLoaded ? {
            filter: `drop-shadow(0 0 5px rgba(${glowColor}, ${glowIntensity * 0.5}))
                    drop-shadow(0 0 10px rgba(${glowColor}, ${glowIntensity * 0.3}))
                    drop-shadow(0 0 15px rgba(${glowColor}, ${glowIntensity * 0.2}))`
          } : {}}
          initial={{ opacity: 0, scale: 0.95 }} // Scale légèrement plus conservateur
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1] // Courbe d'animation plus fluide (cubique)
          }}
        >
          <img 
            ref={logoRef}
            src={src}
            alt={alt}
            className={cn(
              "w-full h-auto object-contain", // Assurer que l'image n'est pas déformée
              width && `max-w-[${width}]`
            )}
            style={{ maxHeight: "25vh" }} // Limiter la hauteur pour plus de constance
            draggable={false}
            onLoad={handleImageLoad}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
