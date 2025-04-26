
import React from 'react';
import { useIlluminated } from './TorchContext';

export const IlluminatedCard = ({ children }: { children: React.ReactNode }) => {
  const { ref, isTorchActive } = useIlluminated();
  
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`rounded-lg p-6 transition-all duration-300 ${
        isTorchActive ? 'bg-yellow-400/20' : 'bg-gray-800/50'
      }`}
      style={{
        transition: 'box-shadow 0.2s ease, background-color 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};
