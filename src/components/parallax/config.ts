
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

// Configuration for all parallax elements
export const parallaxElements: ParallaxElementConfig[] = [
  // Background layer - très très éloigné pour un mouvement très lent
  { type: 'background', depth: 0.01, className: 'opacity-90' },
  
  // Paint splashes - Far Back layer (mais devant le background)
  { type: 'paint', x: 5, y: 10, depth: 0.15, scale: 0.9, rotation: -15, className: 'opacity-70', 
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 85, y: 5, depth: 0.16, scale: 0.8, rotation: 25, className: 'opacity-65',
    src: '/lovable-uploads/361c7d09-c2a5-413f-a973-c89812c3e85f.png' },
  
  // Paint splashes - Back layer
  { type: 'paint', x: 15, y: 25, depth: 0.25, scale: 1.2, rotation: -20, className: 'opacity-80',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  { type: 'paint', x: 75, y: 30, depth: 0.28, scale: 0.9, rotation: 15, className: 'opacity-75',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Paint splashes - Middle layer
  { type: 'paint', x: 10, y: 50, depth: 0.35, scale: 1.1, rotation: 10, className: 'opacity-80',
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 90, y: 15, depth: 0.38, scale: 1.0, rotation: -5, className: 'opacity-85',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  
  // Paint splashes - Front layer
  { type: 'paint', x: 30, y: 45, depth: 0.45, scale: 1.5, rotation: -10, className: 'opacity-90',
    src: '/lovable-uploads/4bcc54d6-fbe7-4e59-ad3c-85be26c0556a.png' },
  { type: 'paint', x: 70, y: 50, depth: 0.5, scale: 1.4, rotation: 20, className: 'opacity-95',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },

  // Pipes and industrial elements
  { type: 'pipe', x: 15, y: 20, depth: 0.6, rotation: -25, scale: 1.2, className: 'opacity-80' },
  { type: 'pipe', x: 85, y: 45, depth: 0.65, rotation: 15, scale: 0.8, className: 'opacity-70' },
  
  // Paint splashes - Very Front layer
  { type: 'paint', x: 25, y: 60, depth: 0.7, scale: 1.3, rotation: 25, className: 'opacity-90',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },
  { type: 'paint', x: 60, y: 30, depth: 0.75, scale: 1.2, rotation: -15, className: 'opacity-85',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Neon lights - devant tout
  { type: 'light', x: 25, y: 30, depth: 0.8, size: 80, glow: 'rgba(255, 215, 0, 0.8)', className: 'opacity-60' },
  { type: 'light', x: 75, y: 60, depth: 0.85, size: 60, glow: 'rgba(255, 215, 0, 0.7)', className: 'opacity-50' },
];
