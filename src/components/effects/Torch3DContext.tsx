
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

// Composant pour la lumière de la lampe torche
const TorchLight = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const coneRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (lightRef.current && coneRef.current) {
      // Projection de la lumière en fonction de la position de la souris
      const x = mouse.current[0] * 5; // Réduit l'ampleur pour un meilleur contrôle
      const y = mouse.current[1] * 5;

      // Positionnement de la lumière
      lightRef.current.position.set(x, y, 10);
      coneRef.current.position.set(x, y, 5);
      // Orientation du cône vers la scène
      coneRef.current.lookAt(new THREE.Vector3(x, y, -10));
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        color="#ffdd44"
        intensity={1.5}
        distance={30}
        decay={2}
      />
      {/* Cône lumineux */}
      <mesh ref={coneRef}>
        <coneGeometry args={[2, 5, 32]} />
        <meshBasicMaterial 
          color="#ffdd44"
          transparent
          opacity={0.15}
        />
      </mesh>
    </>
  );
};

// Composant pour le plan illuminé
const IlluminatedPlane = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  return (
    <mesh position={position}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );
};

// Masque visuel pour l'effet "torche"
const TorchMaskOverlay = () => {
  const { mousePosition } = useTorch();
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        background: 'radial-gradient(circle 200px at ' + 
          `${mousePosition.x}px ${mousePosition.y}px, transparent 10%, rgba(0,0,0,0.85) 100%)`,
      }}
    />
  );
};

// Scène 3D
const Scene = () => {
  const mouse = useRef<[number, number]>([0, 0]);
  const { isTorchActive, mousePosition } = useTorch();

  // Conversion des coordonnées de souris
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
      <IlluminatedPlane position={[0, 0, -5]} />
      
      {/* Cube démo */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

export const Torch3DProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [is3DModeActive, setIs3DModeActive] = useState(false);
  const { isTorchActive, mousePosition } = useTorch();
  
  const toggle3DMode = () => {
    setIs3DModeActive(prev => !prev);
  };

  return (
    <Torch3DContext.Provider value={{ is3DModeActive, toggle3DMode }}>
      {children}
      {is3DModeActive && isTorchActive && (
        <>
          <div className="fixed inset-0 z-40 pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 15], fov: 50 }}
              style={{ background: "transparent" }}
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
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333333" />
      {children}
    </mesh>
  );
};
