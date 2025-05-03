
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
      // Elliptical mask of ~100px
      const threshold = 100; 
      if (distance < threshold * 1.5 && uvMode) {
        const intensity = 1 - (distance / (threshold * 1.5));
        
        // Déterminer de quel côté vient le curseur
        const fromLeft = mousePosition.x < elementCenterX;
        
        // Créer un effet de révélation progressive du texte
        if (messageRef.current) {
          // Diviser le texte en caractères et appliquer des opacités variables
          const chars = message.split('');
          const processedChars = chars.map((char, index) => {
            // Calculer la position du caractère par rapport au curseur
            const charElement = document.createElement('span');
            charElement.textContent = char;
            charElement.style.display = 'inline-block';
            document.body.appendChild(charElement);
            const charWidth = charElement.getBoundingClientRect().width;
            document.body.removeChild(charElement);
            
            // Position approximative du caractère (en pixels)
            const charPosition = index * (charWidth || 8); // 8px de largeur par défaut
            const charOffset = fromLeft ? charPosition : rect.width - charPosition;
            const charX = rect.left + charOffset;
            
            // Distance du caractère au curseur
            const charDx = mousePosition.x - charX;
            const charDy = mousePosition.y - rect.top - rect.height / 2;
            const charDistance = Math.sqrt(charDx * charDx + charDy * charDy);
            
            // Visibilité basée sur la distance au curseur (effet masque elliptique inversé)
            // Plus le caractère est proche du curseur, plus il est visible
            const ellipticalDistance = Math.sqrt((charDx * charDx) / 1 + (charDy * charDy) / 2.25);
            const charVisibility = Math.max(0, 1 - ellipticalDistance / threshold);
            
            return `<span style="opacity: ${charVisibility.toFixed(2)}; display: inline-block; filter: blur(${Math.max(0, (1 - charVisibility) * 10)}px);">${char}</span>`;
          });
          
          messageRef.current.innerHTML = processedChars.join('');
          
          // Apply effects
          messageRef.current.style.opacity = '1';
          
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
          messageRef.current.style.filter = 'blur(10px)';
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
