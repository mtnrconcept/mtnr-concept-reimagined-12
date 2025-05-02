
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../effects/NavigationContext";
import { navLinks } from "./navConfig";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  
  if (!isOpen) return null;
  
  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // Don't navigate if clicking on current page
    if (path === pathname) {
      e.preventDefault();
      onClose();
      return;
    }
    
    e.preventDefault();
    console.log(`Navigation to ${path}, triggering video transition`);
    navigation.triggerVideoTransition();
    
    // Navigate after a short delay to ensure video starts playing
    setTimeout(() => {
      window.location.href = path;
    }, 100);
    
    onClose();
  };
  
  return (
    <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-lg border-t border-yellow-400/20 animate-fade-in">
      <motion.ul 
        className="flex flex-col py-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
      >
        {navLinks.map((link) => (
          <motion.li 
            key={link.path} 
            className="border-b border-yellow-400/10 last:border-b-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <a
              href={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className={cn(
                "block px-6 py-3 font-medium transition-all",
                pathname === link.path ? "text-primary" : "text-white/80"
              )}
            >
              {link.name}
            </a>
          </motion.li>
        ))}
        <motion.li 
          className="px-6 py-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <a 
            href="/book" 
            onClick={(e) => handleNavClick(e, "/book")}
            className="block w-full py-2 bg-yellow-400/90 text-black font-bold text-center rounded-lg hover:bg-yellow-300 transition-all"
          >
            Book Now
          </a>
        </motion.li>
      </motion.ul>
    </div>
  );
}
