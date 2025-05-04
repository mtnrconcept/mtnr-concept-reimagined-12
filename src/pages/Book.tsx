
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const bookingFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Adresse email invalide.",
  }),
  phone: z.string().min(10, {
    message: "Numéro de téléphone invalide.",
  }),
  date: z.date({
    required_error: "Veuillez sélectionner une date.",
  }),
  service: z.string({
    required_error: "Veuillez sélectionner un service.",
  }),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Book() {
  const { id } = useParams();

  // Valeurs par défaut du formulaire
  const defaultValues: Partial<BookingFormValues> = {
    name: "",
    email: "",
    phone: "",
    message: "",
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  function onSubmit(data: BookingFormValues) {
    toast.success("Votre réservation a bien été prise en compte !", {
      description: `Nous vous contacterons prochainement pour confirmer votre réservation du ${format(data.date, 'PPP', { locale: fr })}.`,
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
              Réservez votre session photo avec MTNR Studio.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-400">Nom et prénom</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Votre nom" 
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-400">Téléphone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Votre numéro de téléphone" 
                            type="tel" 
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
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-yellow-400">Date souhaitée</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-transparent border-yellow-400/50 hover:bg-yellow-400/10 text-white",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionnez une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              locale={fr}
                            />
                          </PopoverContent>
                        </Popover>
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
                      <FormLabel className="text-yellow-400">Type de prestation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-yellow-400/50 text-white focus:border-yellow-400">
                            <SelectValue placeholder="Sélectionnez une prestation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black/90 border-yellow-400/50 text-white">
                          <SelectItem value="portrait">Portrait studio</SelectItem>
                          <SelectItem value="mode">Shooting Mode / Book</SelectItem>
                          <SelectItem value="event">Événementiel / Reportage</SelectItem>
                          <SelectItem value="location">Location du studio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-400">Message (facultatif)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Des précisions sur votre demande..."
                          className="resize-none min-h-[100px] bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white"
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
