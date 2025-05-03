
import React from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UVTorchButtonProps {
  uvMode: boolean;
  onClick: () => void;
  isDisabled: boolean;
}

export const UVTorchButton: React.FC<UVTorchButtonProps> = ({ 
  uvMode, 
  onClick, 
  isDisabled 
}) => {
  return (
    <Button
      onClick={onClick}
      className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 relative ${
        uvMode
          ? "bg-blue-600 text-white shadow-blue-600/50"
          : "bg-gray-800 text-purple-400"
      }`}
      aria-label="Activer/désactiver le mode UV"
      variant="outline"
      size="icon"
      style={{ isolation: "isolate" }}
      disabled={isDisabled}
    >
      <Eye className={`w-6 h-6 ${uvMode ? 'animate-pulse' : ''}`} />
      
      {uvMode && (
        <>
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping scale-110"></span>
          <span className="absolute text-[8px] font-bold -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
            UV
          </span>
        </>
      )}
    </Button>
  );
};
