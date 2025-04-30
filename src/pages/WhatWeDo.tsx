import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ParallaxBackground from "@/components/ParallaxBackground";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import UVText from "@/components/effects/UVText";
import { motion } from "framer-motion";

// Animation configs
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15
    }
  }
};

export default function WhatWeDo() {
  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add mouse move event for interactive particles
  useEffect(() => {
    const handleInteractiveParticles = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      // Apply subtle transformations based on mouse position
      document.documentElement.style.setProperty('--mouse-x', mouseX.toString());
      document.documentElement.style.setProperty('--mouse-y', mouseY.toString());
    };
    
    window.addEventListener('mousemove', handleInteractiveParticles);
    return () => window.removeEventListener('mousemove', handleInteractiveParticles);
  }, []);

  return (
    <div className="relative z-10 min-h-screen">
      <Navbar />
      <main className="min-h-screen w-full flex flex-col items-center pt-20 xs:pt-24 md:pt-32 pb-32 px-3 xs:px-6 font-grunge">
        <motion.div 
          className="w-full max-w-4xl mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="relative px-4 xs:px-8 md:px-16 mb-16">
            <NeonText 
              text="Notre Vibe" 
              className="text-3xl xs:text-4xl md:text-6xl text-center" 
              color="yellow" 
              flicker={true} 
            />
            <ElectricParticles targetSelector=".neon-text" color="#ffdd00" quantity={12} />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-black/80 grunge-border paper-texture px-5 xs:px-7 py-7 xs:py-8 md:py-10 mx-auto font-grunge text-gray-200 text-base xs:text-lg md:text-xl leading-relaxed shadow-xl"
          >
            <p className="mb-6">
              <UVText 
                text={<b className="text-yellow-400 font-extrabold">MTNR Studio</b>}
                hiddenText="MTNR - CODE SECRET"
                uvColor="#7E69AB"
              />
              , c'est le choix de la marge.<br />
              On crée sans limite, on enregistre dans la sueur, on partage la ride.
            </p>
            
            <ul className="list-disc ml-6 space-y-3 font-bold text-yellow-400 mb-8">
              <motion.li variants={itemVariants}>
                <UVText 
                  text="Studio accessible à tous, on casse les codes : no bling, que du vrai."
                  hiddenText="ACCESS CODE 3472 - MEMBRES UNIQUEMENT"
                  uvColor="#9b87f5"
                />
              </motion.li>
              <motion.li variants={itemVariants}>Ambiance home-made : murs rough, lampes chaudes, matos old-school tweaké à l'os.</motion.li>
              <motion.li variants={itemVariants}>
                <UVText 
                  text="Crew fraternel : chacun amène sa folie et repart avec une vibe unique."
                  hiddenText="LA FRATERNITÉ EST NOTRE ARME SECRÈTE"
                  uvColor="#D946EF"
                />
              </motion.li>
              <motion.li variants={itemVariants}>On valorise le process : l'art, c'est la trace qu'on laisse. Les erreurs font le style.</motion.li>
            </ul>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-black/40 border border-yellow-500/20 p-4 md:p-6 rounded-md mb-8"
            >
              <h3 className="text-yellow-400 text-xl md:text-2xl mb-3">Notre approche</h3>
              <p>
                Le son brut, direct, qui raconte une histoire vraie. On monte le son pour
                faire tomber les murs entre les styles et les gens. 
                <br />
                <br />
                <span className="text-yellow-300">
                  "Le studio n'est pas qu'un lieu, c'est une attitude."
                </span>
              </p>
            </motion.div>
            
            <span className="block font-black text-white mt-7 text-xl xs:text-2xl">
              <UVText 
                text="Rejoignez la ride. Le son prend vie dans la cave."
                hiddenText="REJOINS-NOUS DANS L'OMBRE - 23H30 - SOUS-SOL - CODE: MTNR"
                uvColor="#F97316"
                textSize="text-xl xs:text-2xl"
              />
            </span>
          </motion.div>
        </motion.div>
        
        {/* Services Grid Section */}
        <motion.section 
          className="w-full max-w-4xl mt-12 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h2 className="text-2xl xs:text-3xl md:text-4xl text-yellow-400 font-bold mb-8 text-center">Nos Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Enregistrement",
                desc: "Capturez votre son brut avec notre matériel vintage et nos techniques modernes.",
                icon: "🎙️"
              },
              {
                title: "Mixage",
                desc: "On sculpte votre son avec précision pour trouver l'équilibre parfait entre clarté et caractère.",
                icon: "🎚️"
              },
              {
                title: "Mastering",
                desc: "La touche finale pour que votre son claque sur toutes les plateformes.",
                icon: "💿"
              },
              {
                title: "Production",
                desc: "Besoin d'instrumentales ou d'arrangements? On vous accompagne de A à Z.",
                icon: "🎹"
              }
            ].map((service, index) => (
              <motion.div 
                key={index}
                className="bg-black/70 border border-yellow-500/20 p-5 rounded-lg shadow-lg hover:shadow-yellow-600/10 transition-all"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(0,0,0,0.8)" }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{service.icon}</div>
                  <div>
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">{service.title}</h3>
                    <p className="text-gray-300">{service.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Call to action with enhanced 3D effect */}
        <motion.div 
          className="w-full max-w-3xl bg-black/70 p-6 rounded-xl border border-yellow-500/30 text-center transform-gpu"
          style={{
            transform: 'translateZ(20px)',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Prêt à donner vie à ton son?</h3>
          <p className="text-gray-300 mb-6">
            Que tu sois débutant ou confirmé, on a ce qu'il te faut pour faire décoller ton projet.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,221,0,0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-400/30"
          >
            Book une session
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
