
import { useRef, useEffect } from 'react';
import { Background } from './parallax/Background';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '@/components/effects/NavigationContext';

export default function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { registerVideoTransitionListener } = useNavigation();
  
  // Utiliser notre hook de parallaxe
  useParallaxEffect(containerRef);
  
  // On s'assure que le composant est monté sur toutes les pages
  useEffect(() => {
    console.log("ParallaxScene mounted");
    return () => console.log("ParallaxScene unmounted");
  }, []);

  return (
    <>
      {/* Le fond n'est plus nécessaire car il est géré par le BackgroundVideo */}
      {/* <Background /> */}

      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
        style={{ 
          perspective: '2000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Les éléments paint splash sont maintenant gérés par le composant PageSplashes dans chaque page */}
      </div>
    </>
  );
}
