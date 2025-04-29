import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createSmokeEffect } from '@/lib/transitions';
import { pageTransitionPreset } from '@/components/effects/smoke-presets';
import { DispersingLogo } from '@/components/home/DispersingLogo';

/**
 * Composant optimisé pour des transitions de pages ultra-fluides 
 * et une dispersion de logo esthétiquement satisfaisante.
 */
export default function PageTransitionEffect() {
  const location = useLocation();
  const [triggerLogoDispersion, setTriggerLogoDispersion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Déclenche la transition : smoke + dispersion du logo
   */
  const triggerTransition = useCallback(() => {
    // On active la dispersion
    setTriggerLogoDispersion(true);
    // On attend la prochaine frame pour garantir que le DOM est prêt
    requestAnimationFrame(() => {
      if (containerRef.current) {
        createSmokeEffect(containerRef.current);
      }
    });
  }, []);

  /**
   * Callback après fin de dispersion pour pouvoir réutiliser l'effet
   */
  const handleDispersionComplete = useCallback(() => {
    setTriggerLogoDispersion(false);
  }, []);

  // À chaque changement de route, on lance notre magie
  useLayoutEffect(() => {
    triggerTransition();
  }, [location.pathname, triggerTransition]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        // Indication pour le GPU d'optimiser ces propriétés
        willChange: 'opacity, transform',
      }}
    >
      {/* Effet de fondu entre les pages */}
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: (pageTransitionPreset.duration || 1200) / 1000,
            ease: 'easeInOut',
          }}
        />
      </AnimatePresence>

      {/* Logo invisible qui gère l'animation de dispersion */}
      <DispersingLogo
        triggerDispersion={triggerLogoDispersion}
        imageSrc="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        onDispersionComplete={handleDispersionComplete}
      />
    </div>
  );
}
