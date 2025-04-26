
export interface ParallaxElementConfig {
  type: 'background' | 'paint' | 'pipe' | 'light' | 'vent';
  x?: number;
  y?: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src?: string;
  blur?: number;
  // Propriétés pour le composant Light
  size?: number;
  glow?: string;
}

export const parallaxElements: ParallaxElementConfig[] = [
  // Background avec très lent déplacement
  { type: 'background', depth: 0.05, className: 'opacity-100' },
  
  // Couche la plus éloignée (plus floue)
  { type: 'paint', x: 75, y: 15, depth: 0.2, scale: 2.5, rotation: -15, blur: 3,
    src: '/lovable-uploads/59182713-1e99-4fd2-981f-7b161eb1b592.png' },
  { type: 'paint', x: 10, y: 20, depth: 0.25, scale: 2.2, rotation: 25, blur: 2.5,
    src: '/lovable-uploads/904b5527-89ec-4f8f-a08c-f47969a9ff4b.png' },

  // Couche intermédiaire éloignée (légèrement floue)
  { type: 'paint', x: 85, y: 40, depth: 0.3, scale: 2.0, rotation: -20, blur: 2,
    src: '/lovable-uploads/731ffea8-c02a-4686-880b-ae867eeb3ba8.png' },
  { type: 'paint', x: 5, y: 45, depth: 0.35, scale: 1.8, rotation: 15, blur: 1.5,
    src: '/lovable-uploads/ea6c53cc-8a16-497f-807b-eff8ead36bff.png' },

  // Couche centrale (nette)
  { type: 'paint', x: 70, y: 60, depth: 0.4, scale: 1.5, rotation: 10, blur: 0,
    src: '/lovable-uploads/da96764e-ce92-44b2-96b9-a7d8b591d333.png' },
  { type: 'paint', x: 15, y: 65, depth: 0.45, scale: 1.4, rotation: -5, blur: 0,
    src: '/lovable-uploads/a44dc7bf-a9b3-42c5-bdfe-4444de4c7326.png' },

  // Couche rapprochée (légèrement floue)
  { type: 'paint', x: 80, y: 75, depth: 0.5, scale: 1.2, rotation: 20, blur: 1.5,
    src: '/lovable-uploads/dd43824e-52f1-4ade-8771-bc32971947f2.png' },
  { type: 'paint', x: 25, y: 80, depth: 0.55, scale: 1.1, rotation: -15, blur: 2,
    src: '/lovable-uploads/2765c033-9390-4304-a1b0-ed01a29a4d21.png' }
];
