
import * as THREE from 'three';

// Types et interfaces pour améliorer la clarté
interface DisperseEffectOptions {
  duration?: number;
  colorPalette?: string[];
  onComplete?: () => void;
  logoSrc?: string;
}

interface ParticleSystem {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Points;
}

interface ThreeContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: HTMLDivElement;
}

/**
 * Crée et applique un effet de dispersion 3D sur un élément logo
 */
export function createLogo3DDisperseEffect(
  targetElement: HTMLElement,
  options: DisperseEffectOptions = {}
) {
  const {
    duration = 3000,
    colorPalette = ['#FFD700', '#222222', '#FFFFFF'],
    onComplete = () => {},
    logoSrc
  } = options;

  // Créer le contexte Three.js
  const threeContext = createThreeContext(targetElement);
  
  // Charger la texture du logo
  const texture = loadLogoTexture(logoSrc);
  
  // Créer le système de particules
  const particleSystem = createParticleSystem(targetElement, colorPalette, duration);
  
  // Ajouter le système de particules à la scène
  threeContext.scene.add(particleSystem.mesh);

  // Cacher temporairement l'élément cible
  const originalDisplay = targetElement.style.display;
  targetElement.style.opacity = '0';
  
  // Lancer l'animation
  const { cleanupAnimation } = animateParticles(
    particleSystem.material, 
    threeContext, 
    duration, 
    () => {
      // Nettoyage après animation
      threeContext.container.remove();
      targetElement.style.opacity = '1';
      onComplete();
    }
  );
  
  // Gérer le redimensionnement de la fenêtre
  const handleResize = createResizeHandler(targetElement, threeContext);
  window.addEventListener('resize', handleResize);
  
  // Fonction de nettoyage
  return {
    cancel: () => {
      window.removeEventListener('resize', handleResize);
      cleanupAnimation();
      threeContext.container.remove();
      targetElement.style.opacity = originalDisplay;
    }
  };
}

/**
 * Crée le contexte Three.js (scène, caméra, renderer, container)
 */
