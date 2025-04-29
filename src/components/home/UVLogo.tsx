
import { useEffect, useRef, useState } from 'react';
import { useUVMode } from '../effects/UVModeContext';
import { useTorch } from '../effects/TorchContext';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const UVLogo = () => {
  const { uvMode } = useUVMode();
  const { isTorchActive, mousePosition } = useTorch();
  const [isVisible, setIsVisible] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Effet de scintillement du néon pour le logo UV
  useEffect(() => {
    if (uvMode && isTorchActive) {
      const interval = setInterval(() => {
        setGlowIntensity(Math.random() * 0.4 + 1.1); // Variation plus intense pour UV
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [uvMode, isTorchActive]);

  // Gestion de la visibilité en fonction du mode UV
  useEffect(() => {
    setIsVisible(uvMode && isTorchActive);
  }, [uvMode, isTorchActive]);

  // Positionnement du masque inverse pour le logo UV
  useEffect(() => {
    if (containerRef.current && isVisible) {
      const updatePosition = () => {
        document.documentElement.style.setProperty('--x', `${mousePosition.x}px`);
        document.documentElement.style.setProperty('--y', `${mousePosition.y}px`);
      };
      
      updatePosition();
      
      window.addEventListener('mousemove', updatePosition);
      return () => window.removeEventListener('mousemove', updatePosition);
    }
  }, [mousePosition, isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="uv-inverse-mask fixed inset-0 flex justify-center items-center z-45"
    >
      <AnimatePresence>
        <motion.div 
          className={cn(
            "relative w-[500px] max-w-[90vw] z-50",
            "transition-all duration-50 ease-in-out"
          )}
          style={{
            filter: `drop-shadow(0 0 8px rgba(0, 170, 255, ${glowIntensity * 0.7}))
                    drop-shadow(0 0 15px rgba(0, 170, 255, ${glowIntensity * 0.5}))
                    drop-shadow(0 0 25px rgba(0, 170, 255, ${glowIntensity * 0.3}))`
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <img 
            src="/lovable-uploads/aaae9aeb-9678-49a4-8be3-4305ab554a55.png" 
            alt="MTNR UV Logo"
            className="w-full h-auto"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
