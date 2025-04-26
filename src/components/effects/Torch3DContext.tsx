
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTorch } from "./TorchContext";

// Création du matériau de masque pour l'effet lampe torche
const TorchMaskMaterial = shaderMaterial(
  // Uniforms
  {
    u_mouse: new THREE.Vector2(0.5, 0.5),
    u_radius: 0.3,
    u_color: new THREE.Color(0x000000),
    u_intensity: 0.95,
    resolution: new THREE.Vector2(1, 1),
  },
  // Vertex shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment shader
  `
  uniform vec2 u_mouse;
  uniform float u_radius;
  uniform vec3 u_color;
  uniform float u_intensity;
  uniform vec2 resolution;
  
  varying vec2 vUv;
  
  void main() {
    vec2 pos = gl_FragCoord.xy / resolution;
    float dist = distance(pos, u_mouse);
    float mask = 1.0 - smoothstep(u_radius, u_radius * 1.3, dist);
    gl_FragColor = vec4(u_color, u_intensity * (1.0 - mask));
  }
  `
);

// Extension du matériau pour React Three Fiber
extend({ TorchMaskMaterial });

interface Torch3DContextType {
  is3DModeActive: boolean;
  toggle3DMode: () => void;
}

const Torch3DContext = createContext<Torch3DContextType>({
  is3DModeActive: false,
  toggle3DMode: () => {},
});

export const use3DTorch = () => useContext(Torch3DContext);

// Composant pour le masque de la lampe torche (effet overlay)
const TorchMask = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const ref = useRef<any>(null);
  const { size } = useThree();

  useFrame(() => {
    if (ref.current) {
      // Convertir les coordonnées de souris normalisées (-1,1) en coordonnées UV (0,1)
      ref.current.uniforms.u_mouse.value = new THREE.Vector2(
        (mouse.current[0] + 1) / 2,
        1 - (mouse.current[1] + 1) / 2
      );
      ref.current.uniforms.resolution.value = new THREE.Vector2(size.width, size.height);
    }
  });

  return (
    <mesh position={[0, 0, 10]} renderOrder={1000}>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore - nécessaire car le matériel personnalisé n'est pas reconnu par TypeScript */}
      <torchMaskMaterial ref={ref} transparent depthTest={false} depthWrite={false} />
    </mesh>
  );
};

const TorchLight = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const coneRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (lightRef.current && coneRef.current) {
      // Projection de la lumière en fonction de la position de la souris
      const x = mouse.current[0] * window.innerWidth / 2;
      const y = mouse.current[1] * window.innerHeight / 2;

      // Ajustement de la position de la lumière
      lightRef.current.position.set(x, y, 50);
      coneRef.current.position.set(x, y, 25);
      // Orientation du cône vers la scène (direction -z)
      coneRef.current.rotation.x = Math.PI/2;
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        color="#ffdd44"
        intensity={2}
        distance={600}
        decay={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={600}
      />
      {/* Cône lumineux pour visualiser le rayon de lumière */}
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
  const { camera } = useThree();

  // Configuration de la caméra pour optimiser l'effet de profondeur
  useEffect(() => {
    if (camera) {
      camera.near = 1;
      camera.far = 2000;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Conversion des coordonnées de souris de { x, y } en format normalisé [-1, 1]
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
      {isTorchActive && (
        <>
          <TorchLight mouse={mouse} />
          <TorchMask mouse={mouse} />
        </>
      )}
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
