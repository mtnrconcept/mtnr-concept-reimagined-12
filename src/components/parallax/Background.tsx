
interface BackgroundProps {
  imagePath: string;
  depth?: number;
}

export const Background = ({ imagePath, depth = 0.05 }: BackgroundProps) => {
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-black"
      style={{
        zIndex: 1,  // Réduit pour être sûr d'être derrière les éléments
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        data-depth={depth}
        style={{
          backgroundImage: `url("${imagePath}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateZ(${-depth * 500}px) scale(${1 + depth * 2})`,
          opacity: 0.2, // Réduit l'opacité du fond pour mieux voir les splashes
          willChange: 'transform',
          filter: 'brightness(0.5) contrast(1.1)'
        }}
      />
      <div 
        className="absolute inset-0 bg-black/70" 
        style={{ zIndex: 2 }} 
      />
    </div>
  );
};
