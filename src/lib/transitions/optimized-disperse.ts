
/**
 * Version optimisée de l'effet de dispersion pour les transitions de pages
 */
import { random } from './utils';

interface OptimizedDisperseOptions {
  particleCount?: number;
  duration?: number;
  colorPalette?: string[];
  onComplete?: () => void;
}

/**
 * Crée un effet de dispersion optimisé avec image redimensionnée
 */
export function createOptimizedDisperseEffect(
  targetElement: HTMLElement,
  options: OptimizedDisperseOptions = {}
) {
  const {
    particleCount = 800,
    duration = 1200,
    colorPalette = ['#FFD700', '#222222', '#FFFFFF'],
    onComplete = () => {}
  } = options;

  // Créer un canvas pour le rendu optimisé
  const canvas = document.createElement('canvas');
  const rect = targetElement.getBoundingClientRect();
  
  // Limiter la taille pour de meilleures performances
  const maxSize = 300;
  const aspectRatio = rect.width / rect.height;
  
  // Garder les proportions tout en limitant la taille
  const width = aspectRatio >= 1 
    ? Math.min(rect.width, maxSize)
    : Math.min(rect.width, maxSize * aspectRatio);
    
  const height = aspectRatio >= 1
    ? Math.min(rect.height, maxSize / aspectRatio)
    : Math.min(rect.height, maxSize);
    
  canvas.width = width;
  canvas.height = height;
  
  // Dessiner l'élément cible à une taille réduite
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("Impossible d'obtenir le contexte canvas");
    onComplete();
    return { cancel: () => {} };
  }
  
  // Créer un conteneur pour les particules
  const particleContainer = document.createElement('div');
  particleContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    overflow: hidden;
  `;
  document.body.appendChild(particleContainer);
  
  // Créer les particules
  const particles = [];
  const fragment = document.createDocumentFragment();
  
  // Utiliser une grille régulière pour un meilleur rendu
  const gridSize = Math.ceil(Math.sqrt(particleCount));
  const cellWidth = width / gridSize;
  const cellHeight = height / gridSize;
  
  // Palette de couleurs améliorée
  const enhancedPalette = [
    ...colorPalette,
    ...(colorPalette.map(color => adjustColorBrightness(color, 1.2))), // Plus lumineux
    ...(colorPalette.map(color => adjustColorBrightness(color, 0.8))) // Plus sombre
  ];
  
  // Créer les particules en grille
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (particles.length >= particleCount) break;
      
      const particleX = (x + 0.5) * cellWidth;
      const particleY = (y + 0.5) * cellHeight;
      
      const particle = document.createElement('div');
      const particleSize = random(2, 5);
      const delay = random(0, duration * 0.2);
      const color = enhancedPalette[Math.floor(Math.random() * enhancedPalette.length)];
      
      // Calcul de la position finale (avec effet de dispersion)
      const angle = Math.random() * Math.PI * 2;
      const distance = random(100, window.innerWidth * 0.4);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      // Style initial
      particle.style.cssText = `
        position: absolute;
        left: ${particleX + (window.innerWidth - width) / 2}px;
        top: ${particleY + (window.innerHeight - height) / 2}px;
        width: ${particleSize}px;
        height: ${particleSize}px;
        background-color: ${color};
        border-radius: 50%;
        opacity: 1;
        transform: translate(0, 0) scale(1);
        will-change: transform, opacity;
        box-shadow: 0 0 ${particleSize * 2}px rgba(255,215,0,0.5);
        z-index: 1000;
      `;
      
      // Stocker les propriétés pour l'animation
      particle.dataset.tx = String(tx);
      particle.dataset.ty = String(ty);
      particle.dataset.delay = String(delay);
      particle.dataset.duration = String(duration);
      
      fragment.appendChild(particle);
      particles.push(particle);
    }
  }
  
  particleContainer.appendChild(fragment);
  
  // Fonction d'easing
  function easeOutQuint(t: number): number {
    return 1 - Math.pow(1 - t, 5);
  }
  
  // Animation avec requestAnimationFrame
  const startTime = performance.now();
  let animFrameId = 0;
  
  function animate(timestamp: number) {
    const elapsed = timestamp - startTime;
    let isComplete = true;
    
    particles.forEach(particle => {
      const delay = Number(particle.dataset.delay) || 0;
      const particleDuration = Number(particle.dataset.duration) || duration;
      const particleElapsed = elapsed - delay;
      
      if (particleElapsed <= 0) {
        isComplete = false;
        return;
      }
      
      const progress = Math.min(1, particleElapsed / particleDuration);
      
      if (progress < 1) {
        isComplete = false;
        
        const easedProgress = easeOutQuint(progress);
        const tx = Number(particle.dataset.tx) || 0;
        const ty = Number(particle.dataset.ty) || 0;
        
        // Animer la position et l'opacité
        particle.style.transform = `translate(
          ${tx * easedProgress}px,
          ${ty * easedProgress}px
        ) scale(${1 - progress * 0.5})`;
        particle.style.opacity = String(1 - easedProgress * 0.9);
      } else {
        particle.style.opacity = '0';
      }
    });
    
    if (isComplete) {
      // Animation terminée
      cleanup();
    } else {
      animFrameId = requestAnimationFrame(animate);
    }
  }
  
  function cleanup() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = 0;
    }
    
    // Supprimer le conteneur progressivement
    particleContainer.style.transition = 'opacity 300ms';
    particleContainer.style.opacity = '0';
    
    setTimeout(() => {
      particleContainer.remove();
      onComplete();
    }, 300);
  }
  
  // Démarrer l'animation
  animFrameId = requestAnimationFrame(animate);
  
  return {
    cancel: () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
      particleContainer.remove();
    }
  };
}

// Utilitaire pour ajuster la luminosité d'une couleur
function adjustColorBrightness(hexColor: string, factor: number): string {
  // Convertir hex en RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Ajuster la luminosité
  const adjustR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const adjustG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const adjustB = Math.min(255, Math.max(0, Math.round(b * factor)));
  
  // Reconvertir en hex
  return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
}
