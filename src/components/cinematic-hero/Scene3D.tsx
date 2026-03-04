"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Model } from "./Model";
import { ScrollAnimationWrapper } from "./ScrollAnimationWrapper";

export function Scene3D({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 1.2, 2.5], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        {/* Clean Studio Lighting Setup - Warmer and Softer */}
        <ambientLight intensity={0.8} color="#ffd8b3" />
        
        {/* Key Light (Top Right) - Warm, soft orange/yellow tone */}
        <directionalLight position={[5, 4, 4]} intensity={1.8} color="#ffedd6" castShadow={false} />
        
        {/* Soft Fill Light (Left) - Cool contrast, very subtle */}
        <pointLight position={[-4, 2, 2]} intensity={0.8} color="#d6e8ff" />
        
        {/* Rim Light (Back Top) to outline the hair and shoulders cleanly without global glossy map */}
        <spotLight position={[0, 5, -3]} intensity={1.0} color="#ffffff" angle={0.8} penumbra={1} castShadow={false} />
        
        {/* Scroll Animator Wraps Model */}
        <ScrollAnimationWrapper containerRef={containerRef}>
          {/* Model Rendering: Adjusted to fix the awkward cut-off at the arms. We'll lower it and scale it down slightly so the chest/head is perfectly framed */}
          <Model position={[0, -2.4, 0]} scale={2.2} />
        </ScrollAnimationWrapper>
      </Suspense>
    </Canvas>
  );
}
