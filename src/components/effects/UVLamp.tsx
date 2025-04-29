
import React, { useEffect, useRef } from 'react';
import { useUVMode } from './UVModeContext';
import { useTorch } from './TorchContext';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const { uvMode } = useUVMode();
  const { mousePosition } = useTorch();
  const [isVisible, setIsVisible] = React.useState(false);
  const [glowIntensity, setGlowIntensity] = React.useState(1);
  const uvCircleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  // UV light size adjustments based on prop
  useEffect(() => {
    if (uvCircleRef.current) {
      // Mask INVERSÉ : show UV effect ONLY within the circle (transparent)
      // and normal outside the circle (black overlay)
      const maskValue = `radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent 0px, transparent ${lampRadius}px, rgba(10, 0, 60, 0.98) ${lampRadius + 2}px)`;
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
    
    if (uvMode && showUVLogo) {
      flickerInterval = setInterval(() => {
        setGlowIntensity(Math.random() * 0.4 + 1.1);
      }, 100);
    }
    
    return () => {
      if (flickerInterval !== null) {
        clearInterval(flickerInterval);
      }
    };
  }, [uvMode, showUVLogo]);

  // Visibility management based on UV mode
  useEffect(() => {
    const visible = uvMode;
    
    // Use a slight delay for turning off to avoid flashes
    if (visible) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [uvMode]);

  // Display UV logo on both home page ("/") and /what-we-do page
  const shouldShowLogo = showUVLogo && (location.pathname === "/" || location.pathname === "/what-we-do");

  if (!isVisible) return null;

  return (
    <>
      {/* Fond UV noir qui sera masqué par le cercle de lampe */}
      <div 
        className="fixed inset-0 z-45 pointer-events-none bg-transparent"
        style={{
          backgroundImage: `url("/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7) contrast(1.1) saturate(1.3)',
        }}
      />
      
      {/* UV Effect Overlay - avec masque inversé */}
      <div 
        ref={uvCircleRef}
        className={cn(
          "fixed inset-0 z-50 pointer-events-none bg-transparent",
          className
        )}
        style={{
          animation: "uv-vibration 4s infinite"
        }}
      />
      
      {/* UV Logo - positionné en haut de la page */}
      {shouldShowLogo && (
        <div 
          ref={logoRef}
          className="fixed inset-x-0 top-16 z-45 pointer-events-none flex justify-center items-start pt-8 sm:pt-12 md:pt-20 lg:pt-24"
        >
          <AnimatePresence>
            <motion.div 
              className="relative w-[400px] max-w-[80vw] z-50 transition-all duration-50 ease-in-out"
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
                src="/lovable-uploads/f8b2ee4c-ca6a-4388-8c9c-bfb3c97d5f0a.png"
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
