
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
  
  // Effet de scintillement du néon si activé
  useEffect(() => {
    if (!glowEffect) return;
    
    const interval = setInterval(() => {
      setGlowIntensity(Math.random() * 0.4 + 0.8); // Variation entre 0.8 et 1.2
    }, 50); // Scintillement rapide

    return () => clearInterval(interval);
  }, [glowEffect]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          key="logo"
          className={cn(
            "relative max-w-[90vw]",
            "transition-all duration-50 ease-in-out",
            className
          )}
          style={glowEffect ? {
            filter: `drop-shadow(0 0 5px rgba(${glowColor}, ${glowIntensity * 0.5}))
                    drop-shadow(0 0 10px rgba(${glowColor}, ${glowIntensity * 0.3}))
                    drop-shadow(0 0 15px rgba(${glowColor}, ${glowIntensity * 0.2}))`
          } : {}}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            ref={logoRef}
            src={src}
            alt={alt}
            className={cn("w-full h-auto", width && `w-[${width}]`)}
            draggable={false}
            onLoad={onLoad}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
