
interface BackgroundProps {
  imagePath: string;
  depth?: number;
}

export const Background = ({ imagePath, depth = 0.05 }: BackgroundProps) => {
  return (
    <div 
      className="fixed inset-0 w-full h-screen bg-cover bg-center bg-no-repeat"
      data-depth={depth}
      style={{
        backgroundImage: `url("${imagePath}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -10,
        transform: `translateZ(${-depth * 1000}px) scale(${1 + depth})`,
        opacity: 1,
        willChange: 'transform'
      }}
    />
  );
};
