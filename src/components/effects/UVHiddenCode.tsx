
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
    if (!isTorchActive || !uvMode) return;
    console.log("UVHiddenCode active with torche UV");

    const handleVisibility = () => {
      if (!containerRef.current || !codeRef.current) return;
      
      const codeRect = containerRef.current.getBoundingClientRect();
      
      // Skip if not in viewport
      if (codeRect.bottom < 0 || 
          codeRect.top > window.innerHeight || 
          codeRect.right < 0 || 
          codeRect.left > window.innerWidth) {
        return;
      }
      
      const codeCenterX = codeRect.left + codeRect.width / 2;
      const codeCenterY = codeRect.top + codeRect.height / 2;
      
      // Distance from mouse to code center
      const dx = mousePosition.x - codeCenterX;
      const dy = mousePosition.y - codeCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Rayon augmenté pour améliorer la visibilité
      const proximityThreshold = 200;
      
      if (distance < proximityThreshold && uvMode) {
        setIsVisible(true);
        
        // Traiter le code ligne par ligne
        const lines = code.split('\n');
        
        const processedLines = lines.map((line, lineIndex) => {
          const chars = line.split('');
          
          return chars.map((char, charIndex) => {
            // Estimation de la position du caractère dans le conteneur
            const charX = codeRect.left + (charIndex / chars.length) * codeRect.width;
            const charY = codeRect.top + (lineIndex / lines.length) * codeRect.height;
            
            // Distance du caractère au curseur
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
          const visibilityRatio = Math.max(0, 1 - (distance / proximityThreshold));
          const glowIntensity = 5 + (visibilityRatio * 15);
          codeRef.current.style.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity*1.5}px ${color}`;
          containerRef.current.style.opacity = visibilityRatio.toString();
          containerRef.current.classList.add('visible');
          
          // Ajouter un léger effet de vibration
          const time = Date.now() / 1000;
          const vibrationX = Math.sin(time * 2) * 0.5;
          const vibrationY = Math.cos(time * 2.3) * 0.5;
          containerRef.current.style.transform = `rotate(${rotation}deg) translate(${vibrationX}px, ${vibrationY}px)`;
        }
      } else {
        setIsVisible(false);
        if (codeRef.current) {
          codeRef.current.style.textShadow = 'none';
        }
        if (containerRef.current) {
          containerRef.current.style.opacity = '0';
          containerRef.current.classList.remove('visible');
          containerRef.current.style.transform = `rotate(${rotation}deg)`;
        }
      }
    };
    
    handleVisibility(); // Initial check
    window.addEventListener('mousemove', handleVisibility);
    
    // Setup MutationObserver to detect when element becomes visible in DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          handleVisibility();
        }
      }
    });
    
    if (containerRef.current) {
      observer.observe(document.body, { 
        childList: true,
        subtree: true,
        attributes: true
      });
    }
    
    return () => {
      window.removeEventListener('mousemove', handleVisibility);
      observer.disconnect();
    };
  }, [uvMode, isTorchActive, mousePosition, code, color, rotation]);

  return (
    <div
      ref={containerRef}
      className={`absolute pointer-events-none select-none transition-opacity duration-300 uv-hidden-code ${className} ${isVisible ? 'visible' : ''}`}
      data-depth={depth}
      style={{
        left: typeof position.x === 'number' ? `${position.x}%` : position.x,
        top: typeof position.y === 'number' ? `${position.y}%` : position.y,
        transform: `rotate(${rotation}deg)`,
        opacity: 0, // Start with opacity 0
        zIndex: 99,
      }}
    >
      <pre
        ref={codeRef}
        style={{
          fontSize,
          color,
          fontFamily,
          textShadow: `0 0 5px ${color}`,
          whiteSpace: 'pre',
          lineHeight: 1.2,
          letterSpacing: '0.05em',
          padding: '8px',
        }}
      >
        {code}
      </pre>
    </div>
  );
}
