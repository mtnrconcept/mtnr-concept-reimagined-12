
import { ParallaxContainer } from './parallax/ParallaxContainer';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <ParallaxContainer backgroundImage="/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png">
      {children}
    </ParallaxContainer>
  );
}
