"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, AlertCircle, CheckCircle2, Loader2, Camera, FileText, ChevronDown, Plus, Minus } from "lucide-react";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import JSZip from "jszip";

interface ClaimImage {
    id: string;
    file: File;
    preview: string;
    compressed?: Blob;
    isProcessing: boolean;
}

export function ClaimsReport() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        otherCompany: "",
        claimType: "",
        date: "",
        time: "",
        location: "",
        description: ""
    });

    const [companiesList, setCompaniesList] = useState<{ name: string; logo: string }[]>([]);
    const [showOtherCompany, setShowOtherCompany] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "¿Qué datos son esenciales para la carga del siniestro?",
            a: (
                <div className="space-y-2">
                    <p>Es importante contar con la siguiente información:</p>
                    <ul className="list-none space-y-1">
                        <li>• Día y hora en que ocurrió el siniestro.</li>
                        <li>• Calle, entrecalles y localidad.</li>
                        <li>• Relato claro de lo sucedido.</li>
                        <li>• Datos del tercero involucrado: nombre completo, DNI, licencia de conducir, domicilio, teléfono, marca, modelo y patente del vehículo, y compañía de seguros.</li>
                    </ul>
                    <p className="mt-2">Para una gestión más ágil, te recomendamos sacar fotos de toda la documentación y datos solicitados, y guardar el contacto del tercero por cualquier eventualidad.</p>
                </div>
            )
        },
        {
            q: "¿Cuánto tiempo tengo para denunciar el siniestro?",
            a: "Contás con un plazo de 72 horas desde que ocurrió el hecho o desde que tomaste conocimiento del mismo para realizar la denuncia administrativa."
        },
        {
            q: "¿Qué fotos son indispensables?",
            a: (
                <div className="space-y-2">
                    <p>Necesitamos:</p>
                    <ul className="list-none space-y-1">
                        <li>• Fotos de la licencia de conducir y cédula del asegurado y del tercero.</li>
                        <li>• Fotos claras de los daños ocasionados (propios y de terceros).</li>
                        <li>• Foto de la tarjeta o comprobante del seguro del tercero.</li>
                    </ul>
                </div>
            )
        },
        {
            q: "¿Cómo sigue el trámite después de enviar este reporte?",
            a: "Una vez que el formulario esté completo y enviado, analizaremos la información recibida y nos pondremos en contacto con vos para finalizar la gestión de la denuncia. En ese contacto, te explicaremos de manera clara cuáles son los pasos a seguir y cómo continúa el proceso según cada caso."
        },
        {
            q: "Si tengo seguro contra todo riesgo, ¿qué debo hacer?",
            a: "Una vez informado el siniestro a la compañía, coordinamos la inspección del vehículo en el taller de tu confianza o en el que elijas para realizar la reparación. Luego de la inspección, la compañía enviará la orden de trabajo y los repuestos necesarios para que el taller pueda comenzar."
        },
        {
            q: "Si no fue culpa mía el siniestro, ¿debo abonar la franquicia igual?",
            a: "Sí, la franquicia debe abonarse inicialmente en todos los casos. La diferencia es que, cuando el siniestro no fue tu responsabilidad, se gestiona el reclamo correspondiente ante la compañía de seguros de la persona que ocasionó el choque."
        },
        {
            q: "¿Tiene algún costo el reclamo de la franquicia o de la reparación de mi vehículo?",
            a: "No. Nos encargamos de gestionar el reclamo de terceros ante compañías colegas sin costo alguno, buscando siempre la mejor indemnización posible."
        },
        {
            q: "¿Qué necesito para iniciar el reclamo de terceros?",
            a: (
                <div className="space-y-2">
                    <p>Es fundamental contar con:</p>
                    <ul className="list-none space-y-1">
                        <li>• Fotos de los daños (todas las necesarias para dimensionar correctamente el perjuicio).</li>
                        <li>• Un presupuesto de taller que detalle el valor de la reparación del vehículo.</li>
                    </ul>
                    <p className="mt-2">El resto de la información la gestionamos nosotros para dar inicio al trámite.</p>
                </div>
            )
        },
        {
            q: "¿Qué pasa si a causa del choque tengo lesiones?",
            a: "Es fundamental acudir a un hospital o clínica para ser evaluado. Toda lesión derivada del siniestro da lugar al cobro de una indemnización"
        },
        {
            q: "¿Cuánto tardo en cobrar mi indemnización?",
            a: "El plazo depende de la compañía que tiene contratada la persona que ocasionó el siniestro. Algunas compañías pueden resolver el reclamo en 30 a 45 días, mientras que otras pueden demorar 6 meses o más."
        }
    ];

    const [images, setImages] = useState<ClaimImage[]>([]);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [maxDate, setMaxDate] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMaxDate(new Date().toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/companies');
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedCompanies = [...data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setCompaniesList(sortedCompanies);
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        fetchCompanies();
    }, []);

    // Validar si el formulario está completo
    const isFormValid = () => {
        return (
            formData.name.trim() !== "" &&
            formData.email.trim() !== "" &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
            formData.phone.trim() !== "" &&
            (formData.company !== "" && (formData.company !== "otro" || formData.otherCompany.trim() !== "")) &&
            formData.claimType !== "" &&
            formData.date !== "" &&
            formData.time !== "" &&
            formData.location.trim() !== "" &&
            formData.description.trim() !== "" &&
            images.length >= 2 &&
            images.every(img => !img.isProcessing)
        );
    };

    const MAX_IMAGES = 10;
    const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: false }));
    };

    const compressImage = async (file: File): Promise<Blob> => {
        const options = {
            maxSizeMB: 0.3, // Reducido para asegurar que 10 fotos entren en el límite de Vercel (4.5MB)
            maxWidthOrHeight: 1280, // Reducido para mayor velocidad y menor peso
            useWebWorker: true,
            fileType: 'image/jpeg'
        };

        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Error compressing image:", error);
            return file;
        }
    };

    const handleImageSelect = async (files: FileList | null) => {
        if (!files) return;

        const remainingSlots = MAX_IMAGES - images.length;
        const selectedFiles = Array.from(files)
            .filter(file => ACCEPTED_TYPES.includes(file.type))
            .slice(0, remainingSlots);

        // 1. Agregar a la UI inmediatamente pero SIN la URL del objeto todavía
        // Esto evita que el navegador intente cargar 10 imágenes pesadas a la vez
        const placeholderImages: ClaimImage[] = selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: "", // No generamos el preview pesado todavía
            isProcessing: true
        }));

        setImages(prev => [...prev, ...placeholderImages]);

        // 2. Procesar en segundo plano para no congelar la UI
        for (const placeholder of placeholderImages) {
            try {
                // Comprimimos antes de generar cualquier preview
                const compressed = await compressImage(placeholder.file);
                // Ahora que es liviana (300KB), generamos la URL de previsualización
                const compressedPreview = URL.createObjectURL(compressed);

                setImages(prev => prev.map(img =>
                    img.id === placeholder.id
                        ? { ...img, compressed, preview: compressedPreview, isProcessing: false }
                        : img
                ));
            } catch (error) {
                console.error("Error al procesar imagen:", error);
                // Si falla, intentamos usar el original pero podría ser pesado
                const fallbackPreview = URL.createObjectURL(placeholder.file);
                setImages(prev => prev.map(img =>
                    img.id === placeholder.id
                        ? { ...img, preview: fallbackPreview, isProcessing: false }
                        : img
                ));
            }
        }
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const image = prev.find(img => img.id === id);
            if (image) {
                URL.revokeObjectURL(image.preview);
            }
            return prev.filter(img => img.id !== id);
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleImageSelect(e.dataTransfer.files);
    };

    const validateForm = () => {
        const newErrors = {
            name: formData.name.trim() === "",
            email: formData.email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
            phone: formData.phone.trim() === "",
            company: formData.company === "" || (formData.company === "otro" && formData.otherCompany.trim() === ""),
            claimType: formData.claimType === "",
            date: formData.date === "",
            time: formData.time === "",
            location: formData.location.trim() === "",
            description: formData.description.trim() === "",
            images: images.length < 2
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus("loading");

        try {
            // Crear ZIP con las imágenes
            const zip = new JSZip();
            images.forEach((img, index) => {
                const fileData = img.compressed || img.file;
                // Usar un nombre descriptivo para cada archivo dentro del zip
                const extension = img.file.name.split('.').pop() || 'jpg';
                zip.file(`foto-${index + 1}.${extension}`, fileData);
            });

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const buffer = await zipBlob.arrayBuffer();
            const base64Zip = Buffer.from(buffer).toString('base64');

            const attachments = [{
                filename: `fotos_siniestro_${formData.name.replace(/\s+/g, '_')}.zip`,
                content: base64Zip,
                type: 'application/zip'
            }];

            // Enviar al API
            const response = await fetch('/api/send-claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    images: attachments
                })
            });

            if (response.ok) {
                setStatus("success");
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    otherCompany: "",
                    claimType: "",
                    date: "",
                    time: "",
                    location: "",
                    description: ""
                });
                setShowOtherCompany(false);
                images.forEach(img => URL.revokeObjectURL(img.preview));
                setImages([]);

                setTimeout(() => setStatus("idle"), 5000);
            } else {
                const data = await response.json().catch(() => ({}));
                setErrorMsg(data?.error || "Ocurrió un error al enviar el reporte. Por favor intentá nuevamente.");
                setStatus("error");
                setTimeout(() => setStatus("idle"), 5000);
            }
        } catch {
            setErrorMsg("Ocurrió un error al enviar el reporte. Por favor intentá nuevamente.");
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    if (status === "success") {
        return (
            <section id="siniestros" className="py-24 bg-linear-to-br from-emerald-50 to-white relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="container mx-auto px-6 max-w-2xl text-center"
                >
                    <div className="bg-white rounded-3xl p-12 shadow-xl border border-emerald-200">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">¡Reporte Enviado!</h3>
                        <p className="text-gray-600 mb-6">
                            Recibimos tu reporte de siniestro. Un asesor se comunicará con vos a la brevedad para ayudarte con los próximos pasos.
                        </p>
                        <p className="text-sm text-gray-500">
                            Revisá tu email para la confirmación.
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-8 text-brand-blue font-bold hover:underline"
                        >
                            Enviar otro reporte
                        </button>
                    </div>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="siniestros" className="py-24 bg-linear-to-br from-orange-50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-200/20 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <AlertCircle className="w-4 h-4" />
                        Atención 24/7
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                        Reportar <span className="text-red-600">Siniestro</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Envianos los detalles de tu siniestro con fotos y nos comunicaremos de inmediato para ayudarte.
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 relative"
                >
                    <AnimatePresence>
                        {status === "loading" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl"
                            >
                                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                                <p className="font-bold text-gray-900">Enviando reporte...</p>
                                <p className="text-sm text-gray-500 mt-2">Comprimiendo y enviando fotos</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Datos del Asegurado */}
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-red-600" />
                            Datos del Asegurado
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 ${errors.name
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                    placeholder="Juan Pérez"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 ${errors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {formData.email.trim() === '' ? 'Este campo es obligatorio' : 'Email inválido'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 ${errors.phone
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                    placeholder="11 1234-5678"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Compañía Aseguradora *
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.company}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleInputChange('company', val);
                                            setShowOtherCompany(val === 'otro');
                                        }}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all appearance-none cursor-pointer text-gray-900 ${errors.company
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                            }`}
                                    >
                                        <option value="">Seleccioná tu compañía</option>
                                        {companiesList.map(comp => (
                                            <option key={comp.name} value={comp.name.toLowerCase()}>
                                                {comp.name.toUpperCase()}
                                            </option>
                                        ))}
                                        <option value="otro">OTRA (No está en la lista)</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.company && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Seleccioná tu compañía aseguradora
                                    </p>
                                )}

                                <AnimatePresence>
                                    {showOtherCompany && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <input
                                                type="text"
                                                value={formData.otherCompany}
                                                onChange={(e) => handleInputChange('otherCompany', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 ${errors.company && formData.company === 'otro'
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                                    }`}
                                                placeholder="Escribí el nombre de tu compañía"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Detalles del Siniestro */}
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            Detalles del Siniestro
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Tipo de Siniestro *
                                </label>
                                <select
                                    value={formData.claimType}
                                    onChange={(e) => handleInputChange('claimType', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all appearance-none cursor-pointer text-gray-900 ${errors.claimType
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                >
                                    <option value="">Seleccioná el tipo</option>
                                    <option value="accidentes">Accidentes Personales</option>
                                    <option value="art">ART</option>
                                    <option value="automotor">Automotor</option>
                                    <option value="cauciones">Cauciones</option>
                                    <option value="comercio">Comercio</option>
                                    <option value="embarcaciones">Embarcaciones de Placer</option>
                                    <option value="hogar">Hogar</option>
                                    <option value="motovehiculos">Motovehículos</option>
                                    <option value="otro">Otro</option>
                                </select>
                                {errors.claimType && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Seleccioná el tipo de siniestro
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Fecha del Hecho *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    max={maxDate}
                                    lang="es-AR"
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 ${errors.date
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Hora Aproximada *
                                </label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => handleInputChange('time', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 ${errors.time
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                />
                                {errors.time && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Lugar / Dirección *
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 ${errors.location
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                    placeholder="Ej: Av. Corrientes 1234, CABA"
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Descripción del Siniestro *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={5}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all resize-none text-gray-900 ${errors.description
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                                        }`}
                                    placeholder="Describí con el mayor detalle posible qué ocurrió..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Este campo es obligatorio
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload de Fotos */}
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-red-600" />
                            Fotos del Siniestro * <span className="text-sm font-normal text-gray-500">(Mínimo 2 son obligatorias)</span>
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Podés subir hasta {MAX_IMAGES} fotos.
                        </p>

                        {/* Guía de Sugerencias */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Guía de fotos sugeridas (Importante)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0">x1</div>
                                    <span>Frente Registro</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0">x1</div>
                                    <span>Dorso Registro</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0">x1</div>
                                    <span>Cédula Verde/Azul</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold shrink-0">x3</div>
                                    <span>Fotos de los Daños</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">x4</div>
                                    <span>Datos de Terceros</span>
                                </div>
                            </div>
                        </div>

                        {/* Drop Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${errors.images
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
                                } ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging || errors.images ? 'text-red-500' : 'text-gray-400'}`} />
                            <p className="text-gray-700 font-semibold mb-2">
                                Arrastrá las fotos acá o hacé click para seleccionar
                            </p>
                            <p className="text-sm text-gray-500">
                                JPG, PNG, HEIC - Mínimo 2, Máximo {MAX_IMAGES} fotos
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept={ACCEPTED_TYPES.join(',')}
                                onChange={(e) => handleImageSelect(e.target.files)}
                                className="hidden"
                                disabled={images.length >= MAX_IMAGES}
                            />
                        </div>

                        {errors.images && (
                            <p className="text-red-500 text-sm mt-3 flex items-center justify-center gap-1 font-bold">
                                <AlertCircle className="w-4 h-4" />
                                Por favor, subí al menos 2 fotos del siniestro
                            </p>
                        )}

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                {images.map((image) => (
                                    <div key={image.id} className="relative group">
                                        {image.preview ? (
                                            <Image
                                                src={image.preview}
                                                alt="Preview"
                                                width={300}
                                                height={200}
                                                unoptimized
                                                className={`w-full h-32 object-cover rounded-xl border-2 transition-opacity ${image.isProcessing ? 'opacity-40 border-orange-200' : 'opacity-100 border-gray-200'}`}
                                            />
                                        ) : (
                                            <div className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                                                <Camera className="w-8 h-8 text-slate-300" />
                                            </div>
                                        )}
                                        {image.isProcessing && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl z-10">
                                                <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                                                <span className="text-[10px] font-black text-red-700 mt-2 uppercase tracking-tighter">Optimizando</span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.id)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {status === "error" && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{errorMsg}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={status === 'loading' || !isFormValid() || images.some(img => img.isProcessing)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                Enviar Reporte
                                <FileText className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {!isFormValid() && status === 'idle' && (
                        <p className="text-sm text-gray-500 text-center mt-4 flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span>Completá todos los campos obligatorios (*) para enviar el reporte</span>
                        </p>
                    )}

                    <p className="text-sm text-gray-500 text-center mt-2">
                        * Campos obligatorios
                    </p>
                </motion.form>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20"
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Preguntas Frecuentes sobre Siniestros</h3>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-gray-800">{faq.q}</span>
                                    {openFaq === i ? <Minus className="w-5 h-5 text-red-600" /> : <Plus className="w-5 h-5 text-gray-400" />}
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
