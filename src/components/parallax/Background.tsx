
import React from 'react';
import BackgroundVideoController from '../effects/BackgroundVideoController';
import Parallax3DEffect from './Parallax3DEffect';

interface BackgroundProps {
  depth?: number;
}

export const Background = ({ depth = 0.08 }: BackgroundProps) => {
  return (
    <>
      {/* Video background */}
      <BackgroundVideoController videoSrc="/lovable-uploads/ascensceur.mp4" />
      
      {/* 3D Parallax Effect */}
      <Parallax3DEffect depth={depth}>
        <div className="absolute inset-0 pointer-events-none">
          {/* Additional decorative elements can be added here */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-500/10 to-transparent blur-xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-48 h-24 rounded-full bg-gradient-to-r from-yellow-500/5 to-transparent blur-lg"></div>
        </div>
      </Parallax3DEffect>
    </>
  );
};
