
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

interface MobileNavProps {
  isOpen: boolean;
  navLinks: Array<{ name: string; path: string }>;
  currentPath: string;
  onLinkClick: () => void;
}

export function MobileNav({ isOpen, navLinks, currentPath, onLinkClick }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-lg border-t border-yellow-400/20 animate-fade-in">
      <ul className="flex flex-col py-3">
        {navLinks.map((link) => (
          <li 
            key={link.path} 
            className="border-b border-yellow-400/10 last:border-b-0"
          >
            <Link
              to={link.path}
              onClick={() => onLinkClick()}
              className={cn(
                "block px-6 py-3 font-medium transition-all",
                currentPath === link.path ? "text-primary" : "text-white/80"
              )}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li className="px-6 py-3">
          <Link 
            to="/book" 
            onClick={() => onLinkClick()}
            className="block w-full py-2 bg-yellow-400/90 text-black font-bold text-center rounded-lg hover:bg-yellow-300 transition-all"
          >
            Book Now
          </Link>
        </li>
      </ul>
    </div>
  );
}
