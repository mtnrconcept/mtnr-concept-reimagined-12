
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useNavigation } from "./effects/NavigationContext";

interface PageContentTransitionProps {
  children: React.ReactNode;
}

const PageContentTransition: React.FC<PageContentTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const { triggerVideoTransition, isTransitioning } = useNavigation();
  
  // Custom transition timing constants
  const CONTENT_FADE_OUT_DURATION = 3; // 3 seconds for content to fade out
  const PAUSE_DURATION = 2; // 2 seconds pause before new content appears
  const CONTENT_FADE_IN_DURATION = 2; // 2 seconds for new content to fade in
  const CONTENT_SWITCH_DELAY = CONTENT_FADE_OUT_DURATION + (PAUSE_DURATION / 2); // Switch content after fade-out + half of pause
  
  // Effect that handles transitions when route changes
  useEffect(() => {
    console.log("Page change detected:", location.pathname);
    
    // Trigger the video transition
    triggerVideoTransition();
    
    // Schedule the content switch after fade-out + half of pause duration
    const contentSwitchTimer = setTimeout(() => {
      setDisplayChildren(children);
      console.log("New content prepared for display");
    }, CONTENT_SWITCH_DELAY * 1000);
    
    return () => {
      clearTimeout(contentSwitchTimer);
    };
  }, [children, location.pathname, triggerVideoTransition, CONTENT_SWITCH_DELAY]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            delay: CONTENT_FADE_OUT_DURATION + PAUSE_DURATION, 
            duration: CONTENT_FADE_IN_DURATION,
            ease: "easeInOut"
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: CONTENT_FADE_OUT_DURATION,
            ease: "easeInOut"
          }
        }}
        className="relative z-10 min-h-screen w-full pointer-events-auto"
        style={{
          willChange: "opacity, transform",
        }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0, rotateX: 5 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            rotateX: 0,
            transition: { 
              delay: CONTENT_FADE_OUT_DURATION + PAUSE_DURATION, 
              duration: CONTENT_FADE_IN_DURATION, 
              ease: "easeOut"
            }
          }}
          exit={{ 
            y: -40, 
            opacity: 0,
            transition: { 
              duration: CONTENT_FADE_OUT_DURATION,
              ease: "easeOut"
            }
          }}
          className="h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center"
          }}
        >
          {displayChildren}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
