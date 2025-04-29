
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
      
      {/* Conteneur des éléments de parallax avec une plus grande hauteur */}
      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-visible pointer-events-none"
        style={{ 
          perspective: '1000px',
          height: '300vh', // Augmente la hauteur pour permettre le défilement
        }}
      />
      
      {/* Contenu de la page, à l'avant-plan avec zIndex élevé */}
      <div className="relative min-h-screen w-full z-10">
        {children}
      </div>
    </>
  );
};
