
import React from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';

export default function ContactPageSecrets() {
  return (
    <>
      <UVHiddenMessage 
        message="COORDONNÉES CRYPTÉES" 
        color="#00FFBB" 
        className="text-2xl font-bold" 
        offsetX={0}
        offsetY={30}
      />
      
      <UVSecretMessage 
        message="TEL: +33 6 ** ** ** 42" 
        position={{ x: 65, y: 40 }}
        color="#D2FF3F"
      />
      
      <UVHiddenCode
        code={`GPG KEY:\n4A3D 8F29 71E6\n2B94 7C01 F0E2\nA31F D222 5719 409D`}
        position={{ x: 25, y: 60 }}
        fontSize="0.7rem"
        color="#4FA9FF"
      />
      
      <UVHiddenCode
        code={`SECURE CONTACT PROTOCOL\nHASH: SHA-512\nINITIALIZATION: 0xB347DF\nTIMEOUT: 48h`}
        position={{ x: 75, y: 80 }}
        fontSize="0.7rem"
        color="#D946EF"
      />
    </>
  );
}
