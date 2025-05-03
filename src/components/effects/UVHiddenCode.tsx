
import React, { useRef, useEffect, useState } from 'react';
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

interface UVHiddenCodeProps {
  code: string;
  className?: string;
  position: {
    x: string | number;
    y: string | number;
  };
  rotation?: number;
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  depth?: string;
}

export default function UVHiddenCode({
  code,
  className = "",
  position,
  rotation = 0,
  fontSize = "1rem",
  color = "#D2FF3F",
  fontFamily = "monospace",
  depth = "0.25"
}: UVHiddenCodeProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!codeRef.current || !isTorchActive) return;

    const handleVisibility = () => {
      if (!codeRef.current) return;
      
      if (uvMode && isTorchActive) {
        // Reveal the code with UV light
        setIsVisible(true);
        
        // Add subtle animation to make code feel "alive"
        const animate = () => {
          if (!codeRef.current) return;
          const time = Date.now() / 1000;
          const glowIntensity = 5 + (Math.sin(time * 2) * 3);
          
          codeRef.current.style.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity*2}px ${color}`;
          
          // Subtle character flicker effect - randomly change opacity of characters
          const characters = codeRef.current.querySelectorAll('span');
          characters.forEach((char, i) => {
            if (Math.random() < 0.05) { // 5% chance per frame
              (char as HTMLElement).style.opacity = (Math.random() * 0.5 + 0.5).toString(); // 0.5-1.0
              setTimeout(() => {
                if (char) (char as HTMLElement).style.opacity = '1';
              }, 100 + Math.random() * 200);
            }
          });
          
          requestAnimationFrame(animate);
        };
        
        // Split code into individual characters for the flicker effect
        if (codeRef.current) {
          codeRef.current.innerHTML = code
            .split('\n')
            .map(line => 
              line
                .split('')
                .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
                .join('')
            )
            .join('<br>');
        }
        
        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
      } else {
        // Hide when UV mode is off
        setIsVisible(false);
      }
    };
    
    handleVisibility();
    window.addEventListener('mousemove', handleVisibility);
    
    return () => {
      window.removeEventListener('mousemove', handleVisibility);
    };
  }, [uvMode, isTorchActive, mousePosition, code, color]);

  if (!uvMode || !isTorchActive) return null;

  return (
    <div
      className={`absolute pointer-events-none select-none transition-all duration-700 ${className}`}
      data-depth={depth}
      style={{
        left: typeof position.x === 'number' ? `${position.x}%` : position.x,
        top: typeof position.y === 'number' ? `${position.y}%` : position.y,
        transform: `rotate(${rotation}deg)`,
        opacity: isVisible ? 1 : 0,
        zIndex: 50
      }}
    >
      <pre
        ref={codeRef}
        style={{
          fontSize,
          color,
          fontFamily,
          textShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
          whiteSpace: 'pre',
          lineHeight: 1.2,
          letterSpacing: '0.05em'
        }}
        className="bg-black/30 p-4 rounded-md backdrop-blur-sm"
      >
        {code}
      </pre>
    </div>
  );
}
