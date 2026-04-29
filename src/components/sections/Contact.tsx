"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook } from "lucide-react";
import { ContactForm } from "../ui/ContactForm";
import { motion } from "framer-motion";

export function Contact() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    return (
        <section id="contacto" className="pt-32 pb-8 bg-brand-navy relative dark-section font-sans">
            {/* Background Mesh - HIDDEN ON MOBILE FOR PERFORMANCE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
                <div className="absolute top-0 right-0 w-150 h-150 bg-brand-cyan/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-24 lg:gap-32 items-start">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-2/5"
                    >
                        <div className="inline-flex items-center gap-2 text-brand-cyan font-bold uppercase tracking-widest text-xs mb-8">
                            <span className="w-8 h-px bg-brand-cyan" />
                            Contacto Directo
                        </div>

                        <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 tracking-tight leading-snug text-white pb-1">
                            Hablemos de tu <br />
                            <span className="text-brand-blue">Tranquilidad.</span>
                        </h2>

                        <p className="text-brand-silver/80 text-xl mb-12 max-w-sm leading-relaxed font-light">
                            Sin compromisos. Analizamos tu situación actual y te proponemos la mejor estrategia.
                        </p>

                        <div className="space-y-12 border-l-2 border-white/10 pl-8">
                            <div className="group">
                                <div className="text-xs font-bold uppercase tracking-widest text-brand-slate mb-4">WhatsApp Directo</div>
                                <a href="https://wa.me/5491158276780" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-blue/20 to-brand-cyan/20 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                                        <MessageCircle className="w-6 h-6 text-brand-cyan" />
                                    </div>
                                    <div className="text-2xl font-bold text-white hover:text-brand-blue transition-colors">11 5827 6780</div>
                                </a>
                            </div>

                            <div className="group">
                                <div className="text-xs font-bold uppercase tracking-widest text-brand-slate mb-4">Correo Electrónico</div>
                                <a href="mailto:cosciaasesores@gmail.com" className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-blue/20 to-brand-cyan/20 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                                        <Mail className="w-6 h-6 text-brand-cyan" />
                                    </div>
                                    <div className="text-sm sm:text-xl font-bold text-white hover:text-brand-blue transition-colors break-all">
                                        cosciaasesores@gmail.com
                                    </div>
                                </a>
                            </div>

                            <div className="group">
                                <div className="text-xs font-bold uppercase tracking-widest text-brand-slate mb-4">Oficina Central</div>
                                <a href="https://maps.app.goo.gl/fVJbztVW5aQeNkX49" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-blue/20 to-brand-cyan/20 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                                        <MapPin className="w-6 h-6 text-brand-cyan" />
                                    </div>
                                    <div className="text-xl font-bold text-white hover:text-brand-blue transition-colors leading-tight">
                                        Año 1852 Nº 8 - El Palomar<br />
                                        <span className="font-normal text-brand-slate text-base">Buenos Aires, Argentina</span>
                                    </div>
                                </a>
                                {/* Modern Google Maps Embed */}
                                <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative h-48 w-full group/map">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d-58.5875769!3d-34.608143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb84533b579c9%3A0x29187b2f684bcd68!2sCoscia%20Asesores%20-%20Productores%20de%20Seguro!5e0!3m2!1ses-419!2sar!4v1714400000000!5m2!1ses-419!2sar"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, filter: 'grayscale(0.6) invert(0.9) contrast(1.2)' }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="opacity-80 group-hover/map:opacity-100 transition-opacity duration-500"
                                    ></iframe>
                                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl"></div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <div className="text-xs font-bold uppercase tracking-widest text-brand-slate mb-6">Síguenos en Redes</div>
                                <div className="flex gap-4">
                                    <a
                                        href="https://www.instagram.com/cosciaasesores?igsh=MXFiaDAzbnJ2cHJzdQ%3D%3D&utm_source=qr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:border-transparent transition-all group"
                                    >
                                        <Instagram className="w-5 h-5 text-white" />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/share/1KHLXD2vWP/?mibextid=wwXIfr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:border-transparent transition-all group"
                                    >
                                        <Facebook className="w-5 h-5 text-white" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-3/5 w-full bg-white/5 backdrop-blur-md p-12 lg:p-16 rounded-3xl border border-white/10"
                    >
                        {/* WhatsApp Quick Quote Option */}
                        <div className="mb-10 pb-10 border-b border-white/10">
                            <h3 className="text-white font-bold text-lg mb-3">¿Preferís cotizar por WhatsApp?</h3>
                            <p className="text-brand-silver/70 text-sm mb-6">Respuesta inmediata de un asesor</p>
                            <a
                                href="https://wa.me/5491158276780?text=Hola!%20Quisiera%20cotizar%20un%20seguro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Cotizar por WhatsApp
                            </a>
                        </div>

                        <h3 className="text-white font-bold text-lg mb-6">O completá el formulario</h3>
                        <ContactForm />
                    </motion.div>

                </div>
            </div>

            {/* WhatsApp Floating Button Premium */}
            <motion.a
                href="https://wa.me/5491158276780"
                target="_blank"
                rel="noopener noreferrer"
                animate={isDesktop ? {
                    boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.4)",
                        "0 0 0 20px rgba(59, 130, 246, 0)",
                    ],
                    scale: [1, 1.05, 1],
                } : {}}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-10 right-10 w-20 h-20 bg-linear-to-br from-brand-blue to-brand-cyan text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(59,130,246,0.5)] z-50 group border border-white/20 overflow-hidden"
            >
                {/* Shimmer Effect - ONLY ON DESKTOP */}
                {isDesktop && (
                    <motion.div
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        initial={{ x: "-150%" }}
                        animate={{ x: "150%" }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut",
                        }}
                    />
                )}

                <MessageCircle className="w-9 h-9 relative z-10" />
                <span className="absolute right-[calc(100%+20px)] glass bg-brand-navy/90 text-white px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap -translate-x-4 group-hover:translate-x-0 border border-white/10">
                    Chatear ahora
                </span>
            </motion.a>
        </section>
    );
}
