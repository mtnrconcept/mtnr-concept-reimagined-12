import React from 'react';

interface NeonLogoProps {
  className?: string;
}

export const NeonLogo: React.FC<NeonLogoProps> = ({ className }) => {
  return (
    <div className={`logo-container ${className || ''}`}>
      <span className="text" data-text="MTNR">
        MTNR
      </span>
      <span className="gradient"></span>
      <span className="spotlight"></span>
    </div>
  );
};
