
import React, { ReactNode } from 'react';

interface ParallaxBackgroundProps {
  children: ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Nous n'ajoutons pas d'éléments qui pourraient masquer la vidéo d'arrière-plan */}
      {children}
    </div>
  );
};

export default ParallaxBackground;
