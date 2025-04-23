
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    <nav className="w-full bg-black/65 paper-texture backdrop-blur-xl fixed top-0 left-0 z-50 border-b-2 border-yellow-400/40 grunge-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png" alt="Logo MTNR" className="h-12 w-auto object-contain rounded shadow-2xl border-2 border-yellow-400/60 bg-paper" draggable={false} />
          <span className="font-nosegrind text-2xl xs:text-3xl tracking-tight uppercase text-primary drop-shadow-lg select-none"
            style={{ letterSpacing: "0.09em", textShadow: "0 3px 18px #000,0 0 10px #fdec2066" }}
          >
            MTNR
          </span>
        </Link>
        {/* Hamburger pour mobile */}
        <button className="md:hidden flex items-center p-2 border border-yellow-400 rounded bg-black/60" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="w-7 h-7 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        <ul className={cn(
          "flex-col md:flex-row md:flex gap-5 font-grunge text-lg md:text-xl font-black uppercase fixed md:static top-16 left-0 w-full md:w-auto bg-black/95 md:bg-transparent z-40 transition-all duration-300",
          menuOpen ? "flex" : "hidden md:flex"
        )}>
          {navLinks.map((link) => (
            <li key={link.path} className="py-3 md:py-0 border-b md:border-0 border-yellow-400/20 md:ml-3 text-center">
              <Link
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "relative py-1 px-4 after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left",
                  "transition-colors duration-200 font-black uppercase tracking-tight rounded-md hover:text-yellow-300",
                  pathname === link.path ? "text-primary after:scale-x-100" : "text-white/90"
                )}
                style={{
                  textShadow: "0 2px 7px #111, 0 0 7px #ffd60039",
                  letterSpacing: "0.035em"
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
