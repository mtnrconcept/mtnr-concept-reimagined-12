
import React from "react";
import { useTorch } from "./TorchContext";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScrollArrowsProps {
  className?: string;
}

const ScrollArrows: React.FC<ScrollArrowsProps> = ({ className }) => {
  const { isTorchActive } = useTorch();
  const isMobile = useIsMobile();
  
  if (!isTorchActive) return null;
  
  const scrollToDirection = (direction: "up" | "down") => {
    // Empêcher le comportement par défaut du scroll
    const scrollAmount = direction === "up" ? -window.innerHeight / 2 : window.innerHeight / 2;
    window.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  };

  // Sur mobile, positionner les flèches sur le côté droit mais plus bas pour éviter la navbar
  const mobilePositionClass = "fixed z-[250] right-4 flex flex-col items-center gap-4 top-[120px]";
  const desktopPositionClass = "fixed z-[250] right-4 flex flex-col items-center gap-4";

  return (
    <div className={cn(
      isMobile ? mobilePositionClass : desktopPositionClass,
      className
    )}>
      <button
        onClick={() => scrollToDirection("up")}
        className="p-3 rounded-full bg-yellow-400/30 hover:bg-yellow-400/60 transition-colors backdrop-blur-sm"
        aria-label="Scroll up"
        style={{
          boxShadow: '0 0 10px rgba(255, 221, 0, 0.5), 0 0 20px rgba(255, 221, 0, 0.3)',
        }}
      >
        <ArrowUp className="text-yellow-100 w-6 h-6" />
      </button>
      
      <button
        onClick={() => scrollToDirection("down")}
        className="p-3 rounded-full bg-yellow-400/30 hover:bg-yellow-400/60 transition-colors backdrop-blur-sm"
        aria-label="Scroll down"
        style={{
          boxShadow: '0 0 10px rgba(255, 221, 0, 0.5), 0 0 20px rgba(255, 221, 0, 0.3)',
        }}
      >
        <ArrowDown className="text-yellow-100 w-6 h-6" />
      </button>
    </div>
  );
};

export default ScrollArrows;
