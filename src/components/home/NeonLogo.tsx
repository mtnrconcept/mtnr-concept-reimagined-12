
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DispersingLogo } from './DispersingLogo';
import { useLocation } from 'react-router-dom';
import { useUVMode } from '../effects/UVModeContext';

export const NeonLogo = () => {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [shouldDisperse, setShouldDisperse] = useState(false);
  const location = useLocation();
  const { uvMode } = useUVMode();
  
  // Effet de scintillement du néon
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(Math.random() * 0.4 + 0.8); // Variation entre 0.8 et 1.2
    }, 50); // Scintillement rapide

    return () => clearInterval(interval);
  }, []);

  // Déclenchement automatique de l'effet de dispersion après un délai
  useEffect(() => {
    const disperseTimeout = setTimeout(() => {
      setShouldDisperse(true);
    }, 3500); // Attendre 3.5 secondes avant de disperser
    
    return () => clearTimeout(disperseTimeout);
  }, []);
  
  // Gérer la fin de l'animation de dispersion
  const handleDispersionComplete = () => {
    // Réinitialiser l'effet après un délai
    setTimeout(() => {
      setShouldDisperse(false);
    }, 2000);
  };
  
  // Si le mode UV est actif, ne pas afficher ce logo normal
  if (uvMode) {
    return null;
  }
  
  return (
    <div className="w-full flex justify-center items-center py-12 pt-32 sm:pt-36 md:pt-40 relative z-30">
      <div 
        className={cn(
          "relative w-[500px] max-w-[90vw]",
          "transition-all duration-50 ease-in-out"
        )}
        style={{
          filter: `drop-shadow(0 0 5px rgba(255, 221, 0, ${glowIntensity * 0.5}))
                  drop-shadow(0 0 10px rgba(255, 221, 0, ${glowIntensity * 0.3}))
                  drop-shadow(0 0 15px rgba(255, 221, 0, ${glowIntensity * 0.2}))`
        }}
      >
        <DispersingLogo
          imageSrc="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
          triggerDispersion={shouldDisperse}
          onDispersionComplete={handleDispersionComplete}
          fromPath={location.pathname}
          toPath={location.pathname}
        />
      </div>
    </div>
  );
};
