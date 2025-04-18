
import React from "react";

/** 
 * ParallaxBackground affichant un fond "escalier/graffiti" type sous-sol, avec effet parallax
 */
const bgImages = [
  "/lovable-uploads/eac56990-bffc-4645-8503-85d6804f7d04.png", // graffiti stairs fourni par l'utilisateur
];

export default function ParallaxBackground({ children }: {children?: React.ReactNode}) {
  React.useEffect(() => {
    const handler = () => {
      document.querySelectorAll<HTMLElement>('.parallax-stairs').forEach((el, i) => {
        el.style.transform = `translateY(${window.scrollY * 0.18 * (i + 1)}px)`;
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">
      <div className="absolute inset-0 pointer-events-none z-0">
        {bgImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt="Escalier graff"
            className={`parallax-stairs absolute w-full object-cover h-screen opacity-85`}
            style={{
              left: 0,
              top: 0,
              pointerEvents: 'none',
              zIndex: idx + 1,
              filter: "brightness(0.68) grayscale(0.13)",
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
