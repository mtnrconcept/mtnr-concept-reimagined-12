
import React from "react";

const stairsImages = [
  "/lovable-uploads/ff5c872a-d737-47fe-a427-a31849cceac3.png",
  "/lovable-uploads/ed3157a2-e211-4f4e-87c4-f3976efe1025.png",
  "/lovable-uploads/c51ac031-c85b-42b2-8d7d-b14f16692636.png"
];

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  // Effet d'escalier optimisé
  React.useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll<HTMLElement>('.parallax-bg').forEach((el, i) => {
        // Vitesse progressive pour chaque couche, donnant l'impression de descendre
        const speed = 0.2 + (i * 0.12); 
        const yOffset = window.scrollY * speed;
        const scale = 1 + (window.scrollY * 0.0008); // Zoom plus prononcé pendant le scroll
        el.style.transform = `translateY(${yOffset}px) scale(${scale})`;
      });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Container de fond fixe */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-black" style={{ zIndex: 0 }}>
        {/* Couches parallax */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {stairsImages.map((img, idx) => (
            <div
              key={img}
              className="parallax-bg absolute inset-0 w-full h-full transition-transform duration-700 ease-out will-change-transform"
              style={{
                zIndex: idx,
                opacity: 0.85 - (idx * 0.1), // Augmentation de l'opacité pour plus de visibilité
              }}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover select-none"
                draggable={false}
                loading="eager"
              />
            </div>
          ))}
        </div>
        
        {/* Overlay sombre léger pour garantir la lisibilité du contenu */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" 
          style={{ zIndex: 5 }} 
        />
        
        {/* Texture grain légère */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-10"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png")',
            zIndex: 6
          }}
        />
      </div>
      
      {/* Container de contenu avec z-index élevé */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
