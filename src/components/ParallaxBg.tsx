
import React from "react";

// Images et textures inspirées underground/grunge
const bgLayers = [
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
    translate: 0.1,
    blur: "blur-xl",
    opacity: "opacity-20",
    blend: "mix-blend-multiply",
  },
  {
    url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1600&q=80",
    translate: 0.23,
    blur: "blur-2xl",
    opacity: "opacity-25",
    blend: "mix-blend-overlay",
  },
  {
    url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1300&q=75",
    translate: 0.4,
    blur: "blur-lg",
    opacity: "opacity-30",
    blend: "mix-blend-color-dodge",
  }
];

export default function ParallaxBg({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll<HTMLElement>(".layer-parallax").forEach((el, i) => {
        el.style.transform = `translateY(${window.scrollY * bgLayers[i].translate}px) scale(1.03)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-grunge selection:bg-primary">
      {/* Parallax grunge backgrounds */}
      {bgLayers.map((layer, idx) => (
        <div
          className={`absolute inset-0 layer-parallax pointer-events-none transition-transform duration-500 ease-out will-change-transform ${layer.blur} ${layer.opacity} ${layer.blend}`}
          style={{ zIndex: `${idx + 1}` }}
          key={layer.url}
        >
          <img
            src={layer.url}
            alt=""
            className="w-full h-full object-cover select-none pointer-events-none grayscale contrast-[1.2]"
            draggable={false}
          />
        </div>
      ))}
      {/* Halo lumineux */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 w-1/2 h-80 bg-gradient-radial from-primary/30 to-transparent blur-3xl rounded-full pointer-events-none" />
      {/* Tache lumière */}
      <div className="absolute right-5 bottom-5 w-2/6 h-52 bg-gradient-radial from-yellow-500/20 via-transparent to-transparent blur-2xl pointer-events-none" />
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-mosaic.png")'
        }}
      />
    </div>
  );
}
