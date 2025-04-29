
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

  // Conteneur invisible - les transitions sont maintenant gérées par OptimizedDisperseLogo
  return null;
}
