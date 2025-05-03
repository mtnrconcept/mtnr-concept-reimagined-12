
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
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
  const { mousePosition } = useNavbarEffect();

  return (
    <nav 
      className={cn(
        "w-full fixed top-0 left-0 z-[100] bg-black/85 backdrop-blur-lg shadow-lg",
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
