
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// Menu strictement musique/underground
const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "What We Do", path: "/what-we-do" },
  { name: "Artistes", path: "/artists" },
  { name: "Book ta session", path: "/book" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="w-full bg-black/60 paper-texture backdrop-blur-2xl fixed top-0 left-0 z-40 shadow-2xl border-b-2 border-yellow-400/40 grunge-border">
      <div className="container mx-auto flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png" alt="Logo MTNR" className="h-14 w-auto object-contain rounded shadow-2xl border-2 border-yellow-400/60 bg-paper" draggable={false} />
          <span className="font-grunge text-3xl tracking-tight uppercase text-primary drop-shadow-lg select-none"
            style={{ letterSpacing: "0.07em", textShadow: "0 3px 18px #000,0 0 10px #fdec2066" }}
          >
            MTNR
          </span>
        </Link>
        <ul className="flex gap-5 font-grunge text-base md:text-lg">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "relative py-1 px-3 after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left",
                  "transition-colors duration-200 font-black uppercase tracking-tight rounded-md hover:text-yellow-300",
                  pathname === link.path ? "text-primary after:scale-x-100 dark:text-yellow-400" : "text-white/90"
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
