
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { createParticleEffect, createSmokeEffect } from '@/lib/transition-effects';

export default function PageTransitionEffect() {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const contentRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Find the main content container
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    contentRef.current = mainContent;
    
    // If this is a route change (not initial load)
    if (prevPathRef.current !== location.pathname) {
      // Apply particle effect to previous content
      // Using requestIdleCallback to not block rendering
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          createParticleEffect(contentRef.current);
        }, { timeout: 100 });
      } else {
        setTimeout(() => {
          createParticleEffect(contentRef.current);
        }, 10);
      }
      
      // Wait for particle effect to disperse before showing new content
      setTimeout(() => {
        // Apply smoke effect to new content
        createSmokeEffect(contentRef.current);
      }, 600);
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname]);
  
  // This component doesn't render anything visually
  return null;
}
