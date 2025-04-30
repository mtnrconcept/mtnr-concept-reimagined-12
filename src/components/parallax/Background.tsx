
import React from 'react';
import BackgroundVideoController from '../effects/BackgroundVideoController';
import Parallax3DEffect from './Parallax3DEffect';

interface BackgroundProps {
  depth?: number;
}

export const Background = ({ depth = 0.08 }: BackgroundProps) => {
  return (
    <>
      {/* Video background with controller */}
      <BackgroundVideoController videoSrc="/lovable-uploads/ascensceur.mp4" />
      
      {/* Enhanced 3D Parallax Effect */}
      <Parallax3DEffect depth={depth}>
        <div className="absolute inset-0 pointer-events-none">
          {/* Grille profonde pour effet comme dans le design de référence */}
          <div className="absolute inset-0 parallax-grid-pattern"></div>
          
          {/* Éléments décoratifs avec couleurs jaune/noir */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-500/10 to-transparent blur-xl depth-4"></div>
          <div className="absolute bottom-1/3 left-1/3 w-48 h-24 rounded-full bg-gradient-to-r from-yellow-500/5 to-transparent blur-lg depth-3"></div>
          
          {/* Points lumineux avec effet 3D avancé */}
          <div className="absolute top-1/6 left-1/5 w-4 h-4 rounded-full bg-yellow-300/30 animate-pulse-yellow parallax-element depth-2"></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-yellow-300/20 animate-pulse-yellow parallax-element depth-3"></div>
          <div className="absolute top-1/3 right-1/5 w-2 h-2 rounded-full bg-yellow-400/40 animate-pulse-yellow parallax-element depth-5"></div>
          
          {/* Grille de profondeur jaune */}
          <div className="absolute inset-0 bg-grid-pattern"></div>
          
          {/* Éléments flottants supplémentaires */}
          <div className="absolute top-1/2 left-1/4 w-20 h-1 bg-yellow-500/20 rotate-45 float depth-4"></div>
          <div className="absolute bottom-1/3 right-1/5 w-16 h-16 rounded-full bg-gradient-radial from-yellow-500/5 to-transparent blur-xl depth-3"></div>
          
          {/* Vignette pour accentuer l'effet 3D */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/30 pointer-events-none"></div>
        </div>
      </Parallax3DEffect>
    </>
  );
};
