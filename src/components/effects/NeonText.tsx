
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "./NeonText.css";

interface NeonTextProps {
  text: string;
  className?: string;
  color?: "yellow" | "white" | "black";
  flicker?: boolean;
  delay?: number;
  startOn?: boolean;
}

export default function NeonText({
  text,
  className,
  color = "yellow",
  flicker = false,
  delay = 0,
  startOn = false,
}: NeonTextProps) {
  const [isOn, setIsOn] = useState(startOn);
  
  // Turn on the neon effect after a delay
  useEffect(() => {
    if (startOn) return;
    
    const timer = setTimeout(() => {
      setIsOn(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay, startOn]);
  
  // Add the appropriate glow color class based on the color prop
  const colorClass = `neon-glow-${color}`;
  
  return (
    <h2
      className={cn(
        "neon-text",
        colorClass,
        isOn && "neon-on",
        flicker && isOn && "neon-flicker",
        className
      )}
    >
      {text}
    </h2>
  );
}
