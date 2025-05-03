
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Pour la version mobile, nous allons afficher juste quelques boutons
  const [visiblePages, setVisiblePages] = useState(5);
  
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
      end += Math.abs(start);
      start = 0;
    }
    
    if (end >= totalVideos) {
      start -= (end - totalVideos + 1);
      end = totalVideos - 1;
    }
    
    // S'assurer que start n'est pas négatif après ajustement
    start = Math.max(0, start);
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  
  const visibleIndices = calculateVisibleIndices();
  
  return (
    <div className="w-full">
      <div className="flex justify-center gap-4 mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevious}
          className="bg-yellow-900/30 hover:bg-yellow-900/50 border-yellow-600/30"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Vidéo précédente</span>
        </Button>
        
        <div className="hidden xs:flex gap-2">
          {visibleIndices.map(index => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center text-sm transition-colors",
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
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Vidéo suivante</span>
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-400">
        {currentIndex + 1} / {totalVideos}
      </div>
    </div>
  );
}
