
import React, { useRef, useEffect, useState } from 'react';
import { ElevatorTransitionProps } from './ElevatorTypes';
import { useElevatorTransition } from './useElevatorTransition';

const ElevatorTransition = ({ children, isActive, onAnimationComplete }: ElevatorTransitionProps) => {
  const { 
    direction, 
    exitContent, 
    enterContent,
    isTransitioning,
    contentEntranceDelay
  } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    currentPath: children
  });
  
  // Références pour accéder aux éléments DOM
  const contentRef = useRef<HTMLDivElement>(null);
  const barrierRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  
  // État pour suivre si l'animation a été commencée
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Effet pour gérer l'animation "repetile" avancée avec 8 phases
  useEffect(() => {
    // Ne rien faire si la transition n'est pas active ou si les refs ne sont pas disponibles
    if (!isTransitioning || !barrierRef.current || !trackRef.current || !contentRef.current) return;
    
    // Si l'animation est déjà lancée, ne pas la redémarrer
    if (animationStarted) return;
    setAnimationStarted(true);
    
    const barrier = barrierRef.current;
    const track = trackRef.current;
    const contentEl = contentRef.current;
    
    // Annuler l'animation précédente si elle existe encore
    if (animationRef.current) {
      animationRef.current.cancel();
    }
    
    // Configuration avancée avec 8 phases et poids spécifiques
    const weights = [8, 4, 2, 1, 1, 2, 4, 8]; // très lent → rapide → rapide → très lent
    const total = weights.reduce((a, b) => a + b, 0);
    
    // Durées en ms pour chaque phase (total = 7000ms)
    const durations = weights.map(w => w * 7000 / total);
    
    // Offsets normalisés [0, t1, t2, ..., t7, 1]
    const offsets = [0];
    let acc = 0;
    for (let i = 0; i < durations.length - 1; i++) {
      acc += durations[i];
      offsets.push(acc / 7000);
    }
    offsets.push(1);
    
    // Blur à chaque étape (plus c'est rapide, plus c'est flou)
    const blurMap = [0, 2, 6, 10, 10, 6, 2, 0]; // 8 valeurs pour les 8 phases
    
    // Cloner l'ancien contenu pour éviter les problèmes de référence
    const cloneExitContent = (exitElement: HTMLElement): HTMLElement => {
      // Création d'un clone profond de l'élément
      const clone = exitElement.cloneNode(true) as HTMLElement;
      // Copier les styles calculés
      const styles = window.getComputedStyle(exitElement);
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        clone.style.setProperty(prop, styles.getPropertyValue(prop));
      }
      return clone;
    };
    
    // Obtenir le contenu HTML
    const exitWrapper = document.getElementById('exit-content-wrapper');
    const exitHTML = exitWrapper ? cloneExitContent(exitWrapper).outerHTML : '<div>Chargement...</div>';
        
    // Nettoyer le track
    while (track.firstChild) {
      track.removeChild(track.firstChild);
    }
    
    // Créer les 7 slides de "vieux contenu" de manière optimisée
    const createSlide = (index: number, content: string) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = content;
      slide.style.top = `${index * 100}%`;
      slide.style.transform = 'translateZ(0)';
      return slide;
    };
    
    // Utiliser DocumentFragment pour améliorer les performances
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 7; i++) {
      fragment.appendChild(createSlide(i, exitHTML));
    }
    
    // 8ème slide = "nouveau contenu"
    const enterWrapper = document.getElementById('enter-content-wrapper');
    if (enterWrapper) {
      const enterHTML = cloneExitContent(enterWrapper).outerHTML;
      fragment.appendChild(createSlide(7, enterHTML));
    }
    
    // Ajouter tous les slides en une seule opération
    track.appendChild(fragment);
    
    // Ajuster la hauteur du track à 800%
    track.style.height = '800%';
    
    // Afficher la barrière, masquer le contenu d'origine
    barrier.classList.add('barrier-visible');
    barrier.style.visibility = 'visible';
    contentEl.classList.add('content-hidden');
    contentEl.style.visibility = 'hidden';
    
    // Créer l'animation avec optimisations pour la performance
    const keyframes = offsets.map((offset, i) => ({
      offset: offset,
      transform: `translateY(-${i * 100}%) translateZ(0)`,
      filter: `blur(${blurMap[i]}px)`
    }));
    
    console.log("Démarrage de l'animation Repetile avancée optimisée sur 7000ms");
    
    // Utiliser l'API Web Animations avec timing optimisé
    try {
      animationRef.current = track.animate(keyframes, {
        duration: 7000,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)', // Courbe d'accélération optimisée
        fill: 'forwards',
        composite: 'replace' // Optimisation des performances
      });
      
      // À la fin de l'animation
      animationRef.current.onfinish = () => {
        console.log("Animation Repetile terminée, finalisation");
        
        // Réinitialiser les états
        contentEl.classList.remove('content-hidden');
        contentEl.style.visibility = 'visible';
        barrier.classList.remove('barrier-visible');
        barrier.style.visibility = 'hidden';
        
        // Nettoyer le contenu du track
        while (track.firstChild) {
          track.removeChild(track.firstChild);
        }
        track.style.height = '';
        
        // Réinitialiser l'état de l'animation
        animationRef.current = null;
        setAnimationStarted(false);
        
        // Terminer la transition
        onAnimationComplete();
      };
      
      // Gestionnaire d'erreur
      animationRef.current.onremove = animationRef.current.onfinish;
      animationRef.current.oncancel = () => {
        // Nettoyage en cas d'annulation
        contentEl.style.visibility = 'visible';
        barrier.style.visibility = 'hidden';
        setAnimationStarted(false);
      };
    } catch (error) {
      console.error("Erreur d'animation:", error);
      // Fallback si l'animation échoue
      contentEl.style.visibility = 'visible';
      barrier.style.visibility = 'hidden';
      setAnimationStarted(false);
      onAnimationComplete();
    }
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
      barrier.style.visibility = 'hidden';
      contentEl.style.visibility = 'visible';
      setAnimationStarted(false);
    };
  }, [isTransitioning, direction, exitContent, enterContent, onAnimationComplete, animationStarted]);
  
  // Si transition inactive, afficher simplement le contenu
  if (!isTransitioning) {
    return <div ref={contentRef} className="elevator-content">{children}</div>;
  }
  
  return (
    <div className="elevator-container">
      <div ref={contentRef} className="elevator-content exit-content">
        <div id="exit-content-wrapper">
          {exitContent}
        </div>
      </div>
      
      {/* Barrière qui masque le défilement */}
      <div ref={barrierRef} className="slider-barrier">
        <div ref={trackRef} className="slider-track"></div>
      </div>
      
      {/* Contenu qui entrera à la fin */}
      <div className="elevator-content enter-content visually-hidden">
        <div id="enter-content-wrapper">
          {enterContent}
        </div>
      </div>
    </div>
  );
};

export default ElevatorTransition;
