
interface BackgroundProps {
  imagePath: string;
  depth?: number;
}

export const Background = ({ imagePath, depth = 0.1 }: BackgroundProps) => {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen parallax-element"
      data-depth={depth}
      style={{
        backgroundImage: `url("${imagePath}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
        zIndex: -1000,
      }}
    />
  );
};
