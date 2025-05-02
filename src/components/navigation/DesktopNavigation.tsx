
import { motion } from "framer-motion";
import { navLinks } from "./navConfig";
import NavLink from "./NavLink";
import BookNowButton from "./BookNowButton";

export default function DesktopNavigation() {
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };
  
  return (
    <ul className="hidden md:flex items-center space-x-1 lg:space-x-4">
      {navLinks.map((link) => (
        <motion.li key={link.path} variants={itemVariants}>
          <NavLink path={link.path} name={link.name} />
        </motion.li>
      ))}
      <motion.li variants={itemVariants}>
        <BookNowButton />
      </motion.li>
    </ul>
  );
}
