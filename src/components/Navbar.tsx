
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigation } from "./effects/NavigationContext";

const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "What We Do", path: "/what-we-do" },
  { name: "Artistes", path: "/artists" },
  { name: "Book ta session", path: "/book" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigation = useNavigation();

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

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // Si on clique sur le lien de la page actuelle, ne rien faire
    if (path === pathname) return;
    
    // Déclencher l'événement de transition vidéo avant la navigation
    console.log(`Navigation vers ${path}, déclenchement de la transition vidéo`);
    navigation.triggerVideoTransition();
  };

  // On supprime les animations pour que la navbar reste toujours visible
  return (
    <nav 
      className={cn(
        "w-full fixed top-0 left-0 z-[100] transition-all duration-300",
        scrolled ? "bg-black/85 backdrop-blur-lg shadow-lg" : "bg-transparent"
      )}
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
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group hover:text-yellow-300",
                  pathname === link.path 
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400" 
                    : "text-white/80"
                )}
                onClick={(e) => handleNavClick(e, link.path)}
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute inset-0 bg-black/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                {pathname === link.path && (
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
          <li>
            <Link 
              to="/book" 
              className="ml-2 px-5 py-2.5 bg-yellow-400/90 text-black font-bold rounded-lg border border-yellow-600/20 hover:bg-yellow-300 transition-all shadow-md hover:shadow-yellow-400/20 relative overflow-hidden group"
              onClick={(e) => handleNavClick(e, "/book")}
            >
              <span className="relative z-10">Book Now</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-yellow-300 to-yellow-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Mobile navigation */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-lg border-t border-yellow-400/20 animate-fade-in">
          <ul 
            className="flex flex-col py-3"
          >
            {navLinks.map((link) => (
              <li 
                key={link.path} 
                className="border-b border-yellow-400/10 last:border-b-0"
              >
                <Link
                  to={link.path}
                  onClick={(e) => {
                    handleNavClick(e, link.path);
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "block px-6 py-3 font-medium transition-all",
                    pathname === link.path ? "text-primary" : "text-white/80"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li 
              className="px-6 py-3"
            >
              <Link 
                to="/book" 
                onClick={(e) => {
                  handleNavClick(e, "/book");
                  setMenuOpen(false);
                }}
                className="block w-full py-2 bg-yellow-400/90 text-black font-bold text-center rounded-lg hover:bg-yellow-300 transition-all"
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
