
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
        // Minimal parallax effect with very slow scroll speed
        const speed = 0.02 + i * 0.01;
        el.style.transform = `translateY(${window.scrollY * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Fixed background container */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-black" style={{ zIndex: 0 }}>
        {/* Parallax layers */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {stairsImages.map((img, idx) => (
            <div
              key={img}
              className="parallax-bg absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
              style={{
                zIndex: idx,
                opacity: 0.3 - (idx * 0.05),
              }}
            >
              <img
                src={img}
                alt=""
                className={`w-full h-full object-cover select-none grayscale contrast-125 ${idx > 0 ? 'blur-[1px]' : ''}`}
                draggable={false}
                loading="eager"
              />
            </div>
          ))}
        </div>
        
        {/* Dark overlay to ensure content visibility */}
        <div className="absolute inset-0 bg-black/85" style={{ zIndex: 5 }} />
        
        {/* Grain texture */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png")',
            zIndex: 6
          }}
        />
      </div>
      
      {/* Content container with normal document flow - HIGH z-index to ensure visibility */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
