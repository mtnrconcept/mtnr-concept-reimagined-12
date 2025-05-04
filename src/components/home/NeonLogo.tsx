
import React from 'react';

interface NeonLogoProps {
  className?: string;
}

export const NeonLogo: React.FC<NeonLogoProps> = ({ className }) => {
  return (
    <div className={`logo-container relative ${className || ''}`}>
      <div className="flex justify-center items-center">
        <img 
          src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
          alt="MTNR Logo"
          className="w-[320px] max-w-full h-auto object-contain"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.7))',
          }}
        />
      </div>
      <div className="text-center text-3xl md:text-4xl font-display text-yellow-400 mt-2 tracking-widest font-medium" 
        style={{ 
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)' 
        }}>
        MTNR
      </div>
    </div>
  );
};
