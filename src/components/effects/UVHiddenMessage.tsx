
import { useRef, useEffect } from "react";
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

export default function UVHiddenMessage({
  message,
  color = "#D2FF3F",
  className = "",
  fontSize = "1rem",
  offsetX = 0,
  offsetY = 0
}: UVHiddenMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();

  useEffect(() => {
    if (!messageRef.current || !isTorchActive || !uvMode) return;

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
      // Reduced threshold to make the effect more localized - showing fewer letters
      const threshold = 150; // Réduit pour limiter la visibilité à environ 7 lettres
      if (distance < threshold && uvMode) {
        const intensity = 1 - (distance / threshold);
        
        // Déterminer de quel côté vient le curseur
        const fromLeft = mousePosition.x < elementCenterX;
        
        // Créer un effet de révélation progressive du texte
        if (messageRef.current) {
          // Diviser le texte en caractères et appliquer des opacités variables
          const chars = message.split('');
          const processedChars = chars.map((char, index) => {
            // Position relative du caractère dans le texte
            const relPos = fromLeft ? index / chars.length : 1 - (index / chars.length);
            
            // Facteur d'échelle pour rendre la fenêtre de visibilité plus petite
            const visibilityWindow = 0.3; // Ajusté pour montrer environ 7 lettres
            
            // Calculer la distance du curseur au caractère
            // Plus la valeur est grande, plus la fenêtre de visibilité sera petite
            const charDistanceFactor = Math.abs(relPos - 0.5) / visibilityWindow;
            
            // Combiner la distance globale avec la position relative
            // La formule crée une fenêtre de visibilité réduite centrée sur la position du curseur
            const charVisibility = Math.max(0, intensity * (1 - charDistanceFactor));
            
            return `<span style="opacity: ${Math.max(0, charVisibility)}; display: inline-block;">${char}</span>`;
          });
          
          messageRef.current.innerHTML = processedChars.join('');
          
          // Apply effects
          messageRef.current.style.opacity = Math.min(0.95, intensity * 1.5).toString();
          messageRef.current.style.filter = `blur(${Math.max(0, 2 - (intensity * 5))}px) brightness(1.3)`;
          
          // Strong glow effect matching the desired color
          const glowIntensity = 5 + (intensity * 25);
          messageRef.current.style.textShadow = `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}`;
          
          // Add subtle motion
          const time = Date.now() / 1000;
          const vibrationX = Math.sin(time * 1.5) * 0.7;
          const vibrationY = Math.cos(time * 1.3) * 0.7;
          messageRef.current.style.transform = `translate(${offsetX + vibrationX}px, ${offsetY + vibrationY}px)`;
        }
      } else {
        if (messageRef.current) {
          messageRef.current.style.opacity = '0';
          messageRef.current.style.filter = 'blur(4px)';
          messageRef.current.style.textShadow = 'none';
          messageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTorchActive, mousePosition, message, color, uvMode, offsetX, offsetY]);

  // Only render when torch is active and in UV mode
  if (!isTorchActive || !uvMode) return null;

  return (
    <div
      ref={messageRef}
      className={`absolute pointer-events-none select-none transition-opacity duration-200 ${className}`}
      style={{
        color,
        fontSize,
        opacity: 0,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        textShadow: `0 0 5px ${color}`,
        letterSpacing: '0.07em',
        fontWeight: 'bold',
      }}
    >
      {message}
    </div>
  );
}
