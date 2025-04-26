
import { forwardRef } from "react";
import { use3DSync } from "@/hooks/use3DSync";
import * as THREE from "three";

interface SyncedPlaneProps {
  domRef: React.RefObject<HTMLElement>;
  color?: THREE.Color | string | number;
  zOffset?: number;
  opacity?: number;
}

export const SyncedPlane = forwardRef<THREE.Mesh, SyncedPlaneProps>(
  ({ domRef, color = "#ffdd44", zOffset = 0, opacity = 1 }, ref) => {
    const { meshRef } = use3DSync(domRef, { zOffset });

    return (
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color={color} 
          transparent={opacity < 1}
          opacity={opacity}
          side={2} // Both sides visible
        />
      </mesh>
    );
  }
);

SyncedPlane.displayName = "SyncedPlane";
