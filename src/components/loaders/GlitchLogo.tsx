
import React from 'react';
import { motion } from 'framer-motion';
import LogoWithEffect from '../effects/LogoWithEffect';

interface GlitchLogoProps {
  isLogoVisible: boolean;
  glitchEffect: boolean;
  phase: 'normal' | 'uv' | 'complete';
  logoRef: React.RefObject<HTMLImageElement>;
}

export const GlitchLogo: React.FC<GlitchLogoProps> = ({ 
  isLogoVisible, 
  glitchEffect, 
  phase,
  logoRef
}) => {
  return (
    <motion.div
      className={`mb-8 relative ${glitchEffect ? 'glitch-effect' : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <LogoWithEffect
        src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        alt="MTNR Studio"
        width="80%"
        glowEffect={true}
        glowColor={phase === 'uv' ? '210, 255, 63' : '255, 221, 0'}
        isVisible={isLogoVisible}
        logoRef={logoRef}
        className={`transform-gpu max-w-full ${glitchEffect ? 'glitch-logo' : ''}`}
      />
      
      {/* Effet de glitch sur le logo */}
      {glitchEffect && (
        <>
          <div className="absolute inset-0 logo-glitch-1"></div>
          <div className="absolute inset-0 logo-glitch-2"></div>
        </>
      )}
    </motion.div>
  );
};
