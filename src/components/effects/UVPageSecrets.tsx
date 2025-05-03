
import React from 'react';
import { useLocation } from 'react-router-dom';
import UVHiddenMessage from './UVHiddenMessage';
import UVHiddenDrawing from './UVHiddenDrawing';
import UVHiddenCode from './UVHiddenCode';
import UVSecretMessage from './UVSecretMessage';
import { useTorch } from './TorchContext';
import { useUVMode } from './UVModeContext';

export default function UVPageSecrets() {
  const location = useLocation();
  const { isTorchActive } = useTorch();
  const { uvMode } = useUVMode();
  
  // Ne rien afficher si le mode UV n'est pas activé
  if (!uvMode || !isTorchActive) return null;
  
  // Éléments secrets spécifiques à la page d'accueil
  if (location.pathname === '/') {
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
        
        <UVHiddenDrawing
          src="/lovable-uploads/c51ac031-c85b-42b2-8d7d-b14f16692636.png"
          alt="Logo caché"
          position={{ x: 70, y: 50 }}
          width="200px"
          rotation={-5}
          glowColor="#D946EF"
        />
      </>
    );
  }
  
  // Éléments secrets spécifiques à la page Artists
  if (location.pathname === '/artists') {
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
        
        <UVHiddenDrawing
          src="/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png"
          alt="Symbole caché"
          position={{ x: 30, y: 40 }}
          width="100px"
          glowColor="#D2FF3F"
        />
        
        <UVHiddenDrawing
          src="/lovable-uploads/abe06f9b-f700-4a49-a4d8-b4d68c473e70.png"
          alt="Symbole caché 2"
          position={{ x: 80, y: 65 }}
          width="120px"
          rotation={15}
          glowColor="#FF00DD"
        />
      </>
    );
  }
  
  // Éléments secrets spécifiques à la page Contact
  if (location.pathname === '/contact') {
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
        
        <UVHiddenDrawing
          src="/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png"
          alt="QR Code caché"
          position={{ x: 80, y: 80 }}
          width="150px"
          glowColor="#D946EF"
        />
      </>
    );
  }
  
  // Éléments secrets spécifiques à la page "What We Do"
  if (location.pathname === '/what-we-do') {
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
        
        <UVHiddenDrawing
          src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png"
          alt="Équipement caché"
          position={{ x: 30, y: 70 }}
          width="180px"
          rotation={-8}
          glowColor="#00FFBB"
        />
      </>
    );
  }
  
  // Éléments secrets spécifiques à la page Book
  if (location.pathname === '/book') {
    return (
      <>
        <UVHiddenMessage 
          message="ARCHIVES SECRÈTES" 
          color="#D2FF3F" 
          className="text-2xl font-bold" 
          offsetX={-10}
          offsetY={50}
        />
        
        <UVSecretMessage 
          message="ACCÈS RESTREINT" 
          position={{ x: 75, y: 15 }}
          color="#FF00DD"
        />
        
        <UVHiddenCode
          code={`SESSION:\nMAINFRAME:ONLINE\nUSER:GHOST\nLOG:ENCRYPTED\nSESSION-KEY:A76FF3`}
          position={{ x: 20, y: 40 }}
          fontSize="0.8rem"
          color="#4FA9FF"
        />
        
        <UVHiddenDrawing
          src="/lovable-uploads/ff5c872a-d737-47fe-a427-a31849cceac3.png"
          alt="Document caché"
          position={{ x: 75, y: 60 }}
          width="130px"
          rotation={5}
          glowColor="#D946EF"
        />
      </>
    );
  }
  
  // Éléments secrets pour la page 404
  if (location.pathname === '/404' || location.pathname.includes('*')) {
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
        
        <UVHiddenDrawing
          src="/lovable-uploads/7eefa948-da3a-4bfd-8b4b-e19299caaa22.png"
          alt="Glitch"
          position={{ x: 70, y: 80 }}
          width="200px"
          rotation={-3}
          glowColor="#4FA9FF"
        />
      </>
    );
  }
  
  return null;
}
