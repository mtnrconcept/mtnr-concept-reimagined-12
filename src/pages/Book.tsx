import React, { useState } from 'react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Headphones, MessageSquare, User, ChevronRight, ChevronLeft } from "lucide-react";
const bookingFormSchema = z.object({
  // Informations personnelles
  blaze: z.string().min(2, {
    message: "Votre blaze doit contenir au moins 2 caractères."
  }),
  email: z.string().email({
    message: "Adresse email invalide."
  }),
  // Informations du projet
  service: z.string({
    required_error: "Veuillez sélectionner un type de prestation."
  }),
  duration: z.number().min(1, {
    message: "Veuillez indiquer une durée approximative."
  }),
  description: z.string().min(10, {
    message: "Veuillez ajouter une description d'au moins 10 caractères."
  }),
  // Options supplémentaires
  trackCount: z.number().optional(),
  additionalServices: z.array(z.string()).default([]),
  urgentDelivery: z.boolean().default(false),
  extraRevisions: z.boolean().default(false)
});
type BookingFormValues = z.infer<typeof bookingFormSchema>;
export default function Book() {
  const {
    id
  } = useParams();
  const [activeTab, setActiveTab] = useState("infos");

  // Valeurs par défaut du formulaire
  const defaultValues: Partial<BookingFormValues> = {
    blaze: "",
    email: "",
    duration: 60,
    description: "",
    trackCount: 1,
    additionalServices: [],
    urgentDelivery: false,
    extraRevisions: false
  };
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues
  });
  const watchService = form.watch("service");
  function onSubmit(data: BookingFormValues) {
    toast.success("Votre projet a bien été enregistré !", {
      description: `Nous vous contacterons prochainement pour discuter de votre projet de ${data.service}.`,
      duration: 5000
    });
    console.log("Données du formulaire soumises:", data);
    form.reset();
    setActiveTab("infos");
  }
  const handleNextStep = () => {
    const infoFields = ["blaze", "email", "service"];
    const isValid = infoFields.every(field => {
      const fieldState = form.getFieldState(field as any);
      return !fieldState.invalid;
    });
    if (isValid) {
      setActiveTab("details");
    } else {
      form.trigger(["blaze", "email", "service"]);
    }
  };
  return <ParallaxBackground>
      <PageSplashes pageVariant="book" />
      
      <div className="relative z-10 min-h-screen">
        <div className="min-h-screen pt-24 xs:pt-28 md:pt-36 px-2 xs:px-6 flex flex-col items-center font-grunge section-content my-0 py-[168px]">
          <div className="relative">
            <NeonText text="Réservation" className="text-3xl xs:text-4xl md:text-6xl mb-5 xs:mb-8 uppercase text-center" color="yellow" flicker={true} />
            <ElectricParticles targetSelector=".neon-text" color="#ffdd00" quantity={12} />
          </div>
          
          <div className="w-full max-w-4xl bg-black/80 grunge-border paper-texture p-6 xs:p-8 md:p-10 mx-auto text-white rounded-xl shadow-2xl mb-10 py-[51px]">
            <p className="text-lg text-center mb-8">
              Réservez votre session studio ou votre prestation musicale.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-8 bg-black/50 border border-yellow-400/30">
                <TabsTrigger value="infos" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                  Informations
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                  Détails du projet
                </TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="infos" className="mt-0">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-0 mx-0">
                        <FormField control={form.control} name="blaze" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-yellow-400 flex items-center gap-2">
                                <User className="h-4 w-4" /> Votre blaze
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Nom d'artiste ou pseudo" {...field} className="bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={form.control} name="email" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-yellow-400 py-0 my-0">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@exemple.com" type="email" {...field} className="bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <FormField control={form.control} name="service" render={({
                      field
                    }) => <FormItem>
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
                          </FormItem>} />
                      
                      <div className="pt-4">
                        <Button type="button" onClick={handleNextStep} className="w-full relative overflow-hidden group hover:text-black font-black tracking-wider py-6 text-lg flex items-center justify-center gap-2">
                          <span className="absolute inset-0 bg-[#D2FF3F] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0"></span>
                          <span className="relative z-10">Étape suivante</span> <ChevronRight className="h-5 w-5 relative z-10" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-0">
                    <div className="space-y-6">
                      {watchService === "recording" && <FormField control={form.control} name="trackCount" render={({
                      field
                    }) => <FormItem>
                              <FormLabel className="text-yellow-400">Nombre de morceaux à enregistrer</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} className="bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />}
                      
                      <FormField control={form.control} name="duration" render={({
                      field: {
                        value,
                        onChange,
                        ...fieldProps
                      }
                    }) => <FormItem>
                            <FormLabel className="text-yellow-400 flex items-center gap-2">
                              <Clock className="h-4 w-4" /> Durée estimée (minutes)
                            </FormLabel>
                            <div className="space-y-2">
                              <div className="flex items-center gap-4">
                                <FormControl>
                                  <Slider min={30} max={240} step={15} value={[value || 60]} onValueChange={vals => onChange(vals[0])} className="py-4" {...fieldProps} />
                                </FormControl>
                                <span className="w-16 text-center font-mono bg-black/30 py-1 px-2 rounded border border-yellow-400/30">
                                  {value || 60}m
                                </span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="additionalServices" render={() => <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-yellow-400">Services supplémentaires</FormLabel>
                              <FormDescription className="text-gray-400 text-sm">
                                Sélectionnez les services additionnels dont vous avez besoin
                              </FormDescription>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {watchService !== "mixage" && <FormField control={form.control} name="additionalServices" render={({
                          field
                        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox checked={field.value?.includes('mixage')} onCheckedChange={checked => {
                              return checked ? field.onChange([...field.value, 'mixage']) : field.onChange(field.value?.filter(value => value !== 'mixage'));
                            }} className="border-yellow-400/70 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black" />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Mixage inclus
                                      </FormLabel>
                                    </FormItem>} />}
                              
                              {watchService !== "mastering" && <FormField control={form.control} name="additionalServices" render={({
                          field
                        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox checked={field.value?.includes('mastering')} onCheckedChange={checked => {
                              return checked ? field.onChange([...field.value, 'mastering']) : field.onChange(field.value?.filter(value => value !== 'mastering'));
                            }} className="border-yellow-400/70 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black" />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Mastering inclus
                                      </FormLabel>
                                    </FormItem>} />}
                              
                              <FormField control={form.control} name="urgentDelivery" render={({
                          field
                        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-yellow-400/70 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      Livraison urgente (48h)
                                    </FormLabel>
                                  </FormItem>} />
                              
                              <FormField control={form.control} name="extraRevisions" render={({
                          field
                        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-yellow-400/70 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      Révisions supplémentaires (+2)
                                    </FormLabel>
                                  </FormItem>} />
                            </div>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="description" render={({
                      field
                    }) => <FormItem>
                            <FormLabel className="text-yellow-400 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" /> Description du projet
                            </FormLabel>
                            <FormControl>
                              <Textarea placeholder="Décrivez votre projet musical, vos influences, vos besoins spécifiques..." className="resize-none min-h-[120px] bg-transparent border-yellow-400/50 focus:border-yellow-400 text-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <div className="flex flex-col xs:flex-row gap-4 pt-4">
                        <Button type="button" onClick={() => setActiveTab("infos")} className="relative overflow-hidden group hover:text-yellow-400 border border-yellow-400/70 font-bold py-4 xs:flex-1">
                          <span className="absolute inset-0 bg-transparent group-hover:bg-yellow-400/10 transition-colors duration-300 z-0"></span>
                          <span className="relative z-10"><ChevronLeft className="h-5 w-5 inline mr-2" /> Retour</span>
                        </Button>
                        
                        <Button type="submit" className="relative overflow-hidden group hover:text-black font-black tracking-wider py-4 xs:flex-1">
                          <span className="absolute inset-0 bg-[#D2FF3F] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0"></span>
                          <span className="relative z-10">Réserver maintenant</span>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </ParallaxBackground>;
}