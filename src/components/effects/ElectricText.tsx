
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ElectricTextProps {
  text: string;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
}

export default function ElectricText({
  text,
  className,
  color = "#D2FF3F",
  intensity = 'medium',
  size = 'md'
}: ElectricTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Générer les arcs électriques
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const arcsContainer = document.createElement('div');
    arcsContainer.className = 'absolute inset-0 pointer-events-none overflow-visible';
    container.appendChild(arcsContainer);
    
    // Nombre d'arcs basé sur l'intensité
    const arcCount = {
      low: 2,
      medium: 4,
      high: 6
    }[intensity];
    
    // Créer les arcs électriques
    for (let i = 0; i < arcCount; i++) {
      createElectricArc(arcsContainer, color);
    }
    
    function createElectricArc(parent: HTMLDivElement, arcColor: string) {
      const arc = document.createElement('div');
      
      // Positionnement aléatoire autour du texte
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = Math.random() * 100;
      const endY = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 0.5 + Math.random() * 1;
      
      arc.className = 'electric-arc absolute';
      arc.style.setProperty('--start-x', `${startX}%`);
      arc.style.setProperty('--start-y', `${startY}%`);
      arc.style.setProperty('--end-x', `${endX}%`);
      arc.style.setProperty('--end-y', `${endY}%`);
      arc.style.setProperty('--arc-color', arcColor);
      arc.style.setProperty('--arc-delay', `${delay}s`);
      arc.style.setProperty('--arc-duration', `${duration}s`);
      
      parent.appendChild(arc);
      
      // Créer des points d'éclat aux deux extrémités
      const sparkStart = document.createElement('div');
      sparkStart.className = 'spark absolute';
      sparkStart.style.left = `${startX}%`;
      sparkStart.style.top = `${startY}%`;
      sparkStart.style.backgroundColor = arcColor;
      sparkStart.style.boxShadow = `0 0 10px ${arcColor}, 0 0 20px ${arcColor}`;
      sparkStart.style.animationDelay = `${delay}s`;
      sparkStart.style.animationDuration = `${duration}s`;
      parent.appendChild(sparkStart);
      
      const sparkEnd = document.createElement('div');
      sparkEnd.className = 'spark absolute';
      sparkEnd.style.left = `${endX}%`;
      sparkEnd.style.top = `${endY}%`;
      sparkEnd.style.backgroundColor = arcColor;
      sparkEnd.style.boxShadow = `0 0 10px ${arcColor}, 0 0 20px ${arcColor}`;
      sparkEnd.style.animationDelay = `${delay}s`;
      sparkEnd.style.animationDuration = `${duration}s`;
      parent.appendChild(sparkEnd);
    }
    
    return () => {
      if (arcsContainer && container.contains(arcsContainer)) {
        container.removeChild(arcsContainer);
      }
    };
  }, [color, intensity]);
  
  // Classes de taille
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];
  
  return (
    <div className="relative inline-block">
      <div
        ref={containerRef}
        className="relative"
      >
        <span
          className={cn(
            "electric-text-effect relative inline-block z-10",
            sizeClasses,
            className
          )}
          style={{ 
            color, 
            textShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}`
          }}
        >
          {text}
        </span>
      </div>
      
      <style jsx>{`
        @keyframes sparkFlash {
          0%, 100% { opacity: 0; transform: scale(0); }
          20%, 80% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes electricArcMove {
          0% {
            opacity: 0;
            filter: blur(1px);
            background: linear-gradient(
              to right,
              transparent 0%,
              var(--arc-color) 50%,
              transparent 100%
            );
            clip-path: polygon(
              var(--start-x) var(--start-y),
              calc(var(--start-x) + 1%) calc(var(--start-y) - 10%),
              calc(var(--start-x) + 20%) calc(var(--start-y) + 20%),
              calc(var(--start-x) + 40%) calc(var(--start-y) - 10%),
              calc(var(--start-x) + 60%) calc(var(--start-y) + 20%),
              calc(var(--start-x) + 80%) calc(var(--start-y) - 10%),
              var(--end-x) var(--end-y)
            );
          }
          5% {
            opacity: 0.8;
          }
          10% {
            clip-path: polygon(
              var(--start-x) var(--start-y),
              calc(var(--start-x) + 5%) calc(var(--start-y) + 15%),
              calc(var(--start-x) + 25%) calc(var(--start-y) - 15%),
              calc(var(--start-x) + 45%) calc(var(--start-y) + 5%),
              calc(var(--start-x) + 65%) calc(var(--start-y) - 10%),
              calc(var(--start-x) + 85%) calc(var(--start-y) + 15%),
              var(--end-x) var(--end-y)
            );
          }
          20% {
            opacity: 1;
          }
          30% {
            clip-path: polygon(
              var(--start-x) var(--start-y),
              calc(var(--start-x) + 10%) calc(var(--start-y) - 20%),
              calc(var(--start-x) + 30%) calc(var(--start-y) + 10%),
              calc(var(--start-x) + 50%) calc(var(--start-y) - 15%),
              calc(var(--start-x) + 70%) calc(var(--start-y) + 20%),
              calc(var(--start-x) + 90%) calc(var(--start-y) - 5%),
              var(--end-x) var(--end-y)
            );
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            filter: blur(3px);
            clip-path: polygon(
              var(--start-x) var(--start-y),
              calc(var(--start-x) + 5%) calc(var(--start-y) + 10%),
              calc(var(--start-x) + 25%) calc(var(--start-y) - 5%),
              calc(var(--start-x) + 45%) calc(var(--start-y) + 15%),
              calc(var(--start-x) + 65%) calc(var(--start-y) - 15%),
              calc(var(--start-x) + 85%) calc(var(--start-y) + 5%),
              var(--end-x) var(--end-y)
            );
          }
        }
        
        .electric-text-effect {
          animation: electricTextPulse 3s infinite, textVibration 0.05s infinite;
        }
        
        .electric-arc {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          filter: blur(1px);
          opacity: 0;
          background: linear-gradient(
            to right,
            transparent 0%,
            var(--arc-color) 50%,
            transparent 100%
          );
          animation: electricArcMove var(--arc-duration) infinite var(--arc-delay);
          animation-timing-function: ease-in-out;
          z-index: 5;
        }
        
        .spark {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          filter: blur(1px);
          animation: sparkFlash var(--arc-duration) infinite var(--arc-delay);
          z-index: 6;
        }
      `}</style>
    </div>
  );
}
