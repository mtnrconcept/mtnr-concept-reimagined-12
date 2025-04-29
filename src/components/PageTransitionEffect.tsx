
import { useLayoutEffect, useRef, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const isLeavingHomeRef = useRef<boolean>(false);
  const initialRenderRef = useRef<boolean>(true);
  
  // Suivre l'état initial de rendu pour éviter l'animation automatique au premier chargement
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    }
  }, []);

  // Réinitialiser l'état quand on revient sur la page d'accueil
  useEffect(() => {
    // Reset state ONLY when we arrive to home from another page
    const isComingToHome = location.pathname === '/' && lastPathRef.current !== '/';
    
    if (isComingToHome) {
      // Make sure dispersion is turned off when returning to homepage
      setTriggerLogoDispersion(false);
      isNavigatingRef.current = false;
      isLeavingHomeRef.current = false;
    }
    
    // Mettre à jour le chemin précédent pour référence future
    if (!initialRenderRef.current) {
      lastPathRef.current = location.pathname;
    }
    
    // Ajouter un timeout de sécurité pour réinitialiser l'état de navigation si quelque chose va mal
    const resetTimeout = setTimeout(() => {
      isNavigatingRef.current = false;
      isLeavingHomeRef.current = false;
    }, 1000);
    
    return () => clearTimeout(resetTimeout);
  }, [location.pathname]);

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
    if (isLeavingHomeRef.current) {
      navigate(lastPathRef.current);
      isLeavingHomeRef.current = false;
    }
    
    // Réinitialiser l'état et permettre de nouvelles navigations
    setTimeout(() => {
      setTriggerLogoDispersion(false);
      isNavigatingRef.current = false;
    }, 100);
  }, [navigate]);

  // Conteneur invisible - nous utilisons maintenant OptimizedDisperseLogo
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
        opacity: 0,
      }}
    >
      {/* Le composant DispersingLogo est maintenu pour les fonctionnalités mais ne sera plus visible */}
      {triggerLogoDispersion && (
        <DispersingLogo
          triggerDispersion={triggerLogoDispersion}
          fromPath={location.pathname}
          toPath={lastPathRef.current}
          imageSrc="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
          onDispersionComplete={handleDispersionComplete}
          className="hidden"
        />
      )}
    </div>
  );
}
