import { useEffect, useRef } from "react";
import { useTorchContext } from "./TorchContext";

export default function ShadowManager() {
  const {
    isTorchActive,
    mousePosition,
    elementsToIlluminate,
    containerRef,
  } = useTorchContext();

  const shadowsContainerRef = useRef<HTMLDivElement>(null);
  const shadowElements = useRef<Map<string, HTMLDivElement>>(new Map());
  let shadowUpdateTimeout: number | null = null;

  const createShadowElement = (element: HTMLElement, index: number) => {
    const rect = element.getBoundingClientRect();
    const shadow = document.createElement("div");
    shadow.className = "shadow-element";
    shadow.style.position = "absolute";
    shadow.style.top = `${rect.top + window.scrollY}px`;
    shadow.style.left = `${rect.left + window.scrollX}px`;
    shadow.style.width = `${rect.width}px`;
    shadow.style.height = `${rect.height}px`;
    shadow.style.zIndex = "9999";
    shadow.style.background = "black";
    shadow.style.opacity = "0.5";
    shadow.style.borderRadius = getComputedStyle(element).borderRadius;
    shadow.style.pointerEvents = "none";
    shadow.style.mixBlendMode = "multiply";
    shadow.setAttribute("data-shadow-id", `shadow-${index}`);
    return shadow;
  };

  const updateShadowPositions = () => {
    const torch = document.getElementById("torch-light");
    if (!torch || !shadowsContainerRef.current) return;

    const torchRect = torch.getBoundingClientRect();
    const torchCenter = {
      x: torchRect.left + torchRect.width / 2,
      y: torchRect.top + torchRect.height / 2,
    };

    shadowElements.current.forEach((shadow, key) => {
      const targetId = key.replace("shadow-", "");
      const element = elementsToIlluminate[Number(targetId)];
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const dx = elementCenter.x - torchCenter.x;
      const dy = elementCenter.y - torchCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normX = dx / distance;
      const normY = dy / distance;
      const shadowLength = Math.min(100, distance / 5);

      shadow.style.transform = `translate(${normX * shadowLength}px, ${
        normY * shadowLength
      }px)`;
    });
  };

  const updateShadows = () => {
    if (!shadowsContainerRef.current) return;
    elementsToIlluminate.forEach((element, index) => {
      const shadowId = `shadow-${index}`;
      if (!shadowElements.current.has(shadowId)) {
        const shadow = createShadowElement(element, index);
        shadowsContainerRef.current?.appendChild(shadow);
        shadowElements.current.set(shadowId, shadow);
      }
    });
  };

  const debounceUpdateShadows = () => {
    if (shadowUpdateTimeout) clearTimeout(shadowUpdateTimeout);
    shadowUpdateTimeout = window.setTimeout(() => {
      updateShadows();
      updateShadowPositions();
    }, 100);
  };

  useEffect(() => {
    if (!isTorchActive) return;
    updateShadows();
    updateShadowPositions();

    const handleMouseMove = () => debounceUpdateShadows();
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTorchActive, mousePosition]);

  return <div ref={shadowsContainerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-[9998]" />;
}
