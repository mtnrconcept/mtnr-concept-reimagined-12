
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
// Nous n'utilisons plus vraiment l'effet de mouvement, mais on garde l'import pour compatibilité
import { useNavbarEffect } from "@/hooks/useNavbarEffect";

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
  
  return (
    <nav 
      className="w-full fixed top-0 left-0 bg-black/85 backdrop-blur-lg shadow-lg"
      style={{ 
        position: 'fixed',
        isolation: 'isolate',
        zIndex: 100000, // Nombre encore plus élevé pour garantir qu'il est vraiment au-dessus
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        pointerEvents: 'all', // Important pour que la navbar reste interactive
      }}
    >
      <div className="container mx-auto flex justify-center h-16 px-4 sm:px-6">
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
        <DesktopNav navLinks={navLinks} currentPath={pathname} />
      </div>
      
      {/* Mobile navigation */}
      <MobileNav 
        isOpen={menuOpen} 
        navLinks={navLinks} 
        currentPath={pathname}
        onLinkClick={() => setMenuOpen(false)}
      />
    </nav>
  );
}
