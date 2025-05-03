
import React from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';

export default function NotFoundPageSecrets() {
  return (
    <>
      <UVHiddenMessage 
        message="ERREUR SYSTÈME DÉTECTÉE" 
        color="#FF00DD" 
        className="text-3xl font-bold" 
        offsetX={0}
        offsetY={30}
      />
      
      <UVSecretMessage 
        message="REDÉMARRAGE FORCÉ: 60s" 
        position={{ x: 50, y: 40 }}
        color="#D2FF3F"
      />
      
      <UVHiddenCode
        code={`CRASH_LOG:\nERROR_CODE: 0xD34DB33F\nMODULE: reality.sys\nREASON: unexpected_visitor\nACTION: reboot_matrix`}
        position={{ x: 30, y: 60 }}
        fontSize="0.7rem"
        color="#00FFBB"
      />
      
      <UVHiddenCode
        code={`SYS://RECOVERY\nBOOT_MODE: SAFE\nDIAGNOSTIC: RUNNING\nMEMORY_DUMP: /dev/null\nRECOVERY_SEQ: 42-23-16`}
        position={{ x: 70, y: 80 }}
        fontSize="0.7rem"
        color="#4FA9FF"
        rotation={-3}
      />
    </>
  );
}
