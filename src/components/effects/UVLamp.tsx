
import React, { useEffect, useRef } from 'react';
import { useUVMode } from './UVModeContext';
import { useTorch } from './TorchContext';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UVLampProps {
  siteUrl?: string;
  lampRadius?: number;
  className?: string;
  showUVLogo?: boolean;
}

export const UVLamp: React.FC<UVLampProps> = ({
  siteUrl = '',
  lampRadius = 300,
  className,
  showUVLogo = true
}) => {
  const { uvMode } = useUVMode();
  const { isTorchActive, mousePosition } = useTorch();
  const [isVisible, setIsVisible] = React.useState(false);
  const [glowIntensity, setGlowIntensity] = React.useState(1);
  const uvCircleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  // UV light size adjustments based on prop
  useEffect(() => {
    if (uvCircleRef.current) {
      // Correct mask: only show UV effect WITHIN the circle (transparent) and normal outside (black)
      const maskValue = `radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent 0px, transparent ${lampRadius}px, black ${lampRadius + 2}px)`;
      uvCircleRef.current.style.mask = maskValue;
      uvCircleRef.current.style.webkitMask = maskValue;
    }
    
    if (logoRef.current && showUVLogo) {
      // Logo mask should only appear WITHIN the circle
      const logoMaskValue = `radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 0px, black ${lampRadius * 0.7}px, transparent ${lampRadius * 0.8}px)`;
      logoRef.current.style.mask = logoMaskValue;
      logoRef.current.style.webkitMask = logoMaskValue;
    }
  }, [lampRadius, showUVLogo]);
  
  // Position management with optimized performance
  useEffect(() => {
    if (isVisible) {
      const updatePosition = () => {
        // Cancel any pending animation frame
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }
        
        // Schedule a new animation frame
        rafRef.current = requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--x', `${mousePosition.x}px`);
          document.documentElement.style.setProperty('--y', `${mousePosition.y}px`);
          rafRef.current = null;
        });
      };
      
      // Initial position update
      updatePosition();
      
      // Position updates on mouse move
      const handleMouseMove = () => updatePosition();
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        
        // Cancel any pending animation frame on cleanup
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }
  }, [mousePosition, isVisible]);
  
  // Flickering effect for UV logo with optimized performance
  useEffect(() => {
    let flickerInterval: ReturnType<typeof setInterval> | null = null;
    
    if (uvMode && isTorchActive && showUVLogo) {
      flickerInterval = setInterval(() => {
        setGlowIntensity(Math.random() * 0.4 + 1.1);
      }, 100);
    }
    
    return () => {
      if (flickerInterval !== null) {
        clearInterval(flickerInterval);
      }
    };
  }, [uvMode, isTorchActive, showUVLogo]);

  // Visibility management based on UV mode
  useEffect(() => {
    const visible = uvMode && isTorchActive;
    
    // Use a slight delay for turning off to avoid flashes
    if (visible) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [uvMode, isTorchActive]);

  if (!isVisible) return null;

  return (
    <>
      {/* UV Effect Overlay - correct mask implementation */}
      <div 
        ref={uvCircleRef}
        className={cn(
          "fixed inset-0 z-50 pointer-events-none bg-[rgba(10,0,60,0.98)]",
          className
        )}
        style={{
          animation: "uv-vibration 4s infinite"
        }}
      />
      
      {/* UV Logo */}
      {showUVLogo && (
        <div 
          ref={logoRef}
          className="fixed inset-0 flex justify-center items-center z-45 pointer-events-none"
        >
          <AnimatePresence>
            <motion.div 
              className="relative w-[500px] max-w-[90vw] z-50 transition-all duration-50 ease-in-out"
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
                src={siteUrl ? `${siteUrl}/lovable-uploads/aaae9aeb-9678-49a4-8be3-4305ab554a55.png` : "/lovable-uploads/aaae9aeb-9678-49a4-8be3-4305ab554a55.png"}
                alt="MTNR UV Logo"
                className="w-full h-auto"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
