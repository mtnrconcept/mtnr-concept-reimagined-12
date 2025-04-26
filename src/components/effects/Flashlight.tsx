
import { useState, useEffect, useRef } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import * as PIXI from 'pixi.js';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const shadowsRef = useRef<PIXI.Graphics[]>([]);
  const lightRef = useRef<PIXI.Graphics | null>(null);

  useEffect(() => {
    if (!containerRef.current || !isEnabled) return;

    // Initialize PIXI Application
    const app = new PIXI.Application({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: true,
    });
    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Create light source
    const light = new PIXI.Graphics();
    light.beginFill(0xffdd00, 0.15);
    light.drawCircle(0, 0, 400);
    light.endFill();
    app.stage.addChild(light);
    lightRef.current = light;

    // Get all elements that should cast shadows
    const elements = document.querySelectorAll('[data-cast-shadow="true"]');
    
    // Create shadows for each element
    shadowsRef.current = Array.from(elements).map(() => {
      const shadow = new PIXI.Graphics();
      app.stage.addChild(shadow);
      return shadow;
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });
      
      // Update light position
      if (lightRef.current) {
        lightRef.current.x = x;
        lightRef.current.y = y + window.scrollY;
      }

      // Update shadows
      elements.forEach((element, i) => {
        const shadow = shadowsRef.current[i];
        if (!shadow) return;

        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY;
        
        // Calculate shadow parameters
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + scrollTop + rect.height / 2;
        const dx = elementCenterX - x;
        const dy = (elementCenterY - scrollTop) - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const normX = dx / dist;
        const normY = dy / dist;
        
        // Dynamic shadow length based on distance
        const shadowLength = Math.min(500, dist * 0.8);
        const shadowOpacity = Math.max(0.1, Math.min(0.4, 1 - (dist / 1000)));

        // Draw shadow
        shadow.clear();
        shadow.beginFill(0x000000, shadowOpacity);
        shadow.moveTo(rect.left, rect.top + scrollTop);
        shadow.lineTo(rect.left + rect.width, rect.top + scrollTop);
        shadow.lineTo(
          rect.left + rect.width + normX * shadowLength,
          rect.top + scrollTop + normY * shadowLength
        );
        shadow.lineTo(
          rect.left + normX * shadowLength,
          rect.top + scrollTop + normY * shadowLength
        );
        shadow.closePath();
        shadow.endFill();
      });
    };

    // Add shadow-casting elements
    document.querySelectorAll('section, .card, .btn, h1, h2, p, img, button, .parallax-element').forEach(el => {
      el.setAttribute('data-cast-shadow', 'true');
    });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleMouseMove);
      document.querySelectorAll('[data-cast-shadow="true"]').forEach(el => {
        el.removeAttribute('data-cast-shadow');
      });
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        if (containerRef.current?.firstChild) {
          containerRef.current.removeChild(appRef.current.view as HTMLCanvasElement);
        }
      }
    };
  }, [isEnabled]);

  return (
    <>
      <Toggle 
        className="fixed right-4 top-24 z-[9999] bg-black/20 hover:bg-black/40"
        pressed={isEnabled}
        onPressedChange={setIsEnabled}
      >
        {isEnabled ? (
          <FlashlightIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <FlashlightOff className="h-5 w-5 text-yellow-400" />
        )}
      </Toggle>

      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 15,
          opacity: isEnabled ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {isEnabled && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-[20] w-full"
          style={{
            height: `${document.documentElement.scrollHeight}px`,
            maskImage: `radial-gradient(circle 600px at ${position.x}px ${position.y}px, transparent, black)`,
            WebkitMaskImage: `radial-gradient(circle 600px at ${position.x}px ${position.y}px, transparent, black)`,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(2px)',
            isolation: 'isolate',
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              left: position.x,
              top: position.y,
              width: '1200px',
              height: '1200px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 221, 0, 0.2) 0%, rgba(255, 221, 0, 0.1) 30%, transparent 70%)',
              filter: 'blur(40px)',
              mixBlendMode: 'soft-light',
            }}
          />
        </div>
      )}
    </>
  );
};
