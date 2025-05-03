
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from './NavigationContext';

export const BackgroundVideoController = () => {
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    // Initialiser le préchargement une seule fois
    const videoUrls = [
      '/lovable-uploads/Composition_1.mp4',
      '/lovable-uploads/Composition_1_1.mp4'
    ];
    
    console.info('Initialisation du préchargement des vidéos');
    
    // Fonction de préchargement optimisée qui utilise un élément vidéo
    const preloadVideo = (url) => {
      // Créer un élément vidéo de préchargement invisible
      const preloadEl = document.createElement('video');
      preloadEl.preload = 'auto';
      preloadEl.muted = true;
      preloadEl.playsInline = true;
      preloadEl.src = url;
      
      // Charger les métadonnées pour préparer la lecture
      preloadEl.load();
      
      console.info(`Préchargement de ${url} initialisé`);
      
      // Retourner une promesse qui se résout quand les métadonnées sont chargées
      return new Promise((resolve, reject) => {
        preloadEl.onloadedmetadata = () => {
          console.info(`Métadonnées chargées pour ${url}`);
          resolve(preloadEl);
        };
        
        preloadEl.onerror = (err) => {
          console.error(`Erreur lors du préchargement de ${url}:`, err);
          reject(err);
        };
        
        // Timeout de sécurité si les métadonnées ne se chargent pas
        setTimeout(() => {
          if (!preloadEl.readyState) {
            console.warn(`Timeout du préchargement pour ${url}`);
            resolve(preloadEl); // On résout quand même pour ne pas bloquer
          }
        }, 5000);
      });
    };
    
    // Précharger les deux vidéos en parallèle
    Promise.all(videoUrls.map(url => preloadVideo(url)))
      .then(() => {
        console.info('Préchargement des vidéos terminé, prêt pour la navigation');
      })
      .catch(err => {
        console.warn('Certaines vidéos n\'ont pas été préchargées correctement:', err);
      });
    
    // Écouter les clics sur les liens pour activer la transition avant le changement de page
    const handleLinkClick = (e) => {
      if (e.target.tagName === 'A' && 
          e.target.getAttribute('href') && 
          !e.target.getAttribute('href').startsWith('http')) {
        console.log('Clic sur un lien interne détecté, déclenchement de la transition vidéo');
        navigation.triggerVideoTransition();
      }
    };
    
    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
      console.info('Nettoyage du contrôleur vidéo');
    };
  }, []); // Dépendance vide pour exécuter une seule fois au montage

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
