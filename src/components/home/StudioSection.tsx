import { studioImages } from './data';

export default function StudioSection() {
  return (
    <section className="container mx-auto py-16 px-4 sm:px-6" data-animate>
      <h2 className="section-title">
        Notre Studio
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {studioImages.map((image, index) => (
          <div 
            key={image.title}
            className="relative overflow-hidden backdrop-blur-xl bg-black/70 rounded-xl border border-yellow-400/30 group transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,215,0,0.15)]"
            style={{ transitionDelay: `${index * 100}ms` }}
            data-animate
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="h-64 sm:h-72 overflow-hidden">
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="relative z-10 p-5">
              <h3 className="text-yellow-400 text-xl font-display uppercase tracking-wide mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_3px_rgba(255,215,0,0.3)]">
                {image.title}
              </h3>
              <p className="text-gray-300 text-sm font-medium">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
