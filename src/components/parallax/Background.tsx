
import { ParallaxElement } from './ParallaxElement';

export const Background = () => {
  return (
    <div 
      className="absolute inset-0 w-full h-full parallax-element"
      data-depth="0.005"  // Réduit considérablement pour éloigner le fond
      data-x="0"
      data-y="0"
      style={{
        backgroundImage: 'url("/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.8,
        transform: 'translateZ(-5000px)', // Éloigne beaucoup plus le fond
      }}
    />
  );
};