function createThreeContext(targetElement: HTMLElement): ThreeContext {
  // Créer un conteneur pour notre animation Three.js
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 100;
  `;
  targetElement.parentNode?.appendChild(container);

  // Configuration de base Three.js
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60, 
    targetElement.clientWidth / targetElement.clientHeight, 
    1, 
    10000
  );
  camera.position.set(0, 0, 400);

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(targetElement.clientWidth, targetElement.clientHeight);
  container.appendChild(renderer.domElement);
  
  return { scene, camera, renderer, container };
}

/**
 * Charge la texture du logo
 */
function loadLogoTexture(logoSrc?: string): THREE.Texture {
  const textureLoader = new THREE.TextureLoader();
  return logoSrc 
    ? textureLoader.load(logoSrc) 
    : textureLoader.load('/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png');
}

/**
 * Convertit les couleurs hexadécimales en RGB pour Three.js
 */
function hexToRgb(hex: string): number[] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

/**
 * Crée le système de particules pour l'animation
 */
function createParticleSystem(
  targetElement: HTMLElement, 
  colorPalette: string[],
  duration: number
): ParticleSystem {
  const particleCount = 2000;
  const particleSize = 2;
  const logoAspectRatio = targetElement.clientWidth / targetElement.clientHeight;
  const logoWidth = 200;
  const logoHeight = logoWidth / logoAspectRatio;

  // Convertir les couleurs du palette en RGB
  const paletteRgb = colorPalette.map(hexToRgb);
  
  // Créer la géométrie et initialiser les attributs
  const { geometry, buffers } = createParticleGeometry(
    particleCount, 
    logoWidth, 
    logoHeight, 
    paletteRgb, 
    particleSize
  );
  
  // Créer le matériau avec shaders
  const material = createParticleMaterial(duration);
  
  // Créer le système de particules
  const mesh = new THREE.Points(geometry, material);
  
  return { geometry, material, mesh };
}

/**
 * Crée la géométrie des particules et initialise les buffer attributes
 */
function createParticleGeometry(
  particleCount: number,
  logoWidth: number,
  logoHeight: number,
  paletteRgb: number[][],
  particleSize: number
) {
  const geometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const endPositions = new Float32Array(particleCount * 3);
  const delays = new Float32Array(particleCount);
  
  // Initialiser les attributs de chaque particule
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position initiale sur une grille représentant le logo
    const x = (Math.random() - 0.5) * logoWidth;
    const y = (Math.random() - 0.5) * logoHeight;
    const z = 0;
    
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    
    // Position finale aléatoire (pour la dispersion)
    const angle = Math.random() * Math.PI * 2;
    const radius = 50 + Math.random() * 300;
    
    endPositions[i3] = x + Math.cos(angle) * radius;
    endPositions[i3 + 1] = y + Math.sin(angle) * radius;
    endPositions[i3 + 2] = z + (Math.random() - 0.5) * 300;
    
    // Couleur aléatoire de la palette
    const colorIndex = Math.floor(Math.random() * paletteRgb.length);
    colors[i3] = paletteRgb[colorIndex][0];
    colors[i3 + 1] = paletteRgb[colorIndex][1];
    colors[i3 + 2] = paletteRgb[colorIndex][2];
    
    // Taille de particule avec variation
    sizes[i] = particleSize * (0.5 + Math.random());
    
    // Délai aléatoire pour l'animation
    delays[i] = Math.random() * 0.5;
  }
  
  // Attacher les attributs à la géométrie
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('endPosition', new THREE.BufferAttribute(endPositions, 3));
  geometry.setAttribute('delay', new THREE.BufferAttribute(delays, 1));
  
  return { 
    geometry,
    buffers: { positions, colors, sizes, endPositions, delays }
  };
}

/**
 * Crée le matériau des particules avec les shaders
 */
function createParticleMaterial(duration: number): THREE.ShaderMaterial {
  // Définir les shaders
  const vertexShader = `
    attribute float size;
    attribute vec3 customColor;
    attribute vec3 endPosition;
    attribute float delay;
    
    varying vec3 vColor;
    
    uniform float uTime;
    uniform float uDuration;
    
    // Fonction d'easing cubique
    float easeOutCubic(float t) {
      return 1.0 - pow(1.0 - t, 3.0);
    }
    
    void main() {
      vColor = customColor;
      
      // Calculer la progression de l'animation avec délai
      float tProgress = clamp((uTime - delay) / uDuration, 0.0, 1.0);
      tProgress = easeOutCubic(tProgress);
      
      // Interpolation entre position initiale et finale
      vec3 newPosition = mix(position, endPosition, tProgress);
      
      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      gl_PointSize = size * (1.0 - 0.5 * tProgress) * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  const fragmentShader = `
    varying vec3 vColor;
    
    void main() {
      // Créer un point rond avec un dégradé
      vec2 uv = gl_PointCoord.xy - 0.5;
      float distance = length(uv);
      float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
      
      gl_FragColor = vec4(vColor, alpha);
    }
  `;
  
  // Créer le matériau avec les shaders et uniforms
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDuration: { value: duration / 1000 }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false
  });
}

/**
 * Gère l'animation des particules
 */
function animateParticles(
  material: THREE.ShaderMaterial, 
  threeContext: ThreeContext, 
  duration: number,
  onCompleteCallback: () => void
) {
  const startTime = performance.now();
  const endTime = startTime + duration + 500; // +500ms pour terminer les animations décalées
  
  let animationFrameId: number;
  
  function animate(timestamp: number) {
    const elapsed = timestamp - startTime;
    
    material.uniforms.uTime.value = elapsed / 1000; // Convertir en secondes pour le shader
    
    threeContext.renderer.render(threeContext.scene, threeContext.camera);
    
    if (elapsed < endTime) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      onCompleteCallback();
    }
  }
  
  animationFrameId = requestAnimationFrame(animate);
  
  return {
    cleanupAnimation: () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }
  };
}

/**
 * Crée un gestionnaire d'événement pour le redimensionnement
 */
function createResizeHandler(
  targetElement: HTMLElement, 
  threeContext: ThreeContext
): () => void {
  return () => {
    threeContext.camera.aspect = targetElement.clientWidth / targetElement.clientHeight;
    threeContext.camera.updateProjectionMatrix();
    threeContext.renderer.setSize(targetElement.clientWidth, targetElement.clientHeight);
  };
}
