
import { useRef } from 'react';
import { useParallaxEffects } from '@/hooks/useParallaxEffects';

interface ParallaxContainerProps {
  children: React.ReactNode;
}

export const ParallaxContainer = ({ children }: ParallaxContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useParallaxEffects({ containerRef });
  
  return (
    <>
      {/* Conteneur des éléments de parallax */}
      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ perspective: '1000px' }}
      />
      
      {/* Contenu de la page, à l'avant-plan avec zIndex élevé */}
      <div className="relative min-h-screen w-full z-10">
        {children}
      </div>
    </>
  );
};
