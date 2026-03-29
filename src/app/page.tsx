import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import dynamic from "next/dynamic";

const HowItWorks  = dynamic(() => import("@/components/sections/HowItWorks").then(m => ({ default: m.HowItWorks })));
const Companies   = dynamic(() => import("@/components/sections/Companies").then(m => ({ default: m.Companies })));
const WhyUs       = dynamic(() => import("@/components/sections/WhyUs").then(m => ({ default: m.WhyUs })));
const About       = dynamic(() => import("@/components/sections/About").then(m => ({ default: m.About })));
const Team        = dynamic(() => import("@/components/sections/Team").then(m => ({ default: m.Team })));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const FAQ         = dynamic(() => import("@/components/sections/FAQ").then(m => ({ default: m.FAQ })));
const Contact     = dynamic(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <HowItWorks />
      <Companies />
      <WhyUs />
      <About />
      <Team />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}
