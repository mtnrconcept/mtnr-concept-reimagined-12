
import { useRef } from 'react';
import { useParallaxEffects } from '@/hooks/useParallaxEffects';
import { Background } from './Background';

interface ParallaxContainerProps {
  children: React.ReactNode;
  backgroundImage: string;
}

export const ParallaxContainer = ({ children, backgroundImage }: ParallaxContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useParallaxEffects({ containerRef });
  
  return (
    <>
      {/* Fond en position fixe */}
      <Background imagePath={backgroundImage} />
      
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
