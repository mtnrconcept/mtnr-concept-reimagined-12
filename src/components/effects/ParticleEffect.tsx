
import { useEffect, useRef } from 'react';

export const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 200; // Nombre de particules
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor() {
        // Distribution complètement aléatoire sur tout l'espace du canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '#FFF' : '#FFD700';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Lorsqu'une particule sort de l'écran, on la replace aléatoirement ailleurs sur le canvas
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          // Repositionner la particule à un emplacement aléatoire sur tout le canvas
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          
          // On peut aussi légèrement modifier sa vitesse pour plus de dynamisme
          this.speedX = (Math.random() - 0.5) * 0.5;
          this.speedY = (Math.random() - 0.5) * 0.5;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    // Création des particules distribuées uniformément sur tout l'écran
    const initParticles = () => {
      particles.length = 0; // Vider le tableau avant de le remplir
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Réinitialiser les particules quand le canvas change de taille
      initParticles();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.8 }}
    />
  );
};
