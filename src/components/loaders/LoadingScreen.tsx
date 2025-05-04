
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUVMode } from '../effects/UVModeContext';
import { useTorch } from '../effects/TorchContext';
import { FlashlightIcon } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { MatrixRain } from './MatrixRain';
import { GlitchLogo } from './GlitchLogo';
import { DecryptMessage } from './DecryptMessage';
import { useAudioEffects } from '../../hooks/useAudioEffects';
import { useResourcePreloader } from '../../hooks/useResourcePreloader';
import UVHiddenMessage from '../effects/UVHiddenMessage';

/**
 * Écran de chargement initial avec animation du logo et préchargement
 */
export const LoadingScreen = () => {
  const { uvMode, toggleUVMode } = useUVMode();
  const { setIsTorchActive } = useTorch();
  const [loading, setLoading] = useState(true);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [phase, setPhase] = useState<'normal' | 'uv' | 'complete'>('normal');
  const [showMatrixEffect, setShowMatrixEffect] = useState(false);
  const [showDecryptMessage, setShowDecryptMessage] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const [glitchEffect, setGlitchEffect] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  
  // Ressources à précharger
  const resourcesToPreload = [
    '/lovable-uploads/videonormale.mp4',
    '/lovable-uploads/videouv.mp4',
    '/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png'
  ];
  
  const { playSound } = useAudioEffects();
  const { progress } = useResourcePreloader(resourcesToPreload);

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
  
  // Simuler la séquence d'animation complète en 5 secondes exactement
  useEffect(() => {
    let mounted = true;
    
    // Animer la séquence complète en 5 secondes exactement
    const startTime = performance.now();
    const totalDuration = 5000; // 5 secondes en millisecondes
    
    // Phase 1: Afficher l'effet Matrix (0.5s)
    setShowMatrixEffect(true);
    playSound('beam');
    
    setTimeout(() => {
      if (!mounted) return;
      
      // Phase 2: Effet de glitch et passage en mode UV (1s)
      setGlitchEffect(true);
      playSound('glitch');
      
      setTimeout(() => {
        if (!mounted) return;
        
        // Phase 3: Activer le mode UV complet (0.5s)
        setPhase('uv');
        toggleUVMode();
        setIsTorchActive(true);
        
        setTimeout(() => {
          if (!mounted) return;
          
          // Phase 4: Afficher le texte déchiffré (1s)
          setShowDecryptMessage(true);
          playSound('decrypt');
          decryptText();
          
          setTimeout(() => {
            if (!mounted) return;
            
            // Phase 5: Finalisation et son de complétion (0.5s)
            setPhase('complete');
            playSound('complete');
            
            // Calculer le temps restant pour atteindre exactement 5 secondes au total
            const elapsed = performance.now() - startTime;
            const remainingTime = Math.max(0, totalDuration - elapsed);
            
            // Redirection après exactement 5 secondes depuis le début
            setTimeout(() => {
              if (!mounted) return;
              setLoading(false);
              navigate('/', { replace: true });
            }, remainingTime);
            
          }, 1500); // 1.5s pour phase 4
        }, 500); // 0.5s pour phase 3
      }, 1000); // 1s pour phase 2
    }, 500); // 0.5s pour phase 1
    
    return () => {
      mounted = false;
    };
  }, [navigate, toggleUVMode, setIsTorchActive, playSound]);

  // Afficher la page de chargement seulement si loading est true
  if (!loading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
      style={{
        background: phase === 'uv' 
          ? 'radial-gradient(circle at center, rgba(10, 0, 60, 0.98) 0%, rgba(5, 0, 30, 0.99) 100%)' 
          : 'radial-gradient(circle at center, #111 0%, #000 100%)',
        transition: 'background 1s ease-in-out'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Effet Matrix en fond */}
      {showMatrixEffect && (
        <div className="absolute inset-0 opacity-20">
          <MatrixRain />
        </div>
      )}
      
      <div className="relative w-full max-w-lg flex flex-col items-center gap-12">
        {/* Logo avec effet */}
        <GlitchLogo 
          isLogoVisible={isLogoVisible} 
          glitchEffect={glitchEffect} 
          phase={phase}
          logoRef={logoRef}
        />
        
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
            <DecryptMessage text={decryptedText} />
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
