
import { useLayoutEffect, useRef, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [triggerLogoDispersion, setTriggerLogoDispersion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPathRef = useRef<string>(location.pathname);
  const navigationStartTimeRef = useRef<number>(0);

  /**
   * Intercepte la navigation pour déclencher la dispersion avant le changement de page
   */
  useEffect(() => {
    // Intercepter les clics sur les éléments de navigation
    const handleNavLinkClick = (e: MouseEvent) => {
      // Vérifier si c'est un lien de navigation
      const target = e.target as HTMLElement;
      const linkElement = target.closest('a');
      
      if (linkElement && linkElement.getAttribute('href')?.startsWith('/')) {
        const targetPath = linkElement.getAttribute('href') || '';
        
        // Ignorer si c'est la page actuelle
        if (targetPath === location.pathname) return;
        
        // Empêcher la navigation par défaut
        e.preventDefault();
        e.stopPropagation();
        
        // Enregistrer l'heure de début pour mesurer la latence
        navigationStartTimeRef.current = performance.now();
        
        // Déclencher immédiatement la dispersion
        setTriggerLogoDispersion(true);
        
        // Stocker le chemin de destination pour la navigation différée
        lastPathRef.current = targetPath;
      }
    };
    
    // Ajouter l'écouteur global pour les clics
    document.addEventListener('click', handleNavLinkClick, true);
    
    return () => {
      document.removeEventListener('click', handleNavLinkClick, true);
    };
  }, [location.pathname]);

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
   * et naviguer vers la nouvelle page
   */
  const handleDispersionComplete = useCallback(() => {
    // Mesurer la latence
    const latency = performance.now() - navigationStartTimeRef.current;
    console.log(`Transition latency: ${Math.round(latency)}ms`);
    
    // Réinitialiser l'état de dispersion
    setTriggerLogoDispersion(false);
    
    // Naviguer vers la page demandée s'il y a eu un clic de navigation
    if (lastPathRef.current !== location.pathname) {
      navigate(lastPathRef.current);
    }
  }, [location.pathname, navigate]);

  // À chaque changement de route direct (par ex. bouton retour), on lance notre magie
  useLayoutEffect(() => {
    // Ne pas déclencher si c'est nous qui avons initié la navigation
    if (!triggerLogoDispersion) {
      triggerTransition();
    }
  }, [location.pathname, triggerTransition, triggerLogoDispersion]);

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
        zIndex: 1000,
        // Indication pour le GPU d'optimiser ces propriétés
        willChange: 'opacity, transform',
      }}
    >
      {/* Effet de fondu entre les pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: (pageTransitionPreset.duration || 1200) / 2000, // Réduit de moitié
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
