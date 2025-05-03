
import React from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';

export default function HomePageSecrets() {
  return (
    <>
      <UVHiddenMessage 
        message="BIENVENUE AU STUDIO SECRET" 
        color="#D2FF3F" 
        className="text-3xl font-bold" 
        offsetX={20}
        offsetY={20}
      />
      
      <UVHiddenMessage 
        message="INTERDIT AUX NON-INITIÉS" 
        color="#FF00DD" 
        className="text-xl" 
        offsetX={-20}
        offsetY={220}
      />
      
      <UVSecretMessage 
        message="ACCESS CODE: 7139" 
        position={{ x: 85, y: 15 }}
        color="#4FA9FF"
        depth="0.05"
        rotation={-3}
      />
      
      <UVHiddenCode
        code={`function unlockSecret() {\n  const key = "MTNR";\n  console.log("Access granted");\n  return key + "-2025";\n}`}
        position={{ x: 15, y: 65 }}
        fontSize="0.9rem"
        color="#00FFBB"
      />
      
      <UVHiddenCode
        code={`// CLASSIFIED INFORMATION\n// USER-ID: 8X724Z\n// ACCESS: LEVEL 3\n// CRYPTO KEY: 0xA723FEB1`}
        position={{ x: 70, y: 50 }}
        fontSize="0.7rem"
        color="#D946EF"
        rotation={-5}
      />
    </>
  );
}
