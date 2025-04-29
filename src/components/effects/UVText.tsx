
import React, { useRef, useEffect, useState, ReactNode } from "react";
import { useTorch } from "./TorchContext";
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
  uvColor = "#4FF0FF",
  textSize = "text-base",
  opacity = 0.05,
  position = "default"
}: UVTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const hiddenTextRef = useRef<HTMLParagraphElement>(null);
  const { isTorchActive, mousePosition, uvMode } = useTorch();
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
      
      // Check if mouse is close enough to illuminate the text
      // Adjust threshold based on the size of your elements
      const threshold = uvMode ? 600 : 300;
      const newIsIlluminated = distance < threshold;
      
      if (newIsIlluminated !== isIlluminated) {
        setIsIlluminated(newIsIlluminated);
      }

      if (newIsIlluminated) {
        // Calculate intensity based on distance (stronger when closer)
        const intensity = 1 - (distance / threshold);
        const opacityValue = Math.min(1, intensity * (uvMode ? 5 : 3));
        hiddenTextRef.current.style.opacity = `${opacityValue}`;
        
        // Larger glow for UV mode with vibrant blue color
        const glowSize = uvMode ? 25 * intensity : 15 * intensity;
        hiddenTextRef.current.style.textShadow = `0 0 ${glowSize}px ${uvMode ? "#00AAFF" : uvColor}, 
                                                 0 0 ${glowSize * 2}px ${uvMode ? "#00AAFF" : uvColor}`;
        
        if (uvMode) {
          // Effet de vibration légère en mode UV
          const time = Date.now() / 1000;
          const vibrationX = Math.sin(time * 2) * 0.5;
          const vibrationY = Math.cos(time * 1.8) * 0.5;
          hiddenTextRef.current.style.transform = `translate(${vibrationX}px, ${vibrationY}px)`;
          hiddenTextRef.current.style.filter = `brightness(1.5) contrast(1.2)`;
        } else {
          hiddenTextRef.current.style.transform = '';
          hiddenTextRef.current.style.filter = '';
        }
      } else {
        hiddenTextRef.current.style.opacity = '0';
        hiddenTextRef.current.style.textShadow = 'none';
        hiddenTextRef.current.style.transform = '';
        hiddenTextRef.current.style.filter = '';
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
          color: uvMode ? "#4FF0FF" : uvColor,
        }}
      >
        {hiddenText || (typeof text === 'string' ? text : null)}
      </p>
    </div>
  );
}
