
interface BackgroundProps {
  imagePath: string;
  depth?: number;
}

export const Background = ({ imagePath, depth = 0.05 }: BackgroundProps) => {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat"
      data-depth={depth}
      style={{
        backgroundImage: `url("${imagePath}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1000,
        transform: 'translateZ(-5000px) scale(1.5)',
        opacity: 1,
        willChange: 'transform'
      }}
    />
  );
};
