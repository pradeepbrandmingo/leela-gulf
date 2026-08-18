import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import ClientLogosSlider from "@/components/about/ClientLogosSlider";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-primary)]">
        <AboutHero />
        <ClientLogosSlider />
      </main>
      <Footer />
    </>
  );
}
