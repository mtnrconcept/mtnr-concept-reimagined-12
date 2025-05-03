
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useTorch } from "./TorchContext";

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
  
  const toggleUVMode = () => {
    setUVMode(prev => !prev);
  };

  const createUVCircle = (mousePosition: { x: number; y: number }) => {
    // Supprime l'ancien cercle s'il existe
    removeUVCircle();

    // Crée un nouveau cercle
    const circle = document.createElement('div');
    circle.className = 'uv-light-circle active';
    circle.style.left = `${mousePosition.x}px`;
    circle.style.top = `${mousePosition.y}px`;
    circle.style.zIndex = '999'; // S'assurer qu'il est au-dessus des autres éléments
    document.body.appendChild(circle);
    uvCircleRef.current = circle;
    
    // Ajouter un effet de pulsation
    const pulseEffect = () => {
      if (uvCircleRef.current) {
        const time = Date.now() / 1000;
        const scale = 1 + Math.sin(time * 2) * 0.03;
        uvCircleRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        requestAnimationFrame(pulseEffect);
      }
    };
    
    requestAnimationFrame(pulseEffect);
  };

  const removeUVCircle = () => {
    if (uvCircleRef.current) {
      uvCircleRef.current.remove();
      uvCircleRef.current = null;
    }
  };

  // Apply global UV mode effects
  useEffect(() => {
    console.log("UV Mode changed:", uvMode);
    
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
      
      // Rendre visibles tous les éléments UV
      document.querySelectorAll('.uv-hidden-code, .uv-hidden-message, .uv-secret-message, .decrypt-message').forEach(el => {
        if (el instanceof HTMLElement) {
          // Les rendre prêts à réagir au mouvement de la souris
          el.classList.add('uv-ready');
        }
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
      
      // Cacher les éléments UV
      document.querySelectorAll('.uv-hidden-code, .uv-hidden-message, .uv-secret-message, .decrypt-message').forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.remove('uv-ready');
          el.classList.remove('visible');
          el.style.opacity = '0';
        }
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
