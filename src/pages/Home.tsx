
import { Link } from "react-router-dom";

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
    <div className="min-h-screen w-full bg-black flex flex-col items-center font-sans overflow-x-hidden">
      {/* Background logo */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
        <img
          src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png"
          alt="MTNR Logo"
          className="opacity-10 w-[60vw] max-w-lg blur-[1px]"
        />
      </div>

      {/* HEADER + HERO */}
      <header className="relative z-10 w-full flex flex-col items-center">
        <nav className="w-full flex justify-between items-center px-6 py-6 z-30 relative">
          <div className="flex items-center gap-3">
            <img
              src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png"
              alt="MTNR logo"
              className="h-12 md:h-16 w-auto drop-shadow-lg object-contain"
            />
            <span className="font-bold text-white text-3xl tracking-widest drop-shadow-lg select-none">MTNR Concept</span>
          </div>
          <div className="flex gap-6 uppercase text-white font-extrabold tracking-wide text-sm md:text-base">
            <Link to="/">Home</Link>
            <Link to="/what-we-do">What We Do</Link>
            <Link to="/artists">Artists</Link>
            <Link to="/book">Book ta session</Link>
            <Link to="/contact">Ecris-nous</Link>
            <Link to="/shop">Boutique</Link>
            <Link to="/reservation">Réservation en ligne</Link>
            <button className="ml-8 px-4 py-1 bg-yellow-400 text-black text-xs font-bold rounded hover:bg-yellow-300 transition">Se connecter</button>
          </div>
        </nav>
        {/* Hero */}
        <section className="w-full max-w-3xl mx-auto pt-20 pb-8 text-center relative">
          <h1 className="font-black text-5xl md:text-7xl tracking-tight leading-tight text-white drop-shadow-2xl" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>
            C&apos;est peut-être<br />
            <span className="text-yellow-400">le début</span><br />
            de quelque chose<br />de <span className="text-yellow-400">GRAND</span>
          </h1>
          <p className="mt-10 text-lg sm:text-xl font-semibold text-gray-100 drop-shadow-sm px-4">
            Chez <b>MTNR Concept Studio</b>, nous nous engageons à donner le meilleur de nous-mêmes à chaque artiste.
            Notre objectif est d’extraire l’essence même de votre talent. Artistes dans l’âme, aucun projet ne quitte notre studio tant que le résultat n’est pas à la hauteur de vos attentes.&nbsp;
            <br />Nous croyons en la puissance thérapeutique de la création.<br /><span className="text-yellow-300">Votre satisfaction est notre priorité absolue.</span>
          </p>
        </section>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative w-full max-w-5xl z-10 flex-1 flex flex-col gap-20 items-center px-3">

        {/* HISTOIRE */}
        <section className="w-full flex flex-col md:flex-row gap-10 items-center px-4 py-12 bg-white/5 rounded-2xl border-2 border-yellow-400/30 shadow-2xl drop-shadow-lg backdrop-blur-sm">
          <div className="flex-1 flex flex-col items-start">
            <h2 className="uppercase font-black text-yellow-400 text-2xl sm:text-3xl tracking-wider drop-shadow" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>
              Le Début<br />
              <span className="block text-white text-lg font-semibold normal-case tracking-normal mt-2">Qui ? Quoi ? Quand ?</span>
            </h2>
            <div className="font-medium mt-6 text-gray-100 leading-relaxed space-y-4 text-base">
              <p>
                <span className="text-yellow-300 font-bold">MTNR Concept Studio</span>, c’est bien plus qu’un simple lieu de création musicale. C’est le fruit de 15 années d’efforts acharnés, mais surtout, c’est le résultat d’un rêve de deux ados devenu réalité.
              </p>
              <p>
                Deux potes d’enfance, rentrant d’une soirée, se sont retrouvés à poser des lyrics sur un coin de rue, l’un posant le texte tandis que l’autre écoutait. C’est là que tout a commencé, dans un élan spontané et passionné.
              </p>
              <p>
                Sans connaissances particulières mais avec une soif de découverte inépuisable, ils ont bâti leur première cabine à partir de palettes et de coton. Puis, avec le temps, une seconde a vu le jour, un peu plus professionnelle.
              </p>
              <p>
                Des dizaines, voire des centaines d’artistes ont franchi le seuil de ce laboratoire musical, chacun apportant sa propre magie. Mais ce n’est que le début de l’aventure. Chez <b>MTNR Concept Studio</b>, chaque jour est une nouvelle chance de faire vibrer le monde avec notre passion et notre dévouement sans limites.
              </p>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png" alt="Logo MTNR" className="w-64 h-64 md:w-72 md:h-72 object-contain drop-shadow-xl brightness-125" />
          </div>
        </section>

        {/* SERVICES */}
        <section className="w-full space-y-14">
          <h2 className="font-black text-white text-3xl md:text-4xl uppercase tracking-wider mb-8 text-center drop-shadow" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>Services</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Enregistrement Studio */}
            <div className="rounded-3xl bg-black/80 border-2 border-yellow-500/70 px-7 py-8 shadow-2xl hover:scale-105 transition-transform duration-200 flex flex-col items-center text-center">
              <h3 className="font-extrabold text-2xl text-yellow-400 uppercase mb-4 tracking-wider" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>01<br />Enregistrement Studio</h3>
              <p className="text-gray-200 font-medium mb-4">On Capture vos Vibes en Studio ! Entrez dans notre zone et laissez-nous capturer vos flows les plus fous, vos riffs les plus épiques et vos punchlines les plus percutantes. Notre studio est équipé pour faire briller chaque détail de votre son. Que vous soyez rappeur ou beatmaker, notre équipe est prête à vous faire vibrer.</p>
              <span className="text-lg font-extrabold text-yellow-300 mt-2">50 CHF</span>
              <Link to="/reservation" className="mt-8 px-6 py-2 bg-yellow-400 text-black rounded-full font-bold tracking-widest hover:bg-yellow-300 transition">Réserver</Link>
            </div>
            {/* Mixing */}
            <div className="rounded-3xl bg-black/80 border-2 border-yellow-500/70 px-7 py-8 shadow-2xl hover:scale-105 transition-transform duration-200 flex flex-col items-center text-center">
              <h3 className="font-extrabold text-2xl text-yellow-400 uppercase mb-4 tracking-wider" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>02<br />Mixing</h3>
              <p className="text-gray-200 font-medium mb-4">Harmonisons vos Voix pour un Son Impeccable ! Au cœur du studio, chaque parole & souffle est traité pour une harmonie sonore qui transcende. Rappeur en session, chanteur R&B… nous sublimerons chaque nuance de votre voix.</p>
              <span className="text-lg font-extrabold text-yellow-300 mt-2">100 CHF</span>
              <Link to="/reservation" className="mt-8 px-6 py-2 bg-yellow-400 text-black rounded-full font-bold tracking-widest hover:bg-yellow-300 transition">Réserver</Link>
            </div>
            {/* Mastering */}
            <div className="rounded-3xl bg-black/80 border-2 border-yellow-500/70 px-7 py-8 shadow-2xl hover:scale-105 transition-transform duration-200 flex flex-col items-center text-center">
              <h3 className="font-extrabold text-2xl text-yellow-400 uppercase mb-4 tracking-wider" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>03<br />Mastering d’excellence</h3>
              <p className="text-gray-200 font-medium mb-4">Faisons Briller vos Tracks dans les Rues ! Le mastering, c’est là que tout prend forme : chaque beat et riff poli pour briller comme des diamants. Préparez-vous à drop vos tracks !</p>
              <span className="text-lg font-extrabold text-yellow-300 mt-2">50 CHF</span>
              <Link to="/reservation" className="mt-8 px-6 py-2 bg-yellow-400 text-black rounded-full font-bold tracking-widest hover:bg-yellow-300 transition">Réserver</Link>
            </div>
          </div>
        </section>

        {/* ARTISTES */}
        <section className="w-full mt-2">
          <h2 className="font-black text-yellow-400 text-3xl md:text-4xl uppercase tracking-wider mb-6 text-center drop-shadow" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>Artistes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-5">
            {artistImages.map((artist) => (
              <div key={artist.name} className="rounded-2xl overflow-hidden shadow-xl bg-black/70 flex flex-col items-center pb-4 border-2 border-yellow-900/70">
                <img src={artist.src} alt={artist.name} className="w-full object-cover aspect-square" />
                <div className="pt-2 text-lg font-bold text-yellow-400 uppercase tracking-wider" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>{artist.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Infos */}
        <section className="w-full flex flex-col md:flex-row gap-12 items-center py-10">
          <div className="flex-1 space-y-4 text-gray-100 font-medium">
            <h2 className="font-black text-yellow-400 text-2xl mb-2" style={{fontFamily: '"Impact", "Arial Black", "sans-serif"'}}>Nous contacter</h2>
            <div>
              <span className="font-bold text-white">Adresse :</span>
              <p>Avenue de Pailly 15<br />1216 Châtelaine</p>
            </div>
            <div>
              <span className="font-bold text-white">Contact :</span>
              <p>xxxxxxx<br />xxxxxxx</p>
            </div>
            <div>
              <span className="font-bold text-white">Heures d&apos;ouverture :</span>
              <p>Lun. - Ven. : <b>Fermé</b><br />Samedi : <b>14h - minuit</b><br />Dimanche : <b>14h - minuit</b></p>
            </div>
          </div>
          {/* Réseaux sociaux (émulateur, utiliser icons Lucide en attendant icons blanches) */}
          <div className="flex-1 flex flex-col items-center gap-5">
            <div className="flex gap-6 text-2xl text-white">
              <a href="#" className="hover:text-yellow-400" aria-label="Spotify"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" className="text-white" fill="white"/><rect x="12" y="18" width="8" height="2" rx="1" fill="black"/><rect x="10" y="14" width="12" height="2" rx="1" fill="black"/></svg></a>
              <a href="#" className="hover:text-yellow-400" aria-label="Facebook"><svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M17.12,2H6.91A4.91,4.91,0,0,0,2,6.91V17.12A4.91,4.91,0,0,0,6.91,22h10.21A4.91,4.91,0,0,0,22,17.12V6.91A4.91,4.91,0,0,0,17.12,2ZM12,8.57a1.37,1.37,0,1,0,1.37,1.37A1.37,1.37,0,0,0,12,8.57ZM20,17.12A2.92,2.92,0,0,1,17.12,20H6.91A2.92,2.92,0,0,1,4,17.12V6.91A2.92,2.92,0,0,1,6.91,4H17.12A2.92,2.92,0,0,1,20,6.91Zm-3.78-2.42V16a.57.57,0,0,1-.57.57h-1.13V12.78h1.14l.28-1.13h-1.42V11a.29.29,0,0,1,.29-.29h1V9.43h-1A2,2,0,0,0,10.91,11v.72H9.86v1.13h1.05v2.62H8.78A.57.57,0,0,1,8.21,16V14.7A.57.57,0,0,1,8.78,14.13h1.08v-2a2,2,0,0,1,2-2H15a.29.29,0,0,1,.29.29V12h1.2A.58.58,0,0,1,16.22,14.7Z"/></svg></a>
              <a href="#" className="hover:text-yellow-400" aria-label="Twitter"><svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M22,5.92a8.16,8.16,0,0,1-2.36.65,4.15,4.15,0,0,0,1.81-2.28,8.21,8.21,0,0,1-2.6,1A4.11,4.11,0,0,0,11,8.23a11.64,11.64,0,0,1-8.45-4.29A4.12,4.12,0,0,0,3,9.46a4.17,4.17,0,0,1-1.86-.52v.05A4.11,4.11,0,0,0,4.08,13.6a4.18,4.18,0,0,1-1.85.07A4.12,4.12,0,0,0,6.67,17.68,8.24,8.24,0,0,1,2,19.07a8.34,8.34,0,0,1-1-.05,11.63,11.63,0,0,0,6.25,1.83A11.57,11.57,0,0,0,23,7.73c0-.18,0-.36,0-.54A8.23,8.23,0,0,0,22,5.92Z"/></svg></a>
              <a href="#" className="hover:text-yellow-400" aria-label="Vimeo"><svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M22.68,6.57a5,5,0,0,0-1.34-2.67Q20,3,19.06,3c-.57,0-1,.38-1.32,1.13l-.94,2a8.81,8.81,0,0,1-.88,1.63l-.24.31a11.23,11.23,0,0,1-1.7,2.23,15.26,15.26,0,0,1-2.13,2.09l-.24.2c-.18.14-.29.23-.32.23a.17.17,0,0,1-.19-.11c0-.14.05-.27.15-.42A10.54,10.54,0,0,0,12,8.22V4.85q0-.77.56-1.26A2.24,2.24,0,0,1,14,3q1,0,1.84.87.81.84,1.3,1.67A2,2,0,0,1,18.72,6c0,.56-.29,1.06-.66,1.39-.34.31-.88.56-1.17.56a1.08,1.08,0,0,1-.54-.11A1.15,1.15,0,0,0,16,8c-.23.06-.53.21-.65.3-.67.49-1.76,2.08-3.23,4.26A14.33,14.33,0,0,1,7,17.31C6,18.68,4.86,19.53,3.87,19.63,2.13,19.8,2,19.44,2,18.61,2,17.51,2.37,16.37,3,15A16.34,16.34,0,0,1,7.14,8.61a5.32,5.32,0,0,0-2-3A5.35,5.35,0,0,0,2.83,5.5c-.81.57-.83,2.12-.18,4.24A32.83,32.83,0,0,0,5.33,17a27.14,27.14,0,0,0,5.42,6.45q2.27,2.13,4.1,2.13c1.12,0,2.34-1,3.88-3.16,1.41-2,2.63-4.33,3.34-6.15Q24,13.46,24,12.11A6.66,6.66,0,0,0,22.68,6.57Z"/></svg></a>
              <a href="#" className="hover:text-yellow-400" aria-label="YouTube"><svg width="34" height="34" fill="white" viewBox="0 0 24 24"><path d="M21.8,7.17A2.72,2.72,0,0,0,19.92,5.29C18.24,5,12,5,12,5s-6.24,0-7.92.32A2.76,2.76,0,0,0,2.2,7.17,29.46,29.46,0,0,0,2,12a29.13,29.13,0,0,0,.2,4.83,2.72,2.72,0,0,0,1.88,1.88c1.68.32,7.92.32,7.92.32s6.24,0,7.92-.32a2.69,2.69,0,0,0,1.88-1.88A28.71,28.71,0,0,0,22,12,28.86,28.86,0,0,0,21.8,7.17ZM10,15.52v-7l6.09,3.52Z"/></svg></a>
            </div>
            <div className="mt-8 text-white text-sm text-center opacity-70">© 2024 by MTNR Concept Studio</div>
          </div>
        </section>
      </main>
    </div>
  );
}
