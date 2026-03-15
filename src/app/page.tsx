import { HeroSection } from "@/components/cinematic-hero";
import { ScrollTextBanner } from "@/components/ui/ScrollTextBanner";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { SkillsPanel } from "@/components/panels/SkillsPanel";
import { ExperienceTimeline } from "@/components/panels/ExperienceTimeline";
import ShowcaseSection from "@/components/panels/ShowcaseSection";
import { ContactPanel } from "@/components/panels/ContactPanel";
import TargetCursor from "@/components/reactbits/TargetCursor";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

export default function Home() {
  return (
    <main className="relative bg-[#0a0f1d] text-white selection:bg-orange-500/30 selection:text-white font-sans overflow-x-clip w-full">
      <NoiseOverlay />
      <TargetCursor targetSelector=".cursor-target, button, a" />
      {/* Scrollable Flow */}
      <div className="w-full relative z-10">
        <HeroSection />
        <ScrollTextBanner />
        <AboutPanel />
        <SkillsPanel />
        <ShowcaseSection />
        <ExperienceTimeline />
        <ContactPanel />
      </div>
    </main>
  );
}
