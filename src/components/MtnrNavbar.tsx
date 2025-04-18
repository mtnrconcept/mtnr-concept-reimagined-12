
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import React from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "What We Do", path: "/what-we-do" },
  { name: "Artists", path: "/artists" },
  { name: "Book ta session", path: "/book" },
  { name: "Écris-nous", path: "/contact" },
  { name: "Boutique", path: "/boutique" },
  { name: "Réservation en ligne", path: "/reservation" },
];

export default function MtnrNavbar() {
  const location = useLocation();
  return (
    <header className="w-full pb-4 bg-transparent fixed left-0 top-0 z-50">
      <div className="mx-auto flex flex-col items-center">
        {/* Logo & user area */}
        <div className="w-full flex justify-center relative" style={{height: '162px'}}>
          <div className="bg-black/90 h-36 w-[880px] rounded-b-lg shadow-2xl flex flex-col items-center relative z-20 pt-3">
            <img
              src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png"
              alt="MTNR Logo"
              className="w-40 h-40 object-contain -mt-5 drop-shadow logo-mtnr"
              style={{ filter: "drop-shadow(0 1px 5px #222)" }}
            />
          </div>
          <div className="absolute right-10 top-6 flex gap-5 items-center z-40">
            <User className="text-white" size={28} />
            <span className="text-sm text-white">Se connecter</span>
            <ShoppingCart className="text-white" size={28} />
          </div>
        </div>
        {/* Nav menu */}
        <nav className="mx-auto -mt-3 z-20">
          <ul className="flex gap-1">
            {navLinks.map(link => (
              <li
                key={link.path}
                className={`font-impact uppercase px-5 py-3 text-lg cursor-pointer border-b-2 transition-all duration-150
                  ${
                    location.pathname === link.path
                      ? "bg-black text-white border-black"
                      : "bg-white/95 text-black border-transparent hover:bg-gray-200"
                  }
                `}
              >
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
