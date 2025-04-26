
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
    src: '/lovable-uploads/59182713-1e99-4fd2-981f-7b161eb1b592.png', className: 'splash-debug' },
  { type: 'paint', x: 10, y: 20, depth: 0.25, scale: 2.2, rotation: 25, blur: 2.5,
    src: '/lovable-uploads/904b5527-89ec-4f8f-a08c-f47969a9ff4b.png', className: 'splash-debug' },
    
  // Ajout de taches de peinture supplémentaires avec des images que nous savons disponibles
  { type: 'paint', x: 50, y: 30, depth: 0.3, scale: 2.0, rotation: 10, blur: 0,
    src: '/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png', className: 'splash-debug' },
  { type: 'paint', x: 30, y: 40, depth: 0.35, scale: 1.8, rotation: 5, blur: 0,
    src: '/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png', className: 'splash-debug' },

  // Couche centrale (nette)
  { type: 'paint', x: 70, y: 60, depth: 0.4, scale: 1.5, rotation: 10, blur: 0,
    src: '/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png', className: 'splash-debug' },
  { type: 'paint', x: 15, y: 65, depth: 0.45, scale: 1.4, rotation: -5, blur: 0,
    src: '/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png', className: 'splash-debug' },

  // Couche rapprochée 
  { type: 'paint', x: 80, y: 75, depth: 0.5, scale: 1.2, rotation: 20, blur: 0,
    src: '/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png', className: 'splash-debug' },
  { type: 'paint', x: 25, y: 80, depth: 0.55, scale: 1.1, rotation: -15, blur: 0,
    src: '/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png', className: 'splash-debug' }
];
