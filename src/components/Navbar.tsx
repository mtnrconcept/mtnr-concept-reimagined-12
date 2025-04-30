
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "What We Do", path: "/what-we-do" },
  { name: "Artistes", path: "/artists" },
  { name: "Book ta session", path: "/book" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
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
  
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  // Fonction pour naviguer entre les pages de manière sécurisée
  const handleNavigation = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Fermer le menu mobile si ouvert
    if (menuOpen) {
      setMenuOpen(false);
    }
    
    // Si nous sommes déjà sur la page, ne rien faire
    if (location.pathname === path) {
      return;
    }
    
    // Naviguer à la nouvelle page via React Router
    navigate(path);
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
        
        {/* Desktop navigation - centered */}
        <ul className="hidden md:flex items-center space-x-1 lg:space-x-4">
          {navLinks.map((link, index) => (
            <motion.li key={link.path} variants={itemVariants}>
              <a
                href={link.path}
                onClick={(e) => handleNavigation(link.path, e)}
                className={cn(
                  "px-3 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group hover:text-yellow-300",
                  location.pathname === link.path 
                    ? "text-yellow-400 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400" 
                    : "text-white/90"
                )}
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute inset-0 bg-black/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                {location.pathname === link.path && (
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            </motion.li>
          ))}
          <motion.li variants={itemVariants}>
            <a 
              href="/book" 
              onClick={(e) => handleNavigation('/book', e)}
              className="ml-2 px-5 py-2.5 bg-yellow-400/90 text-black font-bold rounded-lg border border-yellow-600/20 hover:bg-yellow-300 transition-all shadow-md hover:shadow-yellow-400/20 relative overflow-hidden group"
            >
              <span className="relative z-10">Book Now</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-yellow-300 to-yellow-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </a>
          </motion.li>
        </ul>
      </div>
      
      {/* Mobile navigation */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-lg border-t border-yellow-400/20 animate-fade-in">
          <motion.ul 
            className="flex flex-col py-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
          >
            {navLinks.map((link) => (
              <motion.li 
                key={link.path} 
                className="border-b border-yellow-400/10 last:border-b-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href={link.path}
                  onClick={(e) => handleNavigation(link.path, e)}
                  className={cn(
                    "block px-6 py-3 font-medium transition-all",
                    location.pathname === link.path ? "text-yellow-400 font-bold" : "text-white/80"
                  )}
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
            <motion.li 
              className="px-6 py-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <a 
                href="/book" 
                onClick={(e) => handleNavigation('/book', e)}
                className="block w-full py-2 bg-yellow-400/90 text-black font-bold text-center rounded-lg hover:bg-yellow-300 transition-all"
              >
                Book Now
              </a>
            </motion.li>
          </motion.ul>
        </div>
      )}
    </motion.nav>
  );
}
