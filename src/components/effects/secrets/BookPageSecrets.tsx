
import React from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';

export default function BookPageSecrets() {
  return (
    <div className="relative w-full h-full">
      <UVHiddenMessage 
        message="ARCHIVES SECRÈTES" 
        color="#D2FF3F" 
        className="text-2xl font-bold absolute top-[50px] left-[10px]" 
      />
      
      <UVSecretMessage 
        message="ACCÈS RESTREINT" 
        position={{ x: 75, y: 10 }}
        color="#FF00DD"
      />
      
      <UVHiddenCode
        code={`SESSION:\nMAINFRAME:ONLINE\nUSER:GHOST\nLOG:ENCRYPTED\nSESSION-KEY:A76FF3`}
        position={{ x: 20, y: 40 }}
        fontSize="0.8rem"
        color="#4FA9FF"
      />
      
      <UVHiddenCode
        code={`DOCUMENT ID: UV-734\nSECURITY: LEVEL 9\nEYES ONLY\nDESTROY AFTER READING\nAUTH CODE: NEBULA-7`}
        position={{ x: 75, y: 60 }}
        fontSize="0.7rem"
        color="#D946EF"
        rotation={5}
      />
    </div>
  );
}
