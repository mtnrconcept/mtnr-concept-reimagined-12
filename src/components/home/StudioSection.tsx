
import { studioImages } from './data';

export default function StudioSection() {
  return (
    <section className="container mx-auto py-16 px-4 sm:px-6" data-animate>
      <h2 className="font-display text-3xl md:text-4xl mb-12 text-center text-yellow-400 uppercase tracking-wide neon-text">
        Notre Studio
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {studioImages.map((image, index) => (
          <div 
            key={image.title}
            className="glass-card overflow-hidden group transition-all duration-500 hover:shadow-yellow-400/20"
            style={{ transitionDelay: `${index * 100}ms` }}
            data-animate
          >
            <div className="h-64 sm:h-72 overflow-hidden">
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="p-5">
              <h3 className="text-yellow-400 text-xl font-display uppercase tracking-wide mb-2">
                {image.title}
              </h3>
              <p className="text-gray-300 text-sm">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
