
/**
 * Logo dispersion effect implementation
 */
import { random } from '../utils';

export interface DisperseOptions {
  particleCount?: number;
  dispersionStrength?: number;
  duration?: number;
  colorPalette?: string[];
  onComplete?: () => void;
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
  console.log("🚀 Dispersion du logo en cours...");
  
  if (!imageElement || !imageElement.complete) {
    console.error("❌ Image non chargée, impossible de créer l'effet de dispersion");
    // Si l'image n'est pas chargée, appeler immédiatement onComplete et retourner
    if (options.onComplete) {
      setTimeout(options.onComplete, 10);
    }
    return { cancel: () => {} };
  }

  const {
    particleCount = 200,
    dispersionStrength = 2.2,
    duration = 1800,
    colorPalette = ['#FFD700', '#222222', '#FFFFFF'], // Jaune, noir, blanc
    onComplete = () => {}
  } = options;

  console.log(`✨ Création de l'effet avec ${particleCount} particules, force: ${dispersionStrength}, durée: ${duration}ms`);

  // Créer un canvas pour capturer l'image
  const canvas = document.createElement('canvas');
  const rect = imageElement.getBoundingClientRect();
  
  console.log(`📐 Dimensions du logo: ${rect.width}x${rect.height}`);
  
  // Dimensions du canvas
  const width = Math.max(rect.width, 100);
  const height = Math.max(rect.height, 100);
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error("❌ Impossible d'obtenir le contexte du canvas");
    // Si pas de contexte canvas, terminer rapidement
    if (onComplete) {
      setTimeout(onComplete, 10);
    }
    return { cancel: () => {} };
  }
  
  try {
    // Dessiner l'image sur le canvas
    ctx.drawImage(imageElement, 0, 0, width, height);
    console.log("✅ Image dessinée sur le canvas");
  } catch (error) {
    console.error("❌ Erreur lors du dessin de l'image:", error);
    if (onComplete) {
      setTimeout(onComplete, 10);
    }
    return { cancel: () => {} };
  }
  
  // Créer un conteneur pour les particules en position absolue
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  particleContainer.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
    overflow: visible;
  `;
  document.body.appendChild(particleContainer);
  console.log("✅ Conteneur de particules créé et ajouté au DOM");
  
  // Créer un clone visible du logo au centre de l'écran pour l'animation
  const logoClone = document.createElement('div');
  logoClone.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: ${width}px;
    height: ${height}px;
    z-index: 9998;
  `;
  particleContainer.appendChild(logoClone);
  
  // Échantillonner les pixels de l'image pour une meilleure couverture
  const targetParticleCount = Math.max(80, Math.min(Math.floor(particleCount), 220));
  const particleGap = Math.max(4, Math.floor(Math.sqrt((width * height) / targetParticleCount)));
  const particleSize = Math.max(2.5, Math.min(Math.floor(Math.sqrt(width * height) / 30), 4));
  
  console.log(`🔍 Taille des particules: ${particleSize}px, espace entre particules: ${particleGap}px`);
  
  const particles = [];
  const fragment = document.createDocumentFragment();

  let particleCount2D = 0;
  const maxParticles = targetParticleCount;

  // Échantillonner l'image de manière plus complète
  outer: for (let y = 0; y < height; y += particleGap) {
    for (let x = 0; x < width; x += particleGap) {
      // Limiter le nombre total de particules
      if (particleCount2D >= maxParticles) {
        break outer;
      }
      
      try {
        // Vérifier que le pixel est suffisamment opaque pour créer une particule
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const alpha = pixelData[3];
        
        if (alpha > 20) { // Seuil d'opacité plus bas pour capturer plus de pixels
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
          
          // Position centrée sur l'écran
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const offsetX = x - width / 2;
          const offsetY = y - height / 2;
          
          particle.className = 'logo-particle';
          particle.style.cssText = `
            position: absolute;
            left: ${centerX + offsetX}px;
            top: ${centerY + offsetY}px;
            width: ${finalSize}px;
            height: ${finalSize}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: ${random(0.7, 1)};
            transform: translate(0, 0) scale(1);
            will-change: transform, opacity;
            box-shadow: 0 0 ${finalSize * 0.5}px rgba(255, 215, 0, 0.3);
            --tx: ${Math.cos(angle) * distance}px;
            --ty: ${Math.sin(angle) * distance}px;
            --delay: ${delay}ms;
            --duration: ${duration}ms;
          `;
          
          fragment.appendChild(particle);
          particles.push(particle);
        }
      } catch (error) {
        console.error("❌ Erreur lors de l'échantillonnage de l'image:", error);
        // Continuer malgré l'erreur
      }
    }
  }
  
  console.log(`✅ ${particleCount2D} particules créées à partir de l'image`);
  
  // Si pas assez de particules ont été créées, ajouter des particules supplémentaires
  if (particleCount2D < maxParticles) {
    const remaining = maxParticles - particleCount2D;
    const additionalCount = Math.min(remaining, Math.max(0, Math.floor(maxParticles * 0.25)));

    if (additionalCount > 0) {
      console.log(`➕ Ajout de ${additionalCount} particules supplémentaires pour améliorer l'effet`);

      for (let i = 0; i < additionalCount; i++) {
        if (particleCount2D >= maxParticles) {
          break;
        }

        const x = (Math.random() - 0.5) * width;
        const y = (Math.random() - 0.5) * height;
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        const particle = document.createElement('div');
        const finalSize = random(particleSize * 0.5, particleSize * 1.5);
        const angle = Math.random() * Math.PI * 2;
        const distance = random(100, 600) * dispersionStrength;
        const delay = random(0, duration * 0.2);

        // Position centrée sur l'écran
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        particle.className = 'logo-particle';
        particle.style.cssText = `
          position: absolute;
          left: ${centerX + x}px;
          top: ${centerY + y}px;
          width: ${finalSize}px;
          height: ${finalSize}px;
          background-color: ${color};
          border-radius: 50%;
          opacity: ${random(0.7, 1)};
          transform: translate(0, 0) scale(1);
          will-change: transform, opacity;
          box-shadow: 0 0 ${finalSize * 0.5}px rgba(255, 215, 0, 0.3);
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
  }
  
  // Si aucune particule n'a été créée, terminer rapidement
  if (particles.length === 0) {
    console.error("❌ Aucune particule créée, annulation de l'effet");
    particleContainer.remove();
    if (onComplete) {
      setTimeout(onComplete, 10);
    }
    return { cancel: () => {} };
  }
  
  // Ajouter toutes les particules en une seule opération
  particleContainer.appendChild(fragment);
  console.log(`🎉 ${particles.length} particules ajoutées au DOM`);
  
  // Masquer l'image originale pendant l'animation
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
    
    console.log("✅ Animation terminée, nettoyage en cours");
    
    // Attendre que la transition de disparition soit terminée avant de supprimer
    setTimeout(() => {
      particleContainer.remove();
      onComplete();
      console.log("🏁 Effet de dispersion terminé, callback appelé");
    }, 300);
  }
  
  console.log("▶️ Démarrage de l'animation de particules");
  animFrameId = requestAnimationFrame(animateParticles);
  
  return {
    cancel: () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
      particleContainer.remove();
      console.log("⚠️ Animation de dispersion annulée manuellement");
    }
  };
}
