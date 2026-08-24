import AboutHero from "@/components/about/AboutHero";
import ClientLogosSlider from "@/components/about/ClientLogosSlider";
import MissionVision from "@/components/about/MissionVision";
import OurJourney from "@/components/about/OurJourney";
import AboutStatsCounter from "@/components/about/AboutStatsCounter";
import GuidingPrinciples from "@/components/about/GuidingPrinciples";
import OurLeaders from "@/components/about/OurLeaders";
import GroupOfCompanies from "@/components/about/GroupOfCompanies";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)]">
      <AboutHero />
      <ClientLogosSlider />
      <MissionVision />
      <OurJourney />
      <AboutStatsCounter />
      <GuidingPrinciples />
      <OurLeaders />
      <GroupOfCompanies />
    </main>
  );
}
