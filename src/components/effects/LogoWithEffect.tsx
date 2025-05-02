import { useEffect, useCallback, useRef, useState } from 'react';
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
      `drop-shadow(0 0 5px rgba(${glowColor}, ${intensity * 0.5})) drop-shadow(0 0 10px rgba(${glowColor}, ${intensity * 0.3})) drop-shadow(0 0 15px rgba(${glowColor}, ${intensity * 0.2}))`;

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
  }, [glowEffect, imageLoaded, glowColor]);

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
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
