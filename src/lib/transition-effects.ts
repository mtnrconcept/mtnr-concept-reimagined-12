
/**
 * Crée un effet de particules sur chaque élément de la page qui disparaît
 * @param container L'élément DOM contenant la page qui va disparaître
 */
export function createParticleEffect(container: HTMLElement | null) {
  if (!container) return;
  
  // Trouver tous les éléments visibles à l'intérieur du conteneur
  const elements = Array.from(container.querySelectorAll('*')).filter(el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 10 && 
           rect.height > 10 && 
           style.display !== 'none' && 
           style.visibility !== 'hidden' &&
           style.opacity !== '0';
  });
  
  // Limiter le nombre d'éléments pour éviter les problèmes de performance
  const targetElements = elements.slice(0, 30);
  
  // Conteneur principal pour toutes les particules
  const particleContainer = document.createElement('div');
  particleContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(particleContainer);
  
  // Traiter chaque élément
  targetElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    
    // Si l'élément est trop petit, on l'ignore
    if (rect.width < 20 || rect.height < 20) return;
    
    // Le nombre de particules dépend de la taille de l'élément
    const area = rect.width * rect.height;
    const particleCount = Math.min(300, Math.floor(area / 250));
    
    // Essayer de capturer une image de l'élément pour les particules
    let elementImage = null;
    try {
      // Utiliser html2canvas si disponible (non inclus dans ce code)
      // Dans cette version simplifiée, on utilisera des particules de couleurs
    } catch (e) {
      console.error("Erreur lors de la capture de l'élément:", e);
    }
    
    // Créer un groupe de particules pour cet élément
    const elementContainer = document.createElement('div');
    elementContainer.style.position = 'absolute';
    elementContainer.style.left = rect.left + 'px';
    elementContainer.style.top = rect.top + 'px';
    elementContainer.style.width = rect.width + 'px';
    elementContainer.style.height = rect.height + 'px';
    elementContainer.style.overflow = 'visible';
    elementContainer.style.zIndex = '9999';
    particleContainer.appendChild(elementContainer);
    
    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Position aléatoire à l'intérieur de l'élément
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      
      // Taille aléatoire entre 1 et 5 pixels
      const size = 1 + Math.random() * 4;
      
      // Essayer d'extraire la couleur de l'élément ou utiliser une couleur du thème
      let color;
      try {
        const computedStyle = window.getComputedStyle(element as Element);
        color = computedStyle.color || computedStyle.backgroundColor;
        
        // Si la couleur est transparente ou non définie, utiliser le jaune (thème)
        if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
          color = Math.random() > 0.3 ? '#FFD700' : '#FFF';
        }
      } catch (e) {
        color = Math.random() > 0.3 ? '#FFD700' : '#FFF'; // Jaune ou blanc par défaut
      }
      
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
      const speed = 1 + Math.random() * 5;
      const lifetime = 3000 + Math.random() * 1000; // 3-4 secondes
      const startTime = performance.now();
      
      elementContainer.appendChild(particle);
      
      // Animer la particule
      function animateParticle() {
        const elapsed = performance.now() - startTime;
        const progress = elapsed / lifetime;
        
        if (progress >= 1) {
          particle.remove();
          return;
        }
        
        // Formules avancées pour un mouvement plus organique
        const easeOutQuint = 1 - Math.pow(1 - progress, 5);
        const translateX = Math.cos(angle) * speed * elapsed * 0.1 * easeOutQuint;
        const translateY = Math.sin(angle) * speed * elapsed * 0.1 * easeOutQuint - 
                           (progress * progress * 25); // Ajout d'un effet de gravité
        
        // Ajouter une légère rotation
        const rotate = (progress * 720 * (Math.random() > 0.5 ? 1 : -1)) % 360;
        
        // Scale qui diminue progressivement
        const scale = Math.max(0, 1 - progress * 1.2);
        
        // Opacité qui diminue vers la fin
        const opacity = Math.max(0, 1 - Math.pow(progress, 2));
        
        // Appliquer les transformations
        particle.style.transform = `translate3D(${translateX}px, ${translateY}px, 0) 
                                   rotate(${rotate}deg) scale(${scale})`;
        particle.style.opacity = opacity.toString();
        
        requestAnimationFrame(animateParticle);
      }
      
      requestAnimationFrame(animateParticle);
    }
  });
  
  // Nettoyer après l'animation
  setTimeout(() => {
    particleContainer.remove();
  }, 4500); // Un peu plus que la durée de vie max des particules
  
  // Cacher le conteneur original après un court délai
  setTimeout(() => {
    if (container) {
      container.style.opacity = '0';
    }
  }, 100);
}

