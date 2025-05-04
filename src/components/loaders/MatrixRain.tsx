
import React, { useEffect, useRef } from 'react';

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redimensionner le canvas pour qu'il prenne toute la taille de la fenêtre
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Appeler une fois au début et ajouter un listener pour le resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caractères pour l'effet Matrix (caractères japonais katakana et quelques chiffres)
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン1234567890';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,./<>?';
    
    // Combiner tous les caractères
    const chars = katakana + latin + nums + symbols;

    // Taille de la police pour les caractères
    const fontSize = 16;
    
    // Calculer le nombre de colonnes en fonction de la largeur du canvas et de la taille de la police
    const columns = Math.floor(canvas.width / fontSize);
    
    // Un tableau pour stocker la position Y de chaque colonne
    const drops: number[] = [];
    
    // Initialiser toutes les colonnes hors du canvas
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Fonction pour dessiner l'effet Matrix
    const draw = () => {
      // Fond semi-transparent pour créer l'effet de trace
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Couleur et police pour les caractères
      ctx.fillStyle = '#0F0'; // Vert Matrix classique
      ctx.font = `${fontSize}px monospace`;
      
      // Dessiner les caractères
      for (let i = 0; i < drops.length; i++) {
        // Caractère aléatoire à dessiner
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Position x (colonne * taille de police)
        const x = i * fontSize;
        
        // Position y (position actuelle de la goutte)
        const y = drops[i] * fontSize;
        
        // Dessiner le caractère
        ctx.fillText(char, x, y);
        
        // Réinitialiser après avoir atteint le bas du canvas avec une probabilité
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Faire "tomber" la goutte
        drops[i]++;
      }
    };

    // Animation frame
    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };

    // Démarrer l'animation
    animate();

    // Nettoyage lors du démontage
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ zIndex: 1 }}
    />
  );
};
