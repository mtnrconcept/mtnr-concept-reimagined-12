
import { artistImages } from './data';

export default function ArtistsSection() {
  return (
    <section className="container mx-auto py-16 px-4 sm:px-6" data-animate>
      <h2 className="font-display text-3xl md:text-4xl mb-12 text-center text-yellow-400 uppercase tracking-wide neon-text">
        Artistes de la cave
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {artistImages.map((artist, index) => (
          <div 
            key={artist.name} 
            className="glass-card overflow-hidden group transition-all duration-500 hover:shadow-yellow-400/30"
            style={{ transitionDelay: `${index * 100}ms` }}
            data-animate
          >
            <div className="aspect-square overflow-hidden relative">
              <img 
                src={artist.src} 
                alt={artist.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-yellow-400 font-display uppercase tracking-wide group-hover:text-yellow-300 transition-colors">
                {artist.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
