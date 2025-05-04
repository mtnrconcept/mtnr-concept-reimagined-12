
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUVMode } from '../effects/UVModeContext';
import { useTorch } from '../effects/TorchContext';
import LogoWithEffect from '../effects/LogoWithEffect';
import UVHiddenMessage from '../effects/UVHiddenMessage';
import { ProgressBar } from './ProgressBar';
import { FlashlightIcon } from 'lucide-react';

/**
 * Écran de chargement initial avec animation du logo et préchargement
 */
export const LoadingScreen = () => {
  const { uvMode, toggleUVMode } = useUVMode();
  const { setIsTorchActive } = useTorch();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [phase, setPhase] = useState<'normal' | 'uv' | 'complete'>('normal');
  const [showDecryptMessage, setShowDecryptMessage] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const logoRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  
  // Ressources à précharger
  const resourcesToPreload = [
    '/lovable-uploads/videonormale.mp4',
    '/lovable-uploads/videouv.mp4',
    '/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png'
  ];
  
  // Simuler le préchargement des ressources et mettre à jour la progression
  useEffect(() => {
    let mounted = true;
    
    const preloadResources = async () => {
      const total = resourcesToPreload.length;
      let loaded = 0;
      
      // Précharger les images
      const preloadPromises = resourcesToPreload.map((url) => {
        return new Promise<void>((resolve) => {
          if (url.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.src = url;
            
            video.onloadeddata = () => {
              if (mounted) {
                loaded++;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                resolve();
              }
            };
            
            video.onerror = () => {
              if (mounted) {
                loaded++;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                resolve();
              }
            };
            
            // Commencer le chargement
            video.load();
          } else {
            const img = new Image();
            img.src = url;
            
            img.onload = () => {
              if (mounted) {
                loaded++;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                resolve();
              }
            };
            
            img.onerror = () => {
              if (mounted) {
                loaded++;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                resolve();
              }
            };
          }
        });
      });
      
      // Attendre que toutes les ressources soient chargées
      await Promise.all(preloadPromises);
      
      // Ajouter un délai pour la présentation
      setTimeout(() => {
        if (mounted) {
          setPhase('uv');
          toggleUVMode();
          setIsTorchActive(true);
          
          // Montrer le texte de déchiffrement après un court délai
          setTimeout(() => {
            setShowDecryptMessage(true);
            decryptText();
          }, 1000);
          
          // Passer à la phase finale après une animation complète
          setTimeout(() => {
            setPhase('complete');
            // Redirection après la fin du chargement
            setTimeout(() => {
              if (mounted) {
                setLoading(false);
                // Naviguer vers la page d'accueil
                navigate('/', { replace: true });
              }
            }, 1500);
          }, 4500);
        }
      }, 1000);
    };
    
    preloadResources();
    
    return () => {
      mounted = false;
    };
  }, [navigate, toggleUVMode, setIsTorchActive]);

  // Animation de déchiffrement du texte
  const decryptText = () => {
    const finalText = "MTNR STUDIO // INITIALISATION COMPLÈTE";
    const speed = 50; // ms par caractère
    let currentText = "";
    let charIndex = 0;
    
    const interval = setInterval(() => {
      if (charIndex < finalText.length) {
        currentText += finalText.charAt(charIndex);
        setDecryptedText(currentText);
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);
  };

  // Logo normal ou UV selon la phase
  const getLogo = () => {
    return (
      <LogoWithEffect
        src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        alt="MTNR Studio"
        width="400px"
        glowEffect={true}
        glowColor={phase === 'uv' ? '210, 255, 63' : '255, 221, 0'}
        isVisible={isLogoVisible}
        logoRef={logoRef}
        className="transform-gpu"
      />
    );
  };

  // Afficher la page de chargement seulement si loading est true
  if (!loading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
      style={{
        backgroundImage: phase === 'uv' 
          ? 'radial-gradient(circle at center, rgba(10, 0, 60, 0.98) 0%, rgba(5, 0, 30, 0.99) 100%)' 
          : 'radial-gradient(circle at center, #111 0%, #000 100%)',
        transition: 'background-image 1s ease-in-out'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-lg flex flex-col items-center gap-12">
        {/* Logo avec effet */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {getLogo()}
        </motion.div>
        
        {/* Barre de progression */}
        <div className="w-full px-8">
          <ProgressBar progress={progress} phase={phase} />
        </div>
        
        {/* Icône de torche avec animation */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: phase === 'uv' ? 1 : 0,
            x: phase === 'uv' ? [0, -10, 10, -5, 5, 0] : 0 
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.8,
            x: { repeat: Infinity, repeatType: "reverse", duration: 2 } 
          }}
          className="mt-4"
        >
          <FlashlightIcon 
            size={32}
            className={`transition-colors duration-500 ${phase === 'uv' ? 'text-[#D2FF3F]' : 'text-yellow-400'}`}
            style={{
              filter: phase === 'uv' 
                ? 'drop-shadow(0 0 8px rgba(210, 255, 63, 0.8))' 
                : 'drop-shadow(0 0 8px rgba(255, 221, 0, 0.5))'
            }}
          />
        </motion.div>
        
        {/* Messages caché en mode UV */}
        <AnimatePresence>
          {showDecryptMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div 
                className="decrypt-message font-mono text-xl"
                style={{
                  color: '#D2FF3F',
                  textShadow: '0 0 8px rgba(210, 255, 63, 0.8)',
                  letterSpacing: '0.05em'
                }}
              >
                {decryptedText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Messages cachés UV positionnés stratégiquement */}
        {phase === 'uv' && (
          <>
            <UVHiddenMessage 
              message="Secrets cachés activés" 
              color="#D2FF3F" 
              className="absolute bottom-20 left-8" 
              fontSize="0.8rem"
            />
            <UVHiddenMessage 
              message="Mode UV détecté" 
              color="#4FA9FF" 
              className="absolute top-20 right-8" 
              fontSize="0.8rem"
            />
          </>
        )}
      </div>
    </motion.div>
  );
};
