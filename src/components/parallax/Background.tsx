
interface BackgroundProps {
  imagePath: string;
  depth?: number;
}

export const Background = ({ imagePath, depth = 0.05 }: BackgroundProps) => {
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-black"
      style={{
        zIndex: 1,
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
          backgroundImage: `url("/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png")`, // Utilisation de l'image d'escalier
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateZ(${-depth * 500}px) scale(${1 + depth * 2})`,
          opacity: 0.15, // Augmentation légère de l'opacité
          willChange: 'transform',
          filter: 'brightness(0.4) contrast(1.2)' // Amélioration du contraste
        }}
      />
      <div 
        className="absolute inset-0 bg-black/70" 
        style={{ zIndex: 2 }} 
      />
    </div>
  );
};
