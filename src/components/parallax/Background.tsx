
export const Background = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-screen parallax-element"
      data-depth="0.02"  // Valeur très faible pour un défilement extrêmement lent
      data-x="0"
      data-y="0"
      style={{
        backgroundImage: 'url("/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.8,
        transform: 'translateZ(-10000px) scale(1.5)', // Beaucoup plus loin et scale pour remplir l'écran
        zIndex: -100,
        willChange: 'transform',
      }}
    />
  );
};
