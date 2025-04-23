
import ParallaxBg from "@/components/ParallaxBg";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { toast } from "sonner";

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
    toast("Message reçu, la Cave va répondre !", { duration: 2400 });
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <ParallaxBg>
      <Navbar />
      <div className="min-h-screen pt-36 px-6 flex flex-col items-center font-grunge">
        <h1 className="font-grunge text-yellow-400 text-4xl md:text-6xl uppercase text-center drop-shadow-lg mb-3 animate-wiggle">
          Contact
        </h1>
        <p className="text-lg text-gray-100 mb-6 text-center font-grunge max-w-md">
          Balance un coucou, une question, une collab'.<br />MTNR répond toujours à la vibe.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-black/85 grunge-border paper-texture rounded-2xl px-8 py-8 shadow-2xl flex flex-col gap-7"
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
          <button type="submit" className="w-full mt-2 font-grunge font-black bg-yellow-400 text-black rounded-full px-7 py-3 shadow hover:bg-yellow-200 hover:text-gray-900 transition-all duration-200 uppercase text-lg tracking-wider">
            Envoyer
          </button>
          {success && (
            <div className="mt-2 text-green-400 text-center font-grunge animate-wiggle">Message envoyé !</div>
          )}
        </form>
        <div className="mt-10 font-grunge text-center text-gray-200/80 text-lg">
          <div className="mb-3">Email : <a href="mailto:contact@mtnrconcept.fr" className="underline text-primary">contact@mtnrconcept.fr</a></div>
          <div className="mb-3">Instagram : <a href="https://www.instagram.com/" target="_blank" className="underline text-yellow-400">@mtnr_concept</a></div>
        </div>
      </div>
    </ParallaxBg>
  );
}
