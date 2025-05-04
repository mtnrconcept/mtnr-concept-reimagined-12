
import React from 'react';
import UVMessage from '../UVMessage';

export default function WhatWeDoPageSecrets() {
  console.log("WhatWeDoPageSecrets component rendering");
  
  return (
    <>
      <UVMessage 
        content="OPÉRATIONS CLASSIFIÉES"
        type="text"
        color="#FF00DD" 
        className="text-2xl font-bold" 
        offsetX={10}
        offsetY={40}
      />
      
      <UVMessage 
        content="NIVEAU D'ACCÈS: ALPHA"
        type="secret"
        position={{ x: 20, y: 20 }}
        color="#D2FF3F"
      />
      
      <UVMessage
        content="VÉRIFICATION D'IDENTITÉ EN COURS..."
        type="decrypt"
        position={{ x: 50, y: 30 }}
        fontSize="1.3rem"
        color="#4FA9FF"
        decryptSpeed={15}
        depth="0.2"
      />
      
      <UVMessage
        content={`PROJECT-X:\n- STATUS: ONGOING\n- PHASE: 3/7\n- COMPLETION: 68%\n- CLEARANCE: TOP`}
        type="code"
        position={{ x: 70, y: 50 }}
        fontSize="0.8rem"
        color="#4FA9FF"
      />
      
      <UVMessage
        content={`// EQUIPMENT SPECS\n// MODEL: XR-7\n// SERIAL: MT75-UV\n// POWER: 1.21 GW\n// WARNING: DO NOT EXPOSE`}
        type="code"
        position={{ x: 30, y: 70 }}
        fontSize="0.7rem"
        color="#00FFBB"
        rotation={-8}
      />
      
      <UVMessage
        content="ZONE SURVEILLÉE"
        type="secret"
        position={{ x: 85, y: 80 }}
        color="#FF00DD"
        fontSize="1.2rem"
      />
    </>
  );
}
