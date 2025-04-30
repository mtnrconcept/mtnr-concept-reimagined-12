
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simul: envoi, toast
    setSuccess(true);
    toast("Message reçu, la Cave va répondre !", { duration: 2400 });
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <div className="min-h-screen pt-24 xs:pt-28 md:pt-36 px-2 xs:px-6 flex flex-col items-center font-grunge section-content">
          <motion.h1 
            className="section-title text-yellow-400 text-2xl xs:text-4xl md:text-6xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Contact
          </motion.h1>
          <motion.p 
            className="text-base xs:text-lg text-gray-100 mb-6 text-center font-grunge max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Balance un coucou, une question, une collab'.<br />MTNR répond toujours à la vibe.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-black/80 border border-yellow-400/30 rounded-2xl px-4 xs:px-8 py-8 shadow-2xl flex flex-col gap-7"
          >
            <div>
              <label className="font-grunge text-yellow-400 font-extrabold">Nom / Crew</label>
              <input type="text" name="name" required autoComplete="off"
                value={form.name} onChange={handleChange}
                className="w-full mt-2 border-b-2 border-yellow-400 px-2 py-2 bg-transparent font-grunge text-white outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="font-grunge text-yellow-400 font-extrabold">Email</label>
              <input type="email" name="email" required autoComplete="off"
                value={form.email} onChange={handleChange}
                className="w-full mt-2 border-b-2 border-yellow-400 px-2 py-2 bg-transparent font-grunge text-white outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="font-grunge text-yellow-400 font-extrabold">Message</label>
              <textarea name="message" rows={4} required
                value={form.message} onChange={handleChange}
                className="w-full mt-2 border-b-2 border-yellow-400 px-2 py-2 bg-transparent font-grunge text-white outline-none focus:border-primary transition"></textarea>
            </div>
            <button type="submit" className="w-full mt-2 font-grunge font-black bg-yellow-400 text-black rounded-full px-6 py-3 shadow hover:bg-yellow-200 hover:text-gray-900 transition-all duration-200 uppercase text-lg tracking-wider">
              Envoyer
            </button>
            {success && (
              <div className="mt-2 text-green-400 text-center font-grunge animate-wiggle">Message envoyé !</div>
            )}
          </motion.form>
          <motion.div 
            className="mt-10 font-grunge text-center text-gray-200/80 text-base xs:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <div className="mb-3">Email : <a href="mailto:contact@mtnrconcept.fr" className="underline text-primary">contact@mtnrconcept.fr</a></div>
            <div className="mb-3">Instagram : <a href="https://www.instagram.com/" target="_blank" className="underline text-yellow-400">@mtnr_concept</a></div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
