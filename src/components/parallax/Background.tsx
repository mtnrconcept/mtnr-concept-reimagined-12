
interface BackgroundProps {
  imagePath: string;
  depth?: number;
}

export const Background = ({ imagePath, depth = 0.05 }: BackgroundProps) => {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen parallax-element"
      data-depth={depth}
      style={{
        backgroundImage: `url("${imagePath}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 1,
        zIndex: -1000,
        transform: 'translateZ(-5000px) scale(1.5)', // Assurez une position très en arrière
      }}
    />
  );
};
