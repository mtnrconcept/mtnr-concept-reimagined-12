
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
  const textRef = useRef<HTMLSpanElement>(null);
  const hiddenTextRef = useRef<HTMLSpanElement>(null);
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
      
      // Enhanced threshold and effects for UV mode
      const threshold = uvMode ? 600 : 300; // Larger detection area in UV mode
      const newIsIlluminated = distance < threshold;
      
      if (newIsIlluminated !== isIlluminated) {
        setIsIlluminated(newIsIlluminated);
      }

      if (newIsIlluminated) {
        // Calculate intensity based on distance (stronger when closer)
        const intensity = 1 - (distance / threshold);
        const opacityValue = Math.min(1, intensity * (uvMode ? 5 : 3));
        hiddenTextRef.current.style.opacity = `${opacityValue}`;
        
        // Enhanced glow for UV mode with dynamic fluorescent yellow color
        const glowSize = uvMode ? 25 * intensity : 15 * intensity;
        const primaryGlow = uvMode ? "#D2FF3F" : uvColor;
        const secondaryGlow = uvMode ? "#4FA9FF" : uvColor;
        
        hiddenTextRef.current.style.textShadow = `
          0 0 ${glowSize}px ${primaryGlow}, 
          0 0 ${glowSize * 2}px ${primaryGlow},
          0 0 ${glowSize * 3}px ${secondaryGlow}
        `;
        
        if (uvMode) {
          // Dynamic animation effects in UV mode
          const time = Date.now() / 1000;
          const vibrationX = Math.sin(time * 2) * 0.8;
          const vibrationY = Math.cos(time * 1.8) * 0.8;
          hiddenTextRef.current.style.transform = `translate(${vibrationX}px, ${vibrationY}px)`;
          hiddenTextRef.current.style.filter = `brightness(1.5) contrast(1.2)`;
          
          // Add letter spacing for dramatic effect in UV mode
          hiddenTextRef.current.style.letterSpacing = `${0.05 + (intensity * 0.1)}em`;
        } else {
          hiddenTextRef.current.style.transform = '';
          hiddenTextRef.current.style.filter = '';
          hiddenTextRef.current.style.letterSpacing = '';
        }
      } else {
        hiddenTextRef.current.style.opacity = '0';
        hiddenTextRef.current.style.textShadow = 'none';
        hiddenTextRef.current.style.transform = '';
        hiddenTextRef.current.style.filter = '';
        hiddenTextRef.current.style.letterSpacing = '';
      }
    };

    if (isTorchActive) {
      window.addEventListener('mousemove', handleMouseMove);
      handleMouseMove(); // Initial calculation
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTorchActive, mousePosition, isIlluminated, uvColor, uvMode]);

  // Auto-reveal hidden text if UV mode is active, regardless of mouse position
  useEffect(() => {
    if (uvMode && hiddenTextRef.current) {
      hiddenTextRef.current.style.opacity = '1';
      hiddenTextRef.current.style.textShadow = `
        0 0 10px ${uvColor},
        0 0 20px ${uvColor},
        0 0 30px ${uvColor}
      `;
      hiddenTextRef.current.style.letterSpacing = '0.1em';
      
      // Add subtle animation
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
  }, [uvMode, uvColor]);

  return (
    <span className={cn(
      "uv-text-container relative inline-block", 
      position === "absolute" ? "absolute inset-0" : "",
      className
    )}>
      <span 
        ref={textRef} 
        className={cn("visible select-none transition-opacity", textSize)}
        style={{
          opacity: uvMode && isIlluminated ? 0.3 : 1
        }}
      >
        {text}
      </span>
      
      <span 
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
      </span>
    </span>
  );
}
