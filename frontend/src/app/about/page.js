import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import ClientLogosSlider from "@/components/about/ClientLogosSlider";
import MissionVision from "@/components/about/MissionVision";
import AboutStatsCounter from "@/components/about/AboutStatsCounter";
import GuidingPrinciples from "@/components/about/GuidingPrinciples";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-primary)]">
        <AboutHero />
        <ClientLogosSlider />
        <MissionVision />
        <AboutStatsCounter />
        <GuidingPrinciples />
      </main>
      <Footer />
    </>
  );
}
