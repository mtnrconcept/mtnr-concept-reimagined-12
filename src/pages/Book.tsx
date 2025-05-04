
import React from 'react';
import { useParams } from 'react-router-dom';
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";
import { PageSplashes } from "@/components/effects/PageSplashes";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";

export default function Book() {
  const { id } = useParams();
  
  return (
    <ParallaxBackground>
      <PageSplashes pageVariant="book" />
      
      <div className="relative z-10 min-h-screen">
        <div className="min-h-screen pt-24 xs:pt-28 md:pt-36 px-2 xs:px-6 flex flex-col items-center font-grunge section-content">
          <div className="relative">
            <NeonText text="Réservation" className="text-3xl xs:text-4xl md:text-6xl mb-5 xs:mb-8 uppercase text-center" color="yellow" flicker={true} />
            <ElectricParticles targetSelector=".neon-text" color="#ffdd00" quantity={12} />
          </div>
          
          <div className="w-full max-w-4xl bg-black/80 grunge-border paper-texture p-6 xs:p-8 md:p-10 mx-auto text-white rounded-xl shadow-2xl mb-10">
            {/* Contenu de la page Book */}
            <p className="text-lg text-center mb-8">
              Réservez votre session photo avec MTNR Studio.
            </p>
            
            {/* Autres éléments de la page */}
          </div>
        </div>
      </div>
      <Footer />
    </ParallaxBackground>
  );
}
