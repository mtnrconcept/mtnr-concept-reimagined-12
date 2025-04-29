
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
  
  // Gérer le déclenchement de l'effet de dispersion
  useEffect(() => {
    if (triggerDispersion && dispersionState === 'idle' && logoRef.current) {
      setDispersionState('dispersing');
      
      // Créer l'effet de dispersion
      effectRef.current = createLogoDisperseEffect(logoRef.current, {
        particleCount: 800,
        dispersionStrength: 1.5,
        duration: 2000,
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
  }, [triggerDispersion, dispersionState, onDispersionComplete]);
  
  return (
    <div className={`relative ${className}`}>
      <img 
        ref={logoRef}
        src={imageSrc} 
        alt="MTNR Concept"
        className="w-full h-auto"
        draggable={false}
      />
    </div>
  );
};
