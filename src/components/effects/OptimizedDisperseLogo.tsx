
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createLogoDisperseEffect } from '@/lib/transitions/particles/disperse-effect';

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
          
          // Activer l'effet de dispersion et stocker la destination
          setIsDisperseActive(true);
          setPendingNavigation(href);
          
          // Mise à jour de window.pageTransitionInProgress pour d'autres composants
          window.pageTransitionInProgress = true;
        }
      }
    };
    
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [location.pathname]);

  // Gérer l'effet de dispersion et la navigation différée
  useEffect(() => {
    if (!isDisperseActive || !logoRef.current) return;
    
    console.log('Démarrage de l\'effet de dispersion du logo');

    const dispersionEffect = createLogoDisperseEffect(logoRef.current, {
      particleCount: 2000, // Inchangé
      dispersionStrength: 3.2, // Inchangé
      duration: 1800, // Durée augmentée de 1000ms à 1800ms
      colorPalette: ['#FFD700', '#222222', '#FFFFFF'], // Inchangé
      onComplete: () => {
        console.log('Animation de dispersion terminée');
        
        // Attendre plus longtemps après la dispersion avant de naviguer (800ms au lieu de 500ms)
        setTimeout(() => {
          if (pendingNavigation) {
            console.log('Navigation vers:', pendingNavigation);
            navigate(pendingNavigation);
            setPendingNavigation(null);
          }
          setIsDisperseActive(false);
          
          // Indiquer que la transition est terminée
          window.pageTransitionInProgress = false;
          
          // Appeler le callback de fin si fourni
          onTransitionComplete?.();
        }, 800); // Délai augmenté de 500ms à 800ms
      }
    });

    // Nettoyage
    return () => {
      dispersionEffect.cancel();
    };
  }, [isDisperseActive, onTransitionComplete, pendingNavigation, navigate]);

  return (
    <div 
      ref={logoContainerRef}
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        opacity: isDisperseActive ? 1 : 0,
        transition: 'opacity 0.8s ease', // Transition plus lente: de 0.3s à 0.8s
        visibility: isDisperseActive ? 'visible' : 'hidden'
      }}
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        <img
          ref={logoRef}
          src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
          alt="Logo"
          className="w-full h-auto object-contain"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            willChange: 'transform, opacity'
          }}
        />
      </div>
    </div>
  );
}
