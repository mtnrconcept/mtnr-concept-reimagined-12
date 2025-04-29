
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
  const navigationTimeoutRef = useRef<number | null>(null);
  const isNavigatingRef = useRef<boolean>(false);

  // Réinitialiser l'état si on reste sur la page actuelle
  useEffect(() => {
    // Attendre que l'animation soit terminée avant de réinitialiser
    const resetTimeout = setTimeout(() => {
      if (!isNavigatingRef.current) {
        setTriggerLogoDispersion(false);
      }
    }, 1000);
    
    return () => clearTimeout(resetTimeout);
  }, [location.pathname]);

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
        
        // Ignorer si c'est la page actuelle ou si une navigation est déjà en cours
        if (targetPath === location.pathname || isNavigatingRef.current) return;
        
        // Empêcher la navigation par défaut
        e.preventDefault();
        e.stopPropagation();
        
        // Marquer qu'une navigation est en cours pour éviter les doubles clics
        isNavigatingRef.current = true;
        
        // Enregistrer l'heure de début
        navigationStartTimeRef.current = performance.now();
        
        // Déclencher immédiatement la dispersion
        setTriggerLogoDispersion(true);
        
        // Stocker le chemin de destination
        lastPathRef.current = targetPath;
        
        // Ajouter un timeout de sécurité pour naviguer même si l'animation échoue
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }
        navigationTimeoutRef.current = window.setTimeout(() => {
          navigate(targetPath);
          isNavigatingRef.current = false;
        }, 1000); // Fallback après 1 seconde maximum
      }
    };
    
    // Ajouter l'écouteur global pour les clics
    document.addEventListener('click', handleNavLinkClick, true);
    
    return () => {
      document.removeEventListener('click', handleNavLinkClick, true);
      // Nettoyer le timeout en sortant
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [location.pathname, navigate]);

  /**
   * Callback après fin de dispersion pour pouvoir réutiliser l'effet
   * et naviguer vers la nouvelle page
   */
  const handleDispersionComplete = useCallback(() => {
    // Nettoyer le timeout car l'animation s'est terminée normalement
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
    
    // Mesurer la latence
    const latency = performance.now() - navigationStartTimeRef.current;
    console.log(`Transition latency: ${Math.round(latency)}ms`);
    
    // Naviguer vers la page demandée s'il y a eu un clic de navigation
    if (lastPathRef.current !== location.pathname) {
      navigate(lastPathRef.current);
    }
    
    // Réinitialiser l'état et permettre de nouvelles navigations
    setTimeout(() => {
      setTriggerLogoDispersion(false);
      isNavigatingRef.current = false;
    }, 100);
  }, [location.pathname, navigate]);

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
        willChange: 'opacity, transform',
        opacity: triggerLogoDispersion ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      {/* Logo invisible qui gère l'animation de dispersion */}
      <DispersingLogo
        triggerDispersion={triggerLogoDispersion}
        imageSrc="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        onDispersionComplete={handleDispersionComplete}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64"
      />
    </div>
  );
}
