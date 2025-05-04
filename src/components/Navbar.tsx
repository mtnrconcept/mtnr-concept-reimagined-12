
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import LogoWithEffect from "./effects/LogoWithEffect";
import { Link } from "react-router-dom";
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
        zIndex: 100000,
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        height: '80px', // Increased height to ensure logo fits
        pointerEvents: 'all',
      }}
    >
      <div className="container mx-auto flex justify-between items-center h-20 px-4 sm:px-6"> {/* Increased height */}
        {/* Logo with proper spacing and container */}
        <Link to="/" className="h-16 w-auto shrink-0 relative z-10 flex items-center">
          <LogoWithEffect
            src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
            alt="MTNR Logo"
            width="120px"
            glowEffect={true}
            glowColor="255, 221, 0"
            isVisible={true}
            logoRef={null}
            className="h-auto w-auto object-contain max-h-16"
          />
        </Link>
        
        {/* Mobile menu toggle - positioned correctly */}
        <button 
          className="md:hidden absolute right-4 top-6 flex items-center p-2 rounded-full bg-black/60 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300" 
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
        <div className="hidden md:block">
          <DesktopNav navLinks={navLinks} currentPath={pathname} />
        </div>
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
