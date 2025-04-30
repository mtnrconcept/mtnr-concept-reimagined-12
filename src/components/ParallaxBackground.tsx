
import { ParallaxContainer } from './parallax/ParallaxContainer';
import BackgroundVideo from './effects/BackgroundVideo';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <>
      {/* BackgroundVideo en fond */}
      <BackgroundVideo />
      
      {/* Container pour les éléments parallax */}
      <ParallaxContainer>
        {children}
      </ParallaxContainer>
    </>
  );
}
