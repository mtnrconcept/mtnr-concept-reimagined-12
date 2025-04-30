
import { useRef, useState, useEffect } from 'react';
import { useSmokeEffect } from '@/hooks/useSmokeEffect';
import { smokeEffectPresets } from '@/components/effects/smoke-presets';
import LogoWithEffect from '@/components/effects/LogoWithEffect';

export const SmokeLogoEffect = () => {
  const [shouldDisperse, setShouldDisperse] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTriggeredRef = useRef(false);
  
  const { isVisible, isAnimating, triggerSmokeEffect } = useSmokeEffect({
    shouldTrigger: shouldDisperse,
    presets: smokeEffectPresets,
    logoRef,
    containerRef,
    onEffectComplete: () => {
      setShouldDisperse(false);
      animationTriggeredRef.current = false;
    }
  });
  
  // Ne déclencher l'effet qu'une seule fois au chargement
  useEffect(() => {
    // Ne déclencher l'effet que si:
    // 1. L'animation n'a pas encore été déclenchée
    // 2. Aucune transition de page n'est en cours
    // 3. L'animation n'est pas déjà en cours
    if (!animationTriggeredRef.current && 
        !(window as any).pageTransitionInProgress && 
        !isAnimating && 
        !shouldDisperse) {
      animationTriggeredRef.current = true;
      const timer = setTimeout(() => {
        setShouldDisperse(true);
      }, 1000); // Attendre 1 seconde après le chargement
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, shouldDisperse]);

  // Appliquer l'effet de fumée
  useEffect(() => {
    if (shouldDisperse && !isAnimating && !animationTriggeredRef.current) {
      animationTriggeredRef.current = true;
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
          // Ne pas déclencher d'effet automatique ici pour éviter les déclenchements multiples
        }}
      />
    </div>
  );
};
