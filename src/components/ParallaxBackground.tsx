
import { ParallaxContainer } from './parallax/ParallaxContainer';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <ParallaxContainer backgroundImage="/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png">
      {children}
    </ParallaxContainer>
  );
}
