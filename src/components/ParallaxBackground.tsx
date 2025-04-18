
import React from "react";

// Escalier images (remplace avec tes propres URLs si besoin)
const stairsImages = [
  "/lovable-uploads/photo-1433086966358-54859d0ed716",
  "/lovable-uploads/photo-1482938289607-e9573fc25ebb",
  "/lovable-uploads/photo-1470071459604-3b5ec3a7fe05",
];

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  // Handles parallax by moving background images at different speeds when scrolling
  React.useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll<HTMLElement>('.parallax-bg').forEach((el, i) => {
        // offset: first = slowest, next = faster
        el.style.transform = `translateY(${window.scrollY * 0.2 * (i+1)}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">
      {/* Parallax layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {stairsImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Escalier ${idx + 1}`}
            className={`parallax-bg absolute w-full object-cover opacity-${60 - idx * 15} blur-sm`}
            style={{
              top: `${idx * 25}%`,
              left: 0,
              height: "60vh",
              pointerEvents: "none",
              zIndex: idx + 1,
              filter: `blur(${2 + idx}px)`,
              opacity: 0.55 - idx * 0.18,
            }}
          />
        ))}
      </div>
      {/* Content above parallax */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
