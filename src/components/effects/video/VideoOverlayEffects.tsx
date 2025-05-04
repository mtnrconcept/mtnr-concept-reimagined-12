
import React from 'react';

const VideoOverlayEffects: React.FC = () => {
  return (
    <>
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          transform: 'translateZ(-50px)',
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }}
      />
      
      {/* Vignette effect - pointerEvents: none empêche l'effet de bloquer les interactions */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
    </>
  );
};

export default VideoOverlayEffects;
