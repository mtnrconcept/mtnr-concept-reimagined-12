
import { random } from './utils';

/**
 * Creates an optimized smoke-like effect for incoming content
 * @param element The element to apply the smoke effect to
 */
export function createSmokeEffect(element: HTMLElement | null) {
  if (!element) return;
  
  // Create a container for the smoke effect
  const smokeContainer = document.createElement('div');
  smokeContainer.className = 'fixed inset-0 pointer-events-none z-40';
  document.body.appendChild(smokeContainer);
  
  // Get element position
  const rect = element.getBoundingClientRect();
  
  // Use fewer smoke particles
  const smokeCount = 15;
  const smokeDuration = 3000; // 3 seconds
  
  // Create smoke particles in batch using DocumentFragment
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < smokeCount; i++) {
    const smoke = document.createElement('div');
    
    // Strategic placement around element
    const x = rect.left + rect.width * (i % 5) / 5 + random(-20, 20);
    const y = rect.top + rect.height * Math.floor(i / 5) / 3 + random(-20, 20);
    
    // Calculate size based on position (center = larger)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow((x - centerX) / (rect.width / 2), 2) + 
      Math.pow((y - centerY) / (rect.height / 2), 2)
    );
    const sizeMultiplier = 1 - Math.min(0.6, distanceFromCenter * 0.6);
    const smokeSize = (30 + random(20, 60)) * sizeMultiplier;
    
    // Use the theme colors
    const useYellow = random(0, 1) > 0.3;
    const color = useYellow ? 
      `rgba(255, 215, 0, ${0.1 + random(0, 0.15)})` : 
      `rgba(255, 255, 255, ${0.1 + random(0, 0.1)})`;
    
    // Apply efficient styles
    smoke.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${smokeSize}px;
      height: ${smokeSize}px;
      border-radius: 50%;
      background: radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%);
      opacity: 0;
      filter: blur(5px);
      transform: scale(0.6);
      will-change: transform, opacity;
    `;
    
    // Animation data as attributes for requestAnimationFrame
    smoke.dataset.startTime = (performance.now() + random(0, 400)).toString();
    smoke.dataset.duration = (smokeDuration - random(0, 500)).toString();
    
    fragment.appendChild(smoke);
  }
  
  // Add all smoke elements at once
  smokeContainer.appendChild(fragment);
  
  // Animate smoke particles with requestAnimationFrame for better performance
  const smokeElements = Array.from(smokeContainer.children) as HTMLElement[];
  
  // Single animation loop for all particles
  function animateSmoke(timestamp: number) {
    let allComplete = true;
    
    smokeElements.forEach(smoke => {
      const startTime = parseFloat(smoke.dataset.startTime || '0');
      const duration = parseFloat(smoke.dataset.duration || '3000');
      
      if (timestamp < startTime) {
        allComplete = false;
        return;
      }
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      if (progress < 1) {
        allComplete = false;
        
        // Animation curve
        let opacity;
        if (progress < 0.4) {
          opacity = progress / 0.4;
        } else {
          opacity = 1 - ((progress - 0.4) / 0.6);
        }
        
        // Simplified movement calculations
        const floatX = Math.sin(progress * Math.PI * 2) * 3;
        const floatY = Math.cos(progress * Math.PI * 2) * 2;
        const scale = 0.6 + (progress < 0.7 ? progress * 0.6 : 0.42);
        
        smoke.style.opacity = (opacity * opacity).toString(); // quadratic easing
        smoke.style.transform = `scale(${scale}) translate(${floatX}px, ${floatY}px)`;
      } else {
        // Remove completed elements
        smoke.remove();
        // Remove from array
        const index = smokeElements.indexOf(smoke);
        if (index > -1) {
          smokeElements.splice(index, 1);
        }
      }
    });
    
    if (!allComplete && smokeElements.length > 0) {
      requestAnimationFrame(animateSmoke);
    } else {
      setTimeout(() => {
        smokeContainer.remove();
      }, 500);
    }
  }
  
  requestAnimationFrame(animateSmoke);
  
  // Show the element with fade in
  if (element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.7s ease-in';
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 300);
  }
}
