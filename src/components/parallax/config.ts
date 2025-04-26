
export interface ParallaxElementConfig {
  type: 'background' | 'paint' | 'pipe' | 'light' | 'vent';
  x?: number;
  y?: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src?: string;
  size?: number;
  glow?: string;
}

export const parallaxElements: ParallaxElementConfig[] = [
  // Background avec très lent déplacement
  { type: 'background', depth: 0.05, className: 'opacity-100' },
  
  // Paint splashes - Des profondeurs Z différentes pour créer plusieurs niveaux
  { type: 'paint', x: 10, y: 15, depth: 0.15, scale: 2.0, rotation: -15, className: 'opacity-85', 
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 80, y: 20, depth: 0.2, scale: 2.2, rotation: 25, className: 'opacity-90',
    src: '/lovable-uploads/361c7d09-c2a5-413f-a973-c89812c3e85f.png' },
  
  // Éléments intermédiaires avec des profondeurs différentes
  { type: 'paint', x: 5, y: 60, depth: 0.25, scale: 1.8, rotation: -20, className: 'opacity-95',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  { type: 'paint', x: 85, y: 65, depth: 0.3, scale: 1.9, rotation: 15, className: 'opacity-85',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Éléments en premier plan (plus proche de la caméra)
  { type: 'paint', x: 15, y: 80, depth: 0.35, scale: 1.5, rotation: 10, className: 'opacity-90',
    src: '/lovable-uploads/4bcc54d2-e89d-4f31-972c-42da68f93fc4.png' },
  { type: 'paint', x: 75, y: 85, depth: 0.4, scale: 1.4, rotation: -5, className: 'opacity-95',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },
];
