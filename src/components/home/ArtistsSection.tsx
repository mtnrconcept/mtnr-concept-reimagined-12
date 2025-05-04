import { artistImages } from './data';
export default function ArtistsSection() {
  return <section data-animate className="container mx-auto px-4 sm:px-6 py-[4px]">
      <h2 className="section-title text-5xl text-center font-extrabold py-[2px] my-[29px]">
        Artistes de la cave
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {artistImages.map((artist, index) => <div key={artist.name} className="relative overflow-hidden backdrop-blur-xl bg-black/70 rounded-xl border border-yellow-400/30 group transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,215,0,0.15)] hover:-translate-y-1" style={{
        transitionDelay: `${index * 100}ms`
      }} data-animate>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="aspect-square overflow-hidden relative">
              <img src={artist.src} alt={artist.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>
            <div className="relative z-10 p-4 text-center transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-yellow-400 font-display uppercase tracking-wide group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_3px_rgba(255,215,0,0.3)]">
                {artist.name}
              </h3>
            </div>
          </div>)}
      </div>
    </section>;
}