
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  progress?: number; // Permettre de passer une progression externe
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete, 
  progress: externalProgress 
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initialisation...");
  
  // Liste des messages à afficher pendant le chargement
  const loadingMessages = [
    "Initialisation...",
    "Chargement des vidéos...",
    "Préparation des effets spéciaux...",
    "Activation du mode UV...",
    "Synchronisation des transitions...",
    "Chargement des secrets...",
    "Optimisation de la performance...",
    "Préchargement des pages...",
    "Presque prêt..."
  ];
  
  // Fonction pour mettre à jour le texte en fonction de la progression
  // Déplacée avant son utilisation pour éviter l'erreur
  const updateLoadingText = (currentProgress: number) => {
    const messageIndex = Math.floor((currentProgress / 100) * (loadingMessages.length - 1));
    setLoadingText(loadingMessages[messageIndex]);
  };
  
  useEffect(() => {
    // Utiliser la progression externe si elle est fournie
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      
      // Mettre à jour le texte en fonction de la progression
      updateLoadingText(externalProgress);
      
      // Si la progression est à 100%, déclencher l'événement de fin après un court délai
      if (externalProgress >= 100) {
        const timer = setTimeout(() => {
          onLoadingComplete();
        }, 1000);
        return () => clearTimeout(timer);
      }
      
      return;
    }
    
    // Simuler une progression de chargement
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onLoadingComplete();
        }, 500); // Légère pause à 100% avant de disparaître
        return;
      }
      
      // Incrémentation progressive qui ralentit vers la fin pour simuler le chargement réel
      const increment = Math.max(1, Math.floor((100 - currentProgress) / 10));
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);
      
      // Mise à jour du texte de chargement
      updateLoadingText(currentProgress);
      
    }, 150);
    
    return () => clearInterval(interval);
  }, [onLoadingComplete, externalProgress]);
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black z-[100000] flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold mb-2 loading-title">MTNR</h1>
            <p className="text-gray-400 text-xl">Studio Concept</p>
          </motion.div>
        </div>

        <div className="mb-2">
          <Progress value={progress} className="h-2 bg-gray-800">
            <div 
              className="absolute bg-yellow-400 h-full transition-all duration-300 ease-in-out rounded-full"
              style={{ width: `${progress}%` }} 
            />
          </Progress>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="text-yellow-400 flex items-center">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            <span>{loadingText}</span>
          </div>
          <div className="text-gray-300">{progress}%</div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Préparation de l'expérience immersive...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
