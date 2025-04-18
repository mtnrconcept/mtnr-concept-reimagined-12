
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
];

export default function MtnrNavbar() {
  const location = useLocation();
  return (
    <header className="w-full flex flex-col items-center pt-6 z-40 relative">
      {/* LOGO style badge */}
      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-[#151c2a] via-[#1e273d] to-[#252840] rounded-full p-4 shadow-2xl mb-2 border-4 border-[#9b87f5]">
          <img
            src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png"
            alt="MTNR Logo"
            className="w-36 h-36 rounded-full object-contain drop-shadow-lg"
            style={{
              background: "radial-gradient(circle at 60% 25%, #17192b 70%, #265ebfbb 100%)"
            }}
          />
        </div>
        <span className="block font-impact text-white text-4xl tracking-widest uppercase mt-2 text-shadow-lg">
          MTNR Concept
        </span>
      </div>
      {/* Navigation liens */}
      <nav className="mt-7">
        <ul className="flex gap-4">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`font-impact px-6 py-2 rounded-full text-lg uppercase tracking-widest shadow-lg
                  transition-all duration-150 border-2
                  ${
                    location.pathname === link.path
                      ? "bg-[#1EAEDB] border-[#9b87f5] text-black shadow-cyan-400/60"
                      : "bg-[#191c25] border-white/10 text-white hover:bg-[#111728] hover:text-[#1EAEDB] hover:border-[#9b87f5] hover:shadow-lg"
                  }
                `}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* User & Cart area à droite */}
      <div className="absolute right-8 top-7 flex gap-6 items-center text-white drop-shadow-lg">
        <User size={28} />
        <span className="text-white text-base font-light tracking-widest hover:underline cursor-pointer">Se connecter</span>
        <ShoppingCart size={28} />
      </div>
    </header>
  );
}
