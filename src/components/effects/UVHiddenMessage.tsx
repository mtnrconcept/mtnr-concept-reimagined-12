
import { useRef, useEffect, memo, useMemo } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

interface UVHiddenMessageProps {
  message: string;
  color?: string;
  className?: string;
  fontSize?: string;
  offsetX?: number;
  offsetY?: number;
}

const UVHiddenMessage = memo(({
  message,
  color = "#D2FF3F",
  className = "",
  fontSize = "1rem",
  offsetX = 0,
  offsetY = 0
}: UVHiddenMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  
  // Retourner null immédiatement si les conditions ne sont pas remplies
  if (!isTorchActive || !uvMode) return null;
  
  // Style de base mémorisé
  const baseStyle = useMemo(() => ({
    position: 'absolute' as const,
    color,
    fontSize,
    opacity: 0,
    transform: `translate(${offsetX}px, ${offsetY}px)`,
    textShadow: `0 0 5px ${color}`,
    letterSpacing: '0.07em',
    fontWeight: 'bold' as const,
    backgroundColor: 'transparent',
  }), [color, fontSize, offsetX, offsetY]);

  useEffect(() => {
    const messageElement = messageRef.current;
    if (!messageElement || !isTorchActive || !uvMode) return;

    const handleMouseMove = () => {
      if (!messageElement) return;

      // Calculate distance between mouse and element
      const rect = messageElement.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const threshold = 150;
      if (distance < threshold * 1.5 && uvMode) {
        const intensity = 1 - (distance / (threshold * 1.5));
        
        // Créer un effet de révélation progressive du texte
        const chars = message.split('');
        const processedChars = chars.map((char, index) => {
          const charPosPercent = index / chars.length;
          const charPosPixels = charPosPercent * rect.width;
          const charX = rect.left + charPosPixels;
          
          const charDx = mousePosition.x - charX;
          const charDy = mousePosition.y - elementCenterY;
          const charDistance = Math.sqrt(charDx * charDx + charDy * charDy);
          const charVisibility = Math.max(0, 1 - charDistance / threshold);
          
          return `<span style="opacity: ${charVisibility.toFixed(2)}; display: inline-block;">${char}</span>`;
        });
        
        messageElement.innerHTML = processedChars.join('');
        messageElement.style.opacity = '1';
        
        const glowIntensity = 5 + (intensity * 25);
        messageElement.style.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}`;
        
        const time = Date.now() / 1000;
        const vibrationX = Math.sin(time * 1.5) * 0.7;
        const vibrationY = Math.cos(time * 1.3) * 0.7;
        messageElement.style.transform = `translate(${offsetX + vibrationX}px, ${offsetY + vibrationY}px)`;
      } else {
        messageElement.style.opacity = '0';
        messageElement.style.textShadow = 'none';
        messageElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Appeler handleMouseMove immédiatement pour initialiser l'état
    handleMouseMove();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTorchActive, mousePosition, message, color, uvMode, offsetX, offsetY]);

  return (
    <div
      ref={messageRef}
      className={`uv-secret-message pointer-events-none select-none z-20 ${className}`}
      style={baseStyle}
    >
      {message}
    </div>
  );
});

UVHiddenMessage.displayName = 'UVHiddenMessage';

export default UVHiddenMessage;
