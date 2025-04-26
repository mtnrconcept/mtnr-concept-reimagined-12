
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  RefObject,
} from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: (active: boolean) => void;
  mousePosition: MousePosition;
  registerElement: (el: HTMLElement) => void;
  unregisterElement: (el: HTMLElement) => void;
  elements: HTMLElement[];
  containerRef: RefObject<HTMLDivElement>;
}

const TorchContext = createContext<TorchContextType | null>(null);

export const useTorch = () => {
  const ctx = useContext(TorchContext);
  if (!ctx) throw new Error("useTorch must be used within TorchProvider");
  return ctx;
};

const TorchLight = ({ position }: { position: MousePosition }) => (
  <div
    className="absolute pointer-events-none z-[9990]"
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,221,0,0.4) 0%, transparent 70%)",
      transform: "translate(-50%, -50%)",
      mixBlendMode: "screen",
    }}
  />
);

export const TorchProvider = ({ children }: { children: ReactNode }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const registerElement = (el: HTMLElement) =>
    setElements((prev) => (prev.includes(el) ? prev : [...prev, el]));

  const unregisterElement = (el: HTMLElement) =>
    setElements((prev) => prev.filter((e) => e !== el));

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (isTorchActive) setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isTorchActive]);

  const value: TorchContextType = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    registerElement,
    unregisterElement,
    elements,
    containerRef,
  };

  return (
    <TorchContext.Provider value={value}>
      <div ref={containerRef} className="torch-container relative">
        {children}
        {isTorchActive && <TorchLight position={mousePosition} />}
      </div>
    </TorchContext.Provider>
  );
};
