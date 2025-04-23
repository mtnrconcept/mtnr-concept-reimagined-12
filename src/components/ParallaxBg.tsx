
import React from "react";

// Images lumineuses pour effet underground
const bgLayers = [
  {
    url: "/lovable-uploads/photo-1470071459604-3b5ec3a7fe05", // escalier/fond sombre
    translate: 0.2,
    blur: "blur-lg",
    opacity: "opacity-30",
    colorOverlay: "bg-gradient-to-br from-transparent via-black/80 to-black/90",
  },
  {
    url: "/lovable-uploads/photo-1433086966358-54859d0ed716", // structure
    translate: 0.4,
    blur: "blur-xl",
    opacity: "opacity-30",
    colorOverlay: "bg-gradient-to-tr from-yellow-400/20 via-transparent to-black/80",
  },
  {
    url: "/lovable-uploads/photo-1482938289607-e9573fc25ebb", // touche lumière
    translate: 0.65,
    blur: "blur-2xl",
    opacity: "opacity-20",
    colorOverlay: "bg-gradient-to-tl from-yellow-200/25 via-transparent to-fuchsia-700/20",
  },
];

export default function ParallaxBg({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll<HTMLElement>(".layer-parallax").forEach((el, i) => {
        el.style.transform = `translateY(${window.scrollY * bgLayers[i].translate}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-black selection:bg-yellow-400/20">
      {/* Fond multi-couches, parallax */}
      {bgLayers.map((layer, idx) => (
        <div
          className={`absolute inset-0 layer-parallax transition-transform duration-300 ease-out will-change-transform pointer-events-none ${layer.blur} ${layer.opacity}`}
          style={{ zIndex: `${idx + 1}` }}
          key={layer.url}
        >
          <img
            src={layer.url}
            alt=""
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
          <div className={`absolute inset-0 ${layer.colorOverlay} pointer-events-none`} />
        </div>
      ))}
      {/* Halo lumineux */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2/3 h-96 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent blur-3xl rounded-full opacity-40 pointer-events-none" />
      {/* Un peu de diffusion */}
      <div className="absolute right-12 -bottom-16 w-1/3 h-52 bg-gradient-radial from-fuchsia-500/30 via-transparent to-transparent blur-2xl opacity-30 pointer-events-none" />
      {/* Zonage pour le contenu */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
