
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
  
  // Optimisation critique : déclencher immédiatement l'effet lorsque triggerDispersion change
  useEffect(() => {
    if (triggerDispersion && logoRef.current) {
      // Réagir immédiatement, sans attendre un état intermédiaire
      setDispersionState('dispersing');
      
      // Créer l'effet de dispersion avec des paramètres optimisés
      effectRef.current = createLogoDisperseEffect(logoRef.current, {
        particleCount: 600, // Réduit de 800 à 600 pour améliorer les performances
        dispersionStrength: 2.0, // Augmenté pour un effet plus visible même s'il est plus court
        duration: 1200, // Réduit significativement la durée pour réduire la latence
        colorPalette: ['#FFD700', '#222222', '#FFFFFF'], // Jaune, noir, blanc
        onComplete: () => {
          setDispersionState('dispersed');
          if (onDispersionComplete) onDispersionComplete();
        }
      });
    }
    
    return () => {
      // Nettoyer l'effet si le composant est démonté pendant l'animation
      if (effectRef.current) {
        effectRef.current.cancel();
        effectRef.current = null;
      }
    };
  }, [triggerDispersion, onDispersionComplete]);
  
  return (
    <div className={`relative ${className}`}>
      <img 
        ref={logoRef}
        src={imageSrc} 
        alt="MTNR Concept"
        className="w-full h-auto"
        style={{ willChange: 'transform, opacity' }} // Optimisation des performances
        draggable={false}
      />
    </div>
  );
};
