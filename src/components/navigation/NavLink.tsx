
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigation } from "../effects/NavigationContext";

interface NavLinkProps {
  path: string;
  name: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function NavLink({ path, name, onClick }: NavLinkProps) {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  
  const handleNavClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on current page
    if (path === pathname) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    console.log(`Navigation to ${path}, triggering video transition`);
    navigation.triggerVideoTransition();
    
    // Navigate after a short delay to ensure video starts playing
    setTimeout(() => {
      window.location.href = path;
    }, 100);
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={path}
      className={cn(
        "px-3 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group hover:text-yellow-300",
        pathname === path 
          ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400" 
          : "text-white/80"
      )}
      onClick={handleNavClick}
    >
      <span className="relative z-10">{name}</span>
      <span className="absolute inset-0 bg-black/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
      {pathname === path && (
        <motion.span 
          className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"
          layoutId="activeNav"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </a>
  );
}
