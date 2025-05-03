
import React from "react";
import { Flashlight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StandardTorchButtonProps {
  isTorchActive: boolean;
  onClick: () => void;
  isDisabled: boolean;
}

export const StandardTorchButton: React.FC<StandardTorchButtonProps> = ({ 
  isTorchActive, 
  onClick, 
  isDisabled 
}) => {
  return (
    <Button
      onClick={onClick}
      className={`p-3 rounded-full shadow-lg transition-all hover:scale-105 ${
        isTorchActive
          ? "bg-yellow-400 text-black shadow-yellow-400/50"
          : "bg-gray-800 text-yellow-400"
      }`}
      aria-label="Activer/désactiver la lampe torche"
      variant="outline"
      size="icon"
      style={{ isolation: "isolate" }}
      disabled={isDisabled}
    >
      <Flashlight className="w-6 h-6" />
    </Button>
  );
};
