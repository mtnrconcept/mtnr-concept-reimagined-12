
import { useRef, useState, useEffect } from 'react';
import { useSmokeEffect } from '@/hooks/useSmokeEffect';
import { smokeEffectPresets } from '@/components/effects/smoke-presets';
import LogoWithEffect from '@/components/effects/LogoWithEffect';

export const SmokeLogoEffect = () => {
  const [shouldDisperse, setShouldDisperse] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isVisible, isAnimating, triggerSmokeEffect } = useSmokeEffect({
    shouldTrigger: shouldDisperse,
    presets: smokeEffectPresets,
    logoRef,
    containerRef,
    onEffectComplete: () => {
      setShouldDisperse(false);
    }
  });
  
  // Déclenchement automatique de l'effet de dispersion après un délai
  useEffect(() => {
    // Ne pas déclencher l'effet si une transition de page est en cours
    if ((window as any).pageTransitionInProgress) return;
    
    const disperseTimeout = setTimeout(() => {
      setShouldDisperse(true);
    }, 2000); // Attendre 2 secondes avant de disperser
    
    return () => clearTimeout(disperseTimeout);
  }, []);

  // Appliquer l'effet de fumée
  useEffect(() => {
    if (shouldDisperse && !isAnimating) {
      const cleanup = triggerSmokeEffect();
      return () => cleanup.cancel();
    }
  }, [shouldDisperse, isAnimating, triggerSmokeEffect]);
  
  return (
    <div ref={containerRef} className="smoke-logo-container w-full flex justify-center items-center py-12 relative z-30">
      <LogoWithEffect 
        src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        alt="MTNR Concept"
        width="500px"
        isVisible={isVisible}
        logoRef={logoRef}
        glowEffect={true}
        onLoad={() => {
          // Déclencher l'effet après le chargement complet de l'image
          if (!shouldDisperse && !window.pageTransitionInProgress) {
            setShouldDisperse(true);
          }
        }}
      />
    </div>
  );
};
