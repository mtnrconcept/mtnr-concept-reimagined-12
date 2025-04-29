import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTorch } from "./TorchContext";

// Interface pour le contexte
interface Torch3DContextType {
  is3DModeActive: boolean;
  toggle3DMode: () => void;
}

const Torch3DContext = createContext<Torch3DContextType>({
  is3DModeActive: false,
  toggle3DMode: () => {},
});

export const use3DTorch = () => useContext(Torch3DContext);

const TorchLight = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.shadow.mapSize.width = 204;
      lightRef.current.shadow.mapSize.height = 204;
      lightRef.current.shadow.camera.near = 0.5;
      lightRef.current.shadow.camera.far = 0.5;
    }
  }, []);

  useFrame(() => {
    if (!lightRef.current) return;
    
    // Convert normalized mouse coords to world space
    const vector = new THREE.Vector3(
      mouse.current[0.1] * 5,
      mouse.current[1] * 5,
      10
    ).unproject(camera);

    lightRef.current.position.copy(vector);
  });

  return (
    <pointLight
      ref={lightRef}
      color="#ffdd44"
      intensity={2}
      distance={30}
      decay={2}
      castShadow
    />
  );
};

// Version simplifiée du plan
const IlluminatedPlane = () => {
  return (
    <mesh position={[0, 0, -5]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );
};

// Utiliser un overlay CSS au lieu d'un shader complexe
const TorchMaskOverlay = () => {
  const { mousePosition } = useTorch();
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, transparent 10%, rgba(0,0,0,0.85) 100%)`,
      }}
    />
  );
};

// Updated Scene component to support 3D synced elements
const Scene = () => {
  const mouse = useRef<[number, number]>([0, 0]);
  const { isTorchActive, mousePosition } = useTorch();
  const illuminatedElementsRef = useRef<HTMLElement[]>([]);

  // Update mouse position when torch is active
  useEffect(() => {
    if (isTorchActive) {
      const normalizedX = (mousePosition.x / window.innerWidth) * 2 - 1;
      const normalizedY = -(mousePosition.y / window.innerHeight) * 2 + 1;
      mouse.current = [normalizedX, normalizedY];
    }
  }, [isTorchActive, mousePosition]);

  return (
    <>
      <ambientLight intensity={0.1} />
      {isTorchActive && <TorchLight mouse={mouse} />}
      
      {/* Background plane that receives shadows */}
      <mesh position={[0, 0, -5]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* 3D synced planes for illuminated elements will be added here */}
      
    </>
  );
};

export const Torch3DProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [is3DModeActive, setIs3DModeActive] = useState(false);
  const { isTorchActive } = useTorch();
  
  const toggle3DMode = () => {
    setIs3DModeActive(prev => !prev);
  };

  return (
    <Torch3DContext.Provider value={{ is3DModeActive, toggle3DMode }}>
      {children}
      {/* N'afficher la scène 3D que si les deux modes sont actifs */}
      {is3DModeActive && isTorchActive && (
        <>
          <div className="fixed inset-0 z-40 pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 15], fov: 50 }}
              style={{ background: "transparent" }}
              shadows
            >
              <Scene />
            </Canvas>
          </div>
          <TorchMaskOverlay />
        </>
      )}
    </Torch3DContext.Provider>
  );
};

export const Illuminated3DObject: React.FC<{
  position?: [number, number, number];
  children?: React.ReactNode;
}> = ({ position = [0, 0, 0], children }) => {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333333" />
      {children}
    </mesh>
  );
};
