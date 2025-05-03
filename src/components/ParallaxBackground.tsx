
import { ParallaxContainer } from './parallax/ParallaxContainer';
import BackgroundVideo from './effects/BackgroundVideo';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <>
      {/* Vidéo de fond avec les chemins mis à jour */}
      <BackgroundVideo 
        videoUrl="/lovable-uploads/videonormale.mp4"
        videoUrlUV="/lovable-uploads/videouv.mp4"
      />
      
      {/* Container pour les éléments parallax */}
      <ParallaxContainer>
        {children}
      </ParallaxContainer>
    </>
  );
}
