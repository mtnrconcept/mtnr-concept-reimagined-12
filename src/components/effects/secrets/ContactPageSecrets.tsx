
import React, { useState } from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';
import UVDecryptMessage from '../UVDecryptMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ContactPageSecrets() {
  const [codeInput, setCodeInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  
  const handleVerification = () => {
    if (codeInput === "7139") {
      setIsVerified(true);
      toast.success("Code correct! Accès autorisé.", {
        duration: 3000
      });
    } else {
      toast.error("Code incorrect. Accès refusé.", {
        duration: 3000
      });
    }
  };

  return (
    <>
      <UVHiddenMessage 
        message="COORDONNÉES CRYPTÉES" 
        color="#00FFBB" 
        className="text-2xl font-bold" 
        offsetX={0}
        offsetY={30}
      />
      
      <div className="absolute" style={{ 
        top: '50%', 
        right: '15%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        backgroundColor: 'rgba(0, 10, 30, 0.75)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #D2FF3F',
        boxShadow: '0 0 15px rgba(210, 255, 63, 0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '250px',
        opacity: 0, /* Commence invisible */
        transition: 'opacity 0.3s ease-out'
      }} id="uv-auth-block">
        <p style={{ color: "#D2FF3F", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
          TEL: +33 6 ** ** ** 42
        </p>
        <p style={{ color: "#fff", fontSize: "12px", marginBottom: "5px" }}>
          Remplis le code
        </p>
        <Input 
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          className="h-8 text-sm bg-black/50 border-yellow-400 text-white"
          placeholder="Enter code"
          maxLength={4}
        />
        <Button 
          onClick={handleVerification}
          className="h-8 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold"
        >
          Vérification
        </Button>
        
        {isVerified && (
          <p style={{ color: "#4FA9FF", fontSize: "12px", marginTop: "5px" }}>
            Code d'accès: NEBULA-7X
          </p>
        )}
      </div>
      
      <UVDecryptMessage
        message="ACCÈS SÉCURISÉ: CODE 8734-XD29-M71R"
        position={{ x: 40, y: 25 }}
        fontSize="1.2rem"
        color="#4FA9FF"
        decryptSpeed={20}
        depth="0.4"
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
      
      {/* Script pour rendre visible le bloc d'authentification quand il est illuminé par la torche UV */}
      <UVSecretMessage
        message=""
        position={{ x: 85, y: 50 }}
        depth="0.2"
        color="transparent"
        size="1.5rem"
        rotation={0}
      />
    </>
  );
}
