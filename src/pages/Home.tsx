
import ParallaxBackground from "@/components/ParallaxBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <ParallaxBackground>
      <Navbar />
      <header className="h-screen flex flex-col justify-center items-center relative text-center">
        <div className="mt-36 p-8">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white drop-shadow-xl animate-fade-in">
            MTNR Concept
          </h1>
          <p className="text-xl md:text-2xl font-inter font-medium mt-6 text-gray-200 drop-shadow-md animate-fade-in">
            Studio photo basé à Lyon | Portraits, Mode, Événementiel & Plus
          </p>
          <Link to="/portfolio" className="mt-10 inline-block font-inter text-white text-lg font-semibold bg-primary px-7 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-white hover:text-primary border-2 border-primary transition-all duration-300 animate-fade-in">
            Voir le Portfolio
          </Link>
        </div>
      </header>
      <main className="bg-white/80 rounded-3xl shadow-xl mt-1 p-8 pb-20 mx-auto max-w-5xl relative z-10 -mt-16 animate-fade-in">
        <section className="mb-16">
          <h2 className="font-playfair text-3xl font-bold mb-4 text-primary uppercase">Bienvenue</h2>
          <p className="font-inter text-gray-700 text-lg mb-2">
            Découvrez le regard unique de MTNR Concept pour tous vos projets photos. 
            Notre studio basé à Lyon vous accompagne pour capturer l’instant et sublimer vos souvenirs : portraits, shootings professionnels, photos d’art, événements, books, etc.
          </p>
          <p className="font-inter text-gray-700 text-lg">
            Nous privilégions la créativité, l’élégance et le naturel dans chacune de nos réalisations. <br />
            <span className="italic">Studio équipé, ambiance conviviale, direction artistique sur-mesure.</span>
          </p>
        </section>
        <section className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <img src="/lovable-uploads/photo-1486312338219-ce68d2c6f44d" alt="Shooting studio" className="rounded-xl w-full md:w-2/5 shadow-lg" />
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-2 text-gray-900">Nos services</h3>
            <ul className="font-inter text-gray-800 text-base list-disc ml-5 space-y-2">
              <li>Portraits individuels et famille</li>
              <li>Shooting mode & lookbooks</li>
              <li>Photos d’événements sociaux & entreprises</li>
              <li>Book photo pro et artistique</li>
              <li>Location du studio</li>
              <li>Édition et retouches professionnelles</li>
            </ul>
            <Link to="/services" className="mt-6 inline-block text-primary border border-primary rounded-full px-5 py-2 font-semibold hover:bg-primary hover:text-white transition-colors">
              Voir nos offres & tarifs
            </Link>
          </div>
        </section>
        <section>
          <h3 className="font-playfair text-2xl font-bold mb-8 text-gray-900">Un aperçu de notre travail</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <img src="/lovable-uploads/photo-1649972904349-6e44c42644a7" className="rounded-xl object-cover h-40 w-full" alt="Exemple 1" />
            <img src="/lovable-uploads/photo-1486312338219-ce68d2c6f44d" className="rounded-xl object-cover h-40 w-full" alt="Exemple 2" />
            <img src="/lovable-uploads/photo-1581091226825-a6a2a5aee158" className="rounded-xl object-cover h-40 w-full" alt="Exemple 3" />
            <img src="/lovable-uploads/photo-1482938289607-e9573fc25ebb" className="rounded-xl object-cover h-40 w-full" alt="Exemple 4" />
          </div>
          <Link to="/portfolio" className="inline-block mt-0 text-lg font-medium underline text-primary hover:text-violet-700 transition">
            Voir tout le portfolio
          </Link>
        </section>
      </main>
      <Footer />
    </ParallaxBackground>
  );
};

export default Home;
