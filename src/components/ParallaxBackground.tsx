
import React from "react";

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
        // Augmentons la vitesse de défilement pour un effet plus prononcé
        const speed = 0.25 + i * 0.15;
        el.style.transform = `translateY(${window.scrollY * speed}px) scale(1.1)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-black">
      {/* Parallax layers */}
      <div className="absolute inset-0 pointer-events-none">
        {stairsImages.map((img, idx) => (
          <div
            key={img}
            className="parallax-bg absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
            style={{
              zIndex: idx + 1,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={img}
              alt=""
              className={`w-full h-full object-cover select-none grayscale contrast-[1.15] ${
                idx === 0 ? 'opacity-90' : idx === 1 ? 'opacity-75' : 'opacity-60'
              } ${idx > 0 ? 'blur-[2px]' : ''}`}
              draggable={false}
              loading="eager"
            />
          </div>
        ))}
      </div>
      
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Grain texture */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 z-20"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png")'
        }}
      />
      
      {/* CRITICAL: Make sure children have a high z-index so they appear above backgrounds */}
      <div className="relative z-30 w-full h-full">
        {children}
      </div>
    </div>
  );
}
