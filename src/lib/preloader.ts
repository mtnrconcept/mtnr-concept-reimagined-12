
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
  return new Promise((resolve, reject) => {
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

// Précharger une vidéo avec mise en cache
const preloadVideo = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Vérifier si la vidéo est déjà dans le cache
    if (resourceCache.videos.has(url)) {
      resolve();
      return;
    }
    
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    
    let loaded = false;
    
    // On considère qu'une vidéo est préchargée quand suffisamment de données sont disponibles
    video.oncanplaythrough = () => {
      if (!loaded) {
        loaded = true;
        resourceCache.videos.set(url, video);
        resolve();
      }
    };
    
    video.onerror = () => {
      console.warn(`Échec du préchargement de la vidéo: ${url}`);
      resolve(); // On résout quand même pour ne pas bloquer le processus
    };
    
    // Timeout pour éviter d'attendre trop longtemps
    setTimeout(() => {
      if (!loaded) {
        loaded = true;
        console.warn(`Timeout du préchargement pour: ${url}`);
        resolve();
      }
    }, 8000); // 8 secondes maximum par vidéo
    
    video.src = url;
    video.load();
  });
};

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
    
    // Note: On ne peut pas accéder à `getAssets` directement car ce n'est pas une propriété standard
    // Au lieu de cela, nous préchargeons simplement les composants de page
    
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
    
    // Précharger les routes et l'UI en parallèle
    await Promise.all([
      preloadRoutes(),
      preloadUI()
    ]);
    
    // Précharger ensuite les ressources média (peut prendre plus de temps)
    await preloadAllResources();
    
    // Créer et attacher un gestionnaire d'événements pour précharger
    // les pages lors des hover sur les liens de navigation
    document.addEventListener('DOMContentLoaded', () => {
      attachNavigationPreloading();
    });
    
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
    return resourceCache.videos.has(url);
  }
  return false;
};
