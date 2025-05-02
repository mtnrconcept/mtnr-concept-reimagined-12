
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";
import GalleryGrid from "@/components/GalleryGrid";

const galleryImages = [
  { src: "/lovable-uploads/photo-1649972904349-6e44c42644a7", alt: "Portrait" },
  { src: "/lovable-uploads/photo-1486312338219-ce68d2c6f44d", alt: "Lifestyle" },
  { src: "/lovable-uploads/photo-1581091226825-a6a2a5aee158", alt: "Portrait" },
  { src: "/lovable-uploads/photo-1487958449943-2429e8be8625", alt: "Architecture" },
  { src: "/lovable-uploads/photo-1433086966358-54859d0ed716", alt: "Escalier" },
  { src: "/lovable-uploads/photo-1482938289607-e9573fc25ebb", alt: "Paysage" },
  { src: "/lovable-uploads/photo-1470071459604-3b5ec3a7fe05", alt: "Escalier" },
  { src: "/lovable-uploads/photo-1527576539890-dfa815648363", alt: "Lumière" },
  { src: "/lovable-uploads/photo-1439337153520-7082a56a81f4", alt: "Toit vitré" },
];

const Portfolio = () => {
  return (
    <ParallaxBackground>
      <Navbar />
      <main className="pt-36 pb-24 min-h-screen max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-xl my-8">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-center text-primary uppercase">Portfolio</h1>
        <p className="text-center font-inter text-lg mb-12 text-gray-700">
          Une sélection de nos réalisations : portraits, photos de mode, événements, paysages & créations artistiques.
        </p>
        <section className="px-4 md:px-12">
          <GalleryGrid images={galleryImages} />
        </section>
      </main>
      <Footer />
    </ParallaxBackground>
  );
};

export default Portfolio;
