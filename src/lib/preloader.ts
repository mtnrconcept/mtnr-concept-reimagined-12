
// Liste des ressources à précharger
const resources = {
  videos: [
    "/lovable-uploads/videonormale.mp4",
    "/lovable-uploads/videouv.mp4"
  ],
  images: [
    "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png",
    "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png",
    "/lovable-uploads/47-473376_splash-by-highpoweredart-on-black-paint-splash-png.png",
    "/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png",
    "/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png",
    "/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png",
    "/lovable-uploads/5e71b343-84de-46de-ab26-ad53863f8f6f.png",
    "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png",
    "/lovable-uploads/6d9c5bde7a1a980174b6d555586ff1b0.png",
    "/lovable-uploads/7eefa948-da3a-4bfd-8b4b-e19299caaa22.png",
    "/lovable-uploads/abe06f9b-f700-4a49-a4d8-b4d68c473e70.png",
    "/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png",
    "/lovable-uploads/c51ac031-c85b-42b2-8d7d-b14f16692636.png",
    "/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png",
    "/lovable-uploads/ed3157a2-e211-4f4e-87c4-f3976efe1025.png",
    "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png",
    "/lovable-uploads/ff5c872a-d737-47fe-a427-a31849cceac3.png",
    "/lovable-uploads/paint-splatter-hi.png",
    "/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png",
    "/lovable-uploads/tv.png",
    "/lovable-uploads/yellow-watercolor-splatter-3.png",
    "/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png",
  ],
  components: [
    // Liste des chemins des composants principaux à précharger
    'Navbar',
    'ParallaxScene', 
    'PageSplashes',
    'LoadingScreen',
    'BackgroundVideo',
    'ParticleEffect'
  ]
};

// Cache de ressources
const resourceCache = {
  images: new Map<string, HTMLImageElement>(),
  videos: new Map<string, HTMLVideoElement>(),
  components: new Map<string, any>()
};

// Précharger une image avec mise en cache
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    // Vérifier si l'image est déjà dans le cache
    if (resourceCache.images.has(url)) {
      resolve();
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      resourceCache.images.set(url, img);
      resolve();
    };
    img.onerror = () => {
      console.warn(`Échec du préchargement de l'image: ${url}`);
      resolve(); // On résout quand même pour ne pas bloquer le processus
    };
    img.src = url;
  });
};

// Précharger une vidéo avec mise en cache et meilleure gestion des erreurs
const preloadVideo = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    // Vérifier si la vidéo est déjà dans le cache
    if (resourceCache.videos.has(url)) {
      resolve();
      return;
    }
    
    // Vérifier également le cache de session
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(`video-cache-${url}`) === 'loaded') {
      console.log(`Vidéo ${url} déjà préchargée selon sessionStorage`);
      
      // Créer un élément vidéo rapide pour le cache même si déjà préchargé
      const quickVideo = document.createElement('video');
      quickVideo.src = url;
      quickVideo.preload = 'auto';
      quickVideo.muted = true;
      resourceCache.videos.set(url, quickVideo);
      
      resolve();
      return;
    }
    
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    
    let loaded = false;
    
    // Utilisons plusieurs événements pour détecter quand la vidéo est suffisamment chargée
    const markAsLoaded = () => {
      if (!loaded) {
        loaded = true;
        resourceCache.videos.set(url, video);
        
        // Marquer comme chargé dans sessionStorage pour persistance entre navigations
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(`video-cache-${url}`, 'loaded');
        }
        
        console.log(`Vidéo ${url} préchargée avec succès et mise en cache`);
        resolve();
      }
    };
    
    // Plusieurs événements qui peuvent indiquer une vidéo chargée
    video.oncanplaythrough = markAsLoaded;
    video.onloadeddata = () => {
      // Si nous avons au moins les premières frames, c'est probablement suffisant
      setTimeout(markAsLoaded, 500);
    };
    
    video.onerror = () => {
      console.warn(`Échec du préchargement de la vidéo: ${url}`);
      // Même en cas d'erreur, on essaie de marquer une entrée dans le cache
      // pour éviter de réessayer continuellement
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(`video-cache-${url}`, 'error');
      }
      resolve(); // On résout quand même pour ne pas bloquer le processus
    };
    
    // Timeout plus court pour éviter d'attendre trop longtemps
    setTimeout(() => {
      if (!loaded) {
        loaded = true;
        console.warn(`Timeout du préchargement pour: ${url}, mais on continue quand même`);
        // Même avec un timeout, on enregistre ce qu'on a dans le cache
        resourceCache.videos.set(url, video);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(`video-cache-${url}`, 'partial');
        }
        resolve();
      }
    }, 5000); // 5 secondes maximum par vidéo (réduit de 8 à 5 secondes)
    
    video.src = url;
    video.load();
    
    // Essayer de précharger également via l'API Cache si disponible
    if ('caches' in window) {
      caches.open('video-cache').then(cache => {
        fetch(url, { mode: 'no-cors' })
          .then(response => {
            cache.put(url, response);
          })
          .catch(error => {
            console.warn('Erreur lors de la mise en cache avec Cache API:', error);
          });
      });
    }
  });
};

