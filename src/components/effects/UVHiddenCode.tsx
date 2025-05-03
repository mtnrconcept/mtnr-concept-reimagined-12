
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
          
          codeRef.current.style.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity*1.5}px ${color}`;
          
          // Subtle character flicker effect - randomly change opacity of characters
          const characters = codeRef.current.querySelectorAll('span');
          characters.forEach((char, i) => {
            if (Math.random() < 0.03) { // 3% chance per frame
              (char as HTMLElement).style.opacity = (Math.random() * 0.5 + 0.5).toString(); // 0.5-1.0
              setTimeout(() => {
                if (char) (char as HTMLElement).style.opacity = '1';
              }, 100 + Math.random() * 150);
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
      className={`absolute pointer-events-none select-none transition-all duration-700 uv-hidden-code ${className}`}
      data-depth={depth}
      style={{
        left: typeof position.x === 'number' ? `${position.x}%` : position.x,
        top: typeof position.y === 'number' ? `${position.y}%` : position.y,
        transform: `rotate(${rotation}deg)`,
        opacity: isVisible ? 0.85 : 0,
        zIndex: 20
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
          letterSpacing: '0.05em',
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 20, 0.4)',
          borderRadius: '4px',
          backdropFilter: 'blur(2px)',
          border: `1px solid ${color}`,
          maxWidth: '250px',
          overflow: 'hidden'
        }}
        className="bg-black/10 p-2 rounded-md"
      >
        {code}
      </pre>
    </div>
  );
}
