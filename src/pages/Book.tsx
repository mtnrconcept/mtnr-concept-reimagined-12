
import ParallaxBg from "@/components/ParallaxBg";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { toast } from "sonner";

export default function Book() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // POST/Email simulation
    setSuccess(true);
    toast("Session demandée ! On te rappelle vite…", { duration: 2500 });
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <ParallaxBg>
      <Navbar />
      <div className="min-h-screen pt-36 px-6 flex flex-col items-center font-grunge">
        <h1 className="font-grunge text-yellow-400 text-4xl md:text-6xl uppercase text-center drop-shadow-lg mb-5 animate-wiggle">
          Book ta session
        </h1>
        <p className="text-lg text-gray-100 mb-9 text-center font-grunge max-w-lg">
          Prêt à enregistrer ? Dis-nous qui tu es, décris ton projet, on t’accueille dans la cave, tu repars avec LE son.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-black/85 paper-texture grunge-border rounded-2xl px-8 py-8 shadow-2xl flex flex-col gap-6"
        >
          <div>
            <label className="font-grunge text-yellow-400 font-extrabold">Nom / Blase</label>
            <input type="text" name="name" required autoComplete="off"
              value={form.name} onChange={handleChange}
              className="w-full mt-2 border-b-2 border-primary px-2 py-2 bg-transparent font-grunge text-white outline-none focus:border-yellow-400 transition" />
          </div>
          <div>
            <label className="font-grunge text-yellow-400 font-extrabold">Email</label>
            <input type="email" name="email" required autoComplete="off"
              value={form.email} onChange={handleChange}
              className="w-full mt-2 border-b-2 border-primary px-2 py-2 bg-transparent font-grunge text-white outline-none focus:border-yellow-400 transition" />
          </div>
          <div>
            <label className="font-grunge text-yellow-400 font-extrabold">Ton Projet</label>
            <textarea name="message" rows={4} required
              value={form.message} onChange={handleChange}
              className="w-full mt-2 border-b-2 border-primary px-2 py-2 bg-transparent font-grunge text-white outline-none focus:border-yellow-400 transition"></textarea>
          </div>
          <button type="submit" className="mt-5 font-grunge font-black bg-yellow-400 text-black rounded-full px-8 py-3 shadow hover:bg-yellow-200 hover:text-gray-950 transition-all duration-200 uppercase text-xl tracking-wider">
            Demander une session
          </button>
          {success && (
            <div className="mt-2 text-green-400 text-center font-grunge animate-wiggle">Demande envoyée !</div>
          )}
        </form>
      </div>
    </ParallaxBg>
  );
}
