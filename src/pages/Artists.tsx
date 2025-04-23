
import ParallaxBg from "@/components/ParallaxBg";
import Navbar from "@/components/Navbar";

const artists = [
  { name: "U.D Sensei", img: "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png", desc: "Producteur maudit, MC, boss du son MTNR. Beat sale, vision claire." },
  { name: "Mairo", img: "/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png", desc: "Ruff lyricist, cracheur de feu, rimes brutales sur instrus obscures." },
  { name: "Aray", img: "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png", desc: "Rappeur, groove noir, punchlines crasses, flow toujours under." },
  { name: "Neverzed", img: "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png", desc: "L’ombre du mic, plume acide, chronique la ruelle." },
];
export default function Artists() {
  return (
    <ParallaxBg>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center pt-36 md:pt-40 px-6 font-grunge selection:bg-primary selection:text-black">
        <h1 className="font-grunge text-yellow-400 text-5xl md:text-7xl uppercase text-center drop-shadow-lg mb-8 animate-wiggle" style={{ letterSpacing: "0.12em" }}>
          Le Crew
        </h1>
        <div className="text-base md:text-xl font-grunge text-gray-100 mb-10 text-center max-w-xl drop-shadow" style={{ letterSpacing: "0.06em" }}>
          Celles et ceux qui bâtissent la légende MTNR. Un collectif, des styles, une vision crue et toujours <span className="text-yellow-400">underground</span>.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-5xl">
          {artists.map((a) => (
            <div key={a.name} className="bg-black/85 paper-texture border-2 border-yellow-400/25 rounded-xl shadow-2xl flex flex-col items-center p-6 transition-transform hover:scale-105 grunge-border">
              <img src={a.img} alt={a.name} className="w-full aspect-square object-cover rounded-xl shadow-xl grayscale hover:grayscale-0 duration-200" />
              <div className="mt-3 font-black text-xl text-yellow-400 uppercase text-center">{a.name}</div>
              <div className="text-sm text-gray-300 italic mt-2 text-center">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </ParallaxBg>
  );
}

