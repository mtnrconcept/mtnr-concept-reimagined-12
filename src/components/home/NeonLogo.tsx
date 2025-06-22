
import React from 'react';
import { useUVMode } from '../effects/UVModeContext';

interface NeonLogoProps {
  className?: string;
}

export const NeonLogo: React.FC<NeonLogoProps> = ({
  className
}) => {
  const { uvMode } = useUVMode();

  return (
    <div className={`logo-container relative ${className || ''}`}>
      <div className="flex flex-col justify-center items-center">
        <img 
          src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png" 
          alt="MTNR Logo" 
          style={{
            filter: uvMode ? 'hue-rotate(120deg) brightness(1.5) saturate(1.5) contrast(1.2) drop-shadow(0 0 8px rgba(210, 255, 63, 0.7))' : 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.7))',
            transition: 'filter 0.5s ease-out'
          }} 
          className="w-[280px] max-w-full h-auto object-contain" 
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  );
};
