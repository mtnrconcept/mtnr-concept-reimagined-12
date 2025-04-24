
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const studioImages = [
  {
    title: "Sound Engineering",
    description: "Professional equipment for perfect recording",
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1650&auto=format&fit=crop&ixlib=rb-4.0.3",
    delay: 100
  },
  {
    title: "Studio Setup",
    description: "Industry-standard recording environment",
    src: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3",
    delay: 300
  },
  {
    title: "Mixing & Mastering",
    description: "State of the art processing tools",
    src: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3",
    delay: 500
  },
  {
    title: "Producing",
    description: "Creative environment to build your sound",
    src: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3",
    delay: 700
  }
];

const artistImages = [
  { name: "U.D Sensei", src: "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png" },
  { name: "Mairo", src: "/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png" },
  { name: "Aray", src: "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png" },
  { name: "Neverzed", src: "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png" }
];

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Setup intersection observer for scroll animations
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up', 'opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen overflow-hidden backdrop-blur-[2px]">
        <Navbar />
        
        <main className="min-h-screen w-full selection:bg-primary selection:text-black">
          {/* Hero Section */}
          <section className="container mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div 
              className="glass-card p-8 sm:p-10 max-w-3xl mx-auto relative overflow-hidden"
              data-animate
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-primary mb-6 neon-text uppercase tracking-tighter">
                <span className="block">Bienvenue à</span>
                <span className="block mt-2">MTNR Studio</span>
              </h1>
              
              <div className="text-white text-xl sm:text-2xl mb-8 font-medium tracking-wide">
                Dans la cave du <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent bg-[size:200%_auto] animate-text-shimmer">son underground</span>
              </div>
              
              <div className="text-gray-200 leading-relaxed max-w-2xl mx-auto">
                <p className="mb-4">
                  Ici y'a pas de pose, pas de paillettes : juste le vrai son. Studio DIY, sueur sur la console, murs recouverts de rêves graffés.
                </p>
                <p>
                  Ramène ton flow, laisse une empreinte. La famille MTNR c'est : beatmakers mutants, MC brut, groove crasseux, et vision d'auteur.
                </p>
                <p className="mt-6 text-yellow-300 font-display text-xl uppercase tracking-wider">
                  Underground ou rien.
                </p>
              </div>
              
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/book" 
                  className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-400/30 hover:bg-yellow-300 transition-all duration-300"
                >
                  Book ta session
                </Link>
                <Link 
                  to="/what-we-do" 
                  className="px-8 py-3 bg-black/60 border border-yellow-400/50 text-white font-bold rounded-lg shadow-lg hover:shadow-yellow-400/20 hover:bg-black/80 transition-all duration-300"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </section>
          
          {/* Studio Images Section */}
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
          
          {/* Services Section */}
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

          {/* Artists section */}
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

          <footer className="container mx-auto py-10 text-center text-sm text-yellow-400/60 uppercase tracking-widest">
            © 2024 - MTNR Cave Studio. Fait maison, sert la vibe underground — Geneva/France.
          </footer>
        </main>
      </div>
    </>
  );
}
