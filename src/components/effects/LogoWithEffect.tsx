
import { useEffect, useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useUVMode } from './UVModeContext';

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

/**
 * Composant logo avec effet de glow néon optimisé via Web Animations API
 */
export default function LogoWithEffect({
  src,
  alt,
  width = '500px',
  className = '',
  glowEffect = true,
  glowColor = '255, 221, 0',
  onLoad,
  isVisible,
  logoRef,
}: LogoWithEffectProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { uvMode } = useUVMode();
  
  // Déterminer la couleur du glow en fonction du mode UV
  const activeGlowColor = uvMode ? '210, 255, 63' : glowColor;

  // Callback quand l'image est chargée
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Neón glow via Web Animations (plus fluide que setInterval)
  useEffect(() => {
    if (!glowEffect || !imageLoaded || !wrapperRef.current) return;
    const el = wrapperRef.current;
    const base = (intensity: number) =>
      `drop-shadow(0 0 5px rgba(${activeGlowColor}, ${intensity * 0.5})) 
       drop-shadow(0 0 10px rgba(${activeGlowColor}, ${intensity * 0.3})) 
       drop-shadow(0 0 15px rgba(${activeGlowColor}, ${intensity * 0.2}))`;

    const animation = el.animate(
      [
        { filter: base(0.85) },
        { filter: base(1.15) },
        { filter: base(0.9) },
        { filter: base(1) },
      ],
      {
        duration: 1000,
        easing: 'ease-in-out',
        iterations: Infinity,
      }
    );

    return () => animation.cancel();
  }, [glowEffect, imageLoaded, activeGlowColor, uvMode]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          ref={wrapperRef}
          key="logo"
          className={cn(
            'relative',
            'max-w-[90vw]',
            'max-h-[30vh]',
            'overflow-hidden',
            'transition-all',
            'duration-300',
            'ease-in-out',
            className
          )}
          style={{ maxWidth: width, maxHeight: '25vh' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <img
            ref={logoRef}
            src={src}
            alt={alt}
            className={cn('w-full', 'h-auto', 'object-contain')}
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              filter: uvMode 
                ? 'hue-rotate(120deg) brightness(1.5) saturate(1.5) contrast(1.2)' 
                : 'none',
              mixBlendMode: uvMode ? 'screen' : 'normal',
              transition: 'filter 0.5s ease-out'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
