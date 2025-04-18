
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";

const Contact = () => (
  <ParallaxBackground>
    <Navbar />
    <main className="pt-36 pb-24 min-h-screen max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-xl my-8 px-8">
      <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-center text-primary uppercase">Contact</h1>
      <form
        action="mailto:contact@mtnrconcept.fr"
        method="POST"
        encType="text/plain"
        className="flex flex-col gap-7 mt-10"
      >
        <div>
          <label className="font-inter text-gray-800 font-semibold">Nom</label>
          <input type="text" name="name" required className="w-full mt-2 border-b-2 border-primary px-2 py-2 bg-transparent font-inter outline-none focus:border-violet-700" />
        </div>
        <div>
          <label className="font-inter text-gray-800 font-semibold">Email</label>
          <input type="email" name="email" required className="w-full mt-2 border-b-2 border-primary px-2 py-2 bg-transparent font-inter outline-none focus:border-violet-700" />
        </div>
        <div>
          <label className="font-inter text-gray-800 font-semibold">Message</label>
          <textarea name="message" rows={4} required className="w-full mt-2 border-b-2 border-primary px-2 py-2 bg-transparent font-inter outline-none focus:border-violet-700"></textarea>
        </div>
        <button type="submit" className="w-full mt-3 font-inter font-semibold bg-primary text-white rounded-full px-6 py-3 shadow hover:bg-violet-700 transition-all duration-200">
          Envoyer
        </button>
      </form>
      <div className="mt-14 font-inter text-center text-gray-800">
        <div className="mb-3">Email : <a href="mailto:contact@mtnrconcept.fr" className="underline text-primary">contact@mtnrconcept.fr</a></div>
        <div className="mb-3">Téléphone : <a href="tel:+33612345678" className="underline">06 12 34 56 78</a></div>
        <div>Instagram : <a href="https://www.instagram.com/" target="_blank" className="underline text-[#c13584]">@mtnr_concept</a></div>
      </div>
    </main>
    <Footer />
  </ParallaxBackground>
);

export default Contact;
