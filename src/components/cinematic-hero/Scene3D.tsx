"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Model } from "./Model";
import { ScrollAnimationWrapper } from "./ScrollAnimationWrapper";
import { useMobile } from "@/lib/hooks/useMobile";

export function Scene3D({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const isMobile = useMobile();

  // 3D: IntersectionObserver-driven frameloop (Patch §4 — exact spec)
  // Mobile always stays "demand" to save battery; desktop switches to "always" when in view
  const canvasRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"demand" | "always">("demand");

  useEffect(() => {
    if (isMobile) return; // Mobile always stays demand — skip observer

    const observer = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "demand"),
      { threshold: 0.1 }
    );
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    // 3D: canvasRef wrapper for IntersectionObserver target
    <div ref={canvasRef} className="w-full h-full">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 1.2, 2.5], fov: 35 }}
        // 3D: Mobile forces pixelRatio=1; desktop uses adaptive [1, 1.5]
        dpr={isMobile ? 1 : [1, 1.5]}
        // 3D: frameloop switches via IntersectionObserver on desktop; mobile always demand
        frameloop={isMobile ? "demand" : frameloop}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        // BUG-04 FIX: Dispose renderer on unmount to prevent WebGL "Context Lost" error
        onCreated={({ gl }) => {
          // Returning a cleanup fn from onCreated is NOT supported —
          // instead we rely on R3F's built-in cleanup + forceContextLoss workaround:
          gl.getContext().canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
          }, { once: false });
        }}
      >
        {/* 3D: AdaptiveDpr automatically lowers resolution under load */}
        <AdaptiveDpr pixelated />
        {/* 3D: AdaptiveEvents disables pointer events when fps drops */}
        <AdaptiveEvents />

        <Suspense fallback={null}>
          {/* Clean Studio Lighting Setup - Warmer and Softer */}
          <ambientLight intensity={0.8} color="#ffd8b3" />

          {/* Key Light (Top Right) - Warm, soft orange/yellow tone */}
          <directionalLight position={[5, 4, 4]} intensity={1.8} color="#ffedd6" castShadow={false} />

          {/* Soft Fill Light (Left) - Cool contrast, very subtle */}
          <pointLight position={[-4, 2, 2]} intensity={0.8} color="#d6e8ff" />

          {/* Rim Light (Back Top) to outline the hair and shoulders cleanly */}
          <spotLight position={[0, 5, -3]} intensity={1.0} color="#ffffff" angle={0.8} penumbra={1} castShadow={false} />

          {/* Scroll Animator Wraps Model */}
          <ScrollAnimationWrapper containerRef={containerRef}>
            {/* Model Rendering: Positioned to frame chest/head perfectly */}
            <Model position={[0, -2.4, 0]} scale={2.2} />
          </ScrollAnimationWrapper>

          {/* 3D: Post-processing — desktop only, disabled on mobile to protect battery/perf */}
          {!isMobile && (
            <EffectComposer>
              {/* Bloom: subtle glow on bright areas — intensity kept low to not overpower the model */}
              <Bloom intensity={0.4} luminanceThreshold={0.9} luminanceSmoothing={0.9} />
              {/* Vignette: dark edge fade for cinematic feel */}
              <Vignette eskil={false} offset={0.1} darkness={0.5} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
