
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
        el.style.transform = `translateY(${window.scrollY * (0.15 + i * 0.1)}px)`;
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
            }}
          >
            <img
              src={img}
              alt=""
              className={`w-full h-full object-cover select-none grayscale contrast-125 ${
                idx === 0 ? 'opacity-90' : idx === 1 ? 'opacity-75' : 'opacity-60'
              } ${idx > 0 ? 'blur-sm' : ''}`}
              draggable={false}
            />
          </div>
        ))}
      </div>
      
      {/* Ajout d'un overlay pour améliorer la lisibilité du contenu */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Grain texture */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 z-20"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png")'
        }}
      />
      
      {children}
    </div>
  );
}
