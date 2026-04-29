import type { Metadata } from "next";
import "@fontsource/outfit";
import "@fontsource/inter";
import "./globals.css";
import { StructuredData } from "@/components/layout/StructuredData";
import { ClientLayout } from "@/components/layout/ClientLayout";


export const metadata: Metadata = {
  metadataBase: new URL('https://www.cosciaasesores.com'),
  title: "Coscia Asesores | Seguros - Cotización Gratis",
  description: "Cotiza gratis tus seguros. +10 compañías líderes. Atención personalizada 24/7",
  keywords: ["seguros el palomar", "asesor de seguros", "seguro automotor", "seguro de vida", "ART", "seguros Buenos Aires", "cotización gratis", "broker seguros"],
  authors: [{ name: "Coscia Asesores" }],
  creator: "Coscia Asesores",
  publisher: "Coscia Asesores",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo-coscia.png",
    shortcut: "/logo-coscia.png",
    apple: "/logo-coscia.png",
  },
  openGraph: {
    title: "Coscia Asesores | Seguros - Cotización Gratis",
    description: "Cotiza gratis tus seguros. +10 compañías líderes. Atención personalizada 24/7",
    url: "https://www.cosciaasesores.com",
    siteName: "Coscia Asesores",
    images: [
      {
        url: "/logoCoscia.png",
        width: 800,
        height: 600,
        alt: "Coscia Asesores Banner",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  alternates: {
    canonical: "https://www.cosciaasesores.com",
  },
  verification: {
    google: "P8xRrgf7LPRFWa5E47szMAQXvNi7PxKN5sNNy77oq-A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <StructuredData />
        {/* Google Ads tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18123731177" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18123731177');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased text-brand-navy bg-brand-silver">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
