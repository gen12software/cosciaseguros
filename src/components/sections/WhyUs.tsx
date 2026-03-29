"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Zap, Users, ShieldCheck } from "lucide-react";
import { ReasonItem } from "../ui/ReasonItem";

export function WhyUs() {
    const reasons = [
        {
            icon: Award,
            title: "Asesoramiento Certificado",
            desc: "Décadas de trayectoria asesorando a familias y empresas con los más altos estándares éticos.",
        },
        {
            icon: Zap,
            title: "Respuesta Inmediata",
            desc: "Gestión ágil pro-cliente. Ante un siniestro, somos tu mayor aliado, no sos un número más.",
        },
        {
            icon: Users,
            title: "Atención Exclusiva",
            desc: "Personalizamos cada póliza buscando el equilibrio perfecto entre máxima cobertura y costo.",
        },
        {
            icon: ShieldCheck,
            title: "Solvencia Garantizada",
            desc: "Operamos con las compañías líderes del país, brindándote la solidez de los mejores del mercado.",
        },
    ];

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const animateX = isMobile ? { initial: { opacity: 1, x: 0 }, whileInView: { opacity: 1, x: 0 } } : { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 } };
    const animateY = (delay = 0) => isMobile ? {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 },
        transition: { delay: 0 }
    } : {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        transition: { delay }
    };

    return (
        <section id="nosotros" className="py-32 bg-white relative">
            {/* Ambient Background Glow - UPDATED FOR LIGHT THEME */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-brand-blue/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-start">

                    {/* Header - STATIC ON MOBILE, STICKY ON DESKTOP */}
                    <div className="lg:w-1/3 relative">
                        <motion.div
                            {...animateX}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase tracking-widest text-xs mb-6"
                        >
                            <span className="w-8 h-px bg-brand-blue" />
                            Por qué elegirnos
                        </motion.div>

                        <motion.h2
                            {...animateY(0.1)}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-display font-bold text-brand-navy mb-8 leading-snug pb-1"
                        >
                            Respaldo <br /><span className="text-brand-blue">Absoluto.</span>
                        </motion.h2>

                        <motion.p
                            {...animateY(0.2)}
                            viewport={{ once: true }}
                            className="text-xl text-brand-slate leading-relaxed font-normal"
                        >
                            En un mercado complejo, la claridad es nuestro mayor activo. Analizamos cada riesgo para ofrecerte soluciones que realmente funcionan cuando las necesitás.
                        </motion.p>
                    </div>

                    {/* Grid */}
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reasons.map((reason, index) => (
                            <motion.div
                                key={index}
                                {...animateY(index * 0.1 + 0.3)}
                                viewport={{ once: true }}
                                className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-300 hover:shadow-xl hover:bg-white"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <reason.icon className="w-7 h-7 text-brand-blue" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-navy mb-4">{reason.title}</h3>
                                <p className="text-brand-slate leading-relaxed">
                                    {reason.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
