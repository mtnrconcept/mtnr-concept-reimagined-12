import React, { useRef, useEffect, useState } from 'react';
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { createSafeFilter } from "@/lib/animation-utils";

interface UVDecryptMessageProps {
  message: string;
  className?: string;
  position: {
    x: number | string;
    y: number | string;
  };
  fontSize?: string;
  color?: string;
  decryptSpeed?: number;
  fontFamily?: string;
  depth?: string;
  scrambleChars?: string;
}

export default function UVDecryptMessage({
  message,
  className = "",
  position,
  fontSize = "1rem",
  color = "#D2FF3F",
  decryptSpeed = 30,
  fontFamily = "monospace",
  depth = "0.3",
  scrambleChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`"
}: UVDecryptMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isRevealing, setIsRevealing] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const [decryptProgress, setDecryptProgress] = useState(0);

  // Decrypt animation function
  const decryptText = (text: string, progress: number) => {
    return text.split('').map((char, index) => {
      // If we've reached this character in the decryption progress, show it
      if (index < progress) {
        return char;
      } 
      // Otherwise show a random character from the scramble set
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }).join('');
  };

  useEffect(() => {
    if (!messageRef.current || !isTorchActive || !uvMode) return;

    const handleMouseMove = () => {
      if (!messageRef.current) return;
      
      const rect = messageRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      // Distance from mouse to text center
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Define reveal threshold - within 150px
      const threshold = 150;
      const newIsRevealing = distance < threshold && uvMode;
      
      if (newIsRevealing !== isRevealing) {
        setIsRevealing(newIsRevealing);
      }

      if (newIsRevealing) {
        // Calculate how close we are to the center (0 = center, 1 = threshold distance)
        const proximityRatio = 1 - Math.min(distance / threshold, 1);
        
        // Create pulsating effect for the text glow
        const time = Date.now() / 1000;
        const pulseIntensity = Math.sin(time * 3) * 0.2 + 0.8; // 0.6 to 1.0
        
        // Dynamic glow and visual effects
        const glowSize = Math.max(5, 15 * proximityRatio * pulseIntensity);
        
        if (messageRef.current) {
          messageRef.current.style.opacity = '1';
          messageRef.current.style.filter = createSafeFilter({ 
            blur: Math.max(0, 3 * (1 - proximityRatio)),
            brightness: 100 + (50 * proximityRatio),
            contrast: 100 + (20 * proximityRatio)
          });
          messageRef.current.style.textShadow = `0 0 ${glowSize}px ${color}`;
          
          // Add subtle motion
          const vibrationX = Math.sin(time * 2) * 0.5 * proximityRatio;
          const vibrationY = Math.cos(time * 2.3) * 0.5 * proximityRatio;
          messageRef.current.style.transform = `translate(${vibrationX}px, ${vibrationY}px)`;
        }
      } else {
        // Hide message when cursor is far away
        if (messageRef.current) {
          messageRef.current.style.opacity = '0';
          messageRef.current.style.textShadow = 'none';
          messageRef.current.style.transform = '';
          messageRef.current.style.filter = '';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isRevealing, mousePosition, color, uvMode, isTorchActive]);

  // Decrypt animation effect
  useEffect(() => {
    if (!isRevealing) {
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
      
      // Progress based on time and speed factor
      const increment = deltaTime * (decryptSpeed / 1000); 
      const newProgress = Math.min(message.length, startProgress + increment);
      
      setDecryptProgress(newProgress);
      setDecryptedText(decryptText(message, Math.floor(newProgress)));
      
      if (newProgress < message.length) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDecryptedText(message); // Ensure we show the full message
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isRevealing, message, decryptSpeed]);

  if (!uvMode || !isTorchActive) return null;

  return (
    <div
      ref={messageRef}
      className={`absolute pointer-events-none select-none decrypt-message ${className}`}
      data-depth={depth}
      style={{
        left: typeof position.x === 'number' ? `${position.x}%` : position.x,
        top: typeof position.y === 'number' ? `${position.y}%` : position.y,
        fontSize,
        color,
        fontFamily,
        opacity: 0, // Start invisible
        transition: 'opacity 0.3s ease-out',
        letterSpacing: '0.05em',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: 'rgba(10, 0, 40, 0.1)', // Subtle background
        backdropFilter: 'blur(1px)',
        zIndex: 20
      }}
    >
      {decryptedText || message.replace(/./g, (c) => 
        c === ' ' ? c : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      )}
    </div>
  );
}