/**
 * Crée un effet de fumée sur un élément qui apparaît
 * @param element L'élément DOM qui apparaît
 */
export function createSmokeEffect(element: HTMLElement | null) {
  if (!element) return;
  
  // Conteneur pour l'effet de fumée
  const smokeContainer = document.createElement('div');
  smokeContainer.className = 'fixed inset-0 pointer-events-none z-40 overflow-hidden';
  document.body.appendChild(smokeContainer);
  
  // Obtenir la position et dimensions de l'élément
  const rect = element.getBoundingClientRect();
  
  // Créer plusieurs nuages de fumée à différentes positions
  const smokeCount = 25; // Augmenter pour plus de densité
  const smokeDuration = 3500; // 3.5 secondes
  
  for (let i = 0; i < smokeCount; i++) {
    const smoke = document.createElement('div');
    
    // Position calculée pour couvrir l'élément de manière plus uniforme
    const gridCols = Math.ceil(Math.sqrt(smokeCount));
    const gridIndex = i % gridCols;
    const gridRow = Math.floor(i / gridCols);
    
    const cellWidth = rect.width / gridCols;
    const cellHeight = rect.height / gridCols;
    
    // Position avec un peu de randomisation pour l'aspect naturel
    const x = rect.left + (gridIndex * cellWidth) + (Math.random() * cellWidth * 0.8 - cellWidth * 0.4);
    const y = rect.top + (gridRow * cellHeight) + (Math.random() * cellHeight * 0.8 - cellHeight * 0.4);
    
    // Taille variable selon la position (plus gros au centre)
    const distanceFromCenter = Math.sqrt(
      Math.pow((x - (rect.left + rect.width/2)) / (rect.width/2), 2) + 
      Math.pow((y - (rect.top + rect.height/2)) / (rect.height/2), 2)
    );
    const sizeMultiplier = 1 - Math.min(0.6, distanceFromCenter * 0.6);
    const size = (40 + Math.random() * 80) * sizeMultiplier;
    
    smoke.style.position = 'absolute';
    smoke.style.left = `${x}px`;
    smoke.style.top = `${y}px`;
    smoke.style.width = `${size}px`;
    smoke.style.height = `${size}px`;
    smoke.style.borderRadius = '50%';
    
    // Déterminer la couleur (principalement jaune/blanc mais avec opacité variable)
    const useYellow = Math.random() > 0.3;
    const color = useYellow ? 
      `rgba(255, 215, 0, ${0.05 + Math.random() * 0.2})` : 
      `rgba(255, 255, 255, ${0.05 + Math.random() * 0.15})`;
    
    smoke.style.background = `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`;
    smoke.style.opacity = '0';
    smoke.style.filter = 'blur(8px)';
    smoke.style.transform = 'scale(0.6)';
    smoke.style.willChange = 'transform, opacity';
    
    // Délai variable pour que les particules n'apparaissent pas toutes en même temps
    const delay = Math.random() * 600;
    const duration = smokeDuration - delay;
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
      
      // Animation avec une courbe d'entrée/sortie plus douce
      let opacity;
      if (progress < 0.4) {
        // Entrée plus progressive
        opacity = progress / 0.4;
      } else {
        // Sortie plus lente
        opacity = 1 - ((progress - 0.4) / 0.6);
      }
      
      // Ajout d'un mouvement flottant
      const floatX = Math.sin(progress * Math.PI * 2) * 5;
      const floatY = Math.cos(progress * Math.PI * 3) * 3;
      
      // Scale qui augmente puis se stabilise
      const scale = 0.6 + (progress < 0.7 ? progress * 0.8 : 0.56);
      
      // Flou qui diminue progressivement
      const blur = Math.max(0, 8 - progress * 5);
      
      // Appliquer les transformations
      smoke.style.opacity = (opacity * opacity * opacity).toString(); // Cubic easing
      smoke.style.transform = `scale(${scale}) translate(${floatX}px, ${floatY}px)`;
      smoke.style.filter = `blur(${blur}px)`;
      
      requestAnimationFrame(animateSmoke);
    }
    
    requestAnimationFrame(animateSmoke);
  }
  
  // Faire apparaître progressivement l'élément
  if (element) {
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.transition = 'opacity 1s ease-in';
      element.style.opacity = '1';
    }, 800); // Commencer à apparaître après que la fumée soit visible
  }
  
  // Nettoyer après l'animation
  setTimeout(() => {
    smokeContainer.remove();
  }, smokeDuration + 1000); // Un peu plus que la durée max pour s'assurer que tout est terminé
}
