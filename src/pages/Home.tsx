
import ParallaxBg from "@/components/ParallaxBg";
import { Link } from "react-router-dom";

// Images artistes, logo
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
    <ParallaxBg>
      <div className="relative min-h-screen w-full flex flex-col items-center font-sans z-10">
        {/* NAV + LOGO */}
        <nav className="w-full px-0 pt-8 flex flex-col items-center gap-5 z-20">
          <div className="flex flex-col items-center justify-center gap-1">
            <img
              src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png"
              alt="MTNR Logo"
              className="h-28 w-auto drop-shadow-[0_2px_24px_rgba(255,221,46,0.35)] brightness-125 saturate-150 animate-[fade-in_0.7s_ease]"
              style={{filter: "drop-shadow(0 0 40px #FFEA00CC)"}}
              draggable={false}
            />
            <h1 className="font-black text-white text-5xl md:text-7xl uppercase tracking-wider leading-tight animate-[fade-in_1s_ease]" style={{ fontFamily: '"Playfair Display", Impact, Arial Black, sans-serif', letterSpacing: "0.1em" }}>
              MTNR Concept
            </h1>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-10 mt-4 font-inter font-bold text-base md:text-lg text-white drop-shadow-lg z-10 bg-black/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-yellow-400/20">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Accueil</Link>
            <Link to="/what-we-do" className="hover:text-yellow-400 transition-colors">What We Do</Link>
            <Link to="/artists" className="hover:text-yellow-400 transition-colors">Artists</Link>
            <Link to="/book" className="hover:text-yellow-400 transition-colors">Book ta session</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition-colors">Ecris-nous</Link>
            <Link to="/shop" className="hover:text-yellow-400 transition-colors">Boutique</Link>
            <Link to="/reservation" className="hover:text-yellow-400 transition-colors">Réservation en ligne</Link>
            <button className="ml-4 px-5 py-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 text-black font-extrabold rounded-full border border-yellow-400/60 shadow hover:bg-yellow-300/90 hover:scale-105 transition-all">Se connecter</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative z-20 mt-10 text-center w-full">
          <div className="inline-block px-8 py-10 bg-black/70 rounded-3xl border-4 border-yellow-400/40 shadow-2xl backdrop-blur-xl max-w-3xl animate-[scale-in_0.75s_cubic-bezier(.11,.76,.34,.99)]">
            <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-[.13em] mb-6 uppercase text-yellow-400 drop-shadow-lg" style={{ fontFamily: '"Playfair Display", Impact, Arial Black, sans-serif' }}>
              C'est peut-être <span className="block text-white text-5xl md:text-6xl tracking-tight leading-tight mt-1 mb-0">le début</span>
              <span className="mt-2 block text-yellow-400 text-4xl md:text-5xl">de quelque chose<br className="hidden md:block"/>de GRAND</span>
            </h2>
            <p className="mt-8 text-lg sm:text-xl font-semibold text-gray-100 drop-shadow-md px-2 tracking-wide" style={{fontFamily:"Inter, sans-serif"}}>
              Chez <span className="text-yellow-300 font-bold">MTNR Concept Studio</span>, chaque projet fusionne <span className="text-yellow-200/90">expérience, vibe urbaine & soin du détail</span>.<br/>
              Ici, notre rêve poussait sur du bitume sous la lumière des néons.<br/>
              <span className="text-yellow-400/80">Ta créativité, notre priorité absolue.</span>
            </p>
          </div>
        </section>

        {/* SERVICES */}
        <main className="w-full max-w-5xl z-20 flex flex-col gap-16 items-center px-2 mt-16">
          <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-[fade-in_0.75s_ease]">
            {/* Enregistrement Studio, Mixing, Mastering */}
            <div className="rounded-3xl glass-morphism border-2 border-yellow-300/50 px-6 py-8 shadow-xl flex flex-col items-center hover-scale">
              <div className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-widest mb-2 drop-shadow-lg" style={{ fontFamily: '"Impact", "Arial Black", "sans-serif"' }}>Enregistrement</div>
              <div className="text-gray-100 text-sm md:text-base font-medium text-center mb-2">Enregistre ta voix dans un espace pro et inspirant. Équipé pour chaque style, chaque nuance.</div>
              <span className="text-lg font-extrabold text-yellow-400 mt-2">50 CHF</span>
              <Link to="/reservation" className="mt-6 px-6 py-1.5 bg-yellow-400 text-black rounded-full font-black tracking-widest border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 transition-all hover-scale">Réserver</Link>
            </div>
            <div className="rounded-3xl glass-morphism border-2 border-yellow-300/50 px-6 py-8 shadow-xl flex flex-col items-center hover-scale">
              <div className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-widest mb-2 drop-shadow-lg" style={{ fontFamily: '"Impact", "Arial Black", "sans-serif"' }}>Mixing</div>
              <div className="text-gray-100 text-sm md:text-base font-medium text-center mb-2">Ajuste chaque détail pour sublimer ton flow, chaque piste, chaque ambiance sonore...</div>
              <span className="text-lg font-extrabold text-yellow-400 mt-2">100 CHF</span>
              <Link to="/reservation" className="mt-6 px-6 py-1.5 bg-yellow-400 text-black rounded-full font-black tracking-widest border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 transition-all hover-scale">Réserver</Link>
            </div>
            <div className="rounded-3xl glass-morphism border-2 border-yellow-300/50 px-6 py-8 shadow-xl flex flex-col items-center hover-scale">
              <div className="text-xl md:text-2xl font-bold text-yellow-300 uppercase tracking-widest mb-2 drop-shadow-lg" style={{ fontFamily: '"Impact", "Arial Black", "sans-serif"' }}>Mastering</div>
              <div className="text-gray-100 text-sm md:text-base font-medium text-center mb-2">Brille dans la nuit : un son calibré pour résonner partout, du studio aux rues...</div>
              <span className="text-lg font-extrabold text-yellow-400 mt-2">50 CHF</span>
              <Link to="/reservation" className="mt-6 px-6 py-1.5 bg-yellow-400 text-black rounded-full font-black tracking-widest border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 transition-all hover-scale">Réserver</Link>
            </div>
          </section>

          {/* ARTISTES GALLERY */}
          <section className="w-full mt-2 z-20">
            <h2 className="font-black text-yellow-400 text-3xl md:text-4xl uppercase tracking-wider mb-4 text-center drop-shadow" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>Artistes phares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4">
              {artistImages.map((artist) => (
                <div key={artist.name} className="rounded-xl overflow-hidden bg-black/75 border border-yellow-400/15 shadow-lg flex flex-col items-center pb-3 hover-scale transition">
                  <img src={artist.src} alt={artist.name} className="w-full object-cover aspect-square grayscale-[30%] hover:grayscale-0 duration-300" />
                  <div className="pt-2 text-lg font-bold text-yellow-400 uppercase tracking-wide truncate max-w-[92%] mx-auto text-center" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>{artist.name}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ADRESSE & CONTACT */}
          <section className="w-full flex flex-col md:flex-row gap-12 items-center py-5 mt-10 z-30">
            <div className="flex-1 space-y-4 text-gray-100 font-medium text-lg max-w-md">
              <div className="font-black text-yellow-400 text-2xl mb-2" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>Nous contacter</div>
              <div>
                <span className="font-bold text-white">Adresse :</span>
                <p>Avenue de Pailly 15<br/>1216 Châtelaine</p>
              </div>
              <div>
                <span className="font-bold text-white">Contact :</span>
                <p>xxxxxxx<br/>xxxxxxx</p>
              </div>
              <div>
                <span className="font-bold text-white">Heures d&apos;ouverture :</span>
                <p>Lun. - Ven. : <b>Fermé</b><br/>Samedi : <b>14h - minuit</b><br/>Dimanche : <b>14h - minuit</b></p>
              </div>
            </div>
            {/* Réseaux sociaux */}
            <div className="flex-1 flex flex-col items-center gap-5">
              <div className="flex gap-5 text-3xl text-white drop-shadow-xl">
                <a href="#" className="hover:text-yellow-400 opacity-80 transition" aria-label="Spotify"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" className="text-white" fill="white"/><rect x="12" y="18" width="8" height="2" rx="1" fill="black"/><rect x="10" y="14" width="12" height="2" rx="1" fill="black"/></svg></a>
                <a href="#" className="hover:text-yellow-400 opacity-80 transition" aria-label="Facebook"><svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M17.12,2H6.91A4.91,4.91,0,0,0,2,6.91V17.12A4.91,4.91,0,0,0,6.91,22h10.21A4.91,4.91,0,0,0,22,17.12V6.91A4.91,4.91,0,0,0,17.12,2ZM12,8.57a1.37,1.37,0,1,0,1.37,1.37A1.37,1.37,0,0,0,12,8.57ZM20,17.12A2.92,2.92,0,0,1,17.12,20H6.91A2.92,2.92,0,0,1,4,17.12V6.91A2.92,2.92,0,0,1,6.91,4H17.12A2.92,2.92,0,0,1,20,6.91Zm-3.78-2.42V16a.57.57,0,0,1-.57.57h-1.13V12.78h1.14l.28-1.13h-1.42V11a.29.29,0,0,1,.29-.29h1V9.43h-1A2,2,0,0,0,10.91,11v.72H9.86v1.13h1.05v2.62H8.78A.57.57,0,0,1,8.21,16V14.7A.57.57,0,0,1,8.78,14.13h1.08v-2a2,2,0,0,1,2-2H15a.29.29,0,0,1,.29.29V12h1.2A.58.58,0,0,1,16.22,14.7Z"/></svg></a>
                <a href="#" className="hover:text-yellow-400 opacity-80 transition" aria-label="Twitter"><svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M22,5.92a8.16,8.16,0,0,1-2.36.65,4.15,4.15,0,0,0,1.81-2.28,8.21,8.21,0,0,1-2.6,1A4.11,4.11,0,0,0,11,8.23a11.64,11.64,0,0,1-8.45-4.29A4.12,4.12,0,0,0,3,9.46a4.17,4.17,0,0,1-1.86-.52v.05A4.11,4.11,0,0,0,4.08,13.6a4.18,4.18,0,0,1-1.85.07A4.12,4.12,0,0,0,6.67,17.68,8.24,8.24,0,0,1,2,19.07a8.34,8.34,0,0,1-1-.05,11.63,11.63,0,0,0,6.25,1.83A11.57,11.57,0,0,0,23,7.73c0-.18,0-.36,0-.54A8.23,8.23,0,0,0,22,5.92Z"/></svg></a>
                <a href="#" className="hover:text-yellow-400 opacity-80 transition" aria-label="Vimeo"><svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M22.68,6.57a5,5,0,0,0-1.34-2.67Q20,3,19.06,3c-.57,0-1,.38-1.32,1.13l-.94,2a8.81,8.81,0,0,1-.88,1.63l-.24.31a11.23,11.23,0,0,1-1.7,2.23,15.26,15.26,0,0,1-2.13,2.09l-.24.2c-.18.14-.29.23-.32.23a.17.17,0,0,1-.19-.11c0-.14.05-.27.15-.42A10.54,10.54,0,0,0,12,8.22V4.85q0-.77.56-1.26A2.24,2.24,0,0,1,14,3q1,0,1.84.87.81.84,1.3,1.67A2,2,0,0,1,18.72,6c0,.56-.29,1.06-.66,1.39-.34.31-.88.56-1.17.56a1.08,1.08,0,0,1-.54-.11A1.15,1.15,0,0,0,16,8c-.23.06-.53.21-.65.3-.67.49-1.76,2.08-3.23,4.26A14.33,14.33,0,0,1,7,17.31C6,18.68,4.86,19.53,3.87,19.63,2.13,19.8,2,19.44,2,18.61,2,17.51,2.37,16.37,3,15A16.34,16.34,0,0,1,7.14,8.61a5.32,5.32,0,0,0-2-3A5.35,5.35,0,0,0,2.83,5.5c-.81.57-.83,2.12-.18,4.24A32.83,32.83,0,0,0,5.33,17a27.14,27.14,0,0,0,5.42,6.45q2.27,2.13,4.1,2.13c1.12,0,2.34-1,3.88-3.16,1.41-2,2.63-4.33,3.34-6.15Q24,13.46,24,12.11A6.66,6.66,0,0,0,22.68,6.57Z"/></svg></a>
                <a href="#" className="hover:text-yellow-400 opacity-80 transition" aria-label="YouTube"><svg width="34" height="34" fill="white" viewBox="0 0 24 24"><path d="M21.8,7.17A2.72,2.72,0,0,0,19.92,5.29C18.24,5,12,5,12,5s-6.24,0-7.92.32A2.76,2.76,0,0,0,2.2,7.17,29.46,29.46,0,0,0,2,12a29.13,29.13,0,0,0,.2,4.83,2.72,2.72,0,0,0,1.88,1.88c1.68.32,7.92.32,7.92.32s6.24,0,7.92-.32a2.69,2.69,0,0,0,1.88-1.88A28.71,28.71,0,0,0,22,12,28.86,28.86,0,0,0,21.8,7.17ZM10,15.52v-7l6.09,3.52Z"/></svg></a>
              </div>
              <div className="mt-8 text-white text-xs text-center opacity-60">© 2024 by MTNR Concept Studio</div>
            </div>
          </section>
        </main>
      </div>
    </ParallaxBg>
  );
}
