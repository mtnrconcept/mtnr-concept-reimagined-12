
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
      <Background imagePath={backgroundImage} />
      
      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ perspective: '1000px' }}
      >
        {children}
      </div>
    </>
  );
};
