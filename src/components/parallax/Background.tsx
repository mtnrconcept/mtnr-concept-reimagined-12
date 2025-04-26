
export const Background = () => {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen parallax-element"
      data-depth="0.05"
      data-x="0"
      data-y="0"
      style={{
        backgroundImage: 'url("/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
        transform: 'translateZ(-15000px) scale(2)',
        zIndex: -1000,
        willChange: 'transform',
      }}
    />
  );
};
