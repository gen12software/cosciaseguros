"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export function FAQ() {
    const questions = [
        {
            q: "¿Cómo cotizo mi seguro?",
            a: "Es muy simple. Podés comunicarte con nosotros haciendo clic en el botón de WhatsApp o completando el formulario de contacto. Te responderemos a la brevedad con una cotización acorde a tus necesidades."
        },
        {
            q: "¿Qué necesito para contratar el seguro?",
            a: (
                <div className="space-y-3">
                    <p>Depende del tipo de seguro:</p>
                    <div className="space-y-1">
                        <p className="font-bold text-brand-navy/80">• Automotores y Motovehículos:</p>
                        <p className="pl-4">Vamos a necesitar foto del frente de la cédula verde y el año del vehículo o el título. Además, DNI (frente y dorso) del titular de la póliza, una dirección de correo electrónico y la forma de pago elegida.</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-brand-navy/80">• Otros riesgos (hogar, comercio, etc.):</p>
                        <p className="pl-4">En estos casos, con indicarnos la dirección del riesgo y qué tipo de cobertura necesitás suele ser suficiente.</p>
                    </div>
                    <p className="pt-2">En todos los casos, analizamos tu situación y gestionamos un plan a tu medida.</p>
                </div>
            )
        },
        {
            q: "¿Cuándo comienza la cobertura?",
            a: "La cobertura comienza a las 12:00 horas del día de inicio de vigencia y finaliza a las 12:00 horas del último día indicado en la póliza."
        },
        {
            q: "¿Cuál es la vigencia del seguro?",
            a: (
                <div className="space-y-2">
                    <p>El contrato de seguro tiene una vigencia anual, salvo que por la naturaleza del riesgo se establezca un plazo distinto.</p>
                    <p>Lo que puede variar es la forma de facturación de la póliza, que puede ser mensual, trimestral, cuatrimestral, semestral o anual, según cada caso.</p>
                </div>
            )
        },
        {
            q: "¿Cuáles son las formas de pago?",
            a: (
                <div className="space-y-2">
                    <p>Aceptamos las siguientes formas de pago:</p>
                    <ul className="list-none space-y-1">
                        <li>• Efectivo (Rapipago o PagoFácil)</li>
                        <li>• Débito automático mediante CBU</li>
                        <li>• Tarjetas de crédito</li>
                        <li>• Home Banking</li>
                        <li>• Plataformas digitales (por ejemplo, Mercado Pago)</li>
                    </ul>
                </div>
            )
        },
        {
            q: "¿Qué hago si tengo un accidente o siniestro?",
            a: "Comunicate con nosotros a través del botón de siniestros, donde podrás cargar toda la información necesaria, o directamente por WhatsApp. Si falta alguna documentación, nos pondremos en contacto con vos. Además, en la sección de siniestros vas a encontrar preguntas frecuentes con toda la información necesaria para una gestión ágil."
        },
        {
            q: "¿En qué me beneficia contratar mi seguro mediante un productor asesor de seguros?",
            a: "No solo contratás una póliza, sino que accedés a asesoramiento profesional y acompañamiento permanente. Estamos capacitados para entender tus necesidades y ayudarte en cada etapa, para que la gestión de tu seguro sea clara, simple y eficiente. Analizamos cada situación y adaptamos la cobertura para que obtengas la mejor relación entre cobertura y costo."
        },
        {
            q: "¿Cuentan con atención presencial?",
            a: "Sí. Nos encontramos ubicados en Calle Año 1852 N.º 8, El Palomar."
        },
        {
            q: "¿Cuáles son los horarios de atención?",
            a: "Atendemos de lunes a viernes de 09:00 a 17:00 hs, de manera presencial con cita previa. Fuera de ese horario, podés seguir en contacto con nosotros de forma online para urgencias. Siempre que estemos disponibles, vamos a responderte."
        },
        {
            q: "¿Cuándo puedo solicitar la baja de mi seguro?",
            a: "La rescisión del contrato puede solicitarse en cualquier momento, sin necesidad de expresar causa. En caso de corresponder, se deberá abonar la prima proporcional al tiempo de cobertura ya transcurrido."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-slate-50 relative font-sans">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-100 h-100 bg-brand-blue/5 rounded-full blur-[100px] hidden md:block" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-navy mb-6">
                        Preguntas <span className="text-brand-blue">Frecuentes</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {questions.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-xs hover:shadow-md
                                ${openIndex === index
                                    ? "bg-white border-brand-blue/30"
                                    : "bg-white border-slate-100 hover:bg-slate-50"
                                }`
                            }
                        >
                            <div className="p-6 flex items-center justify-between gap-4">
                                <h3 className={`text-lg font-bold transition-colors ${openIndex === index ? "text-brand-blue" : "text-brand-navy"}`}>
                                    {item.q}
                                </h3>
                                <div className={`p-2 rounded-full transition-colors ${openIndex === index ? "bg-brand-blue text-white" : "bg-slate-100 text-brand-slate"}`}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-brand-slate leading-relaxed border-t border-slate-100 pt-4">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
