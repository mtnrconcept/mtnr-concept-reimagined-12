
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Prestations", path: "/services" },
  { name: "À propos", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="w-full bg-white/70 backdrop-blur-lg fixed top-0 left-0 z-30 shadow-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/photo-1527576539890-dfa815648363" alt="Logo MTNR" className="h-12 w-auto object-contain rounded" />
          <span className="font-playfair text-2xl font-bold text-gray-900 tracking-widest uppercase">
            MTNR Concept
          </span>
        </Link>
        <ul className="flex gap-6 font-inter text-lg">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "relative py-1 px-2 after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-all after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:duration-300",
                  "transition-colors duration-200",
                  pathname === link.path ? "text-primary after:scale-x-100" : "text-gray-700 hover:text-primary"
                )}
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
