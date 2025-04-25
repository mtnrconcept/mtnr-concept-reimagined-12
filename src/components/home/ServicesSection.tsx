
import { Link } from "react-router-dom";

export default function ServicesSection() {
  return (
    <section className="container mx-auto py-16 px-4 sm:px-6 bg-black/40 backdrop-blur-sm rounded-3xl my-16 max-w-6xl" data-animate>
      <h2 className="font-display text-3xl md:text-4xl mb-12 text-center text-yellow-400 uppercase tracking-wide neon-text">
        Nos Services
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Studio', 'Mix', 'Mastering'].map((service, index) => (
          <div 
            key={service} 
            className="glass-card p-6 sm:p-8 text-center group hover:shadow-yellow-400/20 transition-all duration-500 hover:-translate-y-2"
            style={{ transitionDelay: `${index * 150}ms` }}
            data-animate
          >
            <div className="text-yellow-400 text-2xl font-display uppercase mb-4 group-hover:text-yellow-300 transition-colors">
              {service}
            </div>
            <div className="text-gray-300 mb-6">
              {service === 'Studio' && "Prise de voix, mélo, freestyle, matos old-school tweaké. Tape direct dans la matière."}
              {service === 'Mix' && "Fais rugir ta prod : mix analogique, pas de triche. On module, t'assumes."}
              {service === 'Mastering' && "On appuie, on sur-sature, on découpe. Le track ressort plus vrai que nature."}
            </div>
            <Link 
              to="/book" 
              className="inline-block px-6 py-2 bg-yellow-400/90 text-black font-bold uppercase tracking-wider rounded-lg border border-yellow-600/20 shadow-lg hover:shadow-yellow-400/20 hover:bg-yellow-300 transition-all duration-300"
            >
              {service === 'Studio' ? 'Book ta session' : service === 'Mix' ? 'Réserve' : 'Masterise'}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
