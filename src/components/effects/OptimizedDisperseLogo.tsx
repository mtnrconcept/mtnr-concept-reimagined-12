
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface OptimizedDisperseLogoProps {
  onTransitionComplete?: () => void;
}

export function OptimizedDisperseLogo({ onTransitionComplete }: OptimizedDisperseLogoProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDisperseActive, setIsDisperseActive] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  // Écouter les clics sur les liens de navigation
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const linkElement = target.closest('a');
      
      if (linkElement && linkElement.getAttribute('href') && !linkElement.getAttribute('target')) {
        // Vérifier si c'est un lien interne
        const href = linkElement.getAttribute('href');
        if (href && href.startsWith('/') && href !== location.pathname) {
          event.preventDefault();
          
          console.log('Navigation interceptée vers:', href);
          
          // Stocker la destination mais sans dispersion
          setPendingNavigation(href);
          
          // Mise à jour de window.pageTransitionInProgress pour d'autres composants
          window.pageTransitionInProgress = true;
          
          // Naviguer immédiatement avec un court délai
          setTimeout(() => {
            navigate(href);
            setPendingNavigation(null);
            
            // Réinitialiser l'état une fois la navigation terminée
            window.pageTransitionInProgress = false;
            
            // Appeler le callback de fin si fourni
            if (onTransitionComplete) {
              setTimeout(onTransitionComplete, 100);
            }
          }, 50);
        }
      }
    };
    
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [location.pathname, navigate, onTransitionComplete]);

  return null; // Ne rend plus d'élément visuel
}
