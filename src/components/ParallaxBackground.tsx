
import React, { ReactNode } from 'react';

interface ParallaxBackgroundProps {
  children: ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Le contenu est simplement rendu directement, sans effet parallaxe */}
      {children}
    </div>
  );
};

export default ParallaxBackground;
