
import React from 'react';
import { useParams } from 'react-router-dom';
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";
import { PageSplashes } from "@/components/effects/PageSplashes";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Clock, Headphones, MessageSquare, User } from "lucide-react";

const bookingFormSchema = z.object({
  blaze: z.string().min(2, {
    message: "Votre blaze doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Adresse email invalide.",
  }),
  service: z.string({
    required_error: "Veuillez sélectionner un type de prestation.",
  }),
  duration: z.number().min(1, {
    message: "Veuillez indiquer une durée approximative.",
  }),
  description: z.string().min(10, {
    message: "Veuillez ajouter une description d'au moins 10 caractères.",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Book() {
  const { id } = useParams();

  // Valeurs par défaut du formulaire
  const defaultValues: Partial<BookingFormValues> = {
    blaze: "",
    email: "",
    duration: 60,
    description: "",
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  function onSubmit(data: BookingFormValues) {
    toast.success("Votre projet a bien été enregistré !", {
      description: `Nous vous contacterons prochainement pour discuter de votre projet de ${data.service}.`,
      duration: 5000,
    });
    form.reset();
  }
  
  return (
    <ParallaxBackground>
      <PageSplashes pageVariant="book" />
      
      <div className="relative z-10 min-h-screen">
        <div className="min-h-screen pt-24 xs:pt-28 md:pt-36 px-2 xs:px-6 flex flex-col items-center font-grunge section-content">
          <div className="relative">
            <NeonText text="Réservation" className="text-3xl xs:text-4xl md:text-6xl mb-5 xs:mb-8 uppercase text-center" color="yellow" flicker={true} />
            <ElectricParticles targetSelector=".neon-text" color="#ffdd00" quantity={12} />
          </div>
          
          <div className="w-full max-w-4xl bg-black/80 grunge-border paper-texture p-6 xs:p-8 md:p-10 mx-auto text-white rounded-xl shadow-2xl mb-10">
            <p className="text-lg text-center mb-8">
              Réservez votre session studio ou votre prestation musicale.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="blaze"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-400 flex items-center gap-2">
                          <User className="h-4 w-4" /> Votre blaze
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nom d'artiste ou pseudo" 
                            {...field} 
                            className="bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-400">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@exemple.com" 
                            type="email" 
                            {...field}
                            className="bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-400 flex items-center gap-2">
                        <Headphones className="h-4 w-4" /> Type de prestation
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-yellow-400/50 text-white focus:border-yellow-400">
                            <SelectValue placeholder="Sélectionnez une prestation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black/90 border-yellow-400/50 text-white">
                          <SelectItem value="recording">Enregistrement studio</SelectItem>
                          <SelectItem value="mixage">Mixage</SelectItem>
                          <SelectItem value="mastering">Mastering</SelectItem>
                          <SelectItem value="production">Production musicale</SelectItem>
                          <SelectItem value="beatmaking">Beatmaking</SelectItem>
                          <SelectItem value="location">Location du studio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-400 flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Durée estimée (minutes)
                      </FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Slider
                              min={30}
                              max={240}
                              step={15}
                              value={[value || 60]}
                              onValueChange={(vals) => onChange(vals[0])}
                              className="py-4"
                              {...fieldProps}
                            />
                          </FormControl>
                          <span className="w-16 text-center font-mono bg-black/30 py-1 px-2 rounded border border-yellow-400/30">
                            {value || 60}m
                          </span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-400 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Description du projet
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez votre projet musical, vos influences, vos besoins spécifiques..."
                          className="resize-none min-h-[120px] bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black tracking-wider py-6 text-lg"
                >
                  Réserver maintenant
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </ParallaxBackground>
  );
}
