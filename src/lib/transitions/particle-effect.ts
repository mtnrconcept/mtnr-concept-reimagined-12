
import { random } from './utils';

export interface DisperseOptions {
  particleCount?: number;
  dispersionStrength?: number;
  duration?: number;
  colorPalette?: string[];
  onComplete?: () => void;
}

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
  options: DisperseOptions = {}
) {
  if (!imageElement || !imageElement.complete) {
    // Si l'image n'est pas chargée, appeler immédiatement onComplete et retourner
    if (options.onComplete) {
      setTimeout(options.onComplete, 10);
    }
    return { cancel: () => {} };
  }

  const {
    particleCount = 2500,
    dispersionStrength = 2.2,
    duration = 1800,
    colorPalette = ['#FFD700', '#222222', '#FFFFFF'], // Jaune, noir, blanc
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
  
  // Échantillonner les pixels de l'image pour une meilleure couverture
  // Réduire légèrement l'écart entre les particules pour une meilleure couverture
  const particleGap = Math.max(3, Math.floor(Math.sqrt(width * height) / Math.sqrt(particleCount)));
  const particleSize = Math.max(2.5, Math.min(Math.floor(Math.sqrt(width * height) / 30), 4));
  
  const particles = [];
  const fragment = document.createDocumentFragment();

  let particleCount2D = 0;
  const maxParticles = Math.min(options.particleCount || 2500, 2500);

  // Échantillonner l'image de manière plus complète
  for (let y = 0; y < height; y += particleGap) {
    for (let x = 0; x < width; x += particleGap) {
      // Limiter le nombre total de particules
      if (particleCount2D >= maxParticles) {
        break;
      }
      
      try {
        // Vérifier que le pixel est suffisamment opaque pour créer une particule
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const alpha = pixelData[3];
        
        if (alpha > 30) { // Seuil d'opacité plus bas pour capturer plus de pixels
          particleCount2D++;
          
          const particle = document.createElement('div');
          
          // Déterminer la couleur en fonction des données du pixel
          let color;
          if (pixelData[0] > 180 && pixelData[1] > 180 && pixelData[2] < 120) {
            // C'est probablement jaune
            color = colorPalette[0]; // #FFD700
          } else if (pixelData[0] < 60 && pixelData[1] < 60 && pixelData[2] < 60) {
            // C'est probablement noir
            color = colorPalette[1]; // #000000
          } else {
            // Par défaut, ou blanc
            color = colorPalette[2]; // #FFFFFF
          }
          
          // Propriétés de la particule
          const finalSize = random(particleSize * 0.5, particleSize * 1.5);
          const angle = Math.random() * Math.PI * 2;
          const distance = random(50, 600) * dispersionStrength;
          const delay = random(0, duration * 0.2); // Réduire les délais pour plus de réactivité
          
          particle.className = 'logo-particle';
          particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${finalSize}px;
            height: ${finalSize}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: ${random(0.7, 1)};
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
  
  // Ajouter des particules supplémentaires aux endroits où l'image est plus transparente
  // pour assurer une couverture complète
  if (particleCount2D < maxParticles / 2) {
    const additionalParticles = Math.min(maxParticles - particleCount2D, maxParticles / 2);
    for (let i = 0; i < additionalParticles; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      
      const particle = document.createElement('div');
      const finalSize = random(particleSize * 0.5, particleSize * 1.5);
      const angle = Math.random() * Math.PI * 2;
      const distance = random(100, 600) * dispersionStrength;
      const delay = random(0, duration * 0.2);
      
      particle.className = 'logo-particle';
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${finalSize}px;
        height: ${finalSize}px;
        background-color: ${color};
        border-radius: 50%;
        opacity: ${random(0.7, 1)};
        transform: translate(0, 0) scale(1);
        will-change: transform, opacity;
        --tx: ${Math.cos(angle) * distance}px;
        --ty: ${Math.sin(angle) * distance}px;
        --delay: ${delay}ms;
        --duration: ${duration}ms;
      `;
      
      fragment.appendChild(particle);
      particles.push(particle);
      particleCount2D++;
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
  
  // Masquer temporairement l'image originale pendant l'animation uniquement
  const originalOpacity = imageElement.style.opacity;
  
  // Masquer l'image d'origine pendant l'animation
  imageElement.style.opacity = '0';
  imageElement.style.transition = 'opacity 300ms ease-out';
  
  // Fonction d'easing améliorée pour une animation plus fluide
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Appliquer l'animation avec RAF pour de meilleures performances
  const startTime = performance.now();
  const endTime = startTime + duration + 500; // +500ms pour les retards
  let animFrameId = 0;
  
  function animateParticles(timestamp) {
    const elapsed = timestamp - startTime;
    const isComplete = elapsed >= endTime;
    
    if (!isComplete) {
      particles.forEach(particle => {
        try {
          const delay = parseFloat(particle.style.getPropertyValue('--delay'));
          const particleDuration = parseFloat(particle.style.getPropertyValue('--duration'));
          const particleElapsed = elapsed - delay;
          
          if (particleElapsed > 0) {
            // Calculer progression avec easing pour un mouvement plus fluide
            const progress = Math.min(1, particleElapsed / particleDuration);
            const easeProgress = easeInOutCubic(progress);
            
            const tx = parseFloat(particle.style.getPropertyValue('--tx'));
            const ty = parseFloat(particle.style.getPropertyValue('--ty'));
            
            // Animation graduelle pour une dispersion plus fluide
            particle.style.transform = `translate(
              ${tx * easeProgress}px, 
              ${ty * easeProgress}px
            ) scale(${Math.max(0.2, 1 - easeProgress * 0.8)})`;
            
            // Opacité qui baisse progressivement avec easing
            particle.style.opacity = `${Math.max(0, 1 - easeProgress * 0.9)}`;
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
    
    // Supprimer progressivement le conteneur de particules
    particleContainer.style.transition = 'opacity 300ms ease-out';
    particleContainer.style.opacity = '0';
    
    // Restaurer l'image d'origine uniquement si l'on est sur la page qui l'a déclenchée
    // (Sur la page d'accueil, on veut remettre l'opacité)
    if (window.location.pathname === '/') {
      imageElement.style.transition = 'opacity 300ms ease-in';
      imageElement.style.opacity = originalOpacity || '1';
    }
    
    // Attendre que la transition de disparition soit terminée avant de supprimer
    setTimeout(() => {
      particleContainer.remove();
      onComplete();
    }, 300);
  }
  
  animFrameId = requestAnimationFrame(animateParticles);
  
  return {
    cancel: cleanup
  };
}
