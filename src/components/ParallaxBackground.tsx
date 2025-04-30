
import React, { ReactNode } from 'react';
import { ParallaxContainer } from './parallax/ParallaxContainer';

interface ParallaxBackgroundProps {
  children: ReactNode;
}

const ParallaxBackground = ({ children }: ParallaxBackgroundProps) => {
  return (
    <ParallaxContainer>
      {children}
    </ParallaxContainer>
  );
};

export default ParallaxBackground;
