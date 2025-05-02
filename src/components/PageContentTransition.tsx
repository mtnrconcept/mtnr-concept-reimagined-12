
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
  
  // Video transition timing constants
  const VIDEO_DURATION = 7000; // 7 seconds
  const CONTENT_FADE_OUT_DURATION = 0.7; // seconds
  const CONTENT_FADE_IN_DELAY = 4.0; // seconds
  const CONTENT_FADE_IN_DURATION = 1.5; // seconds
  const CONTENT_SWITCH_DELAY = VIDEO_DURATION / 2; // 3.5 seconds
  
  // Effect that handles transitions when route changes
  useEffect(() => {
    console.log("Page change detected:", location.pathname);
    
    // Trigger the video transition
    triggerVideoTransition();
    
    // Schedule the content switch after half the video duration
    const contentSwitchTimer = setTimeout(() => {
      setDisplayChildren(children);
      console.log("New content prepared for display");
    }, CONTENT_SWITCH_DELAY);
    
    return () => {
      clearTimeout(contentSwitchTimer);
    };
  }, [children, location.pathname, triggerVideoTransition]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            delay: CONTENT_FADE_IN_DELAY / 1000, 
            duration: CONTENT_FADE_IN_DURATION
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: CONTENT_FADE_OUT_DURATION
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
              delay: isTransitioning ? CONTENT_FADE_IN_DELAY / 1000 : 0, 
              duration: CONTENT_FADE_IN_DURATION, 
              ease: "easeOut"
            }
          }}
          exit={{ 
            y: -40, 
            opacity: 0,
            transition: { duration: CONTENT_FADE_OUT_DURATION }
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
