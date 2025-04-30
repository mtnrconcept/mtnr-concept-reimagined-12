
import React, { ReactNode } from 'react';

interface ParallaxBackgroundProps {
  children: ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      {children}
    </div>
  );
};

export default ParallaxBackground;
