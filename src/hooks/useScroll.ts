
import { useEffect, useRef } from 'react';

/**
 * Hook pour gérer le défilement fluide et les optimisations de scroll
 */
export function useScroll() {
  const scrollPositionRef = useRef(0);
  
  useEffect(() => {
    // Activer le défilement sur le body et html
    document.body.classList.add('allow-scroll');
    document.documentElement.classList.add('allow-scroll');
    
    // Mémoriser la position de défilement actuelle
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };
    
    // Utiliser passive: true pour les performances
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Réactiver le défilement au cas où il aurait été désactivé
    const enableScroll = () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
    
    // Activer le défilement après un court délai pour s'assurer que tous les éléments sont chargés
    const timeout = setTimeout(enableScroll, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);
  
  return { scrollPositionRef };
}
