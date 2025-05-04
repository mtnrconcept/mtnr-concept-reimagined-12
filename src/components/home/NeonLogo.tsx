import React from 'react';
import { cn } from '@/lib/utils';

// Update the component to accept className as a prop
interface NeonLogoProps {
  className?: string;
}

export const NeonLogo: React.FC<NeonLogoProps> = ({ className }) => {
  return (
    <div className={cn("logo-container relative", className)}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
      >
        <path
          d="M41 40L41 160"
          stroke="#FFDD00"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M41 40L159 40"
          stroke="#FFDD00"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M159 40L159 160"
          stroke="#FFDD00"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M159 100L100 100"
          stroke="#FFDD00"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M100 160L41 160"
          stroke="#FFDD00"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M100 100L100 160"
          stroke="#FFDD00"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M100 100L80 75"
          stroke="#FFDD00"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
