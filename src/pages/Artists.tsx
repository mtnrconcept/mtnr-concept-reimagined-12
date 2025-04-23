
import ParallaxBg from "@/components/ParallaxBg";

// Liste des artistes (exemple, à compléter par l'équipe)
const artists = [
  { name: "U.D Sensei", img: "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png", desc: "Producteur, MC, fondateur du son MTNR." },
  { name: "Mairo", img: "/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png", desc: "Lyriciste, flow rugueux et authenticité brute." },
  { name: "Aray", img: "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png", desc: "Rappeur, mélodies dark et punchlines acérées." },
  { name: "Neverzed", img: "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png", desc: "MC à la plume vénéneuse, ambiance urbaine pure." },
];

export default function Artists() {
  return (
    <ParallaxBg>
      <div className="min-h-screen flex flex-col items-center pt-28 md:pt-32 px-6 font-marker selection:bg-primary selection:text-black">
        <h1 className="font-rocksalt text-primary text-5xl md:text-7xl uppercase text-center drop-shadow-lg mb-6 animate-wiggle" style={{ letterSpacing: "0.12em" }}>
          Artistes MTNR
        </h1>
        <p className="text-base md:text-xl text-gray-100 mb-10 text-center font-inter max-w-xl drop-shadow" style={{ letterSpacing: "0.06em" }}>
          La scène underground, c'est eux : crews maison, punchlines sauvages et identités propres. Découvrez qui donne sa couleur au son MTNR.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-5xl">
          {artists.map((a) => (
            <div key={a.name} className="bg-black/80 border-2 border-yellow-400/25 rounded-xl shadow-2xl flex flex-col items-center p-6 transition-transform hover:scale-105">
              <img src={a.img} alt={a.name} className="w-full aspect-square object-cover rounded-xl shadow-xl grayscale-[50%] hover:grayscale-0 duration-200" />
              <div className="mt-3 font-extrabold text-xl text-yellow-400 uppercase text-center">{a.name}</div>
              <div className="font-inter text-sm text-gray-200/95 italic mt-2 text-center">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </ParallaxBg>
  );
}
