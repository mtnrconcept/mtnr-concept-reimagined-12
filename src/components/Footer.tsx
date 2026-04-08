
import { Link } from "react-router-dom";
import LogoWithEffect from "./effects/LogoWithEffect";
import { useRef, useState, useEffect } from "react";

const Footer = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const img = new Image();
    img.src = "/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png";
    img.onload = () => setImageLoaded(true);
  }, []);
  
  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "What We Do", path: "/what-we-do" },
    { name: "Artistes", path: "/artists" },
    { name: "Réservation", path: "/book" },
    { name: "Contact", path: "/contact" }
  ];
  
  return (
    <footer className="relative w-full text-white pt-20 pb-10 mt-20 font-inter px-4 sm:px-6 lg:px-8 overflow-hidden z-20">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
      
      {/* Background with subtle glow */}
      <div className="absolute inset-0 bg-[#060606]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Logo & Manifesto Column */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-6 inline-block">
              <LogoWithEffect 
                src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png" 
                alt="Logo MTNR" 
                width="160px" 
                glowEffect={true} 
                glowColor="255, 221, 0" 
                isVisible={true} 
                logoRef={logoRef} 
                className="h-auto w-auto object-contain max-h-20 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" 
              />
            </div>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6 font-medium">
              Le studio est un hub créatif où les artistes se rencontrent, échangent et évoluent ensemble. 
              On crée des ponts, pas des murs. Bienvenue dans la matière sonore brute.
            </p>
            <div className="flex gap-4 items-center">
              <div className="h-px w-8 bg-yellow-400/50" />
              <span className="text-xs font-mono tracking-[0.2em] text-yellow-400 uppercase">Code: MTNR</span>
            </div>
          </div>
          
          {/* Navigation Column */}
          <div className="flex flex-col items-center md:items-start pl-0 md:pl-10">
            <h3 className="font-display font-medium text-xl mb-6 tracking-wide text-white uppercase relative inline-block">
              Exploration
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-yellow-400"></span>
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/0 group-hover:bg-yellow-400 transition-colors" />
                    <span className="text-sm uppercase tracking-wider">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Socials & Contact Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-display font-medium text-xl mb-6 tracking-wide text-white uppercase relative inline-block">
              Réseau
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-yellow-400"></span>
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full border border-gray-800 group-hover:border-yellow-400/50 flex items-center justify-center bg-gray-900 group-hover:bg-yellow-400/10 transition-all shadow-[0_0_0_rgba(255,215,0,0)] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <span className="text-sm tracking-wide">@mtnrconcept</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@mtnrconcept.fr" className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full border border-gray-800 group-hover:border-yellow-400/50 flex items-center justify-center bg-gray-900 group-hover:bg-yellow-400/10 transition-all shadow-[0_0_0_rgba(255,215,0,0)] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20v-8.99l8 6.99 8-6.99V20H4z"/>
                    </svg>
                  </div>
                  <span className="text-sm tracking-wide">contact@mtnrconcept.fr</span>
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-mono">
            © {new Date().getFullYear()} MTNR CONCEPT. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 text-xs text-gray-500 font-mono">
            <Link to="#" className="hover:text-yellow-400 transition-colors">MENTIONS LÉGALES</Link>
            <span className="text-gray-800">|</span>
            <Link to="#" className="hover:text-yellow-400 transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
