import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    // Particle settings
    let particles: Particle[] = [];
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 20)); // Responsive particle count
    const connectionDistance = Math.min(200, window.innerWidth / 6);
    const mouseRadius = 180;

    let mouse = {
      x: null as number | null,
      y: null as number | null,
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Smaller particles
        this.speedX = (Math.random() - 0.5) * 0.4; // Slower movement
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = '#ffd700';
        this.opacity = Math.random() * 0.5 + 0.2; // Varied opacity
      }

      update() {
        // Move particles
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary check with smoother edge handling
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX * 0.8; // Dampen the bounce a bit
          
          // Keep particles inside the canvas
          if (this.x < 0) this.x = 2;
          if (this.x > canvas.width) this.x = canvas.width - 2;
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY * 0.8;
          
          if (this.y < 0) this.y = 2;
          if (this.y > canvas.height) this.y = canvas.height - 2;
        }

        // Mouse repulsion - more subtle
        if (
          mouse.x !== null &&
          mouse.y !== null &&
          Math.hypot(this.x - mouse.x, this.y - mouse.y) < mouseRadius
        ) {
          const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
          const pushFactor = 0.15; // Less aggressive push
          this.speedX += Math.cos(angle) * pushFactor;
          this.speedY += Math.sin(angle) * pushFactor;
        }

        // Speed limit
        const maxSpeed = 0.8;
        if (Math.abs(this.speedX) > maxSpeed) {
          this.speedX = this.speedX > 0 ? maxSpeed : -maxSpeed;
        }
        if (Math.abs(this.speedY) > maxSpeed) {
          this.speedY = this.speedY > 0 ? maxSpeed : -maxSpeed;
        }
        
        // Add slight friction
        this.speedX *= 0.99;
        this.speedY *= 0.99;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connect() {
      if (!ctx) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Create more subtle connections
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.15})`;
            ctx.lineWidth = 0.6; // Thinner lines
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      connect();
      requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Event listeners
    window.addEventListener('resize', updateCanvasDimensions);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchend', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 bg-[#10101a]"
      style={{ pointerEvents: 'auto' }} // Allow interaction for better effect
    />
  );
}
