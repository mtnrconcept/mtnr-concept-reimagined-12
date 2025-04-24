
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "w-full fixed top-0 left-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/85 backdrop-blur-lg shadow-lg" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <img 
            src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png" 
            alt="Logo MTNR" 
            className="h-10 w-auto object-contain rounded shadow-lg border border-yellow-400/30" 
            draggable={false} 
          />
          <span className="font-display text-3xl sm:text-4xl tracking-tight uppercase text-primary neon-text">
            MTNR
          </span>
        </Link>
        
        {/* Mobile menu toggle */}
        <button 
          className="md:hidden flex items-center p-2 rounded-full bg-black/60 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300" 
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
        <ul className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden hover:text-yellow-300",
                  pathname === link.path 
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400" 
                    : "text-white/80"
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link 
              to="/book" 
              className="ml-2 px-4 py-2 bg-yellow-400/90 text-black font-bold rounded-lg border border-yellow-600/20 hover:bg-yellow-300 transition-all shadow-md hover:shadow-yellow-400/20"
            >
              Book Now
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Mobile navigation */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-lg border-t border-yellow-400/20 animate-fade-in">
          <ul className="flex flex-col py-3">
            {navLinks.map((link) => (
              <li key={link.path} className="border-b border-yellow-400/10 last:border-b-0">
                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block px-6 py-3 font-medium transition-all",
                    pathname === link.path ? "text-primary" : "text-white/80"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="px-6 py-3">
              <Link 
                to="/book" 
                onClick={() => setMenuOpen(false)}
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
