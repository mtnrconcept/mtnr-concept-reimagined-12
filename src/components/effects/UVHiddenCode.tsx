
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!codeRef.current || !isTorchActive || !uvMode) return;

    const handleVisibility = () => {
      if (!codeRef.current || !containerRef.current) return;
      
      const codeRect = containerRef.current.getBoundingClientRect();
      const codeCenterX = codeRect.left + codeRect.width / 2;
      const codeCenterY = codeRect.top + codeRect.height / 2;
      
      // Distance from mouse to code center
      const dx = mousePosition.x - codeCenterX;
      const dy = mousePosition.y - codeCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Elliptical mask of ~150px (augmenté pour une meilleure visibilité)
      const proximityThreshold = 150;
      
      if (distance < proximityThreshold * 1.5 && uvMode) {
        // Reveal code progressively based on cursor proximity
        setIsVisible(true);
        
        // Traiter le code ligne par ligne
        const lines = code.split('\n');
        
        const processedLines = lines.map((line, lineIndex) => {
          const chars = line.split('');
          
          // Pour chaque caractère, calculer sa distance absolue au curseur
          return chars.map((char, charIndex) => {
            // Estimation de la position du caractère dans le conteneur
            const charX = codeRect.left + (charIndex / chars.length) * codeRect.width;
            const charY = codeRect.top + (lineIndex / lines.length) * codeRect.height;
            
            // Distance directe du caractère au curseur (sans ellipse)
            const charDx = mousePosition.x - charX;
            const charDy = mousePosition.y - charY;
            const charDistance = Math.sqrt(charDx * charDx + charDy * charDy);
            
            // Visibilité inversement proportionnelle à la distance
            const charVisibility = Math.max(0, 1 - charDistance / proximityThreshold);
            
            return `<span style="opacity: ${charVisibility.toFixed(2)};">${char === ' ' ? '&nbsp;' : char}</span>`;
          }).join('');
        });
        
        if (codeRef.current) {
          codeRef.current.innerHTML = processedLines.join('<br>');
          
          // Ajouter un effet de lueur basé sur la proximité
          const visibilityRatio = Math.max(0, 1 - (distance / (proximityThreshold * 1.5)));
          const glowIntensity = 5 + (visibilityRatio * 15);
          codeRef.current.style.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity*1.5}px ${color}`;
          containerRef.current.style.opacity = '1';
        }
      } else {
        // Hide when cursor is far
        setIsVisible(false);
        if (codeRef.current) {
          codeRef.current.style.textShadow = 'none';
        }
        if (containerRef.current) {
          containerRef.current.style.opacity = '0';
        }
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
      ref={containerRef}
      className={`absolute pointer-events-none select-none transition-opacity duration-300 uv-hidden-code ${className}`}
      data-depth={depth}
      style={{
        left: typeof position.x === 'number' ? `${position.x}%` : position.x,
        top: typeof position.y === 'number' ? `${position.y}%` : position.y,
        transform: `rotate(${rotation}deg)`,
        opacity: 0, // Start with opacity 0
        zIndex: 20,
        backgroundColor: 'transparent', // Remove background
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
          backgroundColor: 'transparent' // No background
        }}
      >
        {code}
      </pre>
    </div>
  );
}
