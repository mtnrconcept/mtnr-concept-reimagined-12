
import React, { useEffect, useRef } from "react";
import { useUVMode } from "./UVModeContext";
import { useTorch } from "./TorchContext";

interface UVSecretMessageProps {
  message: string;
  position: { x: number; y: number };
  size?: string;
  color?: string;
  depth?: string;
  rotation?: number;
  className?: string;
  fontSize?: string;
}

export default function UVSecretMessage({
  message,
  position,
  size = "1rem",
  color = "#D2FF3F",
  depth = "0.1",
  rotation = 0,
  className = "",
  fontSize
}: UVSecretMessageProps) {
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Show element only when UV mode is active, but make it more visible inside the UV circle
  useEffect(() => {
    if (elementRef.current) {
      if (uvMode && isTorchActive) {
        elementRef.current.style.opacity = "1";
        elementRef.current.style.animation = "uvPulse 4s infinite";
        elementRef.current.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;
      } else {
        elementRef.current.style.opacity = "0";
        elementRef.current.style.animation = "none";
      }
    }
  }, [uvMode, isTorchActive, color]);

  return (
    <div
      ref={elementRef}
      data-depth={depth}
      className={`parallax-element absolute pointer-events-none select-none ${className}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        fontSize: fontSize || size,
        color,
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        opacity: 0,
        transform: `rotate(${rotation}deg)`,
        transition: 'opacity 0.5s ease-out, text-shadow 0.5s ease-out',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'monospace',
        zIndex: 100
      }}
    >
      {message}
    </div>
  );
}
