
import { useState, useEffect, useRef } from 'react';
import { createLogoDisperseEffect } from '@/lib/transitions/particle-effect';

interface DispersingLogoProps {
  triggerDispersion?: boolean;
  onDispersionComplete?: () => void;
  className?: string;
  imageSrc: string;
}

export const DispersingLogo = ({ 
  triggerDispersion = false, 
  onDispersionComplete, 
  className = "", 
  imageSrc 
}: DispersingLogoProps) => {
  const [dispersionState, setDispersionState] = useState<'idle' | 'dispersing' | 'dispersed'>('idle');
  const logoRef = useRef<HTMLImageElement>(null);
  const effectRef = useRef<{ cancel: () => void } | null>(null);
  
  // Nettoyer l'effet précédent si le composant est démonté
  useEffect(() => {
    return () => {
      if (effectRef.current) {
        effectRef.current.cancel();
        effectRef.current = null;
      }
    };
  }, []);
  
  // Effet pour gérer la dispersion
  useEffect(() => {
    if (triggerDispersion && logoRef.current && dispersionState !== 'dispersing') {
      // Réagir immédiatement, sans attendre un état intermédiaire
      setDispersionState('dispersing');
      
      // Annuler tout effet existant pour éviter les animations multiples
      if (effectRef.current) {
        effectRef.current.cancel();
        effectRef.current = null;
      }
      
      // Créer l'effet de dispersion avec des paramètres ultra-optimisés
      effectRef.current = createLogoDisperseEffect(logoRef.current, {
        particleCount: 400, // Réduit pour améliorer les performances
        dispersionStrength: 1.8, // Augmenté pour un effet plus visible même s'il est plus court
        duration: 800, // Réduit significativement la durée pour réduire la latence
        colorPalette: ['#FFD700', '#222222', '#FFFFFF'], // Jaune, noir, blanc
        onComplete: () => {
          setDispersionState('dispersed');
          // Nettoyer la référence après utilisation
          effectRef.current = null;
          if (onDispersionComplete) onDispersionComplete();
        }
      });
    } else if (!triggerDispersion && dispersionState === 'dispersed') {
      // Réinitialiser l'état quand la dispersion n'est plus demandée
      setDispersionState('idle');
    }
  }, [triggerDispersion, onDispersionComplete, dispersionState]);
  
  return (
    <div className={`relative ${className}`} style={{ pointerEvents: 'none' }}>
      <img 
        ref={logoRef}
        src={imageSrc} 
        alt="MTNR Concept"
        className={`w-full h-auto transition-opacity ${dispersionState === 'dispersed' ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          willChange: 'transform, opacity',
          visibility: dispersionState === 'dispersed' ? 'hidden' : 'visible' 
        }}
        draggable={false}
      />
    </div>
  );
};
