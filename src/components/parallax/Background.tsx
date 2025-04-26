
export const Background = () => {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen parallax-element"
      data-depth="0.05"  // Valeur très faible pour un défilement encore plus lent
      data-x="0"
      data-y="0"
      style={{
        backgroundImage: 'url("/lovable-uploads/5e71b343-84de-46de-ab26-ad53863f8f6f.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
        transform: 'translateZ(-15000px) scale(2)', // Plus loin en Z et scale plus grand
        zIndex: -1000, // Assurons-nous qu'il est vraiment derrière tout
        willChange: 'transform',
      }}
    />
  );
};
