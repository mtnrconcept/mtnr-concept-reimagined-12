
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TVPaginationProps {
  totalVideos: number;
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export function TVPaginationControls({
  totalVideos,
  currentIndex,
  onPrevious,
  onNext,
  onSelect
}: TVPaginationProps) {
  const isMobile = useIsMobile();
  const [visiblePages, setVisiblePages] = useState(5);
  
  // Ajuster dynamiquement le nombre de pages visibles en fonction de la taille d'écran
  useEffect(() => {
    function updateVisiblePages() {
      if (window.innerWidth < 400) {
        setVisiblePages(3);
      } else if (window.innerWidth < 640) {
        setVisiblePages(5);
      } else {
        setVisiblePages(7);
      }
    }
    
    updateVisiblePages();
    window.addEventListener('resize', updateVisiblePages);
    return () => window.removeEventListener('resize', updateVisiblePages);
  }, []);
  
  // Calculer quels indices afficher
  const calculateVisibleIndices = () => {
    // Si on a moins de vidéos que la limite, on affiche tout
    if (totalVideos <= visiblePages) {
      return Array.from({ length: totalVideos }, (_, i) => i);
    }
    
    // Sinon, on calcule un range centré autour de l'index actuel
    const halfVisible = Math.floor(visiblePages / 2);
    let start = currentIndex - halfVisible;
    let end = currentIndex + halfVisible;
    
    // Ajuster si on dépasse les limites
    if (start < 0) {
      end = Math.min(end - start, totalVideos - 1); // Ne pas dépasser le total
      start = 0;
    }
    
    if (end >= totalVideos) {
      start = Math.max(0, start - (end - totalVideos + 1));
      end = totalVideos - 1;
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  
  const visibleIndices = calculateVisibleIndices();
  
  return (
    <div className="w-full px-2">
      <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevious}
          className="bg-yellow-900/30 hover:bg-yellow-900/50 border-yellow-600/30"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sr-only">Vidéo précédente</span>
        </Button>
        
        <div className="hidden xs:flex gap-1 sm:gap-2 flex-wrap justify-center">
          {visibleIndices.map(index => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                "w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs sm:text-sm transition-colors",
                index === currentIndex 
                  ? "bg-yellow-600/40 text-white border border-yellow-500" 
                  : "bg-yellow-900/20 text-gray-300 border border-yellow-500/30 hover:bg-yellow-600/20"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNext}
          className="bg-yellow-900/30 hover:bg-yellow-900/50 border-yellow-600/30"
        >
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sr-only">Vidéo suivante</span>
        </Button>
      </div>
      
      <div className="text-center text-xs sm:text-sm text-gray-400">
        {currentIndex + 1} / {totalVideos}
      </div>
    </div>
  );
}
