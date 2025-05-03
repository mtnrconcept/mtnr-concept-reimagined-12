
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initialisation...");
  
  useEffect(() => {
    // Liste des messages à afficher pendant le chargement
    const loadingMessages = [
      "Initialisation...",
      "Chargement des vidéos...",
      "Préparation des effets spéciaux...",
      "Activation du mode UV...",
      "Synchronisation des transitions...",
      "Chargement des secrets...",
      "Presque prêt..."
    ];
    
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
      const messageIndex = Math.floor((currentProgress / 100) * (loadingMessages.length - 1));
      setLoadingText(loadingMessages[messageIndex]);
      
    }, 180); // Ajusté pour une durée totale d'environ 3-4 secondes
    
    return () => clearInterval(interval);
  }, [onLoadingComplete]);
  
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
            <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold mb-2">MTNR</h1>
            <p className="text-gray-400 text-xl">Studio Concept</p>
          </motion.div>
        </div>

        <div className="relative w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-yellow-400"
          />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="text-yellow-400 flex items-center">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            <span>{loadingText}</span>
          </div>
          <div className="text-gray-300">{progress}%</div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Préparez-vous à entrer dans l'univers MTNR</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
