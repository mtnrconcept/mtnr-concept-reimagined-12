
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
  const { isTorchActive, mousePosition, isMobile } = useTorch();
  const { uvMode } = useUVMode();

  useEffect(() => {
    if (!messageRef.current || !isTorchActive || !uvMode) return;

    const handleReveal = () => {
      if (!messageRef.current) return;

      // Calculate distance between torch position and element
      const rect = messageRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Elliptical mask of ~150px (augmenté pour une meilleure visibilité)
      const threshold = 150; 
      if (distance < threshold * 1.5 && uvMode) {
        const intensity = 1 - (distance / (threshold * 1.5));
        
        // Créer un effet de révélation progressive du texte
        if (messageRef.current) {
          // Diviser le texte en caractères et appliquer des opacités variables
          const chars = message.split('');
          const processedChars = chars.map((char, index) => {
            // Position approximative du caractère en pourcentage de la largeur totale
            const charPosPercent = index / chars.length;
            
            // Position du caractère en pixels par rapport au début du texte
            const charPosPixels = charPosPercent * rect.width;
            const charX = rect.left + charPosPixels;
            
            // Distance du caractère au curseur
            const charDx = mousePosition.x - charX;
            const charDy = mousePosition.y - elementCenterY;
            
            // Distance absolue sans effet miroir
            const charDistance = Math.sqrt(charDx * charDx + charDy * charDy);
            
            // Visibilité basée sur la distance absolue au curseur (pas d'effet miroir)
            // Plus le caractère est proche du curseur, plus il est visible
            const charVisibility = Math.max(0, 1 - charDistance / threshold);
            
            return `<span style="opacity: ${charVisibility.toFixed(2)}; display: inline-block;">${char}</span>`;
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
          messageRef.current.style.textShadow = 'none';
          messageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
      }
    };

    if (isMobile) {
      // On mobile, update on scroll and initial load
      handleReveal();
      window.addEventListener('scroll', handleReveal);
      return () => {
        window.removeEventListener('scroll', handleReveal);
      };
    } else {
      // On desktop, update on mouse move
      window.addEventListener('mousemove', handleReveal);
      return () => {
        window.removeEventListener('mousemove', handleReveal);
      };
    }
  }, [isTorchActive, mousePosition, message, color, uvMode, offsetX, offsetY, isMobile]);

  // Only render when torch is active and in UV mode
  if (!isTorchActive || !uvMode) return null;

  return (
    <div
      ref={messageRef}
      className={`uv-secret-message pointer-events-none select-none z-20 ${className}`}
      style={{
        position: 'absolute',
        color,
        fontSize,
        opacity: 0, // Always start with opacity 0 until mouse is in perimeter
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        textShadow: `0 0 5px ${color}`,
        letterSpacing: '0.07em',
        fontWeight: 'bold',
        backgroundColor: 'transparent', // Remove any background
      }}
    >
      {message}
    </div>
  );
}
