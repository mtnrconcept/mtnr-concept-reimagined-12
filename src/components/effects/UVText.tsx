
import React, { useRef, useEffect, useState } from "react";
import { useTorch } from "./TorchContext";
import { cn } from "@/lib/utils";

interface UVTextProps {
  text: string;
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
  uvColor = "#8B5CF6",
  textSize = "text-base",
  opacity = 0.05,
  position = "default"
}: UVTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const hiddenTextRef = useRef<HTMLParagraphElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
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
      const threshold = 300;
      const newIsIlluminated = distance < threshold;
      
      if (newIsIlluminated !== isIlluminated) {
        setIsIlluminated(newIsIlluminated);
      }

      if (newIsIlluminated) {
        // Calculate intensity based on distance (stronger when closer)
        const intensity = 1 - (distance / threshold);
        hiddenTextRef.current.style.opacity = `${Math.min(1, intensity * 3)}`;
        hiddenTextRef.current.style.textShadow = `0 0 ${15 * intensity}px ${uvColor}`;
      } else {
        hiddenTextRef.current.style.opacity = '0';
        hiddenTextRef.current.style.textShadow = 'none';
      }
    };

    if (isTorchActive) {
      window.addEventListener('mousemove', handleMouseMove);
      handleMouseMove(); // Initial calculation
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTorchActive, mousePosition, isIlluminated, uvColor]);

  return (
    <div className={cn(
      "uv-text-container relative", 
      position === "absolute" ? "absolute inset-0" : "",
      className
    )}>
      <p 
        ref={textRef} 
        className={cn("visible select-none transition-opacity", textSize)}
      >
        {text}
      </p>
      
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
          color: uvColor,
        }}
      >
        {hiddenText || text}
      </p>
    </div>
  );
}