// Fonction spéciale pour forcer le préchargement des vidéos
export const forcePrecacheVideos = (): Promise<void> => {
  console.log('Forçage du préchargement des vidéos...');
  
  return new Promise((resolve) => {
    // Précharger les vidéos en parallèle
    const videoPromises = resources.videos.map(videoUrl => {
      // Si déjà en cache, on crée quand même un nouvel élément pour rafraîchir
      if (resourceCache.videos.has(videoUrl)) {
        resourceCache.videos.delete(videoUrl);
      }
      
      return preloadVideo(videoUrl);
    });
    
    Promise.all(videoPromises)
      .then(() => {
        console.log('Préchargement forcé des vidéos terminé');
        resolve();
      })
      .catch(error => {
        console.error('Erreur lors du préchargement forcé des vidéos:', error);
        resolve(); // Toujours résoudre pour ne pas bloquer
      });
  });
};

// Exposer la fonction au niveau global
if (typeof window !== 'undefined') {
  window.__forcePrecacheVideos = forcePrecacheVideos;
}

// Fonction principale pour précharger toutes les ressources
export const preloadAllResources = async (): Promise<void> => {
  console.log("Démarrage du préchargement des ressources...");
  
  try {
    // Précharger les vidéos (prioritaire)
    const videoPromises = resources.videos.map(preloadVideo);
    await Promise.all(videoPromises);
    console.log("Vidéos préchargées avec succès");
    
    // Précharger les images
    const imagePromises = resources.images.map(preloadImage);
    await Promise.all(imagePromises);
    console.log("Images préchargées avec succès");
    
    console.log("Toutes les ressources ont été préchargées!");
  } catch (error) {
    console.error("Erreur lors du préchargement des ressources:", error);
  }
};

// Précharger les routes pour React Router
export const preloadRoutes = async (): Promise<void> => {
  try {
    // Importer dynamiquement les composants de page principaux
    await Promise.all([
      import('../pages/Home'),
      import('../pages/WhatWeDo'),
      import('../pages/Artists'),
      import('../pages/Contact'),
      import('../pages/Book'),
      import('../pages/NotFound')
    ]);
    
    console.log("Composants de route préchargés");
  } catch (error) {
    console.error("Erreur lors du préchargement des routes:", error);
  }
};

// Précharger les principaux composants UI
export const preloadUI = async (): Promise<void> => {
  try {
    // Précharger les composants essentiels en parallèle
    const componentModules = await Promise.all([
      import('../components/Navbar'),
      import('../components/effects/ParticleEffect'),
      import('../components/effects/TorchToggle'),
      import('../components/effects/BackgroundVideo'),
      import('../components/ParallaxScene')
    ]);
    
    // Stocker les composants dans le cache - s'assurer que chaque module a un export default
    resources.components.forEach((componentName, index) => {
      if (index < componentModules.length) {
        const module = componentModules[index];
        // Vérifier si le module a un export default avant de l'utiliser
        if ('default' in module) {
          resourceCache.components.set(componentName, module.default);
        }
      }
    });
    
    console.log("Composants UI principaux préchargés");
  } catch (error) {
    console.error("Erreur lors du préchargement des composants UI:", error);
  }
};

// Fonction globale de préchargement
export const initializePreloader = async (): Promise<void> => {
  try {
    console.log("Initialisation du préchargeur...");
    
    // Précharger en priorité les vidéos pour prévenir les saccades
    await preloadAllResources();
    
    // Précharger les routes et l'UI en parallèle
    await Promise.all([
      preloadRoutes(),
      preloadUI()
    ]);
    
    // Créer et attacher un gestionnaire d'événements pour précharger
    // les pages lors des hover sur les liens de navigation
    if (typeof document !== 'undefined') {
      attachNavigationPreloading();
    }
    
    console.log("Préchargement initial terminé");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du préchargement:", error);
  }
};

// Attacher des listeners pour précharger les pages au survol des liens
const attachNavigationPreloading = () => {
  const navLinks = document.querySelectorAll('a[href^="/"]');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        // Précharger la page au survol
        const route = href.substring(1) || 'home';
        let routeName = route.charAt(0).toUpperCase() + route.slice(1);
        
        // Gérer les routes avec des tirets
        if (route.includes('-')) {
          routeName = route.split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
        }
        
        import(`../pages/${routeName}`)
          .catch(() => console.log(`Préchargement de ${routeName} non nécessaire ou impossible`));
      }
    });
  });
};

// Récupérer une ressource du cache
export const getCachedResource = (type: 'image' | 'video', url: string): HTMLImageElement | HTMLVideoElement | null => {
  if (type === 'image') {
    return resourceCache.images.get(url) || null;
  } else if (type === 'video') {
    return resourceCache.videos.get(url) || null;
  }
  return null;
};

// Vérifier si une ressource est dans le cache
export const isResourceCached = (type: 'image' | 'video', url: string): boolean => {
  if (type === 'image') {
    return resourceCache.images.has(url);
  } else if (type === 'video') {
    return resourceCache.videos.has(url) || 
           (typeof window !== 'undefined' && window.sessionStorage.getItem(`video-cache-${url}`) === 'loaded');
  }
  return false;
};
