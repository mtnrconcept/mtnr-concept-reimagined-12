
import React from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';

export default function ArtistsPageSecrets() {
  return (
    <>
      <UVHiddenMessage 
        message="QUATRE MESSAGERS DE L'OMBRE" 
        color="#D946EF" 
        className="text-2xl font-bold" 
        offsetX={0}
        offsetY={50}
      />
      
      <UVSecretMessage 
        message="PROCHAINE SESSION: 21/07/25" 
        position={{ x: 75, y: 25 }}
        color="#4FA9FF"
        depth="0.1"
      />
      
      <UVHiddenCode
        code={`ID:SEQUENCE-DELTA\nSTATUT:ACTIF\nPROJET:"FANTÔME"\nÉCHÉANCE:31-12`}
        position={{ x: 20, y: 80 }}
        fontSize="0.8rem"
        color="#00FFBB"
      />
      
      <UVHiddenCode
        code={`SESSION CODE: 0xFADE\nTRANSMISSION: SECURE\nENCRYPTION: AES-384\nCHANNEL: ULTRAVIOLET`}
        position={{ x: 80, y: 65 }}
        fontSize="0.7rem"
        color="#FF00DD"
        rotation={15}
      />
    </>
  );
}
