
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
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

// Version simplifiée du composant TorchLight
const TorchLight = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const coneRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (lightRef.current) {
      // Configurer la lumière pour qu'elle projette correctement des ombres
      lightRef.current.castShadow = true;
      lightRef.current.shadow.mapSize.width = 512;
      lightRef.current.shadow.mapSize.height = 512;
      lightRef.current.shadow.camera.near = 0.5;
      lightRef.current.shadow.camera.far = 50;
    }
  }, []);

  // Mise à jour des positions dans le useEffect plutôt que useFrame
  // pour éviter des problèmes potentiels avec les props
  useEffect(() => {
    if (lightRef.current && coneRef.current) {
      const x = mouse.current[0] * 5;
      const y = mouse.current[1] * 5;
      
      lightRef.current.position.set(x, y, 10);
      coneRef.current.position.set(x, y, 5);
      
      // Orienter le cône vers la scène de façon simplifiée
      coneRef.current.lookAt(0, 0, -10);
    }
  }, [mouse.current[0], mouse.current[1]]);

  return (
    <>
      <pointLight
        ref={lightRef}
        color="#ffdd44"
        intensity={1.5}
        distance={30}
        decay={2}
        position={[0, 0, 10]} // Position initiale
      />
      
      <mesh ref={coneRef} position={[0, 0, 5]}>
        <coneGeometry args={[2, 5, 32]} />
        <meshBasicMaterial color="#ffdd44" transparent opacity={0.15} />
      </mesh>
    </>
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

// Scène simplifiée
const Scene = () => {
  const mouse = useRef<[number, number]>([0, 0]);
  const { isTorchActive, mousePosition } = useTorch();

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
      <IlluminatedPlane />
      
      {/* Cube démo simple avec casting d'ombres */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
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
