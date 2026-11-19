import About from "@/components/home/About";
import CallToAction from "@/components/home/CallToAction";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Navbar from "@/components/home/Navbar";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <About />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
