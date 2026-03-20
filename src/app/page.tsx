"use client";

import { HeroSection } from "@/components/cinematic-hero";
import { ScrollTextBanner } from "@/components/ui/ScrollTextBanner";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { SkillsPanel } from "@/components/panels/SkillsPanel";
import { ShowcaseSection } from "@/components/panels/ShowcaseSection";
import { ExperienceTimeline } from "@/components/panels/ExperienceTimeline";
import { ContactSection } from "@/components/panels/ContactSection";
import { ContactForm } from "@/components/panels/ContactForm";
import { TraditionalFooter } from "@/components/panels/TraditionalFooter";
import dynamic from "next/dynamic";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

// TargetCursor uses window/navigator — must skip SSR to avoid hydration mismatch
const TargetCursor = dynamic(
  () => import("@/components/reactbits/TargetCursor"),
  { ssr: false }
);

export default function Home() {
  return (
    <main
      className="relative bg-[#0a0f1d] text-white selection:bg-orange-500/30 selection:text-white font-sans overflow-x-clip w-full min-h-screen"
      suppressHydrationWarning
    >
      <NoiseOverlay />
      <TargetCursor targetSelector=".cursor-target, button, a" />
      
      {/* Scrollable Flow - Cleanest structure for ScrollTrigger/Framer animations */}
      <HeroSection />
      
      <ScrollTextBanner />
      
      <AboutPanel />
      
      <SkillsPanel />
      
      <ShowcaseSection />
      
      <ExperienceTimeline />
      
      <ContactSection />
      <ContactForm />
      <TraditionalFooter />
    </main>
  );
}
