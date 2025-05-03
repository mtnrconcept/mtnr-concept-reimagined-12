
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
      
      // Distance from mouse to code
      const dx = mousePosition.x - codeCenterX;
      const dy = mousePosition.y - codeCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Reduced proximity threshold to limit visibility to ~7 characters
      const proximityThreshold = 150; // Réduit pour une visibilité plus locale
      
      if (distance < proximityThreshold && uvMode) {
        // Reveal code progressively based on cursor proximity
        setIsVisible(true);
        
        const visibilityRatio = Math.max(0, 1 - (distance / proximityThreshold));
        
        if (codeRef.current) {
          // Déterminer de quel côté vient le curseur (direction)
          const fromLeft = mousePosition.x < codeCenterX;
          const fromTop = mousePosition.y < codeCenterY;
          
          // Créer un effet de révélation progressive basé sur la position du curseur
          const lines = code.split('\n');
          const processedLines = lines.map((line, lineIndex) => {
            const chars = line.split('');
            
            return chars.map((char, charIndex) => {
              // Calculer la position relative de ce caractère dans le bloc de code
              const relX = fromLeft 
                ? charIndex / chars.length 
                : 1 - (charIndex / chars.length);
              
              const relY = fromTop 
                ? lineIndex / lines.length 
                : 1 - (lineIndex / lines.length);
              
              // Facteur d'échelle pour rendre la fenêtre de visibilité plus petite
              // Ajusté pour montrer environ 7 caractères sur une ligne
              const visibilityWindowX = 0.25; 
              const visibilityWindowY = 0.5; // Plus grand pour les lignes
              
              // Distance normalisée du curseur au caractère dans l'espace 2D
              const charDistanceX = Math.abs(relX - 0.5) / visibilityWindowX;
              const charDistanceY = Math.abs(relY - 0.5) / visibilityWindowY;
              const charDistance = Math.sqrt(charDistanceX * charDistanceX + charDistanceY * charDistanceY);
              
              // Combiner la distance globale avec la position relative
              const charVisibility = Math.max(0, visibilityRatio * (1 - charDistance));
              
              return `<span style="opacity: ${Math.max(0, charVisibility)};">${char === ' ' ? '&nbsp;' : char}</span>`;
            }).join('');
          });
          
          codeRef.current.innerHTML = processedLines.join('<br>');
          
          // Ajouter un effet de lueur basé sur la proximité
          const glowIntensity = 5 + (visibilityRatio * 15);
          codeRef.current.style.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity*1.5}px ${color}`;
          containerRef.current.style.opacity = visibilityRatio.toString();
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
        opacity: 0,
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
