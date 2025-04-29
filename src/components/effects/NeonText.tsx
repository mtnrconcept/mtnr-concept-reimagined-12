
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import "./NeonText.css";

interface NeonTextProps {
  text: string;
  className?: string;
  color?: "yellow" | "white" | "black";
  flicker?: boolean;
  delay?: number;
}

export default function NeonText({ 
  text, 
  className, 
  color = "yellow", 
  flicker = true,
  delay = 0
}: NeonTextProps) {
  const [isOn, setIsOn] = useState(false);
  
  useEffect(() => {
    // Délai pour l'effet d'allumage progressif
    const timer = setTimeout(() => {
      setIsOn(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Détermine les couleurs de lueur en fonction de la propriété color
  const glowColors = {
    yellow: "neon-glow-yellow",
    white: "neon-glow-white",
    black: "neon-glow-black"
  };

  return (
    <h1 
      className={cn(
        "neon-text transition-all duration-700", 
        isOn && "neon-on",
        flicker && "neon-flicker",
        glowColors[color],
        className
      )}
    >
      {text}
    </h1>
  );
}
