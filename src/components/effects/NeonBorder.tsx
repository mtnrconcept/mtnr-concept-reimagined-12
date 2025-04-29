
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NeonBorderProps {
  className?: string;
  color?: "yellow" | "white";
  children: React.ReactNode;
  speed?: number; // en secondes pour un cycle complet
  glowIntensity?: "low" | "medium" | "high";
}

export default function NeonBorder({
  className,
  color = "yellow",
  children,
  speed = 8, // 8 secondes par défaut pour un cycle complet
  glowIntensity = "medium"
}: NeonBorderProps) {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Petit délai avant activation pour permettre au composant de se rendre complètement
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calcul des classes de couleur
  const colorVariants = {
    yellow: "neon-border-yellow",
    white: "neon-border-white"
  };
  
  // Calcul des classes d'intensité de lueur
  const intensityVariants = {
    low: "glow-intensity-low",
    medium: "glow-intensity-medium", 
    high: "glow-intensity-high"
  };

  return (
    <div className="relative">
      <style>
        {`
          @keyframes borderGlow {
            0% { background-position: 0% 0%; }
            100% { background-position: 300% 0%; }
          }
          
          .neon-border-container {
            position: relative;
            z-index: 0;
          }
          
          .neon-border-container::before {
            content: '';
            position: absolute;
            z-index: -1;
            inset: -3px;
            background: linear-gradient(90deg, 
              #ffdd00, #ffee88, #ffffff, #ffdd00, 
              #ffee88, #ffffff, #ffdd00);
            background-size: 300% 100%;
            border-radius: inherit;
            animation: borderGlow var(--animation-speed) linear infinite;
            opacity: 0;
            transition: opacity 0.5s ease-in;
          }
          
          .neon-border-container.active::before {
            opacity: 1;
          }
          
          .neon-border-yellow::before {
            background: linear-gradient(90deg, 
              #ffdd00, #ffee88, #ffffff, #ffdd00, 
              #ffee88, #ffffff, #ffdd00);
          }
          
          .neon-border-white::before {
            background: linear-gradient(90deg, 
              #ffffff, #dddddd, #ffffff, #dddddd, 
              #ffffff, #dddddd, #ffffff);
          }
          
          .glow-intensity-low::before {
            filter: blur(4px);
          }
          
          .glow-intensity-medium::before {
            filter: blur(6px);
          }
          
          .glow-intensity-high::before {
            filter: blur(8px);
          }
        `}
      </style>
      <div 
        className={cn(
          "neon-border-container",
          isActive && "active",
          colorVariants[color],
          intensityVariants[glowIntensity],
          className
        )}
        style={{ "--animation-speed": `${speed}s` } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
