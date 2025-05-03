
import React, { useEffect } from "react";
import { useTorchToggle } from "@/hooks/useTorchToggle";
import { StandardTorchButton } from "./torch/StandardTorchButton";
import { UVTorchButton } from "./torch/UVTorchButton";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

export const TorchToggle = () => {
  const { isTorchActive } = useTorch();
  const { uvMode } = useUVMode();
  const { 
    isHandlingRef,
    handleToggleTorch, 
    handleToggleUV, 
    cleanup 
  } = useTorchToggle();

  // Clean up timeouts on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex gap-2">
      {/* Standard Torch Button */}
      <StandardTorchButton 
        isTorchActive={isTorchActive} 
        onClick={handleToggleTorch} 
        isDisabled={isHandlingRef.current} 
      />

      {/* UV Button */}
      <UVTorchButton 
        uvMode={uvMode} 
        onClick={handleToggleUV} 
        isDisabled={(!isTorchActive && uvMode) || isHandlingRef.current} 
      />
    </div>
  );
};
