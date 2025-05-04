
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
  const [showSecretPage, setShowSecretPage] = useState(false);
  
  const handleVerification = () => {
    if (codeInput === "7139") {
      setIsVerified(true);
      toast.success("Code correct! Accès autorisé.", {
        duration: 3000
      });
    } else if (codeInput === "MTNR") {
      setShowSecretPage(true);
      toast.success("Code secret activé! Bienvenue dans la zone cachée.", {
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
        transition: 'opacity 0.3s ease-out',
        pointerEvents: 'auto' /* Permettre l'interaction avec le bloc */
      }} id="uv-auth-block">
        <p style={{ color: "#D2FF3F", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
          Secret Mixtape Access 
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
      
      {/* Page secrète qui apparaît uniquement lorsque le code MTNR est saisi */}
      {showSecretPage && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-8 overflow-y-auto"
             style={{
               backdropFilter: 'blur(8px)',
               border: '2px solid #D2FF3F',
               animation: 'fadeIn 0.5s ease-out forwards'
             }}>
          <h2 className="text-3xl font-bold text-[#D2FF3F] mb-6 text-center glow-text">
            ZONE SECRÈTE MTNR
          </h2>
          
          <div className="max-w-3xl w-full bg-black/60 border border-[#4FA9FF] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-[#4FA9FF] mb-4">Manifeste Underground</h3>
            <p className="text-white mb-4">
              La Cave n'est pas juste un lieu, c'est un mouvement. Nous existons dans les interstices, 
              où l'art véritable prend forme loin des regards standardisés. Chaque seconde passée 
              à créer est une rébellion contre la médiocrité ambiante.
            </p>
            <p className="text-[#D2FF3F] mb-4">
              Coordonnées des prochains événements secrets disponibles uniquement pour les initiés.
              Contactez-nous avec le code: <span className="font-mono font-bold">NEBULA-7X</span> pour recevoir le lieu exact.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="border border-[#D2FF3F] p-4 rounded">
                <h4 className="text-[#D2FF3F] font-bold">Session Underground #42</h4>
                <p className="text-white text-sm">21 juin 2025 • 23h00</p>
                <p className="text-gray-400 text-xs">Paris • Zone industrielle</p>
              </div>
              <div className="border border-[#D2FF3F] p-4 rounded">
                <h4 className="text-[#D2FF3F] font-bold">Exposition Secrète</h4>
                <p className="text-white text-sm">15 juillet 2025 • 22h00</p>
                <p className="text-gray-400 text-xs">Marseille • Tunnels</p>
              </div>
            </div>
          </div>
          
          <div className="max-w-3xl w-full bg-black/60 border border-[#4FA9FF] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-[#4FA9FF] mb-4">Message Crypté</h3>
            <div className="font-mono text-sm text-[#D2FF3F] bg-black/80 p-4 rounded">
              <p>01001100 01000101 00100000 01000011 01001111 01000100 01000101 00100000</p>
              <p>01000110 01001001 01001110 01000001 01001100 00111010 00100000 01000010</p>
              <p>01001100 01000001 01000011 01001011 01001100 01001001 01000111 01001000</p>
              <p>01010100 00101101 00110111 00111001 00110101</p>
            </div>
            <p className="text-white text-sm mt-4">Ce message contient les instructions pour l'événement spécial du 31 octobre.</p>
          </div>
          
          <Button 
            onClick={() => setShowSecretPage(false)}
            className="mt-6 bg-[#D2FF3F] hover:bg-[#A0FF00] text-black font-bold"
          >
            Retourner à la page
          </Button>
        </div>
      )}
      
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
