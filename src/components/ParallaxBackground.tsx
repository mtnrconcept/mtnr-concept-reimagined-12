
import { ParallaxContainer } from './parallax/ParallaxContainer';
import BackgroundVideo from './effects/BackgroundVideo';
import Parallax3DScene from './Parallax3DScene';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <>
      {/* BackgroundVideo en fond */}
      <BackgroundVideo />
      
      {/* Nouvelle scène 3D avec effets de parallaxe améliorés */}
      <Parallax3DScene />
      
      {/* Container pour les éléments à afficher au premier plan */}
      <ParallaxContainer>
        {children}
      </ParallaxContainer>
    </>
  );
}
