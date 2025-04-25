
import { ParallaxElement } from './ParallaxElement';

export const Background = () => {
  return (
    <div 
      className="absolute inset-0 w-full h-screen parallax-element"
      data-depth="0.05"  // Une valeur très faible pour un défilement très lent
      data-x="0"
      data-y="0"
      style={{
        backgroundImage: 'url("/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.9,
        transform: 'translateZ(-2000px)', // Plus proche que précédemment mais toujours derrière les autres éléments
      }}
    />
  );
};
