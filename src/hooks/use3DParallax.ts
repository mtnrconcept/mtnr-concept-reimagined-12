
import { useEffect, useRef } from 'react';

interface Parallax3DOptions {
  strength?: number;
  perspective?: number;
  easing?: number;
}

export function use3DParallax(containerRef: React.RefObject<HTMLElement>, options: Parallax3DOptions = {}) {
  const {
    strength = 25,
    perspective = 1000,
    easing = 0.05
  } = options;
  
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  
  useEffect(() => {
    console.log("Initializing 3D parallax effect");
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position from -1 to 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    const animate = () => {
      // Apply easing for smooth movement
      target.current.x += (mouse.current.x - target.current.x) * easing;
      target.current.y += (mouse.current.y - target.current.y) * easing;
      
      // Only update if position has changed significantly
      if (
        Math.abs(lastPosition.current.x - target.current.x) > 0.001 ||
        Math.abs(lastPosition.current.y - target.current.y) > 0.001
      ) {
        updateParallaxElements();
        
        lastPosition.current.x = target.current.x;
        lastPosition.current.y = target.current.y;
      }
      
      rafId.current = null;
      
      // Continue animation if movement is still happening
      if (
        Math.abs(mouse.current.x - target.current.x) > 0.002 ||
        Math.abs(mouse.current.y - target.current.y) > 0.002
      ) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    const updateParallaxElements = () => {
      if (!containerRef.current) return;
      
      const elements = containerRef.current.querySelectorAll<HTMLElement>('.parallax-element');
      const scrollY = window.scrollY;
      
      elements.forEach(el => {
        const depth = parseFloat(el.dataset.depth || '0.5');
        const rotationX = target.current.y * strength * depth;
        const rotationY = -target.current.x * strength * depth;
        
        const translateZ = -depth * perspective;
        const translateY = scrollY * depth * 0.5;
        
        el.style.transform = `
          translateY(${translateY}px)
          translateZ(${translateZ}px)
          rotateX(${rotationX}deg)
          rotateY(${rotationY}deg)
          scale(${1 + depth * 0.3})
        `;
        
        // Adjust shadowing based on angle to light source
        const shadowIntensity = Math.abs(rotationX + rotationY) * 0.2;
        el.style.boxShadow = `0 ${shadowIntensity}px ${shadowIntensity * 3}px rgba(0,0,0,0.3)`;
      });
      
      // Also update background if present
      const bgElements = document.querySelectorAll<HTMLElement>('[data-depth]');
      bgElements.forEach(el => {
        if (el.classList.contains('parallax-element')) return; // Skip elements already processed
        
        const depth = parseFloat(el.dataset.depth || '0.02');
        const moveX = target.current.x * strength * depth * 0.5;
        const moveY = target.current.y * strength * depth * 0.5 + (scrollY * depth * 0.2);
        
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${1 + depth})`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial update
    requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [strength, perspective, easing]);
}
