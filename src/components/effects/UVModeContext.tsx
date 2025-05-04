
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useTorch } from "./TorchContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface UVModeContextType {
  uvMode: boolean;
  toggleUVMode: () => void;
  uvCircleRef: React.RefObject<HTMLDivElement>;
  createUVCircle: (mousePosition: { x: number; y: number }) => void;
  removeUVCircle: () => void;
}

const UVModeContext = createContext<UVModeContextType>({
  uvMode: false,
  toggleUVMode: () => {},
  uvCircleRef: { current: null },
  createUVCircle: () => {},
  removeUVCircle: () => {},
});

export const useUVMode = () => useContext(UVModeContext);

export const UVModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uvMode, setUVMode] = useState(false);
  const uvCircleRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const toggleUVMode = () => {
    setUVMode(prev => !prev);
  };

  const createUVCircle = (mousePosition: { x: number; y: number }) => {
    if (!uvCircleRef.current) {
      const circle = document.createElement('div');
      circle.className = 'uv-light-circle active';
      circle.style.left = `${mousePosition.x}px`;
      circle.style.top = `${mousePosition.y}px`;
      // Désactiver les transitions sur mobile pour un suivi instantané
      if (isMobile) {
        circle.style.transition = 'none';
        circle.style.willChange = 'left, top'; // Optimisation pour le rendu
      }
      document.body.appendChild(circle);
      uvCircleRef.current = circle;
    }
  };

  const removeUVCircle = () => {
    if (uvCircleRef.current) {
      uvCircleRef.current.remove();
      uvCircleRef.current = null;
    }
  };

  // Apply global UV mode effects
  useEffect(() => {
    const logos = document.querySelectorAll('img[src*="logo"]');
    const navLinks = document.querySelectorAll('nav a');
    const buttons = document.querySelectorAll('button, a.btn, .btn, [role="button"]');
    
    if (uvMode) {
      // Add UV mode class to body
      document.body.classList.add('uv-mode-active');
      
      // Apply effects to navigation elements
      navLinks.forEach(link => {
        link.classList.add('uv-nav-link');
      });
      
      // Apply effects to buttons
      buttons.forEach(button => {
        button.classList.add('uv-button');
      });
      
      // Play subtle sound if available
      try {
        // Create subtle electronic "click" sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        // Ignore errors if Web Audio API is not supported
        console.log("Audio API not supported", e);
      }
    } else {
      document.body.classList.remove('uv-mode-active');
      
      navLinks.forEach(link => {
        link.classList.remove('uv-nav-link');
      });
      
      buttons.forEach(button => {
        button.classList.remove('uv-button');
      });
    }
    
    return () => {
      document.body.classList.remove('uv-mode-active');
      
      navLinks.forEach(link => {
        link.classList.remove('uv-nav-link');
      });
      
      buttons.forEach(button => {
        button.classList.remove('uv-button');
      });
    };
  }, [uvMode]);

  return (
    <UVModeContext.Provider value={{ 
      uvMode, 
      toggleUVMode,
      uvCircleRef,
      createUVCircle,
      removeUVCircle
    }}>
      {children}
    </UVModeContext.Provider>
  );
};
