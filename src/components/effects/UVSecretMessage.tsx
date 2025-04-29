
import React from "react";

interface UVSecretMessageProps {
  message: string;
  position: { x: number; y: number };
  size?: string;
  color?: string;
  depth?: string;
  rotation?: number;
  className?: string;
}

export default function UVSecretMessage({
  message,
  position,
  size = "1rem",
  color = "#D2FF3F",
  depth = "0.1",
  rotation = 0,
  className = ""
}: UVSecretMessageProps) {
  return (
    <div
      data-depth={depth}
      className={`parallax-element absolute pointer-events-none select-none ${className}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        fontSize: size,
        color,
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        opacity: 0,
        transform: `rotate(${rotation}deg)`,
        transition: 'opacity 0.5s ease-out, text-shadow 0.5s ease-out',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        animation: 'uvPulse 4s infinite',
        fontFamily: 'monospace'
      }}
    >
      {message}
    </div>
  );
}
