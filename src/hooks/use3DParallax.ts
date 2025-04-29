
import { useEffect, RefObject } from 'react';

interface Parallax3DOptions {
  strength?: number;
  perspective?: number;
  easing?: number;
  layerSelector?: string;
}

/**
 * Enhanced 3D parallax effect hook with depth perception
 * @param containerRef - Reference to the container element
 * @param options - Configuration options for the parallax effect
 */
export const use3DParallax = (
  containerRef: RefObject<HTMLElement>,
  options: Parallax3DOptions = {}
) => {
  const {
    strength = 30,
    perspective = 1000,
    easing = 0.1,
    layerSelector = '[data-depth]'
  } = options;

  useEffect(() => {
    console.log('Initializing enhanced 3D parallax effect');
    
    const container = containerRef.current;
    if (!container) return;
    
    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scrollPosition = window.scrollY;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - windowWidth / 2;
      mouseY = e.clientY - windowHeight / 2;
    };
    
    const handleScroll = () => {
      scrollPosition = window.scrollY;
    };
    
    const handleResize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };
    
    const updateParallaxElements = () => {
      // Smooth mouse movement with easing
      targetMouseX += (mouseX - targetMouseX) * easing;
      targetMouseY += (mouseY - targetMouseY) * easing;
      
      const elements = container.querySelectorAll<HTMLElement>(layerSelector);
      
      elements.forEach(element => {
        const depth = parseFloat(element.dataset.depth || '0');
        
        // Calculate 3D transforms
        const moveX = (targetMouseX * depth * strength) / 100;
        const moveY = (targetMouseY * depth * strength) / 100;
        const scrollY = scrollPosition * depth;
        
        // Apply transforms with 3D depth
        element.style.transform = `
          translate3d(${moveX}px, ${moveY + scrollY}px, ${depth * -100}px)
          rotateX(${-targetMouseY / 50 * depth}deg)
          rotateY(${targetMouseX / 50 * depth}deg)
        `;
      });
      
      rafId = requestAnimationFrame(updateParallaxElements);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    rafId = requestAnimationFrame(updateParallaxElements);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef, strength, perspective, easing, layerSelector]);
};
