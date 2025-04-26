
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
  size?: number;
  glow?: string;
}

export const parallaxElements: ParallaxElementConfig[] = [
  // Background avec très lent déplacement
  { type: 'background', depth: 0.05, className: 'opacity-100' },
  
  // Couche éloignée (plus floue)
  { type: 'paint', x: 75, y: 15, depth: 0.2, scale: 2.5, rotation: -15, blur: 3,
    src: '/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png', className: 'splash-debug' },
  { type: 'paint', x: 10, y: 20, depth: 0.25, scale: 2.2, rotation: 25, blur: 2.5,
    src: '/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png', className: 'splash-debug' },
    
  // Couche intermédiaire
  { type: 'paint', x: 50, y: 30, depth: 0.3, scale: 2.0, rotation: 10, blur: 0,
    src: '/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png', className: 'splash-debug' },
  { type: 'paint', x: 30, y: 40, depth: 0.35, scale: 1.8, rotation: 5, blur: 0,
    src: '/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png', className: 'splash-debug' },

  // Couche centrale (nette)
  { type: 'paint', x: 70, y: 60, depth: 0.4, scale: 1.5, rotation: 10, blur: 0,
    src: '/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png', className: 'splash-debug' },
  { type: 'paint', x: 15, y: 65, depth: 0.45, scale: 1.4, rotation: -5, blur: 0,
    src: '/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png', className: 'splash-debug' },

  // Couche rapprochée 
  { type: 'paint', x: 80, y: 75, depth: 0.5, scale: 1.2, rotation: 20, blur: 0,
    src: '/lovable-uploads/abe06f9b-f700-4a49-a4d8-b4d68c473e70.png', className: 'splash-debug' },
  { type: 'paint', x: 25, y: 80, depth: 0.55, scale: 1.1, rotation: -15, blur: 0,
    src: '/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png', className: 'splash-debug' },
  
  // Ajout de deux splashes jaunes pour être sûr
  { type: 'paint', x: 60, y: 45, depth: 0.3, scale: 1.7, rotation: 0, blur: 0,
    src: '/lovable-uploads/c51ac031-c85b-42b2-8d7d-b14f16692636.png', className: 'splash-debug' },
  { type: 'paint', x: 40, y: 55, depth: 0.4, scale: 1.6, rotation: -10, blur: 0,
    src: '/lovable-uploads/7eefa948-da3a-4bfd-8b4b-e19299caaa22.png', className: 'splash-debug' }
];
