
import { ParallaxContainer } from './parallax/ParallaxContainer';
import BackgroundVideo from './effects/BackgroundVideo';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <>
      {/* Remplacer l'image de fond par la vidéo */}
      <BackgroundVideo />
      
      {/* Container pour les éléments parallax */}
      <ParallaxContainer>
        {children}
      </ParallaxContainer>
    </>
  );
}
