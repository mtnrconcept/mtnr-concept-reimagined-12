
import React, { useEffect, useRef } from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';
import UVDecryptMessage from '../UVDecryptMessage';
import { useTorch } from '../TorchContext';
import { useUVMode } from '../UVModeContext';

export default function WhatWeDoPageSecrets() {
  console.log("WhatWeDoPageSecrets component rendering");
  const { uvMode, toggleUVMode } = useUVMode();
  const { isTorchActive } = useTorch();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log("WhatWeDoPageSecrets mounted, uvMode:", uvMode, "isTorchActive:", isTorchActive);
  }, [uvMode, isTorchActive]);
  
  // Ne rien afficher si le mode UV n'est pas activé ou si la torche est désactivée
  if (!uvMode || !isTorchActive) return null;
  
  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      {/* Hidden messages */}
      <UVHiddenMessage 
        message="OPÉRATIONS CLASSIFIÉES" 
        color="#FF00DD" 
        className="text-2xl font-bold" 
        offsetX={10}
        offsetY={40}
      />
      
      <UVSecretMessage 
        message="NIVEAU D'ACCÈS: ALPHA" 
        position={{ x: 20, y: 20 }}
        color="#D2FF3F"
      />
      
      <UVDecryptMessage
        message="VÉRIFICATION D'IDENTITÉ EN COURS..."
        position={{ x: 50, y: 30 }}
        fontSize="1.3rem"
        color="#4FA9FF"
        decryptSpeed={15}
        depth="0.2"
      />
      
      <UVHiddenCode
        code={`PROJECT-X:\n- STATUS: ONGOING\n- PHASE: 3/7\n- COMPLETION: 68%\n- CLEARANCE: TOP`}
        position={{ x: 70, y: 50 }}
        fontSize="0.8rem"
        color="#4FA9FF"
      />
      
      <UVHiddenCode
        code={`// EQUIPMENT SPECS\n// MODEL: XR-7\n// SERIAL: MT75-UV\n// POWER: 1.21 GW\n// WARNING: DO NOT EXPOSE`}
        position={{ x: 30, y: 70 }}
        fontSize="0.7rem"
        color="#00FFBB"
        rotation={-8}
      />
      
      <UVSecretMessage 
        message="ZONE SURVEILLÉE" 
        position={{ x: 85, y: 80 }}
        color="#FF00DD"
        size="1.2rem"
      />
      
      {/* Ajout de messages supplémentaires */}
      <UVHiddenMessage 
        message="MISSION CONFIDENTIELLE" 
        color="#4FA9FF" 
        className="text-xl font-bold" 
        offsetX={40}
        offsetY={200}
      />
      
      <UVDecryptMessage
        message="INTRUSION DÉTECTÉE - SÉCURITÉ ACTIVE"
        position={{ x: 60, y: 60 }}
        fontSize="1rem"
        color="#FF3366"
        decryptSpeed={20}
      />
      
      <UVHiddenCode
        code={`/* Données sensibles */\nconst access = {\n  key: "MT-75X",\n  expires: "25-06-2025",\n  clearance: "ULTRA"\n};`}
        position={{ x: 40, y: 40 }}
        fontSize="0.7rem"
        color="#D2FF3F"
        rotation={3}
      />
    </div>
  );
}
