
import { useEffect, useRef } from "react";

interface UseNearbyUVElementsProps {
  isTorchActive: boolean;
  uvMode: boolean;
  mousePosition: { x: number; y: number };
}

export function useNearbyUVElements({
  isTorchActive,
  uvMode,
  mousePosition
}: UseNearbyUVElementsProps) {
  const processingBatchRef = useRef(false);
  
  useEffect(() => {
    // Don't process if conditions aren't met
    if (!uvMode || !isTorchActive) return;
    if (processingBatchRef.current) return;
    
    processingBatchRef.current = true;
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      // Process UV elements in batches to improve performance
      const uvElements = document.querySelectorAll('.uv-hidden-code, .uv-hidden-message, .uv-secret-message, .decrypt-message');
      const batchSize = 5;
      
      for (let i = 0; i < uvElements.length; i += batchSize) {
        const endIndex = Math.min(i + batchSize, uvElements.length);
        
        for (let j = i; j < endIndex; j++) {
          const el = uvElements[j];
          if (el instanceof HTMLElement) {
            // Calculate distance to element
            const rect = el.getBoundingClientRect();
            const dx = mousePosition.x - (rect.left + rect.width/2);
            const dy = mousePosition.y - (rect.top + rect.height/2);
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // Skip elements too far away for better performance
            if (distance > 300) continue;
            
            // Minimal manipulation to prevent performance issues
            // Force a repaint
            el.style.opacity = el.style.opacity;
            
            // Make element visible if close enough
            if (distance < 150) {
              el.classList.add('active');
            } else {
              el.classList.remove('active');
            }
          }
        }
      }
      
      processingBatchRef.current = false;
    });
  }, [mousePosition, isTorchActive, uvMode]);
}
