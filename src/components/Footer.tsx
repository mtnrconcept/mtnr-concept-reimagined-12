
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="w-full bg-black text-white py-8 mt-10 font-inter">
    <div className="container mx-auto flex flex-col md:flex-row md:justify-between gap-6 items-center">
      <div className="flex flex-col items-center md:items-start">
        <img src="/lovable-uploads/photo-1527576539890-dfa815648363" alt="Logo MTNR" className="h-9 w-auto object-contain mb-2 rounded" />
        <span className="font-playfair text-xl font-bold">MTNR Concept</span>
        <p className="text-sm text-gray-400 mt-2">© {new Date().getFullYear()} MTNR Concept. Tous droits réservés.</p>
      </div>
      <div className="flex flex-col gap-2 text-center md:text-right">
        <Link to="/about" className="hover:underline">À propos</Link>
        <Link to="/services" className="hover:underline">Prestations</Link>
        <Link to="/portfolio" className="hover:underline">Portfolio</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0 text-xl">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#c13584] transition">
          <svg width="24" height="24" fill="currentColor" className="inline"><use href="#icon-instagram"/></svg>
        </a>
        <a href="mailto:contact@mtnrconcept.fr" className="hover:text-primary transition">
          <svg width="24" height="24" fill="currentColor" className="inline"><use href="#icon-mail"/></svg>
        </a>
      </div>
      {/* SVG icons hidden */}
      <svg style={{display:"none"}}>
        <symbol id="icon-instagram" viewBox="0 0 24 24">
          <path d="M7.5,2A5.5,5.5,0,0,0,2,7.5v9A5.5,5.5,0,0,0,7.5,22h9A5.5,5.5,0,0,0,22,16.5v-9A5.5,5.5,0,0,0,16.5,2Zm0,2h9A3.5,3.5,0,0,1,20,7.5v9A3.5,3.5,0,0,1,16.5,20h-9A3.5,3.5,0,0,1,4,16.5v-9A3.5,3.5,0,0,1,7.5,4Zm7,2A1.5,1.5,0,1,0,16,7.5,1.5,1.5,0,0,0,14.5,6ZM12,7.5a4.5,4.5,0,1,0,4.5,4.5A4.5,4.5,0,0,0,12,7.5Zm0,2A2.5,2.5,0,1,1,9.5,12,2.5,2.5,0,0,1,12,9.5Z"/>
        </symbol>
        <symbol id="icon-mail" viewBox="0 0 24 24">
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20v-8.99l8 6.99 8-6.99V20H4z"/>
        </symbol>
      </svg>
    </div>
  </footer>
);

export default Footer;
