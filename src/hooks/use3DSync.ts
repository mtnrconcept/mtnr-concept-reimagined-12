
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, RefObject, useCallback } from "react";
import * as THREE from "three";

interface Use3DSyncOptions {
  enabled?: boolean;
  zOffset?: number;
}

export const use3DSync = (
  domRef: RefObject<HTMLElement>,
  options: Use3DSyncOptions = {}
) => {
  const { enabled = true, zOffset = 0 } = options;
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();

  const updateSync = useCallback(() => {
    if (!domRef.current || !meshRef.current || !enabled) return;

    const rect = domRef.current.getBoundingClientRect();

    // Convert DOM coordinates to normalized device coords [-1, 1]
    const xNDC = (rect.left + rect.width / 2) / size.width * 2 - 1;
    const yNDC = -((rect.top + rect.height / 2) / size.height) * 2 + 1;

    // Unproject to world coordinates
    const vector = new THREE.Vector3(xNDC, yNDC, zOffset);
    vector.unproject(camera);

    // Update position
    meshRef.current.position.set(vector.x, vector.y, zOffset);

    // Scale mesh to match DOM element size
    // Check if camera is PerspectiveCamera before accessing fov
    let frustumHeight: number;
    let frustumWidth: number;
    
    if (camera instanceof THREE.PerspectiveCamera) {
      frustumHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * Math.abs(camera.position.z - zOffset);
      frustumWidth = frustumHeight * (size.width / size.height);
    } else {
      // For OrthographicCamera or other camera types
      // Use a different approach to calculate frustum dimensions
      const cameraZ = Math.abs(camera.position.z - zOffset);
      frustumHeight = 2 * cameraZ;
      frustumWidth = frustumHeight * (size.width / size.height);
    }

    meshRef.current.scale.set(
      (rect.width / size.width) * frustumWidth,
      (rect.height / size.height) * frustumHeight,
      1
    );
  }, [camera, size, enabled, zOffset]);

  useFrame(updateSync);

  return { meshRef, updateSync };
};
