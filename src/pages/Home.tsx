
import ParallaxBackground from "@/components/ParallaxBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";

const artistImages = [
  {
    name: "U.D Sensei",
    src: "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png"
  },
  {
    name: "Mairo",
    src: "/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png"
  },
  {
    name: "Aray",
    src: "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png"
  },
  {
    name: "Neverzed",
    src: "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png"
  }
];

export default function Home() {
  return (
    <ParallaxBackground>
      <Navbar />
      <main className="pt-36 pb-24 min-h-screen max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-xl my-8 px-5">
        <header className="flex flex-col gap-8 items-center text-center px-4 py-10">
          <img src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png" alt="MTNR Logo" className="mx-auto w-32 h-32 object-contain rounded-full shadow-lg bg-white" />
          <h1 className="font-impact text-6xl md:text-7xl drop-shadow-md text-primary uppercase tracking-tight">
            MTNR Concept Studio
          </h1>
          <p className="max-w-xl mx-auto text-gray-700 text-lg font-inter">
            Le studio musical pluridisciplinaire qui t’accompagne de la création à la diffusion.&nbsp;
            <br />
            <span className="font-semibold">Beatmaking • Enregistrement • Mixage • Vidéo • Shooting Photo</span>
          </p>
          <a href="/reservation" className="inline-block mt-6 px-8 py-3 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-300 text-black font-bold uppercase text-lg shadow hover:scale-105 transition">Réserve ta session</a>
        </header>
        <section className="my-20">
          <h2 className="font-impact text-4xl md:text-5xl mb-8 text-center text-primary uppercase">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="rounded-2xl bg-gray-50/80 backdrop-blur-lg border-2 border-primary px-7 py-8 shadow-lg flex flex-col items-center">
              <h3 className="font-impact text-xl uppercase text-primary mb-2">Studio & Enregistrement</h3>
              <p className="text-gray-800 mb-4 text-base font-inter text-center">Captation audio & voix en cabine insonorisée dans une ambiance pro & détendue.</p>
              <span className="text-lg font-bold text-yellow-400 mt-2">50 CHF/h</span>
            </div>
            <div className="rounded-2xl bg-gray-50/80 backdrop-blur-lg border-2 border-primary px-7 py-8 shadow-lg flex flex-col items-center">
              <h3 className="font-impact text-xl uppercase text-primary mb-2">Mixage & Mastering</h3>
              <p className="text-gray-800 mb-4 text-base font-inter text-center">Optimisation de ton morceau : équilibre, présence, volume, rendu streaming/radio.</p>
              <span className="text-lg font-bold text-yellow-400 mt-2">Sur Devis</span>
            </div>
            <div className="rounded-2xl bg-gray-50/80 backdrop-blur-lg border-2 border-primary px-7 py-8 shadow-lg flex flex-col items-center">
              <h3 className="font-impact text-xl uppercase text-primary mb-2">Photo & Vidéo</h3>
              <p className="text-gray-800 mb-4 text-base font-inter text-center">Clips, shooting, captation, teasers... pour un résultat esthétique, soigné et créa.</p>
              <span className="text-lg font-bold text-yellow-400 mt-2">Sur Devis</span>
            </div>
          </div>
        </section>
        <section className="my-20">
          <h2 className="font-impact text-4xl md:text-5xl mb-7 text-yellow-400 text-center uppercase">Artistes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {artistImages.map((artist) => (
              <div key={artist.name} className="rounded-xl overflow-hidden shadow-md bg-black/70 flex flex-col items-center pb-3 border-2 border-yellow-900/70">
                <img src={artist.src} alt={artist.name} className="w-full aspect-square object-cover" />
                <div className="pt-2 text-lg font-bold text-yellow-400 uppercase tracking-wider font-impact">{artist.name}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="my-20">
          <h2 className="font-impact text-3xl md:text-4xl text-center mb-3 text-primary uppercase">Contact & Infos</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-around font-inter text-lg">
            <div>
              <span className="font-bold">Adresse :</span><br />
              Avenue de Pailly 15<br />
              1216 Châtelaine
            </div>
            <div>
              <span className="font-bold">Téléphone :</span><br />
              <a className="underline text-primary" href="tel:+41791234567">07 99 12 34 56</a>
            </div>
            <div>
              <span className="font-bold">Horaires :</span><br />
              Samedi & Dimanche : 14h - minuit<br />
              (Lun–Ven sur demande)
            </div>
          </div>
          <div className="mt-8 flex gap-4 justify-center">
            <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" className="hover:text-[#c13584] text-3xl">
              <svg width="28" height="28" fill="currentColor" className="inline"><use href="#icon-instagram"/></svg>
            </a>
            <a href="mailto:contact@mtnrconcept.fr" aria-label="Mail" className="hover:text-primary text-3xl">
              <svg width="28" height="28" fill="currentColor" className="inline"><use href="#icon-mail"/></svg>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </ParallaxBackground>
  );
}
