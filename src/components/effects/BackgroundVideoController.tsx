
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from './NavigationContext';

export const BackgroundVideoController = () => {
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    // Initialiser le préchargement une seule fois avec les noms corrects des fichiers vidéo
    const videoUrls = [
      '/lovable-uploads/videonormale.mp4',
      '/lovable-uploads/videouv.mp4'
    ];
    
    console.info('Initialisation du préchargement des vidéos');
    
    // Fonction de préchargement optimisée qui utilise un élément vidéo et la mise en cache
    const preloadVideo = (url) => {
      return new Promise((resolve, reject) => {
        // Vérifier si la vidéo est déjà dans le cache du navigateur
        const cachedVideo = window.sessionStorage.getItem(`video-cache-${url}`);
        if (cachedVideo === 'loaded') {
          console.info(`Vidéo ${url} déjà en cache`);
          resolve(url);
          return;
        }

        // Créer un élément vidéo de préchargement invisible
        const preloadEl = document.createElement('video');
        preloadEl.preload = 'auto';
        preloadEl.muted = true;
        preloadEl.playsInline = true;
        preloadEl.crossOrigin = 'anonymous'; // Pour permettre la mise en cache
        preloadEl.src = url;
        
        // Charger entièrement la vidéo pour un préchargement complet
        preloadEl.load();
        
        console.info(`Préchargement de ${url} initialisé`);
        
        // Événements pour suivre le chargement complet
        preloadEl.oncanplaythrough = () => {
          console.info(`Vidéo ${url} entièrement préchargée et prête pour lecture fluide`);
          // Marquer la vidéo comme mise en cache
          window.sessionStorage.setItem(`video-cache-${url}`, 'loaded');
          resolve(url);
        };
        
        preloadEl.onerror = (err) => {
          console.error(`Erreur lors du préchargement de ${url}:`, err);
          reject(err);
        };
        
        // Timeout de sécurité (10 secondes)
        setTimeout(() => {
          if (!preloadEl.readyState) {
            console.warn(`Timeout du préchargement pour ${url}`);
            resolve(url); // On résout quand même pour ne pas bloquer
          }
        }, 10000);
      });
    };
    
    // Précharger les deux vidéos en parallèle
    Promise.all(videoUrls.map(url => preloadVideo(url)))
      .then((results) => {
        console.info('Préchargement des vidéos terminé, prêt pour la navigation', results);
        
        // Éventuellement signaler à l'application que les vidéos sont prêtes
        if (typeof window !== 'undefined') {
          window.__videoAssetsPreloaded = true;
        }
      })
      .catch(err => {
        console.warn('Certaines vidéos n\'ont pas été préchargées correctement:', err);
      });
    
    // Écouter les clics sur les liens pour activer la transition avant le changement de page
    const handleLinkClick = (e) => {
      if (e.target.tagName === 'A' && 
          e.target.getAttribute('href') && 
          !e.target.getAttribute('href').startsWith('http') &&
          !e.target.getAttribute('href').startsWith('#')) {
        console.log('Clic sur un lien interne détecté, déclenchement de la transition vidéo');
        // Déclencher la transition vidéo avant le changement de page
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
