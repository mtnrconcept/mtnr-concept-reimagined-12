
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Focus sur navigation musique uniquement !
const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "What We Do", path: "/what-we-do" },
  { name: "Artistes", path: "/artists" },
  { name: "Book ta session", path: "/book" },
  { name: "Contact", path: "/contact" },
  { name: "Boutique", path: "/shop" },
  { name: "Réservation", path: "/reservation" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="w-full bg-black/50 backdrop-blur-xl fixed top-0 left-0 z-30 shadow-2xl border-b border-yellow-400/40">
      <div className="container mx-auto flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png" alt="Logo MTNR" className="h-14 w-auto object-contain rounded shadow-lg ring-2 ring-yellow-400/50 bg-paper" />
          <span className="font-marker text-3xl tracking-widest uppercase text-primary drop-shadow-lg select-none"
            style={{ letterSpacing: "0.1em", textShadow: "0 2px 10px #000,0 0 8px #fdec20bb" }}
          >
            MTNR Concept
          </span>
        </Link>
        <ul className="flex gap-5 font-rocksalt text-lg">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "relative py-1 px-3 after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left",
                  "transition-colors duration-200 font-bold uppercase tracking-tight rounded-md",
                  pathname === link.path ? "text-primary after:scale-x-100 dark:text-yellow-400" : "text-white/90 hover:text-primary"
                )}
                style={{
                  textShadow: "0 2px 6px #000, 0 0 6px #fff5",
                  letterSpacing: "0.04em"
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
