import { Link } from "react-router-dom";
export default function ServicesSection() {
  return <section data-animate className="container mx-auto px-4 sm:px-6 backdrop-blur-sm rounded-3xl max-w-6xl my-[66px] py-[26px]">
      <h2 className="section-title text-center text-5xl font-extrabold my-[25px] py-[10px]">
        Nos Services
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Studio', 'Mix', 'Mastering'].map((service, index) => <div key={service} className="relative overflow-hidden backdrop-blur-xl bg-black/70 rounded-xl border border-yellow-400/30 p-6 sm:p-8 text-center group hover:shadow-[0_0_25px_rgba(255,215,0,0.15)] transition-all duration-500 hover:-translate-y-2" style={{
        transitionDelay: `${index * 150}ms`
      }} data-animate>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="text-yellow-400 text-2xl font-display uppercase mb-4 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_3px_rgba(255,215,0,0.3)]">
                {service}
              </div>
              <div className="text-gray-300 mb-6 font-medium">
                {service === 'Studio' && "Prise de voix, mélo, freestyle, matos old-school tweaké. Tape direct dans la matière."}
                {service === 'Mix' && "Fais rugir ta prod : mix analogique, pas de triche. On module, t'assumes."}
                {service === 'Mastering' && "On appuie, on sur-sature, on découpe. Le track ressort plus vrai que nature."}
              </div>
              <Link to="/book" className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300">
                {service === 'Studio' ? 'Book ta session' : service === 'Mix' ? 'Réserve' : 'Masterise'}
              </Link>
            </div>
          </div>)}
      </div>
    </section>;
}