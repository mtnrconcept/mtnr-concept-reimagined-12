import React from 'react';
interface NeonLogoProps {
  className?: string;
}
export const NeonLogo: React.FC<NeonLogoProps> = ({
  className
}) => {
  return <div className={`logo-container relative ${className || ''}`}>
      <div className="flex justify-center items-center">
        <img src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png" alt="MTNR Logo" className="w-[320px] max-w-full h-auto object-contain" style={{
        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.7))'
      }} />
      </div>
      
    </div>;
};