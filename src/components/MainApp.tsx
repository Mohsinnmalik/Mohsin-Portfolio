"use client";

import { useEffect } from "react";
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
import { ClientOnly } from "@/components/ui/ClientOnly";
import { Navbar } from "@/components/ui/Navbar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { AIVoiceWidget } from "@/components/ui/AIVoiceWidget";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// TargetCursor uses window/navigator — must skip SSR to avoid hydration mismatch
const TargetCursor = dynamic(
  () => import("@/components/reactbits/TargetCursor"),
  { ssr: false }
);

export default function MainApp() {
  // PERF FIX: Lenis + GSAP ScrollTrigger bridge (Patch §1 — exact spec)
  // Uses ONLY gsap.ticker for Lenis raf — no separate requestAnimationFrame loop
  useEffect(() => {
    // BUG-07 FIX: Store ticker function reference in a variable so the SAME ref
    // is passed to both gsap.ticker.add() and gsap.ticker.remove().
    // Using an inline arrow fn in remove() creates a NEW object — it never matches.
    let tickerFn: ((time: number) => void) | null = null;

    const initLenis = async () => {
      const Lenis = (await import("lenis")).default;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis();

      // Bridge: Lenis scroll events update ScrollTrigger positions
      lenis.on("scroll", ScrollTrigger.update);

      // Bridge: GSAP ticker drives Lenis raf — single animation loop
      tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);

      // Disable GSAP ticker lag smoothing for frame-perfect scroll sync
      gsap.ticker.lagSmoothing(0);

      // Cleanup: destroy Lenis + remove the exact same tickerFn reference
      return () => {
        if (tickerFn) gsap.ticker.remove(tickerFn);
        lenis.destroy();
      };
    };

    const cleanup = initLenis();
    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, []);

  return (
    <main
      className="relative bg-[#0a0b10] text-white selection:bg-[#7c3aed]/30 selection:text-white font-sans overflow-x-clip w-full min-h-screen"
    >
      <ClientOnly>
        <LoadingScreen />
        <NoiseOverlay />
        <TargetCursor targetSelector=".cursor-target, button, a" />
        {/* BUG-13 FIX: Navbar mounted here — inside ClientOnly because it reads Zustand (aiMode) */}
        <Navbar />
        <AIVoiceWidget />
      </ClientOnly>
      
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
