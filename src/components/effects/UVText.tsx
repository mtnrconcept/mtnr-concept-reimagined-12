
import React, { useRef, useEffect, useState, ReactNode } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { cn } from "@/lib/utils";

interface UVTextProps {
  text: ReactNode;
  className?: string;
  hiddenText?: string;
  uvColor?: string;
  textSize?: string;
  opacity?: number;
  position?: "default" | "absolute";
}

export default function UVText({
  text,
  className,
  hiddenText,
  uvColor = "#D2FF3F", // Fluorescent yellow color to match reference image
  textSize = "text-base",
  opacity = 0.05,
  position = "default"
}: UVTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const hiddenTextRef = useRef<HTMLParagraphElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isIlluminated, setIsIlluminated] = useState(false);

  useEffect(() => {
    if (!isTorchActive || !textRef.current || !hiddenTextRef.current) return;

    const handleMouseMove = () => {
      if (!textRef.current || !hiddenTextRef.current) return;
      
      const rect = textRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Distance from mouse to text center
      const dx = mousePosition.x - centerX;
      const dy = mousePosition.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Uniquement visible en mode UV
      const threshold = uvMode ? 100 : 0; // Rayon du masque de 100px
      const newIsIlluminated = distance < threshold * 1.5 && uvMode;
      
      if (newIsIlluminated !== isIlluminated) {
        setIsIlluminated(newIsIlluminated);
      }

      if (newIsIlluminated && uvMode) {
        // Calculate intensity based on distance (stronger when closer)
        const intensity = 1 - (distance / threshold);
        
        if (typeof hiddenText === 'string') {
          // Diviser le texte en caractères pour un effet elliptique
          const chars = hiddenText.split('');
          const processedChars = chars.map((char, index) => {
            // Estimer la position horizontale de ce caractère 
            const charElement = document.createElement('span');
            charElement.textContent = char;
            charElement.style.display = 'inline-block';
            document.body.appendChild(charElement);
            const charWidth = charElement.getBoundingClientRect().width;
            document.body.removeChild(charElement);
            
            // Position approximative du caractère (en pixels)
            const charPosition = index * (charWidth || 8); // 8px par défaut
            const charX = rect.left + charPosition;
            
            // Distance du caractère au curseur
            const charDx = mousePosition.x - charX;
            const charDy = mousePosition.y - centerY;
            
            // Distance elliptique (100px mask)
            const ellipticalDistance = Math.sqrt((charDx * charDx) / 1 + (charDy * charDy) / 2.25);
            const charVisibility = Math.max(0, 1 - ellipticalDistance / 100);
            
            return `<span style="opacity: ${charVisibility.toFixed(2)}; display: inline-block;">${char}</span>`;
          });
          
          hiddenTextRef.current.innerHTML = processedChars.join('');
          textRef.current.style.opacity = '0.3'; // Reduce original text opacity
        } else {
          const opacityValue = Math.min(1, intensity * 3);
          hiddenTextRef.current.style.opacity = `${opacityValue}`;
        }
        
        // Enhanced glow for UV mode with dynamic fluorescent yellow color
        const glowSize = 25 * intensity;
        const primaryGlow = uvColor;
        const secondaryGlow = "#4FA9FF";
        
        hiddenTextRef.current.style.textShadow = `
          0 0 ${glowSize}px ${primaryGlow}, 
          0 0 ${glowSize * 2}px ${primaryGlow},
          0 0 ${glowSize * 3}px ${secondaryGlow}
        `;
        
        // Dynamic animation effects in UV mode
        const time = Date.now() / 1000;
        const vibrationX = Math.sin(time * 2) * 0.8;
        const vibrationY = Math.cos(time * 1.8) * 0.8;
        hiddenTextRef.current.style.transform = `translate(${vibrationX}px, ${vibrationY}px)`;
        
        // Add letter spacing for dramatic effect in UV mode
        hiddenTextRef.current.style.letterSpacing = `${0.05 + (intensity * 0.1)}em`;
      } else {
        if (hiddenTextRef.current) {
          hiddenTextRef.current.style.opacity = '0';
          hiddenTextRef.current.style.textShadow = 'none';
          hiddenTextRef.current.style.transform = '';
          hiddenTextRef.current.style.letterSpacing = '';
        }
        if (textRef.current) {
          textRef.current.style.opacity = '1';
        }
      }
    };

    if (isTorchActive) {
      window.addEventListener('mousemove', handleMouseMove);
      handleMouseMove(); // Initial calculation
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTorchActive, mousePosition, isIlluminated, uvColor, uvMode, hiddenText]);

  // Auto-reveal hidden text if UV mode is active, regardless of mouse position
  useEffect(() => {
    if (!uvMode || !isTorchActive) {
      // Réinitialiser le texte original si le mode UV est désactivé
      if (textRef.current) {
        textRef.current.style.opacity = '1';
      }
      if (hiddenTextRef.current) {
        hiddenTextRef.current.style.opacity = '0';
      }
    }
  }, [uvMode, isTorchActive]);

  return (
    <div className={cn(
      "uv-text-container relative", 
      position === "absolute" ? "absolute inset-0" : "",
      className
    )}>
      <div 
        ref={textRef} 
        className={cn("visible select-none transition-opacity", textSize)}
        style={{ position: 'relative', zIndex: 5 }} // Assurer que le texte est au premier plan
      >
        {text}
      </div>
      
      <p 
        ref={hiddenTextRef}
        className={cn(
          "uv-hidden-text absolute top-0 left-0 w-full pointer-events-none select-none transition-opacity duration-300",
          textSize
        )}
        style={{
          opacity: 0, // Always start with opacity 0
          color: uvMode ? "#D2FF3F" : uvColor,
          backgroundColor: 'transparent', // Remove background
          position: 'absolute',
          zIndex: 10, // S'assurer que le texte caché est au premier plan quand visible
        }}
      >
        {hiddenText || (typeof text === 'string' ? text : null)}
      </p>
    </div>
  );
}
