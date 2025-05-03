
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
      const threshold = uvMode ? 600 : 0; // Aucune détection en mode normal
      const newIsIlluminated = distance < threshold && uvMode;
      
      if (newIsIlluminated !== isIlluminated) {
        setIsIlluminated(newIsIlluminated);
      }

      if (newIsIlluminated && uvMode) {
        // Calculate intensity based on distance (stronger when closer)
        const intensity = 1 - (distance / threshold);
        
        // Déterminer de quel côté vient le curseur
        const fromLeft = mousePosition.x < centerX;
        
        if (typeof hiddenText === 'string') {
          // Diviser le texte en caractères et appliquer des opacités variables
          const chars = hiddenText.split('');
          const processedChars = chars.map((char, index) => {
            // Position relative du caractère dans le texte
            const relPos = fromLeft ? index / chars.length : 1 - (index / chars.length);
            
            // Combiner la distance globale avec la position relative
            const charVisibility = Math.min(intensity * (1.5 - relPos), 1);
            
            return `<span style="opacity: ${Math.max(0, charVisibility)}; display: inline-block;">${char}</span>`;
          });
          
          hiddenTextRef.current.innerHTML = processedChars.join('');
        } else {
          const opacityValue = Math.min(1, intensity * 5);
          hiddenTextRef.current.style.opacity = `${opacityValue}`;
        }
        
        // Enhanced glow for UV mode with dynamic fluorescent yellow color
        const glowSize = 25 * intensity;
        const primaryGlow = "#D2FF3F";
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
        hiddenTextRef.current.style.filter = `brightness(1.5) contrast(1.2)`;
        
        // Add letter spacing for dramatic effect in UV mode
        hiddenTextRef.current.style.letterSpacing = `${0.05 + (intensity * 0.1)}em`;
      } else {
        if (hiddenTextRef.current) {
          hiddenTextRef.current.style.opacity = '0';
          hiddenTextRef.current.style.textShadow = 'none';
          hiddenTextRef.current.style.transform = '';
          hiddenTextRef.current.style.filter = '';
          hiddenTextRef.current.style.letterSpacing = '';
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
    if (uvMode && hiddenTextRef.current && isTorchActive) {
      // On continue à utiliser l'effet de survol du curseur
      // Le reveal complet n'est fait que si la souris passe dessus
      
      // Mais on ajoute un effet de lueur subtil pour indiquer que quelque chose est là
      const animateGlow = () => {
        if (hiddenTextRef.current) {
          const time = Date.now() / 1000;
          const pulseIntensity = (Math.sin(time * 2) + 1) / 2; // 0 to 1 pulsating
          hiddenTextRef.current.style.textShadow = `
            0 0 ${5 + (pulseIntensity * 10)}px ${uvColor},
            0 0 ${10 + (pulseIntensity * 20)}px ${uvColor}
          `;
          requestAnimationFrame(animateGlow);
        }
      };
      
      const animId = requestAnimationFrame(animateGlow);
      return () => cancelAnimationFrame(animId);
    }
  }, [uvMode, uvColor, isTorchActive]);

  return (
    <div className={cn(
      "uv-text-container relative", 
      position === "absolute" ? "absolute inset-0" : "",
      className
    )}>
      <div 
        ref={textRef} 
        className={cn("visible select-none transition-opacity", textSize)}
        style={{
          opacity: uvMode && isIlluminated ? 0.3 : 1
        }}
      >
        {text}
      </div>
      
      <p 
        ref={hiddenTextRef}
        className={cn(
          "uv-hidden-text absolute top-0 left-0 w-full pointer-events-none select-none",
          "transition-all duration-300",
          textSize,
          isIlluminated ? "" : "opacity-0"
        )}
        style={{
          opacity: isIlluminated ? 1 : opacity,
          color: uvMode ? "#D2FF3F" : uvColor,
        }}
      >
        {hiddenText || (typeof text === 'string' ? text : null)}
      </p>
    </div>
  );
}
