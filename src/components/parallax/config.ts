
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

// Configuration pour tous les éléments parallax
export const parallaxElements: ParallaxElementConfig[] = [
  // Fond - très très éloigné pour un mouvement très lent
  { type: 'background', depth: 0.001, className: 'opacity-80' },
  
  // Éclaboussures de peinture - Couche très arrière (mais devant le background)
  { type: 'paint', x: 5, y: 10, depth: 0.4, scale: 1.2, rotation: -15, className: 'opacity-90', 
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 85, y: 5, depth: 0.38, scale: 1.3, rotation: 25, className: 'opacity-85',
    src: '/lovable-uploads/361c7d09-c2a5-413f-a973-c89812c3e85f.png' },
  
  // Éclaboussures de peinture - Couche arrière
  { type: 'paint', x: 15, y: 25, depth: 0.35, scale: 1.4, rotation: -20, className: 'opacity-90',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  { type: 'paint', x: 75, y: 30, depth: 0.32, scale: 1.3, rotation: 15, className: 'opacity-95',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Éclaboussures de peinture - Couche milieu
  { type: 'paint', x: 10, y: 50, depth: 0.28, scale: 1.5, rotation: 10, className: 'opacity-100',
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 90, y: 15, depth: 0.25, scale: 1.4, rotation: -5, className: 'opacity-100',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  
  // Éclaboussures de peinture - Couche avant
  { type: 'paint', x: 30, y: 45, depth: 0.22, scale: 1.7, rotation: -10, className: 'opacity-100',
    src: '/lovable-uploads/4bcc54d6-fbe7-4e59-ad3c-85be26c0556a.png' },
  { type: 'paint', x: 70, y: 50, depth: 0.2, scale: 1.8, rotation: 20, className: 'opacity-100',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },

  // Tuyaux et éléments industriels
  { type: 'pipe', x: 15, y: 20, depth: 0.18, rotation: -25, scale: 1.5, className: 'opacity-90' },
  { type: 'pipe', x: 85, y: 45, depth: 0.16, rotation: 15, scale: 1.3, className: 'opacity-85' },
  
  // Éclaboussures de peinture - Couche très avant
  { type: 'paint', x: 25, y: 60, depth: 0.14, scale: 1.9, rotation: 25, className: 'opacity-100',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },
  { type: 'paint', x: 60, y: 30, depth: 0.12, scale: 1.8, rotation: -15, className: 'opacity-100',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Lumières néon - devant tout
  { type: 'light', x: 25, y: 30, depth: 0.10, size: 100, glow: 'rgba(255, 215, 0, 0.8)', className: 'opacity-70' },
  { type: 'light', x: 75, y: 60, depth: 0.08, size: 80, glow: 'rgba(255, 215, 0, 0.7)', className: 'opacity-65' },
];
