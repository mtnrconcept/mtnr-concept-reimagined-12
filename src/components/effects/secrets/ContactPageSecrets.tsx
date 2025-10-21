
import React, { useState, useEffect } from 'react';
import UVHiddenMessage from '../UVHiddenMessage';
import UVHiddenCode from '../UVHiddenCode';
import UVSecretMessage from '../UVSecretMessage';
import UVDecryptMessage from '../UVDecryptMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ContactPageSecrets() {
  const [codeInput, setCodeInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showSecretPage, setShowSecretPage] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  
  // Timer pour l'écran de chargement (8-10 secondes)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showSecretPage) {
      // Démarre le timer pour le chargement de 8-10 secondes
      timer = setTimeout(() => {
        setIsLoadingVideo(false);
      }, 9000); // 9 secondes de chargement
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSecretPage]);
  
  const handleVerification = () => {
    if (codeInput === "7139") {
      setIsVerified(true);
      toast.success("Code correct! Accès autorisé.", {
        duration: 3000
      });
    } else if (codeInput === "MTNR") {
      setShowSecretPage(true);
      setIsLoadingVideo(true);
      toast.success("Code secret activé! Chargement de la vidéo confidentielle...", {
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
      
      {/* Page secrète avec la vidéo YouTube en plein écran */}
      {showSecretPage && (
        <div className="fixed inset-0 z-[200] bg-black overflow-hidden">
          {/* Écran de chargement (affiché pendant 8-10 secondes) */}
          {isLoadingVideo ? (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
              {/* Animation de chargement stylisée */}
              <motion.div 
                className="relative w-32 h-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Cercles animés */}
                <motion.div 
                  className="absolute inset-0 border-4 border-t-yellow-400 border-r-yellow-400 border-b-transparent border-l-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.div 
                  className="absolute inset-2 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.div 
                  className="absolute inset-4 border-4 border-t-transparent border-r-magenta-500 border-b-transparent border-l-magenta-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              {/* Texte clignotant */}
              <motion.div 
                className="mt-8 text-center" 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h3 className="text-xl font-mono text-green-400 mb-2">DÉCHIFFRAGE EN COURS</h3>
                <div className="flex items-center justify-center space-x-2">
                  <motion.div 
                    className="h-2 w-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
                  />
                  <motion.div 
                    className="h-2 w-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
                  />
                  <motion.div 
                    className="h-2 w-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.6 }}
                  />
                </div>
              </motion.div>
              
              {/* Progression animée */}
              <motion.div 
                className="mt-6 w-64 h-2 bg-gray-800 rounded-full overflow-hidden"
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-green-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8.5, ease: "linear" }}
                />
              </motion.div>
              
              {/* Mots de passe aléatoires qui défilent */}
              <motion.div 
                className="mt-4 font-mono text-xs text-green-500"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.p
                  animate={{ opacity: [0, 1, 1, 0], y: [-5, 0, 0, 5] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                >
                  ACCESS CODE: FD7X-99RT-HJ2L
                </motion.p>
                <motion.p
                  animate={{ opacity: [0, 1, 1, 0], y: [-5, 0, 0, 5] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.5 }}
                >
                  BYPASS SEQUENCE: INITIATED
                </motion.p>
              </motion.div>
            </div>
          ) : (
            // La vidéo YouTube en plein écran après le chargement
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <iframe
                className="absolute w-full h-full"
                src="https://www.youtube.com/embed/RXOCewCjn70?autoplay=1&controls=1&showinfo=0&rel=0&fs=1"
                title="Vidéo secrète"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              
              {/* Bouton pour retourner à la page précédente placé en bas à droite */}
              <div className="absolute bottom-5 right-5 z-10">
                <Button 
                  onClick={() => setShowSecretPage(false)}
                  className="bg-black/60 hover:bg-black/80 text-white border border-white/20"
                >
                  Retour
                </Button>
              </div>
            </div>
          )}
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
