
import { Link } from "react-router-dom";
import { NavLink } from "./NavLink";
import { useNavigation } from "../effects/NavigationContext";

interface DesktopNavProps {
  navLinks: Array<{ name: string; path: string }>;
  currentPath: string;
}

export function DesktopNav({ navLinks, currentPath }: DesktopNavProps) {
  const navigation = useNavigation();
  
  const handleBookNowClick = () => {
    navigation.triggerVideoTransition();
  };
  
  return (
    <ul className="flex items-center space-x-1 lg:space-x-4">
      {navLinks.map((link) => (
        <li key={link.path}>
          <NavLink 
            to={link.path}
            isActive={currentPath === link.path}
          >
            {link.name}
          </NavLink>
        </li>
      ))}
      <li>
        <Link 
          to="/book" 
          className="ml-2 px-5 py-2.5 bg-yellow-400/90 text-black font-bold rounded-lg border border-yellow-600/20 hover:bg-yellow-300 transition-all shadow-md hover:shadow-yellow-400/20 relative overflow-hidden group"
          onClick={handleBookNowClick}
        >
          <span className="relative z-10">Book Now</span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-yellow-300 to-yellow-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </Link>
      </li>
    </ul>
  );
}
