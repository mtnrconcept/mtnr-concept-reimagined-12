
import React, { useEffect, useRef, useState } from 'react';

interface Parallax3DEffectProps {
  depth?: number;
  children?: React.ReactNode;
}

const Parallax3DEffect: React.FC<Parallax3DEffectProps> = ({ 
  depth = 0.08,
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Calculate mouse position relative to the center of the screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate normalized coordinates (-1 to 1)
      const x = (e.clientX - centerX) / centerX; 
      const y = (e.clientY - centerY) / centerY;
      
      // Set movement flag for subtle animation
      setIsMoving(true);
      setPosition({ x, y });
      
      // Reset moving state after a delay for smooth transitions
      clearTimeout((window as any).parallaxTimeout);
      (window as any).parallaxTimeout = setTimeout(() => {
        setIsMoving(false);
      }, 300);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div
      ref={containerRef}
      className="parallax-container"
      style={{
        position: 'fixed',
        inset: 0,
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transition: isMoving ? 'none' : 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
      }}
    >
      {/* Grid layer with parallax effect */}
      <div
        className="parallax-grid-layer"
        style={{
          position: 'absolute',
          inset: '-50px',
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px',
          transform: `translateZ(-100px) rotateX(${position.y * -3}deg) rotateY(${position.x * 3}deg)`,
          transition: isMoving ? 'none' : 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
          opacity: 0.1,
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Middle layer */}
      <div
        className="parallax-middle-layer"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateZ(-50px) rotateX(${position.y * -2}deg) rotateY(${position.x * 2}deg)`,
          transition: isMoving ? 'none' : 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50" />
      </div>
      
      {/* Content layer with parallax effect */}
      <div
        className="parallax-content-layer"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `rotateX(${position.y * -1}deg) rotateY(${position.x * 1}deg)`,
          transition: isMoving ? 'none' : 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
      
      {/* Inner glow effect */}
      <div
        className="inner-glow-effect"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
          transform: `rotateX(${position.y * -0.5}deg) rotateY(${position.x * 0.5}deg)`,
          transition: isMoving ? 'none' : 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
        }}
      />
    </div>
  );
};

export default Parallax3DEffect;
