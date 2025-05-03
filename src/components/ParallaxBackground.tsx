
import { ParallaxContainer } from './parallax/ParallaxContainer';
import BackgroundVideo from './effects/BackgroundVideo';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <>
      {/* Vidéo de fond avec les chemins corrects */}
      <BackgroundVideo 
        videoUrl="/lovable-uploads/Composition_1.mp4"
        videoUrlUV="/lovable-uploads/Composition_1_1.mp4"
      />
      
      {/* Container pour les éléments parallax */}
      <ParallaxContainer>
        {children}
      </ParallaxContainer>
    </>
  );
}
