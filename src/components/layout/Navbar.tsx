"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
/* eslint-disable @next/next/no-img-element */

const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Coberturas", href: "#servicios" },
    { name: "Compañías", href: "#socios" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "FAQ", href: "#faq" },
    { name: "Contacto", href: "#contacto" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const lastScrollTime = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastScrollTime.current < 100) return;
            lastScrollTime.current = now;
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed z-50 transition-all duration-500 ease-out",
                isScrolled
                    ? "top-6 left-1/2 -translate-x-1/2 w-[98%] md:w-[90%] lg:w-[85%] xl:w-[75%] rounded-full bg-brand-navy/90 backdrop-blur-md py-3 px-8 border border-white/10 shadow-2xl"
                    : "top-0 left-0 right-0 w-full bg-transparent py-8 px-6"
            )}
        >
            <div className={cn(
                "mx-auto flex justify-between items-center transition-all",
                isScrolled ? "w-full" : "container"
            )}>
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className={cn(
                        "relative transition-all flex items-center justify-center",
                        "rounded-full bg-white/10 overflow-hidden",
                        isScrolled ? "w-8 h-8" : "w-14 h-14"
                    )}>
                        <Image
                            src="/logoCoscia.png"
                            alt="Coscia Asesores Logo"
                            fill
                            sizes="56px"
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className={cn(
                        "font-black tracking-tighter text-white uppercase flex flex-col leading-none transition-all",
                        isScrolled ? "text-base" : "text-2xl"
                    )}>
                        Coscia Asesores <span className="text-brand-cyan text-[8px] tracking-widest font-medium mt-0.5">Productores de Seguros</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className={cn("hidden lg:flex items-center", isScrolled ? "gap-4" : "gap-8")}>
                    <div className={cn("flex items-center", isScrolled ? "gap-4 xl:gap-6" : "gap-6")}>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-xs font-bold text-brand-silver hover:text-brand-cyan transition-colors uppercase tracking-widest relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-cyan transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>
                    <a
                        href="/siniestros"
                        className={cn(
                            "rounded-full font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center",
                            isScrolled
                                ? "bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-xs shadow-red-600/20"
                                : "bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-xs shadow-red-600/30"
                        )}
                    >
                        Siniestro
                    </a>
                    <a
                        href="#contacto"
                        className={cn(
                            "rounded-full font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-blue/20 flex items-center justify-center relative overflow-hidden group",
                            isScrolled
                                ? "bg-brand-blue text-white px-6 py-2 text-xs"
                                : "bg-brand-blue text-white px-8 py-3 text-sm hover:bg-white hover:text-brand-blue"
                        )}
                    >
                        <span className="relative z-10">{isScrolled ? "Cotizar Gratis" : "Cotización Gratis"}</span>
                        {/* Shimmer Effect - ONLY ON DESKTOP */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent hidden md:block btn-shimmer" />
                    </a>
                </div>

                {/* Mobile Actions */}
                <div className="flex lg:hidden items-center gap-3">
                    <a
                        href="/siniestros"
                        className="bg-red-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-transform"
                    >
                        Siniestro
                    </a>
                    <button
                        className="text-white w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="lg:hidden absolute top-[calc(100%+16px)] left-0 right-0 bg-brand-navy/95 backdrop-blur-3xl p-6 border border-white/10 rounded-3xl shadow-2xl mx-auto w-full max-w-sm max-h-[85vh] overflow-y-auto"
                    >
                        <div className="flex flex-col gap-6 text-center">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-white hover:text-brand-cyan transition-colors tracking-tighter"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="/siniestros"
                                onClick={() => setMobileMenuOpen(false)}
                                className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest mt-4 shadow-xl block transition-colors"
                            >
                                Reportar Siniestro
                            </a>
                            <a
                                href="#contacto"
                                onClick={() => setMobileMenuOpen(false)}
                                className="bg-brand-blue text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl block"
                            >
                                Cotización Gratis
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
