
import ParallaxBackground from "@/components/ParallaxBackground";
import MtnrNavbar from "@/components/MtnrNavbar";
import React from "react";

export default function Home() {
  return (
    <ParallaxBackground>
      {/* Navbar & logo positionnés façon design inspiré */}
      <MtnrNavbar />
      {/* Zone centrale vidéo */}
      <main className="flex flex-col items-center w-full px-4">
        {/* Espacement pour la navbar et le logo */}
        <div className="pt-10 pb-8" />
        {/* Bloc vidéo dans son encadré */}
        <section className="mt-2 flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#151c2a]/90 via-[#101527]/85 to-[#1EAEDB]/70 rounded-2xl p-2 sm:p-4 shadow-2xl max-w-2xl mx-auto border border-[#9b87f5] saturate-150">
            <iframe
              width="650"
              height="365"
              src="https://www.youtube.com/embed/CxFPpZY0UCw"
              title="Mairo - Attentat Uzi | A COLORS SHOW"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl mx-auto border-4 border-white/10 shadow-lg"
              style={{
                minWidth: "315px",
                background: "#141a22"
              }}
            />
          </div>
          <div className="mt-8 text-center max-w-[600px] drop-shadow-xl">
            <h1 className="font-impact text-4xl md:text-5xl text-white uppercase tracking-widest mb-3">
              Studio Rap – MTNR Concept
            </h1>
            <p className="font-inter text-lg text-[#1EAEDB] mb-1 font-semibold tracking-wide">
              La référence du son underground et de la créativité à Marseille
            </p>
            <p className="font-open-sans text-md text-white/85">
              Enregistre, collabore, produit et grandis au cœur du mouvement urbain, dans un lieu conçu pour l’inspiration et le partage. <span className="text-[#9b87f5]">Prends rendez-vous pour vivre l’expérience !</span>
            </p>
          </div>
        </section>
      </main>
    </ParallaxBackground>
  );
}
