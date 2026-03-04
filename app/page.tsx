import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import AgentShowcase from "@/components/sections/AgentShowcase";
import DiamondEconomy from "@/components/sections/DiamondEconomy";
import Marketplace from "@/components/sections/Marketplace";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <AgentShowcase />
      <DiamondEconomy />
      <Marketplace />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
