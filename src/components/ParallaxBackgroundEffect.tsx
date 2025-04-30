
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ParallaxBackgroundEffectProps {
  children: React.ReactNode;
}

export const ParallaxBackgroundEffect: React.FC<ParallaxBackgroundEffectProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isDragging) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center
      const x = (e.clientX - centerX) / 25; // Reduced intensity
      const y = (e.clientY - centerY) / 25; // Reduced intensity
      
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      // Smoothly reset to center when mouse leaves
      setMousePosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black" ref={containerRef}>
      {/* Grid Lines */}
      <div 
        className="fixed inset-0 z-0 w-full h-full"
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255, 221, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 221, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '35px 35px',
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.4}deg) rotateY(${-mousePosition.x * 0.4}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      />

      {/* Yellow Accent Elements */}
      <div className="fixed inset-0 z-0">
        {/* Top Left Accent */}
        <motion.div 
          className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-br-full"
          style={{ 
            filter: 'blur(40px)',
            transform: `translate3d(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px, 0)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Bottom Right Accent */}
        <motion.div 
          className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-yellow-400/20 to-transparent rounded-tl-full"
          style={{ 
            filter: 'blur(50px)',
            transform: `translate3d(${mousePosition.x * 3}px, ${mousePosition.y * 3}px, 0)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 z-0 w-full h-full">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow-400/20"
            style={{ 
              width: `${Math.random() * 5 + 3}px`,
              height: `${Math.random() * 5 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
              transform: `translate3d(${mousePosition.x * (i % 5 + 1) * 0.5}px, ${mousePosition.y * (i % 5 + 1) * 0.5}px, 0)`,
              transition: 'transform 0.5s ease-out'
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 5 + 5,
            }}
          />
        ))}
      </div>

      {/* Content Layer - Transform based on mouse position */}
      <motion.div 
        className="relative z-10 w-full min-h-screen"
        style={{ 
          transform: `perspective(1000px) translateZ(0) rotateX(${mousePosition.y * 0.2}deg) rotateY(${-mousePosition.x * 0.2}deg)`,
          transition: 'transform 0.2s ease-out',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center'
        }}
      >
        {children}
      </motion.div>

      {/* Vignette Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.4) 100%)'
        }}
      />
    </div>
  );
};

export default ParallaxBackgroundEffect;
