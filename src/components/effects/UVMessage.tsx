
import React, { useRef, useEffect, useState } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

export type MessageType = "text" | "code" | "secret" | "decrypt";

interface UVMessageProps {
  content: string;
  type?: MessageType;
  position?: {
    x: number | string;
    y: number | string;
  } | null;
  offsetX?: number;
  offsetY?: number;
  color?: string;
  fontSize?: string;
  className?: string;
  rotation?: number;
  depth?: string;
  decryptSpeed?: number;
  fontFamily?: string;
}

/**
 * Composant unifié pour tous les types de messages UV cachés
 */
export default function UVMessage({
  content,
  type = "text",
  position = null,
  offsetX = 0,
  offsetY = 0,
  color = "#D2FF3F",
  fontSize = "1rem",
  className = "",
  rotation = 0,
  depth = "0.2",
  decryptSpeed = 30,
  fontFamily = type === "code" || type === "decrypt" ? "monospace" : "inherit"
}: UVMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isVisible, setIsVisible] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const [decryptProgress, setDecryptProgress] = useState(0);
  
  const scrambleChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
  
  // Style de base selon le type
  const getBaseStyle = () => {
    const isPositionAbsolute = position !== null;
    
    const commonStyle: React.CSSProperties = {
      position: isPositionAbsolute ? 'absolute' : 'relative',
      color,
      fontSize,
      opacity: 0,
      fontFamily,
      zIndex: 100,
      pointerEvents: 'none',
    };
    
    // Styles spécifiques selon le type
    if (isPositionAbsolute) {
      return {
        ...commonStyle,
        left: typeof position?.x === 'number' ? `${position.x}%` : position?.x,
        top: typeof position?.y === 'number' ? `${position.y}%` : position?.y,
        transform: `translate(${offsetX}px, ${offsetY}px) ${rotation ? `rotate(${rotation}deg)` : ''}`,
      };
    }
    
    return {
      ...commonStyle,
      transform: `translate(${offsetX}px, ${offsetY}px) ${rotation ? `rotate(${rotation}deg)` : ''}`,
    };
  };
  
  // Fonction pour décrypter le texte (utilisée pour le type "decrypt")
  const decryptText = (text: string, progress: number) => {
    return text.split('').map((char, index) => {
      if (index < progress) {
        return char;
      } 
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }).join('');
  };
  
  // Classes CSS selon le type
  const getClassName = () => {
    let baseClass = "pointer-events-none select-none";
    
    switch (type) {
      case "text":
        return `uv-hidden-message ${baseClass} ${className}`;
      case "code":
        return `uv-hidden-code ${baseClass} ${className}`;
      case "secret":
        return `uv-secret-message ${baseClass} ${className}`;
      case "decrypt":
        return `decrypt-message ${baseClass} ${className}`;
      default:
        return `${baseClass} ${className}`;
    }
  };

  // Effet de visibilité basé sur la proximité de la souris
  useEffect(() => {
    if (!messageRef.current || !isTorchActive || !uvMode) return;

    const handleVisibility = () => {
      if (!messageRef.current) return;
      
      // Calculer la distance entre la souris et l'élément
      const rect = messageRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Seuil de proximité selon le type
      const threshold = type === "code" ? 150 : 200;
      
      // Afficher uniquement lorsque la torche UV est proche
      if (distance < threshold * 1.2 && uvMode) {
        setIsVisible(true);
        
        if (messageRef.current) {
          // Calculer l'intensité basée sur la distance
          const intensity = 1 - (distance / threshold);
          
          // Effet de révélation du texte selon le type
          if (type === "text" || type === "secret") {
            // Diviser le message en caractères pour un effet de révélation progressif
            const chars = content.split('');
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
            
            messageRef.current.innerHTML = processedChars.join('');
          } else if (type === "code") {
            // Traitement du code ligne par ligne
            const lines = content.split('\n');
            
            const processedLines = lines.map((line, lineIndex) => {
              const chars = line.split('');
              
              return chars.map((char, charIndex) => {
                // Estimation de la position du caractère
                const charX = rect.left + (charIndex / chars.length) * rect.width;
                const charY = rect.top + (lineIndex / lines.length) * rect.height;
                
                const charDx = mousePosition.x - charX;
                const charDy = mousePosition.y - charY;
                const charDistance = Math.sqrt(charDx * charDx + charDy * charDy);
                
                const charVisibility = Math.max(0, 1 - charDistance / threshold);
                
                return `<span style="opacity: ${charVisibility.toFixed(2)};">${char === ' ' ? '&nbsp;' : char}</span>`;
              }).join('');
            });
            
            messageRef.current.innerHTML = processedLines.join('<br>');
          }
          
          // Appliquer la visibilité avec une transition fluide
          messageRef.current.style.opacity = intensity.toFixed(2);
          
          // Ajouter un effet de lueur plus fort quand on est proche
          const glowSize = 5 + (intensity * 15);
          messageRef.current.style.textShadow = `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 1.5}px ${color}`;
          
          // Ajouter une animation subtile basée sur le temps
          const time = Date.now() / 1000;
          const vibrationX = Math.sin(time * 1.5) * 0.7 * intensity;
          const vibrationY = Math.cos(time * 1.8) * 0.7 * intensity;
          
          // Appliquer vibration selon la position
          if (position) {
            messageRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) translate(${vibrationX}px, ${vibrationY}px)`;
          } else {
            messageRef.current.style.transform = `translate(${offsetX + vibrationX}px, ${offsetY + vibrationY}px) ${rotation ? `rotate(${rotation}deg)` : ''}`;
          }
        }
      } else {
        // Cacher quand le curseur est loin
        setIsVisible(false);
        
        if (messageRef.current) {
          messageRef.current.style.opacity = '0';
          messageRef.current.style.textShadow = 'none';
          
          if (position) {
            messageRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
          } else {
            messageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) ${rotation ? `rotate(${rotation}deg)` : ''}`;
          }
        }
      }
    };
    
    // Configuration de l'écouteur d'événements pour le mouvement du curseur
    window.addEventListener('mousemove', handleVisibility);
    
    // Vérification de visibilité initiale
    handleVisibility();
    
    // Nettoyage
    return () => {
      window.removeEventListener('mousemove', handleVisibility);
    };
  }, [isTorchActive, mousePosition, content, color, uvMode, type, position, offsetX, offsetY, rotation]);
  
  // Animation de décryptage pour le type "decrypt"
  useEffect(() => {
    if (type !== "decrypt" || !isVisible) {
      setDecryptProgress(0);
      return;
    }

    let startProgress = decryptProgress;
    let animationFrame: number;
    let lastUpdate = Date.now();

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdate;
      lastUpdate = now;
      
      const increment = deltaTime * (decryptSpeed / 1000); 
      const newProgress = Math.min(content.length, startProgress + increment);
      
      setDecryptProgress(newProgress);
      setDecryptedText(decryptText(content, Math.floor(newProgress)));
      
      if (newProgress < content.length) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDecryptedText(content);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, content, decryptSpeed, decryptProgress, type]);

  // Ne pas rendre si pas en mode UV ou torche inactive
  if (!uvMode || !isTorchActive) return null;

  // Contenu affiché selon le type
  const getDisplayContent = () => {
    if (type === "decrypt") {
      return decryptedText || content.replace(/./g, (c) => 
        c === ' ' ? c : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      );
    }
    
    if (type === "code") {
      return (
        <pre style={{
          whiteSpace: 'pre',
          lineHeight: 1.2,
          letterSpacing: '0.05em',
          padding: '8px',
          backgroundColor: 'transparent'
        }}>
          {content}
        </pre>
      );
    }
    
    return content;
  };

  return (
    <div
      ref={messageRef}
      className={getClassName()}
      style={getBaseStyle()}
      data-depth={depth}
      data-uv-type={type}
    >
      {getDisplayContent()}
    </div>
  );
}
