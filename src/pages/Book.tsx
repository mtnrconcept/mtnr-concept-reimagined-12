
import ParallaxBackground from "@/components/ParallaxBackground";
import { useState } from "react";
import { toast } from "sonner";
import { PageSplashes } from "@/components/effects/PageSplashes";
import { motion } from "framer-motion";
import { CalendarClock, Clock, CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useUVMode } from "@/components/effects/UVModeContext";
import { Button } from "@/components/ui/button";

export default function Book() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    project: "", 
    type: "recording", 
    duration: "3h",
    date: "",
  });
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const { uvMode } = useUVMode();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  
  function nextStep() {
    setStep(step + 1);
  }
  
  function prevStep() {
    setStep(step - 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // POST/Email simulation
    setSuccess(true);
    toast("Session demandée ! On te rappelle vite…", { duration: 2500 });
    setTimeout(() => {
      setForm({ 
        name: "", 
        email: "", 
        phone: "",
        project: "", 
        type: "recording", 
        duration: "3h",
        date: "",
      });
      setStep(1);
      setSuccess(false);
    }, 3000);
  }

  return (
    <ParallaxBackground>
      <PageSplashes pageVariant="book" />
      
      <div className="relative z-10 min-h-screen">
        <div className="min-h-screen pt-24 xs:pt-28 md:pt-36 px-2 xs:px-6 flex flex-col items-center font-grunge section-content">
          <motion.h1 
            className="section-title text-yellow-400 text-2xl xs:text-4xl md:text-6xl mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Book ta session
          </motion.h1>
          
          <motion.p 
            className="text-base xs:text-lg text-gray-100 mb-7 text-center font-grunge max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Prêt à enregistrer ? Dis-nous qui tu es, décris ton projet, 
            on t'accueille dans la cave, tu repars avec LE son.
          </motion.p>

          <motion.div
            className="w-full max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className={`overflow-hidden relative ${uvMode ? 'border-yellow-400/50 bg-black/95' : 'border-yellow-900/20 bg-black/85'} paper-texture grunge-border rounded-2xl shadow-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-black/10 pointer-events-none"></div>
              
              {/* Indicateurs d'étape */}
              <div className="flex justify-center py-5 border-b border-yellow-900/20">
                <div className="flex items-center">
                  <div className={`rounded-full w-10 h-10 flex items-center justify-center ${step >= 1 ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-gray-300'}`}>
                    1
                  </div>
                  <div className={`w-12 h-1 ${step >= 2 ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
                  <div className={`rounded-full w-10 h-10 flex items-center justify-center ${step >= 2 ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-gray-300'}`}>
                    2
                  </div>
                  <div className={`w-12 h-1 ${step >= 3 ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
                  <div className={`rounded-full w-10 h-10 flex items-center justify-center ${step >= 3 ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-gray-300'}`}>
                    3
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  {/* Étape 1: Infos personnelles */}
                  {step === 1 && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-xl text-yellow-400 font-bold mb-4">Qui es-tu ?</h2>
                      
                      <div>
                        <label className="font-grunge text-yellow-400 font-extrabold">Nom / Blase</label>
                        <Input
                          type="text"
                          name="name"
                          required
                          autoComplete="off"
                          value={form.name}
                          onChange={handleChange}
                          className="mt-2 border-b-2 border-yellow-900/30 px-2 py-2 bg-black/20 font-grunge text-white outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      
                      <div>
                        <label className="font-grunge text-yellow-400 font-extrabold">Email</label>
                        <Input
                          type="email"
                          name="email"
                          required
                          autoComplete="off"
                          value={form.email}
                          onChange={handleChange}
                          className="mt-2 border-b-2 border-yellow-900/30 px-2 py-2 bg-black/20 font-grunge text-white outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      
                      <div>
                        <label className="font-grunge text-yellow-400 font-extrabold">Téléphone</label>
                        <Input
                          type="tel"
                          name="phone"
                          autoComplete="off"
                          value={form.phone}
                          onChange={handleChange}
                          className="mt-2 border-b-2 border-yellow-900/30 px-2 py-2 bg-black/20 font-grunge text-white outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="mt-4 font-grunge font-black bg-yellow-400 text-black rounded-full px-7 py-3 shadow hover:bg-yellow-200 hover:text-gray-950 transition-all duration-200 uppercase text-lg xs:text-xl tracking-wider"
                        >
                          Suivant
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Étape 2: Infos projet */}
                  {step === 2 && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-xl text-yellow-400 font-bold mb-4">Ton projet</h2>
                      
                      <div>
                        <label className="font-grunge text-yellow-400 font-extrabold">Type de session</label>
                        <select
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          className="w-full mt-2 border-b-2 border-yellow-900/30 px-2 py-3 bg-black/30 font-grunge text-white outline-none focus:border-yellow-400 transition rounded"
                        >
                          <option value="recording">Enregistrement</option>
                          <option value="mixing">Mixage</option>
                          <option value="mastering">Mastering</option>
                          <option value="full">Production Complète</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="font-grunge text-yellow-400 font-extrabold">Description du projet</label>
                        <Textarea
                          name="project"
                          rows={4}
                          required
                          value={form.project}
                          onChange={handleChange}
                          placeholder="Décris ton projet, ce que tu souhaites faire, nombre de titres, durée estimée..."
                          className="mt-2 border-b-2 border-yellow-900/30 px-2 py-2 bg-black/20 font-grunge text-white outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="mt-4 font-grunge bg-transparent border border-yellow-400/50 text-yellow-400 rounded-full px-5 py-2 hover:bg-yellow-400/10 transition-all duration-200"
                        >
                          Retour
                        </Button>
                        
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="mt-4 font-grunge font-black bg-yellow-400 text-black rounded-full px-7 py-3 shadow hover:bg-yellow-200 hover:text-gray-950 transition-all duration-200 uppercase text-lg xs:text-xl tracking-wider"
                        >
                          Suivant
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Étape 3: Durée et Date */}
                  {step === 3 && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-xl text-yellow-400 font-bold mb-4">Quand et combien de temps ?</h2>
                      
                      <div>
                        <label className="font-grunge text-yellow-400 font-extrabold flex items-center gap-2">
                          <Clock className="text-yellow-400" size={20} />
                          Durée estimée
                        </label>
                        <select
                          name="duration"
                          value={form.duration}
                          onChange={handleChange}
                          className="w-full mt-2 border-b-2 border-yellow-900/30 px-2 py-3 bg-black/30 font-grunge text-white outline-none focus:border-yellow-400 transition rounded"
                        >
                          <option value="3h">3 heures</option>
                          <option value="6h">6 heures</option>
                          <option value="day">Journée complète</option>
                          <option value="custom">Plusieurs jours</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="font-grunge text-yellow-400 font-extrabold flex items-center gap-2">
                          <CalendarClock className="text-yellow-400" size={20} />
                          Date souhaitée
                        </label>
                        <Input
                          type="date"
                          name="date"
                          required
                          value={form.date}
                          onChange={handleChange}
                          className="mt-2 border-b-2 border-yellow-900/30 px-2 py-2 bg-black/20 font-grunge text-white outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {/* Options disponibles */}
                        <motion.div 
                          className={`flex flex-col items-center justify-center p-3 border border-yellow-400/30 rounded-xl ${form.date ? 'bg-yellow-400/5' : 'bg-gray-900/30'}`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CalendarCheck className={`w-8 h-8 mb-2 ${form.date ? 'text-yellow-400' : 'text-gray-500'}`} />
                          <span className={`text-sm text-center ${form.date ? 'text-yellow-100' : 'text-gray-500'}`}>
                            {form.date ? 'Date sélectionnée' : 'Choisis une date'}
                          </span>
                        </motion.div>
                      </div>
                      
                      <div className="pt-6 flex justify-between">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="mt-4 font-grunge bg-transparent border border-yellow-400/50 text-yellow-400 rounded-full px-5 py-2 hover:bg-yellow-400/10 transition-all duration-200"
                        >
                          Retour
                        </Button>
                        
                        <Button
                          type="submit"
                          className="mt-4 font-grunge font-black bg-yellow-400 text-black rounded-full px-7 py-3 shadow hover:bg-yellow-200 hover:text-gray-950 transition-all duration-200 uppercase text-lg xs:text-xl tracking-wider flex items-center gap-2"
                        >
                          <span>Réserver</span>
                          <CalendarCheck className="w-5 h-5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {success && (
                    <div className="mt-6 text-green-400 text-center font-grunge animate-pulse">
                      Demande envoyée avec succès !
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
            
            {/* Services proposés */}
            <div className="mt-12 mb-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-90">
              <Card className="border-yellow-900/20 bg-black/70 shadow-lg hover:shadow-yellow-900/5 transition">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Session d'enregistrement</h3>
                  <p className="text-sm text-gray-300">Ingénieurs du son expérimentés, équipement professionnel et une acoustique parfaite pour capturer ton talent.</p>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-900/20 bg-black/70 shadow-lg hover:shadow-yellow-900/5 transition">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Mixage & Mastering</h3>
                  <p className="text-sm text-gray-300">Donne à tes enregistrements la qualité dont ils ont besoin pour briller. Traitement audio de haute précision.</p>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-900/20 bg-black/70 shadow-lg hover:shadow-yellow-900/5 transition">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Production complète</h3>
                  <p className="text-sm text-gray-300">De l'idée à la réalisation finale. On t'accompagne à chaque étape pour créer un son unique.</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxBackground>
  );
}
