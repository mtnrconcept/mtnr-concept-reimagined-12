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
  const navLinks = [{
    name: "Accueil",
    path: "/"
  }, {
    name: "What We Do",
    path: "/what-we-do"
  }, {
    name: "Artistes",
    path: "/artists"
  }, {
    name: "Réservation",
    path: "/book"
  }, {
    name: "Contact",
    path: "/contact"
  }];
  return <footer className="w-full bg-black text-white py-12 mt-10 font-inter my-0 px-[60px]">
      <div className="container mx-auto px-[55px]">
        {/* Structure en trois colonnes pour desktop, colonne unique pour mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne du logo et copyright */}
          <div className="flex flex-col items-center md:items-start px-[10px]">
            {/* Conteneur du logo avec marges */}
            <div className="mb-4 flex items-center justify-center md:justify-start">
              <LogoWithEffect src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png" alt="Logo MTNR" width="140px" glowEffect={true} glowColor="255, 221, 0" isVisible={true} logoRef={logoRef} className="h-auto w-auto object-contain max-h-20" />
            </div>
            <span className="font-playfair text-xl font-bold mt-2">MTNR Concept</span>
            <p className="text-sm text-gray-400 mt-2">© {new Date().getFullYear()} MTNR Concept. Tous droits réservés.</p>
          </div>
          
          {/* Colonne des liens de navigation */}
          <div className="flex flex-col gap-2 text-center md:text-center px-[115px]">
            <h3 className="font-bold text-lg mb-2">Navigation</h3>
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`relative overflow-hidden group hover:text-yellow-400 transition-colors ${link.name === "Réservation" ? "hover:text-black px-2 py-0.5 inline-block w-auto max-w-[120px]" : ""}`}>
                {link.name === "Réservation" && <span className="absolute inset-0 bg-[#D2FF3F] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0 px-[48px] mx-0 my-0 text-center"></span>}
                <span className="relative z-10 text-base px-0 font-normal text-center mx-0">{link.name}</span>
              </Link>)}
          </div>
          
          {/* Colonne des réseaux sociaux */}
          <div className="flex flex-col items-center md:items-end px-[24px]">
            <h3 className="font-bold text-lg mb-2">Suivez-nous</h3>
            <div className="flex gap-4 mt-2 text-xl">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#c13584] transition">
                <svg width="24" height="24" fill="currentColor" className="inline"><use href="#icon-instagram" /></svg>
              </a>
              <a href="mailto:contact@mtnrconcept.fr" className="hover:text-primary transition">
                <svg width="24" height="24" fill="currentColor" className="inline"><use href="#icon-mail" /></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* SVG icons hidden */}
        <svg style={{
        display: "none"
      }}>
          <symbol id="icon-instagram" viewBox="0 0 24 24">
            <path d="M7.5,2A5.5,5.5,0,0,0,2,7.5v9A5.5,5.5,0,0,0,7.5,22h9A5.5,5.5,0,0,0,22,16.5v-9A5.5,5.5,0,0,0,16.5,2Zm0,2h9A3.5,3.5,0,0,1,20,7.5v9A3.5,3.5,0,0,1,16.5,20h-9A3.5,3.5,0,0,1,4,16.5v-9A3.5,3.5,0,0,1,7.5,4Zm7,2A1.5,1.5,0,1,0,16,7.5,1.5,1.5,0,0,0,14.5,6ZM12,7.5a4.5,4.5,0,1,0,4.5,4.5A4.5,4.5,0,0,0,12,7.5Zm0,2A2.5,2.5,0,1,1,9.5,12,2.5,2.5,0,0,1,12,9.5Z" />
          </symbol>
          <symbol id="icon-mail" viewBox="0 0 24 24">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20v-8.99l8 6.99 8-6.99V20H4z" />
          </symbol>
        </svg>
      </div>
    </footer>;
};
export default Footer;