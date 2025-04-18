
import ParallaxBackground from "@/components/ParallaxBackground";
import MtnrNavbar from "@/components/MtnrNavbar";
import React from "react";

export default function Home() {
  return (
    <ParallaxBackground>
      <MtnrNavbar />
      {/* Pour espacer sous header */}
      <div className="pt-[220px]" />
      {/* Vidéo centrale */}
      <section className="flex flex-col items-center">
        <div className="bg-black/80 rounded-xl p-2 shadow-2xl max-w-2xl mx-auto border border-white">
          <iframe
            width="650"
            height="365"
            src="https://www.youtube.com/embed/CxFPpZY0UCw"
            title="Mairo - Attentat Uzi | A COLORS SHOW"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg mx-auto"
          />
        </div>
      </section>
    </ParallaxBackground>
  );
}
