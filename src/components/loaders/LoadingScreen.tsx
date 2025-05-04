
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUVMode } from '../effects/UVModeContext';
import { useTorch } from '../effects/TorchContext';
import LogoWithEffect from '../effects/LogoWithEffect';
import UVHiddenMessage from '../effects/UVHiddenMessage';
import { ProgressBar } from './ProgressBar';
import { FlashlightIcon } from 'lucide-react';
import { MatrixRain } from './MatrixRain';

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
  const [showMatrixEffect, setShowMatrixEffect] = useState(false);
  const [showDecryptMessage, setShowDecryptMessage] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const [glitchEffect, setGlitchEffect] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  
  // Créer l'élément audio pour les effets sonores
  useEffect(() => {
    // Créer un élément audio
    audioRef.current = new Audio();
    audioRef.current.volume = 0.3;
    
    // Nettoyer
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Fonction pour jouer un son
  const playSound = (soundType: 'glitch' | 'beam' | 'decrypt' | 'complete') => {
    if (!audioRef.current) return;
    
    switch (soundType) {
      case 'glitch':
        audioRef.current.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+NAwAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAAA3YAlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaW9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDgAAAAAAAAAB2VS+N2QAAAAAAAAAAAAAAAAAAAAAA/+OAwAFkZoXiAmmMbWm71JMZNM8xMDkxVTEwMDGqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/jgMCZM8GHvAGPnComxeLe9JpG5MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMw=';
        break;
      case 'beam':
        audioRef.current.src = 'data:audio/mp3;base64,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';
        break;
      case 'decrypt':
        audioRef.current.src = 'data:audio/mp3;base64,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';
        break;
      case 'complete':
        audioRef.current.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+NAwAAAAAAAAAAAAFhpbmcAAAAPAAAABQAABPYAlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWvr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vu3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDdAAAAAAAAPYYRzKpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/49DAEaackkvAMNPNiURBkgkAAZfmrnt65FM5zPlFZ8XmRUxLwnkMPMCB5p1XB5lMIdgYEDzGIQCBYkPwIPAwWIgsMOGYSGGBsxYNH4PAECysMR8QY8BiIND7E0LBTiDwkgIYaDA8cmKQsIjhYDAIBEEBjCSQNCQiAQ8CQGGkheeBwEAsCzCYjNQsG3Y4MBQLBUHExLzw4VMjWS8REcUAISBCExiyQLQ4tLGxsLDyx0OjSQJJAs5DBVImlDA0mXBglljMJkbFC4HEV4dxQB02Ykl8gEAQgAxAyNzC6czC0HDDEXDBUgTBwUjGUBzDCBBsYCYVAg7O7hDDB9DDgzTvppjE4XDDUaz/HsSxUyc1LOWPTM7MKS49jM+UTBGmzCz9DB8ODXgmzLJTskmJw8SGOK8xADMyOiwxXFJ44bvBuCDeifz3HE0LMUwE7o0NXI3AlU0rgMzMAoxnU81jY0yQAApgEABjLJR1YkZxUMYooAYbI8aMgPGuXTLMwvpCKJiwzJkCPK8ehg9nxnb+oMCUk/Sa3mkmQ0d9RNqtpDRs0yWZGtYPD0fYYEoAGBYBpiDzYtmavnMwKAF5gkAiwYIKjuNCLgOGsDVaUICROgWblOf3uaBrqv8lmR4t9c3Vf/3fmNnlGXCKiZsuFIexQeJAR0JxwPc65n/xvfW+AYCAHAwCACoACAgycAwIHBCACwMIgoK60mdly+W//MmImFwOCQOEwsDBYGFmAoHmBoCgQAGur/tfXiACiQYJgWYDAGKhoYCsBSKkICgQGgO1b//17d9MBRKMrQXUkrp0cI8NDQ0Rmt/e9KBxouwGCZoCgIYBgQd8rf0DQJMCAGHDPf/+6p/rDJCFACgICAkGAIBmAICAwCAiuZAACv+GgKYDgwfzZP///////X+/////plDiA4AStAgCgga79//p/////7cju///+/3atp4KA0HK/++///a6+2u/v9///uVVWcPwhn/25T2wyGFQgHwZt/YZpe/WvZe////KbK7pS2vBwoRGaTSZ9ZaJDCILAQWvVTHW5PNnv2IQT/////////+EA8Xkksa/DwEBIqwOYf///////+OWQLDZ4ONQoym48TRn2JhM9vdv2r9tAytm/gwsnZhWmKSlE/S/////dtuq5DQeGBoQmligGCQNnrKS1mpdb/9b//+2rMNEgkiBQf//////fWv/////q//////////3////6UwTKQ0Bhs5B6Yoq6ValfWGvdX+tkIHJTydxw8HRhQEQgBpaSWrVt7Vr/V6oUwEAYwABYIAaEyAwGAMUDXNyiwx27TEWMMYogxkSjEiNMMEswxPiTAyEDAFFAqFZgjAGDIAaiCZu1CmIcGYJgJgUAggCldkhrNEunQGlckAdLMbBwiQqYcCAwMUwT5ojiAnJmCgMZavphWAmAYCXKMFqutmGQQHcuVAYVEAQYYLTsd+dba1NQWLl5YkYaK51ChGRBcYHT6ADDQACACUzVcHupvrIohEAGYLEpgABGBQEW4MCg0wICgAAUvSLbVIl+/buVolyg4AUAAGCxAXDgBBFM0JDJQsMFg8wEBgOA+4dZYZQp+wy38+vvVqWZm9XYdAxUSCAGPOhglGrpIuUuRNZFQAhEJABldAHBzB5XOTNs57E/0hHRMyMizMQ5FARDpQis2NzzHZBOTno4YSDjM+MklA6MbTAweFjDZoaEzg1HWzpvhNDSc12mjRNSOsno5dWjJ7xN/g83bATS8TLPAKGQOmCpSZnvRnaHGJhYW4DN34bMLzowsdjIRGMHigxsBTBRCCYfGG5WYLFBg0TggCZTacvmtqqZZExncQmOBWYkiZmckqUDjSDB4PmeQqeIPR6ShgOIGJHWZgPZhaKnBpYq5IytFD7UWM/V4+9KTG6DMUQIwZBjA0OMCBowKDRYAkAB+cGJunD9wp5rllmCwAYQA4OAMIAAw+BzAwF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/9qSLMBBQKSSBAv//+///7JCkFO9n/Z3MAwEEKCQFIh5qO//////1RRQoOqqStKlQmpioJJEgoEUP//////RMRRpu0ZdUSUMUGJRAKCIr/////9GCkGJqbsSyqkSIkBsihnfmDJrMuMGIXtrVq29Za1Vv65arUppdla1ta2PHay/+dnZobu1MNlNhhlbOFMMnAwY/D//////+XDQsO9+1FjEImB42D5Qzm//////VOUDTdUVQ0jUVEopUT0z//////6kUGJpVVJVSNQ9MTRJJJAcAOG7/////9WCgoNRmVjcURQYURUEQkA///////UimBxP9EyRRIIMRRQiECBQ3/////9CRSKDc/5VpFCBhRCMIEhQ3f////9SkUFJpQqXLJFGlFDscEABEJuLXv//v//rLTVQkWzKlVEUDA4Ehg5Ccf//////UwLDVmVKZUGBkIxghFQX/////+igpNOm9SmpKIkKTU0CoUBYTt/////9UKKC8//NXUyRQpgqCiQ4FBu//////0UKBlSSpStJFIlECBAIS03//////6KCkn22pklSRJUKCREkB8Hbf////9VCig1qb5VRSQmCgQJIET//////rCoUGdVJKlSQLEkoLQf//////SQoGVJt82UVAJJQgZ///////6sLBil39VQtClIN/+OQwBWNgKPkAYdrm//////+hIzKqb8mdUkkDRNUkEvQMh//////9WRRGJ9qlSpMUDhyv//////+TEo0/9NVQtCgjIxSGQX//////6JmDc3SmiyIrBQKDExD//////9mRUKDU+pRNKiEghMRIEOE//////0OCgo7b+lQkyQYkgAU//////UhQYm6rKrFSJSBCggKRQTl//////6qgjKlWaUzIgEyHf/////+sMhQZlNs6USko0oEBSD//////9jRQUFLqmlKSicCCIiD///////VxBoP/0kiQCVQoBCYgEEcf//////UKCgrb5krIoCSUIFJQTEQM///////oqKFBnK2ttSVJFEEiVhRKgT//////sKKDM06q1KikCQVFAahf/////9SFBQanUpqqVQhQRCiRAgOA//////6hFAmU3mTaqJYKGkgoFBBj/////+kBQMtUrVUSkQwUGF///////6KgUN9+vU2UgcKBgcEgiAj//////2qBQUtVK9SUiKBQsCoP//////1RQUGt12bOopBlQZFQSB///////6Ki0HqpTZUjEUgKRCDAX//////sgUFJX2pdEgGpguFIuEv/////+yhQMbPm6opY0QKCgYFAQECf////+ikFAy1dKlLEJhgYHAoH//////1RQYlXWzJnIpA4WBQYCAr/////+hgUDNbapWqKCQsoEkEDf//////UJC0HWryaXUSKEgUmJSFAcJ+/////9WBQYmsqqpSKRFECk4BgP//////5QUFLba1VVCiBQQFggD/////+oCgoNZs2dQiRQUDoGAQE//////+zQUDLZ6XqiUCQJKiIQEAX//////UoGBeWrZutSkIgJJpuhYAlQGhoHAkNF/wgf/OUmwYOBoGjQQBCewZ+urK0lwzahqdm1n/t/n/ZGGB4JGAAK//jkMCNIAH6qAMtHN//////////+DEVRvfVvS7rq2+lUlX/5Vf7LVflXSUGRoBAIYIhITQuGSOqTERj9FoYnt2mRtmRG+1G9O2VsTk/rP8+OjkoxpnsFhYrm5JJSQWKRst5tQ8tmpadrJ5vU9VWTusr7KnYk7GWrW9R6dTvUu7adinDEgdmZPV/90On2J2VKqlD8J00RmiwQFAY9z//////////////ygyRof//U86v/l0qrr/yZctrNz01//qZFgwDoOYLBY1NTU1NTU1NTU1NTU1NQYcINVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        break;
    }
    
    // Jouer le son
    audioRef.current.play().catch(err => console.log('Audio play error:', err));
  };

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
      
      // Simuler un délai pour l'effet visuel
      setTimeout(() => {
        if (mounted) {
          // Montrer l'effet Matrix
          setShowMatrixEffect(true);
          playSound('beam');
          
          setTimeout(() => {
            if (mounted) {
              // Passer au mode UV avec effet de glitch
              setGlitchEffect(true);
              playSound('glitch');
              
              setTimeout(() => {
                if (mounted) {
                  setPhase('uv');
                  toggleUVMode();
                  setIsTorchActive(true);
                  
                  // Montrer le texte de déchiffrement après un court délai
                  setTimeout(() => {
                    if (mounted) {
                      setShowDecryptMessage(true);
                      playSound('decrypt');
                      decryptText();
                    }
                  }, 1000);
                  
                  // Passer à la phase finale après une animation complète
                  setTimeout(() => {
                    if (mounted) {
                      setPhase('complete');
                      playSound('complete');
                      
                      // Redirection après la fin du chargement
                      setTimeout(() => {
                        if (mounted) {
                          setLoading(false);
                          // Naviguer vers la page d'accueil
                          navigate('/', { replace: true });
                        }
                      }, 1500);
                    }
                  }, 4500);
                }
              }, 1000);
            }
          }, 2000);
        }
      }, 1000);
    };
    
    // Démarrer le préchargement
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
        <motion.div
          className={`mb-8 relative ${glitchEffect ? 'glitch-effect' : ''}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <LogoWithEffect
            src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
            alt="MTNR Studio"
            width="400px"
            glowEffect={true}
            glowColor={phase === 'uv' ? '210, 255, 63' : '255, 221, 0'}
            isVisible={isLogoVisible}
            logoRef={logoRef}
            className={`transform-gpu ${glitchEffect ? 'glitch-logo' : ''}`}
          />
          
          {/* Effet de glitch sur le logo */}
          {glitchEffect && (
            <>
              <div className="absolute inset-0 logo-glitch-1"></div>
              <div className="absolute inset-0 logo-glitch-2"></div>
            </>
          )}
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

