
import React from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';

export default function WhatWeDoPageSecrets() {
  return (
    <>
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
    </>
  );
}
