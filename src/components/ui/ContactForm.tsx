"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

export function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedService, setSelectedService] = useState("");

    // Form values
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    // Form errors
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        phone: false,
        service: false,
        message: false
    });

    // Listen for custom service selection events
    useEffect(() => {
        const handleServiceSelect = (e: CustomEvent) => {
            if (e.detail) {
                setSelectedService(e.detail);
                setErrors(prev => ({ ...prev, service: false }));
            }
        };

        window.addEventListener('selectService', handleServiceSelect as EventListener);
        return () => window.removeEventListener('selectService', handleServiceSelect as EventListener);
    }, []);

    const validateForm = () => {
        const newErrors = {
            name: formData.name.trim() === "",
            email: formData.email.trim() === "" || !isValidEmail(formData.email),
            phone: formData.phone.trim() === "",
            service: selectedService === "",
            message: formData.message.trim() === ""
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch('/api/send-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    service: selectedService
                })
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", message: "" });
                setSelectedService("");
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                const data = await response.json().catch(() => ({}));
                setErrorMsg(data?.error || "Ocurrió un error al enviar el mensaje. Por favor reintente.");
                setStatus("error");
                setTimeout(() => setStatus("idle"), 5000);
            }
        } catch {
            setErrorMsg("Ocurrió un error al enviar el mensaje. Por favor reintente.");
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: false }));
    };

    if (status === "success") {
        const successVariants = {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 }
        };

        return (
            <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/5 p-8 md:p-12 rounded-3xl shadow-sm border border-emerald-500/30 flex flex-col items-center justify-center text-center h-full min-h-100 backdrop-blur-md"
            >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">¡Mensaje Enviado!</h3>
                <p className="text-brand-silver max-w-sm">
                    Gracias por contactarnos. Un asesor se comunicará con vos a la brevedad.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 text-brand-cyan font-bold hover:underline"
                >
                    Enviar otro mensaje
                </button>
            </motion.div>
        );
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="flex flex-col h-full"
        >
            <AnimatePresence>
                {status === "loading" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl"
                    >
                        <Loader2 className="w-12 h-12 text-brand-cyan animate-spin mb-4" />
                        <p className="font-bold text-white">Enviando mensaje...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-brand-silver pl-1">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Tu nombre"
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-1 outline-none transition-all placeholder:text-brand-slate/50 text-white ${errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan'
                            }`}
                    />
                    {errors.name && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Este campo es obligatorio
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-brand-silver pl-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@email.com"
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-1 outline-none transition-all placeholder:text-brand-slate/50 text-white ${errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan'
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {formData.email.trim() === '' ? 'Este campo es obligatorio' : 'Ingresá un email válido'}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-brand-silver pl-1">
                        Teléfono / WhatsApp
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Ej: 11 1234 5678"
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-1 outline-none transition-all placeholder:text-brand-slate/50 text-white ${errors.phone
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan'
                            }`}
                    />
                    {errors.phone && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Este campo es obligatorio
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="service" className="block text-xs font-bold uppercase tracking-widest text-brand-silver pl-1">
                        Servicio de Interés
                    </label>
                    <div className="relative">
                        <select
                            id="service"
                            name="service"
                            value={selectedService}
                            onChange={(e) => {
                                setSelectedService(e.target.value);
                                setErrors(prev => ({ ...prev, service: false }));
                            }}
                            className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-1 outline-none transition-all appearance-none cursor-pointer text-white [&>option]:bg-brand-navy ${errors.service
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan'
                                }`}
                        >
                            <option value="">Seleccionar opción</option>
                            <option value="accidentes">Accidentes Personales</option>
                            <option value="art">ART</option>
                            <option value="automotor">Automotor</option>
                            <option value="cauciones">Cauciones</option>
                            <option value="comercios">Comercio</option>
                            <option value="embarcaciones">Embarcaciones de Placer</option>
                            <option value="hogar">Hogar</option>
                            <option value="motovehiculo">Motovehículo</option>
                            <option value="otro">Otro</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate pointer-events-none" />
                    </div>
                    {errors.service && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Seleccioná un servicio
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-10">
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-brand-silver pl-1">
                    Mensaje
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="¿En qué podemos ayudarte?"
                    className={`w-full px-4 py-4 bg-white/5 border rounded-xl focus:ring-1 outline-none transition-all resize-none placeholder:text-brand-slate/30 text-white ${errors.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan'
                        }`}
                ></textarea>
                {errors.message && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Este campo es obligatorio
                    </p>
                )}
            </div>

            {status === "error" && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-200 border border-red-500/20 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{errorMsg}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-brand-blue hover:bg-brand-cyan text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shadow-lg shadow-brand-blue/20"
            >
                {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                        Enviando...
                    </span>
                ) : (
                    <>
                        Enviar Consulta
                        <Send className="w-5 h-5" />
                    </>
                )}
            </button>
        </motion.form>
    );
}
