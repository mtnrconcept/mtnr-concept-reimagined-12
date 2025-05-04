
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigation } from "../effects/NavigationContext";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({ to, isActive, children, onClick }: NavLinkProps) {
  const navigation = useNavigation();
  const isReservation = children === "Réservation";
  
  const handleClick = (e: React.MouseEvent) => {
    // Si on clique sur le lien de la page actuelle, ne rien faire
    if (isActive) return;
    
    // Déclencher l'événement de transition vidéo avant la navigation
    console.log(`Navigation vers ${to}, déclenchement de la transition vidéo`);
    navigation.triggerVideoTransition();
    
    if (onClick) onClick();
  };

  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group hover:text-yellow-300",
        isActive 
          ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400" 
          : "text-white/80",
        isReservation && "hover:text-black"
      )}
      onClick={handleClick}
    >
      {isReservation && (
        <span className="absolute inset-0 bg-[#D2FF3F] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0"></span>
      )}
      <span className="relative z-10">{children}</span>
      {isActive && (
        <motion.span 
          className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"
          layoutId="activeNav"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}
