"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";

import Image from "next/image";

export function Hero() {
    return (
        <section id="inicio" className="relative min-h-[95vh] lg:min-h-screen flex items-center bg-brand-navy pt-32 pb-20 lg:py-20 overflow-hidden font-sans dark-section">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block">
                <div className="absolute top-0 right-0 w-200 h-200 bg-brand-cyan/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="absolute bottom-0 left-0 w-150 h-150 bg-brand-blue/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-30" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                    {/* Left Side: Content */}
                    <div className="w-full lg:w-1/2 text-left space-y-8 lg:pr-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-none tracking-tight"
                        >
                            Tu Futuro <br />
                            <span className="text-brand-cyan">
                                Asegurado.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-xl md:text-2xl text-brand-silver/80 leading-relaxed max-w-xl font-normal"
                        >
                            Contamos con el respaldo que tanto vos como tu familia y empresa necesitan para vivir con total libertad!
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <a href="#contacto" className="px-10 py-5 bg-brand-blue text-white rounded-full font-bold text-xl transition-all hover:bg-white hover:text-brand-blue hover:scale-105 shadow-2xl shadow-brand-blue/20 flex items-center justify-center gap-2 relative overflow-hidden group">
                                <span className="relative z-10">COTIZAR GRATIS</span>
                                {/* Shimmer Effect - ONLY ON DESKTOP */}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent hidden md:block btn-shimmer" />
                            </a>
                            <a href="#servicios" className="px-10 py-5 bg-transparent hover:bg-white/5 border border-white/20 text-white rounded-full font-bold text-xl transition-all hover:scale-105 backdrop-blur-sm flex items-center justify-center">
                                COBERTURAS
                            </a>
                        </motion.div>
                    </div>

                    {/* Right Side: Large Rounded Card Image - HIDDEN ON MOBILE */}
                    <div className="hidden lg:flex lg:w-1/2 relative lg:h-125 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="relative w-full h-100 md:h-125 lg:h-full z-10 lg:-ml-24"
                        >
                            <div className="w-full h-full relative hero-rounded border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                                <Image
                                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300"
                                    alt="Familia feliz asegurada con Coscia Asesores"
                                    fill
                                    sizes="50vw"
                                    className="object-cover hero-rounded"
                                    priority
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-brand-navy/60 via-transparent to-transparent" />
                            </div>
                        </motion.div>


                        {/* Background Glow */}
                        <div className="absolute inset-x-8 -bottom-12 h-24 bg-brand-cyan/20 blur-[80px] -z-10 rounded-full hidden lg:block" />
                    </div>

                </div>
            </div>
        </section >
    );
}
