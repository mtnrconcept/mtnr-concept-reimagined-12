import { random } from './utils';

/**
 * Creates an optimized particle dispersion effect for page transitions
 * @param container The element DOM container whose content will be dispersed
 */
export function createParticleEffect(container: HTMLElement | null) {
  if (!container) return;
  
  // Create a container for all particles
  const particleContainer = document.createElement('div');
  particleContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(particleContainer);
  
  // Capture positions of visible elements for targeted particle generation
  const visibleElements = Array.from(container.querySelectorAll('*'))
    .filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 5 && rect.height > 5 && rect.top < window.innerHeight && rect.bottom > 0;
    })
    .slice(0, 25); // Limit to 25 elements max for better performance
  
  // Pre-calculate canvases for better performance
  const canvases = visibleElements.map(element => {
    const rect = element.getBoundingClientRect();
    const elementCanvas = document.createElement('canvas');
    elementCanvas.width = rect.width;
    elementCanvas.height = rect.height;
    
    return {
      element,
      rect,
      canvas: elementCanvas,
      position: { x: rect.left, y: rect.top },
      size: { width: rect.width, height: rect.height }
    };
  });
  
  // Create element group containers up front (batching DOM operations)
  const elementGroups = canvases.map(({ position, size }) => {
    const group = document.createElement('div');
    group.style.position = 'absolute';
    group.style.left = `${position.x}px`;
    group.style.top = `${position.y}px`;
    group.style.width = `${size.width}px`;
    group.style.height = `${size.height}px`;
    group.style.overflow = 'visible';
    particleContainer.appendChild(group);
    return group;
  });
  
  // Generate particles in batches
  canvases.forEach(({ size, rect }, index) => {
    const group = elementGroups[index];
    const element = canvases[index].element;
    
    // Dynamically adjust particle count based on element size (but keep it reasonable)
    const area = size.width * size.height;
    const particleCount = Math.min(Math.floor(area / 600), 100);
    
    // Get element style information
    const computedStyle = window.getComputedStyle(element as Element);
    let baseColor = computedStyle.color;
    if (baseColor === 'transparent' || baseColor === 'rgba(0, 0, 0, 0)') {
      baseColor = Math.random() > 0.3 ? '#FFD700' : '#FFF'; // Yellow or white theme
    }
    
    // Use DocumentFragment for batch append
    const fragment = document.createDocumentFragment();
    
    // Create particles in one batch
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Use hardware-accelerated properties
      const x = random(0, size.width);
      const y = random(0, size.height);
      const particleSize = random(1, 3);
      
      // Create initial styles with transforms
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${particleSize}px;
        height: ${particleSize}px;
        background-color: ${baseColor};
        border-radius: 50%;
        will-change: transform, opacity;
        --tx: ${random(-100, 100)}px;
        --ty: ${random(-100, 100)}px;
        --tz: ${random(-20, 20)}px;
        --rx: ${random(-180, 180)}deg;
        --ry: ${random(-180, 180)}deg;
        --s: ${random(0, 0.8)};
      `;
      
      fragment.appendChild(particle);
    }
    
    // Add all particles at once
    group.appendChild(fragment);
  });
  
  // Gradually hide the original container
  if (container) {
    container.style.transition = 'opacity 0.3s ease-out';
    container.style.opacity = '0';
  }
  
  // Set timeout to remove particles container when animation is complete
  setTimeout(() => {
    particleContainer.remove();
  }, 4000); // Slightly longer than animation duration to ensure all particles are gone
}
