
import { ParallaxContainer } from './parallax/ParallaxContainer';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <>
      {/* Container pour les éléments parallax, sans vidéo en double */}
      <ParallaxContainer>
        {children}
      </ParallaxContainer>
    </>
  );
}
