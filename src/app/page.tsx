import { Header } from "@/components/Header";
import { Banner } from "@/components/Banner";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { Gallery } from "@/components/Gallery";
import { Reservation } from "@/components/Reservation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-surface">
        <Banner />
        <Hero />
        <Benefits />
        <About />
        <HowItWorks />
        <Gallery />
        <Reservation />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
