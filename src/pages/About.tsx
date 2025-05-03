
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";
import { PageSplashes } from "@/components/effects/PageSplashes";

const About = () => (
  <ParallaxBackground>
    <PageSplashes pageVariant="about" />
    
    <main className="pt-36 pb-24 min-h-screen max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl my-8 px-7">
      <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-center text-primary uppercase">À propos</h1>
      <div className="flex flex-col md:flex-row items-center gap-10 mt-7">
        <img src="/lovable-uploads/photo-1486312338219-ce68d2c6f44d" alt="Portrait photographe" className="rounded-xl w-52 h-52 object-cover shadow-lg" />
        <div>
          <h2 className="font-playfair text-2xl font-bold mb-2 text-gray-900">MTNR Concept</h2>
          <p className="font-inter text-gray-700 text-lg mb-4">
            Passionné par l'humain, la lumière et la créativité, j'ai fondé MTNR Concept afin d'offrir un studio photo accessible et polyvalent à Lyon.
          </p>
          <p className="font-inter text-gray-700 text-lg">
            Ici, chaque client est unique : je vous accompagne pour mettre en valeur votre personnalité ou votre projet. <br />
            <span className="italic text-sm">N'hésitez pas à faire connaissance !</span>
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </ParallaxBackground>
);

export default About;
