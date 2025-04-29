
import * as THREE from 'three';

interface ThreeRootParams {
  antialias?: boolean;
  fov?: number;
  zNear?: number;
  zFar?: number;
  createCameraControls?: boolean;
}

export function createLogo3DDisperseEffect(
  targetElement: HTMLElement,
  options: {
    duration?: number;
    colorPalette?: string[];
    onComplete?: () => void;
    logoSrc?: string;
  } = {}
) {
  const {
    duration = 3000,
    colorPalette = ['#FFD700', '#222222', '#FFFFFF'],
    onComplete = () => {},
    logoSrc
  } = options;

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
  const camera = new THREE.PerspectiveCamera(60, targetElement.clientWidth / targetElement.clientHeight, 1, 10000);
  camera.position.set(0, 0, 400);

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(targetElement.clientWidth, targetElement.clientHeight);
  container.appendChild(renderer.domElement);

  // Charger la texture du logo
  const textureLoader = new THREE.TextureLoader();
  const texture = logoSrc 
    ? textureLoader.load(logoSrc) 
    : textureLoader.load('/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png');

  // Créer la grille de particules qui représenteront le logo
  const particleCount = 2000;
  const particleSize = 2;
  const logoAspectRatio = targetElement.clientWidth / targetElement.clientHeight;
  const logoWidth = 200;
  const logoHeight = logoWidth / logoAspectRatio;

  // Créer la géométrie et le matériau pour les particules
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const endPositions = new Float32Array(particleCount * 3);
  const delays = new Float32Array(particleCount);
  
  // Convertir les couleurs hexadécimales en RGB pour Three.js
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };
  
  const paletteRgb = colorPalette.map(hexToRgb);
  
  // Générer des positions initiales pour les particules basées sur une grille
  for (let i = 0; i < particleCount; i++) {
    // Position initiale sur une grille représentant le logo
    const x = (Math.random() - 0.5) * logoWidth;
    const y = (Math.random() - 0.5) * logoHeight;
    const z = 0;
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    // Position finale aléatoire (pour la dispersion)
    const angle = Math.random() * Math.PI * 2;
    const radius = 50 + Math.random() * 300;
    
    endPositions[i * 3] = x + Math.cos(angle) * radius;
    endPositions[i * 3 + 1] = y + Math.sin(angle) * radius;
    endPositions[i * 3 + 2] = z + (Math.random() - 0.5) * 300;
    
    // Couleur aléatoire du palette
    const colorIndex = Math.floor(Math.random() * paletteRgb.length);
    colors[i * 3] = paletteRgb[colorIndex][0];
    colors[i * 3 + 1] = paletteRgb[colorIndex][1];
    colors[i * 3 + 2] = paletteRgb[colorIndex][2];
    
    // Taille de particule avec variation
    sizes[i] = particleSize * (0.5 + Math.random());
    
    // Délai aléatoire pour l'animation (pour que toutes les particules ne bougent pas en même temps)
    delays[i] = Math.random() * 0.5;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Créer le shader pour les particules
  const particleShader = {
    vertexShader: `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      uniform float uTime;
      uniform float uDuration;
      attribute float delay;
      
      // Position finale pour la dispersion
      attribute vec3 endPosition;
      
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
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform sampler2D texture;
      
      void main() {
        // Créer un point rond avec un dégradé
        vec2 uv = gl_PointCoord.xy - 0.5;
        float distance = length(uv);
        float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
        
        gl_FragColor = vec4(vColor, alpha);
      }
    `
  };
  
  // Créer des attributs supplémentaires pour les positions finales et délais
  particles.setAttribute('endPosition', new THREE.BufferAttribute(endPositions, 3));
  particles.setAttribute('delay', new THREE.BufferAttribute(delays, 1));
  
  // Créer le matériau de particule avec les shaders
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDuration: { value: duration / 1000 },
      texture: { value: texture }
    },
    vertexShader: particleShader.vertexShader,
    fragmentShader: particleShader.fragmentShader,
    transparent: true,
    depthTest: false
  });
  
  // Créer le système de particules
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  
  // Cacher temporairement l'élément cible
  const originalDisplay = targetElement.style.display;
  targetElement.style.opacity = '0';
  
  // Fonction d'animation
  const startTime = performance.now();
  const endTime = startTime + duration + 500; // +500ms pour terminer les animations décalées
  
  function animate(timestamp) {
    const elapsed = timestamp - startTime;
    const normalizedTime = Math.min(elapsed / duration, 1.0);
    
    particleMaterial.uniforms.uTime.value = elapsed / 1000; // Convertir en secondes pour le shader
    
    renderer.render(scene, camera);
    
    if (elapsed < endTime) {
      requestAnimationFrame(animate);
    } else {
      // Nettoyage
      container.remove();
      targetElement.style.opacity = '1';
      onComplete();
    }
  }
  
  requestAnimationFrame(animate);
  
  // Gérer le redimensionnement de la fenêtre
  function handleResize() {
    camera.aspect = targetElement.clientWidth / targetElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(targetElement.clientWidth, targetElement.clientHeight);
  }
  
  window.addEventListener('resize', handleResize);
  
  // Fonction de nettoyage
  return {
    cancel: () => {
      window.removeEventListener('resize', handleResize);
      container.remove();
      targetElement.style.opacity = originalDisplay;
    }
  };
}
