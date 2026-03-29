"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ErrorBoundary } from "./ErrorBoundary";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { useState, useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isSiniestros = pathname === '/siniestros';
    const [skipAnimations, setSkipAnimations] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setSkipAnimations(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <ErrorBoundary>
            <MotionConfig reducedMotion={skipAnimations ? "always" : "user"}>
                {!isSiniestros && <Navbar />}
                {children}
                {!isSiniestros && <Footer />}
            </MotionConfig>
        </ErrorBoundary>
    );
}

