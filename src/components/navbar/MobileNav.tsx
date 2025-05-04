
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
            <NavLink
              to={link.path}
              isActive={currentPath === link.path}
              onClick={onLinkClick}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
