
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
  const containerRef = useRef<HTMLDivElement>(null);
  const uvCircleRef = useRef<HTMLDivElement>(null);
  const uvInverseMaskRef = useRef<HTMLDivElement>(null);
  
  // UV light size adjustments based on prop
  useEffect(() => {
    if (uvCircleRef.current) {
      const maskValue = `radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent 0%, black ${lampRadius / 2}px, black ${lampRadius}px)`;
      uvCircleRef.current.style.mask = maskValue;
      uvCircleRef.current.style.webkitMask = maskValue;
    }
    
    if (uvInverseMaskRef.current && showUVLogo) {
      const inverseMaskValue = `radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 0%, black ${lampRadius * 0.75}px, transparent ${lampRadius}px)`;
      uvInverseMaskRef.current.style.mask = inverseMaskValue;
      uvInverseMaskRef.current.style.webkitMask = inverseMaskValue;
    }
  }, [lampRadius, showUVLogo]);
  
  // Scintillement effect for UV logo
  useEffect(() => {
    if (uvMode && isTorchActive) {
      const interval = setInterval(() => {
        setGlowIntensity(Math.random() * 0.4 + 1.1);
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [uvMode, isTorchActive]);

  // Visibility management based on UV mode
  useEffect(() => {
    setIsVisible(uvMode && isTorchActive);
  }, [uvMode, isTorchActive]);

  // Position updates for the UV circle and mask
  useEffect(() => {
    if (isVisible) {
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
    <>
      {/* UV Circle Effect */}
      <div 
        ref={uvCircleRef}
        className={cn(
          "uv-light-circle fixed inset-0 z-50 pointer-events-none",
          className
        )}
      />
      
      {/* UV Inverse Mask for Logo */}
      {showUVLogo && (
        <div 
          ref={uvInverseMaskRef}
          className="uv-inverse-mask fixed inset-0 flex justify-center items-center z-45"
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

