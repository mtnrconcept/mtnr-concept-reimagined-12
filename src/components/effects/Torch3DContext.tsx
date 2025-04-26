
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTorch } from "./TorchContext";

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
  const coneRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (lightRef.current && coneRef.current) {
      // Project the light in front of the camera based on mouse position
      const x = mouse.current[0] * window.innerWidth / 2;
      const y = mouse.current[1] * window.innerHeight / 2;

      // Adjust light position
      lightRef.current.position.set(x, y, 50);
      coneRef.current.position.set(x, y, 25);
      coneRef.current.lookAt(x, y, -100);
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        color="#ffdd44"
        intensity={2}
        distance={300}
        decay={2}
      />
      {/* Light cone approximated with a transparent mesh */}
      <mesh ref={coneRef} position={[0, 0, 50]} rotation={[Math.PI/2, 0, 0]}>
        <coneGeometry args={[100, 200, 32]} />
        <meshBasicMaterial
          color="#ffdd44"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

const IlluminatedPlane = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  return (
    <mesh position={position} receiveShadow>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );
};

const Scene = () => {
  const mouse = useRef<[number, number]>([0, 0]);
  const { isTorchActive, mousePosition } = useTorch();

  // Convert mousePosition from { x, y } to normalized [-1, 1] format
  useEffect(() => {
    if (isTorchActive) {
      mouse.current = [
        (mousePosition.x / window.innerWidth) * 2 - 1,
        -(mousePosition.y / window.innerHeight) * 2 + 1,
      ];
    }
  }, [isTorchActive, mousePosition]);

  return (
    <>
      <ambientLight intensity={0.1} />
      {isTorchActive && <TorchLight mouse={mouse} />}
      <IlluminatedPlane position={[0, 0, 0]} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

export const Torch3DProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [is3DModeActive, setIs3DModeActive] = useState(false);
  
  const toggle3DMode = () => {
    setIs3DModeActive(prev => !prev);
  };

  return (
    <Torch3DContext.Provider value={{ is3DModeActive, toggle3DMode }}>
      {children}
      {is3DModeActive && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Canvas
            shadows
            camera={{ position: [0, 0, 500], fov: 50 }}
            className="w-full h-full"
            style={{ background: "transparent" }}
          >
            <Scene />
          </Canvas>
        </div>
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
      <boxGeometry args={[50, 50, 50]} />
      <meshStandardMaterial color="#333" />
      {children}
    </mesh>
  );
};
