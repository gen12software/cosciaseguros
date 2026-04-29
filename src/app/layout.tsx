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
        {/* Google Ads + Analytics tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18123731177" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18123731177');
              gtag('config', 'G-WDJF4QJ6MP');
            `,
          }}
        />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '843274950653780');
              fbq('track', 'PageView');
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
