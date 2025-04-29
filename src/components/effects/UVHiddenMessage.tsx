
import { useRef, useEffect } from "react";
import { useTorch } from "./TorchContext";

interface UVHiddenMessageProps {
  message: string;
  color?: string;
  className?: string;
  fontSize?: string;
  offsetX?: number;
  offsetY?: number;
}

export default function UVHiddenMessage({
  message,
  color = "#9b87f5",
  className = "",
  fontSize = "1rem",
  offsetX = 0,
  offsetY = 0
}: UVHiddenMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();

  useEffect(() => {
    if (!messageRef.current || !isTorchActive) return;

    const handleMouseMove = () => {
      if (!messageRef.current) return;

      // Calculate distance between mouse and element
      const rect = messageRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Modify visibility based on distance
      const threshold = 300;
      if (distance < threshold) {
        const intensity = 1 - (distance / threshold);
        
        // Apply effects
        messageRef.current.style.opacity = `${Math.min(0.95, intensity)}`;
        messageRef.current.style.filter = `blur(${Math.max(0, 3 - (intensity * 6))}px)`;
        messageRef.current.style.textShadow = `0 0 ${5 + (intensity * 15)}px ${color}`;
      } else {
        messageRef.current.style.opacity = '0';
        messageRef.current.style.filter = 'blur(4px)';
        messageRef.current.style.textShadow = 'none';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTorchActive, mousePosition, color]);

  // Only render when torch is active
  if (!isTorchActive) return null;

  return (
    <div
      ref={messageRef}
      className={`absolute pointer-events-none select-none transition-all duration-200 ${className}`}
      style={{
        color,
        fontSize,
        opacity: 0,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        textShadow: `0 0 5px ${color}`,
        letterSpacing: '0.05em',
      }}
    >
      {message}
    </div>
  );
}
