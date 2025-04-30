
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
  const hiddenTextRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isIlluminated, setIsIlluminated] = useState(false);

  useEffect(() => {
    if (!isTorchActive || !textRef.current || !hiddenTextRef.current) return;

    // Throttle pour éviter trop de recalculs
    let ticking = false;
    let rafId: number;

    const handleMouseMove = () => {
      if (!textRef.current || !hiddenTextRef.current || ticking) return;
      
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const rect = textRef.current?.getBoundingClientRect();
        if (!rect) {
          ticking = false;
          return;
        }
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Distance from mouse to text center
        const dx = mousePosition.x - centerX;
        const dy = mousePosition.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Enhanced threshold and effects for UV mode
        const threshold = uvMode ? 600 : 300; // Larger detection area in UV mode
        const newIsIlluminated = distance < threshold;
        
        if (newIsIlluminated !== isIlluminated) {
          setIsIlluminated(newIsIlluminated);
        }

        if (newIsIlluminated && hiddenTextRef.current) {
          // Calculate intensity based on distance (stronger when closer)
          const intensity = 1 - (distance / threshold);
          const opacityValue = Math.min(1, intensity * (uvMode ? 5 : 3));
          
          // Regrouper les modifications de style
          const newStyles = {
            opacity: `${opacityValue}`,
            textShadow: `
              0 0 ${uvMode ? 25 * intensity : 15 * intensity}px ${uvMode ? "#D2FF3F" : uvColor}, 
              0 0 ${uvMode ? 50 * intensity : 30 * intensity}px ${uvMode ? "#4FA9FF" : uvColor}
            `,
            transform: uvMode ? 
              `translate(${Math.sin(Date.now() / 1000 * 2) * 0.8}px, ${Math.cos(Date.now() / 1000 * 1.8) * 0.8}px)` : 
              '',
            filter: uvMode ? 'brightness(1.5) contrast(1.2)' : '',
            letterSpacing: uvMode ? `${0.05 + (intensity * 0.1)}em` : ''
          };
          
          // Appliquer tous les styles en une fois
          Object.assign(hiddenTextRef.current.style, newStyles);
        } else if (hiddenTextRef.current) {
          // Reset styles
          Object.assign(hiddenTextRef.current.style, {
            opacity: '0',
            textShadow: 'none',
            transform: '',
            filter: '',
            letterSpacing: ''
          });
        }
        
        ticking = false;
      });
    };

    if (isTorchActive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      handleMouseMove(); // Initial calculation
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isTorchActive, mousePosition, isIlluminated, uvColor, uvMode]);

  // Auto-reveal animation avec requestAnimationFrame
  useEffect(() => {
    if (!uvMode || !hiddenTextRef.current) return;
    
    let animId: number;
    
    const animateGlow = () => {
      if (!hiddenTextRef.current) return;
      
      const time = Date.now() / 1000;
      const pulseIntensity = (Math.sin(time * 2) + 1) / 2; // 0 to 1 pulsating
      
      hiddenTextRef.current.style.textShadow = `
        0 0 ${5 + (pulseIntensity * 10)}px ${uvColor},
        0 0 ${10 + (pulseIntensity * 20)}px ${uvColor}
      `;
      
      hiddenTextRef.current.style.opacity = '1';
      hiddenTextRef.current.style.letterSpacing = '0.1em';
      
      animId = requestAnimationFrame(animateGlow);
    };
    
    animId = requestAnimationFrame(animateGlow);
    
    return () => cancelAnimationFrame(animId);
  }, [uvMode, uvColor]);

  // Correction pour éviter le problème de DOM nesting (p dans p)
  const isTextString = typeof text === 'string';
  const hiddenTextContent = hiddenText || (isTextString ? text : null);

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
      
      <div 
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
        {hiddenTextContent}
      </div>
    </div>
  );
}
