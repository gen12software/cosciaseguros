"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Companies() {
    const [companies, setCompanies] = useState<{ name: string; logo: string }[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Fetch dynamic logos from API
        const fetchLogos = async () => {
            try {
                const response = await fetch('/api/companies');
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedCompanies = [...data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setCompanies(sortedCompanies);
                }
            } catch (error) {
                console.error("Error fetching logos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogos();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const animateProps = (delay = 0) => isMobile ? {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: 0 }
    } : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay }
    };

    if (isLoading) return null;

    return (
        <section id="socios" className="py-24 bg-white relative overflow-hidden font-sans">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        {...animateProps(0)}
                        className="text-4xl md:text-6xl font-display font-bold text-brand-navy mb-8"
                    >
                        Trabajamos con las Mejores Aseguradoras
                    </motion.h2>
                    <motion.div
                        {...animateProps(0.1)}
                        className="text-brand-slate text-lg md:text-2xl max-w-4xl mx-auto"
                    >
                        <p className="leading-relaxed">
                            No trabajamos para una aseguradora. <span className="text-brand-blue font-bold">Trabajamos para vos.</span>
                        </p>
                        <p className="mt-4 text-brand-slate/80">
                            Contamos con mas de 10 compañías de primer nivel para que tengas cubierto tu riesgo al mejor precio y cobertura posible.
                        </p>
                    </motion.div>
                </div>

                {/* Optimized Logo Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
                    {companies.map((company, index) => {
                        const lowName = company.name.toLowerCase();
                        let paddingClass = "p-1 md:p-2"; // Default "large" padding

                        if (lowName.includes("segunda")) {
                            return (
                                <motion.div
                                    key={company.logo}
                                    {...animateProps(index * 0.05)}
                                    className="bg-white border border-slate-100 rounded-2xl p-2 md:p-4 transition-all duration-300 hover:shadow-xl flex items-center justify-center aspect-video relative overflow-hidden shadow-sm group"
                                >
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <Image
                                            src={company.logo}
                                            alt={`${company.name} logo`}
                                            fill
                                            sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            style={{ transform: isMobile ? 'scale(1.5)' : 'scale(1.8)' }}
                                            className="object-contain transition-all duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </motion.div>
                            );
                        }

                        if (lowName.includes("prov art")) {
                            paddingClass = "p-0 scale-140 md:scale-180"; // Prov ART stays massive
                        } else if (
                            lowName.includes("allianz") ||
                            lowName.includes("prevencion") ||
                            lowName.includes("metropol") ||
                            lowName.includes("meridional") ||
                            lowName.includes("federacion") ||
                            lowName.includes("provincia")
                        ) {
                            paddingClass = "p-0 scale-110 md:scale-120"; // Standard large size
                        } else if (lowName.includes("mercantil")) {
                            paddingClass = "p-0 scale-105 md:scale-112"; // Slightly smaller than the group above
                        } else if (lowName.includes("experta")) {
                            paddingClass = "p-6 md:p-10"; // Experta small
                        } else if (lowName.includes("sancor") || lowName.includes("noble")) {
                            paddingClass = "p-2 md:p-3";
                        } else if (lowName.includes("fed") || lowName.includes("galicia")) {
                            paddingClass = "p-1 md:p-2";
                        }

                        return (
                            <motion.div
                                key={company.logo}
                                {...animateProps(index * 0.05)}
                                className="bg-white border border-slate-100 rounded-2xl p-2 md:p-4 transition-all duration-300 hover:shadow-xl flex items-center justify-center aspect-video relative overflow-hidden shadow-sm group"
                            >
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        fill
                                        sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        className={`object-contain ${paddingClass} transition-all duration-500 group-hover:scale-110`}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
