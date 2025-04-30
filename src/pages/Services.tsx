
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";

const Services = () => {
  return (
    <ParallaxBackground>
      <Navbar />
      <main className="pt-36 pb-24 min-h-screen max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl my-8 px-5">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-center text-primary uppercase">Prestations & Tarifs</h1>
        <p className="text-center font-inter text-lg mb-12 text-gray-700">
          Choisissez la formule qui correspond à vos besoins. N’hésitez pas à nous contacter pour toute demande personnalisée.
        </p>
        <section className="space-y-8">
          <div className="border-l-4 border-primary pl-5">
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Portrait studio</h2>
            <ul className="font-inter text-gray-800 text-base list-disc ml-4 mb-2 space-y-0.5">
              <li>30 minutes, 5 photos retouchées</li>
              <li>Choix du fond</li>
              <li>Mise en lumière personnalisée</li>
              <li>À partir de 80 €</li>
            </ul>
          </div>
          <div className="border-l-4 border-primary pl-5">
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Shooting Mode / Book</h2>
            <ul className="font-inter text-gray-800 text-base list-disc ml-4 mb-2 space-y-0.5">
              <li>1 heure, 12 photos retouchées, 2 tenues</li>
              <li>Accompagnement & conseils posing</li>
              <li>À partir de 140 €</li>
            </ul>
          </div>
          <div className="border-l-4 border-primary pl-5">
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Événementiel / Reportage</h2>
            <ul className="font-inter text-gray-800 text-base list-disc ml-4 mb-2 space-y-0.5">
              <li>Sur devis, à partir de 2 h de couverture</li>
              <li>Livraison galerie privée en ligne</li>
              <li>Photos haute résolution</li>
            </ul>
          </div>
          <div className="border-l-4 border-primary pl-5">
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Location du studio</h2>
            <ul className="font-inter text-gray-800 text-base list-disc ml-4 mb-2 space-y-0.5">
              <li>Studio équipé, plusieurs fonds disponibles</li>
              <li>Sur réservation</li>
              <li>À partir de 30 €/h</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxBackground>
  );
};

export default Services;
