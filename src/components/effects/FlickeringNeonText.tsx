
import React from 'react';
import { cn } from '@/lib/utils';

interface FlickeringNeonTextProps {
  text: string;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  fontSize?: string;
}

export default function FlickeringNeonText({
  text,
  className,
  color = "#D946EF",
  intensity = 'medium',
  fontSize = "0.875rem"
}: FlickeringNeonTextProps) {
  // Déterminer les classes d'intensité
  const intensityClass = {
    low: "flicker-low",
    medium: "flicker-medium",
    high: "flicker-high"
  }[intensity];
  
  return (
    <div className="relative">
      <p
        className={cn(
          "flickering-neon-text",
          intensityClass,
          className
        )}
        style={{
          fontSize,
          color,
          textShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}`
        }}
      >
        {text}
      </p>
      
      <style jsx>{`
        @keyframes neonFlicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 
              0 0 5px ${color},
              0 0 10px ${color},
              0 0 20px ${color};
            opacity: 0.8;
          }
          20%, 24%, 55% {
            text-shadow: none;
            opacity: 0.3;
          }
        }
        
        @keyframes staticEffect {
          0% { clip-path: inset(10% 0 80% 0); }
          5% { clip-path: inset(30% 0 50% 0); }
          10% { clip-path: inset(80% 0 5% 0); }
          15% { clip-path: inset(50% 0 40% 0); }
          20% { clip-path: inset(15% 0 65% 0); }
          25% { clip-path: inset(5% 0 95% 0); }
          30% { clip-path: inset(50% 0 30% 0); }
          35% { clip-path: inset(80% 0 15% 0); }
          40% { clip-path: inset(30% 0 50% 0); }
          45% { clip-path: inset(70% 0 40% 0); }
          50% { clip-path: inset(10% 0 60% 0); }
          55% { clip-path: inset(40% 0 30% 0); }
          60% { clip-path: inset(5% 0 70% 0); }
          65% { clip-path: inset(80% 0 10% 0); }
          70% { clip-path: inset(25% 0 50% 0); }
          75% { clip-path: inset(45% 0 35% 0); }
          80% { clip-path: inset(5% 0 70% 0); }
          85% { clip-path: inset(40% 0 60% 0); }
          90% { clip-path: inset(60% 0 10% 0); }
          95% { clip-path: inset(30% 0 20% 0); }
          100% { clip-path: inset(15% 0 80% 0); }
        }
        
        @keyframes buzzEffect {
          0% { transform: translateX(0); }
          1% { transform: translateX(1px); }
          2% { transform: translateX(-1px); }
          3% { transform: translateX(1px); }
          4% { transform: translateX(-1px); }
          5% { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
        
        .flickering-neon-text {
          position: relative;
          display: inline-block;
          animation: neonFlicker 3s infinite;
        }
        
        .flickering-neon-text::before {
          content: '${text}';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          opacity: 0.2;
          animation: staticEffect 0.2s infinite steps(1);
          color: ${color};
          z-index: -1;
        }
        
        .flicker-low {
          animation-duration: 4s;
        }
        
        .flicker-medium {
          animation-duration: 3s;
        }
        
        .flicker-high {
          animation-duration: 2s;
          animation: neonFlicker 2s infinite, buzzEffect 5s infinite;
        }
      `}</style>
    </div>
  );
}
