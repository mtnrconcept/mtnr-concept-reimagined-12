
import { useEffect } from "react";
import { useUVAudioFeedback } from "./useUVAudioFeedback";

export function useUVModeEffects(uvMode: boolean) {
  const { playUVToggleSound } = useUVAudioFeedback();
  
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
      
      // Play sound when UV mode is activated
      playUVToggleSound();
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
  }, [uvMode, playUVToggleSound]);
}
