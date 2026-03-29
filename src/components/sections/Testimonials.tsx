"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
    const testimonials = [
        {
            name: "Daniel Szulanski",
            role: "Cliente Particular",
            content: "Hace años que les confío los autos de la familia. Siempre me consiguen las mejores cláusulas de ajuste para no quedar desactualizado con la inflación. Súper recomendables.",
            stars: 5
        },
        {
            name: "Marta Villalba",
            role: "Seguro de Hogar",
            content: "Tuve un problema con un caño en casa y me cubrieron todo rapidísimo. Lo que más valoro es que les escribís por WhatsApp y te contestan ellos, no un bot.",
            stars: 5
        },
        {
            name: "Gabriel Percivall",
            role: "Empresario",
            content: "Excelente atención de Gustavo y Nahuel. Me asesoraron con la ART de mis empleados y me bajaron los costos un montón comparado a lo que venía pagando directamente.",
            stars: 5
        },
        {
            name: "Romina G.",
            role: "Seguro de Moto",
            content: "Aseguré mi moto con ellos. Tuve un desperfecto mecánico en la ruta y me gestionaron la grúa al toque. Vivir tranquila no tiene precio.",
            stars: 5
        },
        {
            name: "Juan Ignacio Rossi",
            role: "Cliente Integral",
            content: "Los recomiendo por la transparencia. Me explicaron letra chica que en otros lados te ocultan. Se nota que saben lo que hacen y cuidan tu bolsillo.",
            stars: 5
        },
        {
            name: "Laura V.",
            role: "Asesoría Integral",
            content: "Súper conformes con el asesoramiento. Nos dieron una charla muy clara a mi y a mi marido, sin vueltas. Muy profesionales y humanos.",
            stars: 5
        },
        {
            name: "Federico Lopez",
            role: "Cliente Particular",
            content: "Tuve un choque donde yo no tuve la culpa y me ayudaron con todo el reclamo de terceros a la otra compañía. Sin su ayuda todavía estaría esperando.",
            stars: 5
        },
        {
            name: "Silvia N.",
            role: "Cliente de años",
            content: "Excelentes personas. Te asesoran con honestidad. Si algo no te conviene, te lo dicen. Eso es difícil de encontrar hoy en día en un productor.",
            stars: 5
        },
        {
            name: "Estanislao Cortese",
            role: "Comerciante",
            content: "Cambié el seguro del negocio con ellos. Me cubrieron cosas que ni sabía que se podían asegurar y a mejor precio. Muy buena predisposición siempre.",
            stars: 5
        },
        {
            name: "Claudia M.",
            role: "Cliente Particular",
            content: "Gestión impecable. Me mandan los cupones de pago y la póliza digital siempre a tiempo por mail y WhatsApp. Cero problemas en 5 años.",
            stars: 5
        }
    ];

    // Double the array for seamless loop
    const doubledTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-24 bg-white relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none hidden md:block">
                <div className="absolute top-0 left-1/4 w-150 h-150 bg-brand-blue/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-brand-cyan/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 mb-16">
                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-navy mb-6">
                        Confianza <span className="text-brand-blue">Confirmada</span>
                    </h2>
                    <p className="text-brand-slate text-lg max-w-2xl mx-auto">
                        No lo decimos nosotros, lo dicen quienes ya protegen su futuro con nosotros.
                    </p>
                </div>
            </div>

            {/* Scrolling Track */}
            <div className="flex overflow-hidden relative group">
                {/* Fade overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-8 hover:[animation-play-state:paused] py-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 60, // Ligeramente más rápido para que se note el movimiento pero siga siendo suave
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {doubledTestimonials.map((t, i) => (
                        <div
                            key={i}
                            className="w-80 md:w-112.5 shrink-0 p-8 rounded-3xl border border-slate-100 bg-slate-50 transition-all duration-300 hover:bg-white hover:shadow-xl relative flex flex-col"
                        >
                            <Quote className="w-10 h-10 text-brand-blue/10 absolute top-6 right-6" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(t.stars)].map((_, si) => (
                                    <Star key={si} className="w-5 h-5 fill-brand-blue text-brand-blue" />
                                ))}
                            </div>

                            <p className="text-brand-slate mb-8 leading-relaxed italic font-normal text-lg">
                                "{t.content}"
                            </p>

                            <div className="mt-auto">
                                <div className="font-bold text-brand-navy text-xl">{t.name}</div>
                                <div className="text-brand-blue text-sm font-medium uppercase tracking-wider">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section >
    );
}
