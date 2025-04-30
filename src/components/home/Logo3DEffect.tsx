
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export const Logo3DEffect = () => {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const logoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Effet de scintillement du néon
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(Math.random() * 0.4 + 0.8); // Variation entre 0.8 et 1.2
    }, 50); // Scintillement rapide

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div ref={containerRef} className="w-full flex justify-center items-center py-12 relative z-30">
      <AnimatePresence mode="wait">
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
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
