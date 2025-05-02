
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import DesktopNavigation from "./navigation/DesktopNavigation";
import MobileMenu from "./navigation/MobileMenu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 25,
        y: (e.clientY - window.innerHeight / 2) / 25,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.nav 
      className={cn(
        "w-full fixed top-0 left-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/85 backdrop-blur-lg shadow-lg" : "bg-transparent"
      )}
      initial="hidden"
      animate="visible"
      variants={navVariants}
      style={{ 
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      <div 
        className="container mx-auto flex justify-center h-16 px-4 sm:px-6"
        style={{ 
          transform: `translateZ(${mousePosition.y}px) rotateX(${mousePosition.y * -0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        {/* Mobile menu toggle */}
        <button 
          className="md:hidden absolute left-4 top-4 flex items-center p-2 rounded-full bg-black/60 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Menu"
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-yellow-400" />
          ) : (
            <Menu className="w-5 h-5 text-yellow-400" />
          )}
        </button>
        
        {/* Desktop navigation */}
        <DesktopNavigation />
      </div>
      
      {/* Mobile navigation */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </motion.nav>
  );
}
