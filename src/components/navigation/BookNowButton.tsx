
import { useLocation } from "react-router-dom";
import { useNavigation } from "../effects/NavigationContext";

interface BookNowButtonProps {
  onClick?: (e: React.MouseEvent) => void;
}

export default function BookNowButton({ onClick }: BookNowButtonProps) {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  
  const handleNavClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on current page
    if ("/book" === pathname) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    navigation.triggerVideoTransition();
    
    // Navigate after a short delay to ensure video starts playing
    setTimeout(() => {
      window.location.href = "/book";
    }, 100);
    
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <a 
      href="/book" 
      className="ml-2 px-5 py-2.5 bg-yellow-400/90 text-black font-bold rounded-lg border border-yellow-600/20 hover:bg-yellow-300 transition-all shadow-md hover:shadow-yellow-400/20 relative overflow-hidden group"
      onClick={handleNavClick}
    >
      <span className="relative z-10">Book Now</span>
      <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-yellow-300 to-yellow-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
    </a>
  );
}
