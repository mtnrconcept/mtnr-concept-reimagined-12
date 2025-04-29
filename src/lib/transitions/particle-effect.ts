
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

/**
 * Creates an effect where a logo or image disperses into particles
 * @param imageElement The image element to disperse
 * @param options Configuration options for the effect
 */
export function createLogoDisperseEffect(
  imageElement: HTMLImageElement,
  options: {
    particleCount?: number;
    dispersionStrength?: number;
    duration?: number;
    colorPalette?: string[];
    onComplete?: () => void;
  } = {}
) {
  if (!imageElement || !imageElement.complete) {
    // Si l'image n'est pas chargée, appeler immédiatement onComplete et retourner
    if (options.onComplete) {
      setTimeout(options.onComplete, 10);
    }
    return { cancel: () => {} };
  }

  const {
    particleCount = 800,
    dispersionStrength = 1.5,
    duration = 2000,
    colorPalette = ['#FFD700', '#000000', '#FFFFFF'], // Jaune, noir, blanc
    onComplete = () => {}
  } = options;

  // Créer un canvas pour capturer l'image
  const canvas = document.createElement('canvas');
  const rect = imageElement.getBoundingClientRect();
  
  // Dimensions du canvas
  const width = Math.max(rect.width, 100);
  const height = Math.max(rect.height, 100);
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Si pas de contexte canvas, terminer rapidement
    if (onComplete) {
      setTimeout(onComplete, 10);
    }
    return { cancel: () => {} };
  }
  
  try {
    // Dessiner l'image sur le canvas
    ctx.drawImage(imageElement, 0, 0, width, height);
  } catch (error) {
    console.error("Erreur lors du dessin de l'image:", error);
    if (onComplete) {
      setTimeout(onComplete, 10);
    }
    return { cancel: () => {} };
  }
  
  // Créer un conteneur pour les particules en position absolue
  const particleContainer = document.createElement('div');
  particleContainer.style.cssText = `
    position: absolute;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${width}px;
    height: ${height}px;
    pointer-events: none;
    z-index: 100;
    overflow: visible;
  `;
  document.body.appendChild(particleContainer);
  
  // Générer les particules - moins nombreuses pour de meilleures performances
  const particleSize = Math.max(1, Math.min(Math.floor(Math.sqrt(width * height) / 50), 3));
  const particleGap = Math.max(6, Math.floor(Math.sqrt(width * height) / particleCount * 5));
  
  const particles = [];
  const fragment = document.createDocumentFragment();

  let particleCount2D = 0;

  // Échantillonner l'image et créer les particules
  for (let y = 0; y < height; y += particleGap) {
    for (let x = 0; x < width; x += particleGap) {
      // Limiter le nombre total de particules
      if (particleCount2D >= options.particleCount || particleCount2D >= 400) {
        break;
      }
      
      try {
        // Vérifier que le pixel est suffisamment opaque pour créer une particule
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const alpha = pixelData[3];
        
        if (alpha > 50) { // Ignorer les pixels trop transparents
          particleCount2D++;
          
          const particle = document.createElement('div');
          
          // Couleur de base extraite de l'image
          let color;
          if (pixelData[0] > 200 && pixelData[1] > 200 && pixelData[2] < 100) {
            // C'est probablement jaune
            color = colorPalette[0]; // #FFD700
          } else if (pixelData[0] < 50 && pixelData[1] < 50 && pixelData[2] < 50) {
            // C'est probablement noir
            color = colorPalette[1]; // #000000
          } else {
            // Par défaut, ou blanc
            color = colorPalette[2]; // #FFFFFF
          }
          
          // Propriétés de la particule
          const finalSize = random(particleSize * 0.5, particleSize * 1.5);
          const angle = Math.random() * Math.PI * 2;
          const distance = random(50, 300) * dispersionStrength;
          const delay = random(0, duration * 0.3); // Réduire les délais pour plus de réactivité
          
          particle.className = 'logo-particle';
          particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${finalSize}px;
            height: ${finalSize}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: ${random(0.6, 1)};
            transform: translate(0, 0) scale(1);
            will-change: transform, opacity;
            --tx: ${Math.cos(angle) * distance}px;
            --ty: ${Math.sin(angle) * distance}px;
            --delay: ${delay}ms;
            --duration: ${duration}ms;
          `;
          
          fragment.appendChild(particle);
          particles.push(particle);
        }
      } catch (error) {
        console.error("Erreur lors de l'échantillonnage de l'image:", error);
        // Continuer malgré l'erreur
      }
    }
  }
  
  // Si aucune particule n'a été créée, terminer rapidement
  if (particles.length === 0) {
    particleContainer.remove();
    if (onComplete) {
      setTimeout(onComplete, 10);
    }
    return { cancel: () => {} };
  }
  
  // Ajouter toutes les particules en une seule opération
  particleContainer.appendChild(fragment);
  
  // Appliquer l'animation avec RAF pour de meilleures performances
  const startTime = performance.now();
  const endTime = startTime + duration + 500; // +500ms pour les retards
  let animFrameId = 0;
  
  // Temporairement masquer l'image originale
  const originalOpacity = imageElement.style.opacity;
  imageElement.style.opacity = '0';
  
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  function animateParticles(timestamp) {
    const elapsed = timestamp - startTime;
    const isComplete = elapsed >= endTime;
    
    if (!isComplete) {
      particles.forEach(particle => {
        try {
          const delay = parseFloat(particle.style.getPropertyValue('--delay'));
          const duration = parseFloat(particle.style.getPropertyValue('--duration'));
          const particleElapsed = elapsed - delay;
          
          if (particleElapsed > 0) {
            const progress = Math.min(1, particleElapsed / duration);
            const easeOutProgress = easeInOutCubic(progress); // Ease-in-out cubique
            
            const tx = parseFloat(particle.style.getPropertyValue('--tx'));
            const ty = parseFloat(particle.style.getPropertyValue('--ty'));
            
            particle.style.transform = `translate(
              ${tx * easeOutProgress}px, 
              ${ty * easeOutProgress}px
            ) scale(${1 - easeOutProgress * 0.5})`;
            
            particle.style.opacity = (1 - easeOutProgress).toString();
          }
        } catch (error) {
          // Ignorer les erreurs pour chaque particule
        }
      });
      
      animFrameId = requestAnimationFrame(animateParticles);
    } else {
      // Animation terminée, nettoyer
      cleanup();
    }
  }
  
  function cleanup() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = 0;
    }
    particleContainer.remove();
    imageElement.style.opacity = originalOpacity; // Restaurer l'opacité originale
    onComplete();
  }
  
  animFrameId = requestAnimationFrame(animateParticles);
  
  return {
    cancel: cleanup
  };
}
