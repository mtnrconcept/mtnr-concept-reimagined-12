
/**
 * Crée un effet de particules sur un élément qui disparaît
 * @param element L'élément DOM qui va disparaître
 */
export function createParticleEffect(element: HTMLElement | null) {
  if (!element) return;
  
  // Obtenir la position et dimensions de l'élément
  const rect = element.getBoundingClientRect();
  const particleContainer = document.createElement('div');
  particleContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(particleContainer);
  
  // Le nombre de particules dépend de la taille de l'élément
  const particleCount = Math.min(100, Math.floor((rect.width * rect.height) / 1000));
  const particles: HTMLElement[] = [];
  
  // Créer les particules
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    
    // Position aléatoire à l'intérieur de l'élément
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    
    // Taille aléatoire
    const size = 2 + Math.random() * 4;
    
    // Extraire la couleur de l'élément ou utiliser le jaune (thème)
    const color = Math.random() > 0.5 ? '#FFD700' : '#FFF';
    
    particle.style.position = 'absolute';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.opacity = '1';
    particle.style.zIndex = '9999';
    particle.style.willChange = 'transform, opacity';
    
    // Animation avec requestAnimationFrame
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const lifetime = 1000 + Math.random() * 1000; // 1-2 secondes
    const startTime = performance.now();
    
    particles.push(particle);
    particleContainer.appendChild(particle);
    
    // Animer la particule
    function animateParticle() {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / lifetime;
      
      if (progress >= 1) {
        particle.remove();
        return;
      }
      
      const translateX = Math.cos(angle) * speed * elapsed * 0.05;
      const translateY = Math.sin(angle) * speed * elapsed * 0.05 - (progress * progress * 50); // Effet de gravité
      const scale = 1 - progress;
      
      particle.style.transform = `translate3D(${translateX}px, ${translateY}px, 0) scale(${scale})`;
      particle.style.opacity = (1 - progress).toString();
      
      requestAnimationFrame(animateParticle);
    }
    
    requestAnimationFrame(animateParticle);
  }
  
  // Nettoyer après l'animation
  setTimeout(() => {
    particleContainer.remove();
  }, 2000);
}

/**
 * Crée un effet de fumée sur un élément qui apparaît
 * @param element L'élément DOM qui apparaît
 */
export function createSmokeEffect(element: HTMLElement | null) {
  if (!element) return;
  
  const smokeContainer = document.createElement('div');
  smokeContainer.className = 'fixed inset-0 pointer-events-none z-40 overflow-hidden';
  document.body.appendChild(smokeContainer);
  
  // Créer plusieurs nuages de fumée
  const smokeCount = 8;
  
  for (let i = 0; i < smokeCount; i++) {
    const smoke = document.createElement('div');
    
    // Position semi-aléatoire autour de l'élément
    const rect = element.getBoundingClientRect();
    const x = rect.left + (Math.random() * rect.width * 0.8) - (rect.width * 0.4);
    const y = rect.top + (Math.random() * rect.height * 0.8) - (rect.height * 0.4);
    
    // Taille aléatoire
    const size = 50 + Math.random() * 100;
    
    smoke.style.position = 'absolute';
    smoke.style.left = `${x}px`;
    smoke.style.top = `${y}px`;
    smoke.style.width = `${size}px`;
    smoke.style.height = `${size}px`;
    smoke.style.borderRadius = '50%';
    smoke.style.background = `radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(0,0,0,0) 70%)`;
    smoke.style.opacity = '0';
    smoke.style.filter = 'blur(8px)';
    smoke.style.transform = 'scale(0.8)';
    smoke.style.willChange = 'transform, opacity';
    
    const delay = Math.random() * 400;
    const duration = 1200 + Math.random() * 800;
    const startTime = performance.now() + delay;
    
    smokeContainer.appendChild(smoke);
    
    // Animer la fumée
    function animateSmoke() {
      const now = performance.now();
      if (now < startTime) {
        requestAnimationFrame(animateSmoke);
        return;
      }
      
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      if (progress >= 1) {
        smoke.remove();
        return;
      }
      
      // Animation de l'entrée puis sortie progressive
      let opacity;
      if (progress < 0.3) {
        // Entrée
        opacity = progress / 0.3;
      } else {
        // Sortie
        opacity = 1 - ((progress - 0.3) / 0.7);
      }
      
      const scale = 0.8 + progress * 0.5;
      const blur = Math.max(0, 8 - progress * 4);
      
      smoke.style.opacity = opacity.toString();
      smoke.style.transform = `scale(${scale})`;
      smoke.style.filter = `blur(${blur}px)`;
      
      requestAnimationFrame(animateSmoke);
    }
    
    requestAnimationFrame(animateSmoke);
  }
  
  // Nettoyer après l'animation
  setTimeout(() => {
    smokeContainer.remove();
  }, 3000);
}
