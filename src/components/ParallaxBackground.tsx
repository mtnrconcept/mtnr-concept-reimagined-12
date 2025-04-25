
import React, { useEffect, useState, useRef } from "react";

// Images et éléments
const mainImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png";
const elements = [
  { type: "light", x: 20, y: 15, z: 0.5, size: 40, brightness: 1.2, blur: 30 },
  { type: "light", x: 75, y: 55, z: 0.3, size: 25, brightness: 0.8, blur: 20 },
  { type: "light", x: 35, y: 85, z: 0.7, size: 20, brightness: 1, blur: 25 },
  { type: "pipe", x: 5, y: 30, z: 0.4, width: 60, height: 10, rotation: 15 },
  { type: "pipe", x: 90, y: 70, z: 0.6, width: 40, height: 8, rotation: -30 },
  { type: "vent", x: 85, y: 25, z: 0.8, size: 30 },
  { type: "vent", x: 15, y: 60, z: 0.5, size: 25 }
];

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });

  // Effet pour surveiller le scroll et la position de la souris
  useEffect(() => {
    // Initialiser les dimensions du viewport
    setViewportDimensions({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    
    const handleResize = () => {
      setViewportDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Effet pour animer les éléments parallax
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Effet de parallaxe sur l'image principale
    const mainBg = containerRef.current.querySelector<HTMLElement>('.main-bg');
    if (mainBg) {
      const depth = 0.2;
      const yOffset = scrollY * depth;
      const scale = 1 + (scrollY * 0.0003);
      const mouseX = mousePosition.x * 10;
      const mouseY = mousePosition.y * 10;
      
      mainBg.style.transform = `
        translateY(${yOffset}px) 
        translateX(${mouseX}px) 
        translateZ(0) 
        scale(${scale})
      `;
    }
    
    // Animer les éléments à différentes profondeurs
    containerRef.current.querySelectorAll<HTMLElement>('.parallax-element').forEach((el) => {
      const z = parseFloat(el.dataset.z || "0");
      const yOffset = scrollY * z;
      const mouseEffect = 15 * z;
      const mouseX = mousePosition.x * mouseEffect;
      const mouseY = mousePosition.y * mouseEffect;
      
      el.style.transform = `
        translate3d(
          ${mouseX}px, 
          calc(${yOffset}px + ${mouseY}px), 
          ${-z * 100}px
        )
      `;
    });
  }, [scrollY, mousePosition]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Container de fond fixe */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-black perspective" style={{ zIndex: 0, perspective: "1000px" }}>
        {/* Couche principale avec effet de profondeur */}
        <div className="absolute inset-0 transform-3d" style={{ transformStyle: "preserve-3d" }}>
          {/* Image principale */}
          <div
            className="main-bg absolute inset-0 w-full h-full transition-transform duration-300 ease-out will-change-transform"
            style={{ zIndex: 1 }}
          >
            <img
              src={mainImage}
              alt=""
              className="w-full h-full object-cover select-none"
              draggable={false}
              loading="eager"
              style={{ filter: "contrast(1.1)" }}
            />
          </div>
          
          {/* Éléments de parallaxe pour renforcer l'effet 3D */}
          {elements.map((element, idx) => (
            <div
              key={`${element.type}-${idx}`}
              className="parallax-element absolute pointer-events-none transition-transform duration-300 ease-out"
              data-z={element.z}
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                zIndex: Math.round(element.z * 10),
              }}
            >
              {element.type === "light" && (
                <div 
                  className="rounded-full bg-yellow-100 mix-blend-screen"
                  style={{
                    width: `${element.size}px`,
                    height: `${element.size}px`,
                    filter: `blur(${element.blur}px) brightness(${element.brightness})`,
                    opacity: 0.6,
                    boxShadow: `0 0 ${element.size}px ${element.size/2}px rgba(255,255,200,0.3)`
                  }}
                />
              )}
              
              {element.type === "pipe" && (
                <div 
                  className="bg-zinc-800 rounded-full opacity-70"
                  style={{
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    transform: `rotate(${element.rotation}deg)`,
                    boxShadow: "0 0 15px 5px rgba(0,0,0,0.5)"
                  }}
                />
              )}
              
              {element.type === "vent" && (
                <div className="relative opacity-80">
                  <div 
                    className="relative bg-zinc-900 border border-zinc-800"
                    style={{
                      width: `${element.size}px`,
                      height: `${element.size * 0.7}px`
                    }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute bg-zinc-700 w-full"
                        style={{
                          height: "2px",
                          top: `${(i+1) * 20}%`,
                          opacity: 0.8
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Overlay avec vignette pour accentuer la profondeur */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            zIndex: 5,
            background: `
              radial-gradient(
                circle at center, 
                transparent 40%, 
                rgba(0,0,0,0.4) 100%
              )
            `
          }} 
        />
        
        {/* Texture grain */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png")',
            zIndex: 6
          }}
        />
        
        {/* Effet de lumière dynamique */}
        <div 
          className="absolute pointer-events-none mix-blend-soft-light opacity-50"
          style={{
            top: `${30 + mousePosition.y * 10}%`,
            left: `${50 + mousePosition.x * 20}%`,
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,100,0.4) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
            zIndex: 7
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
