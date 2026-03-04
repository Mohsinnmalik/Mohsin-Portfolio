"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { Suspense } from "react";
import { RobotModel } from "./RobotModel";
import { CameraRig } from "./CameraRig";

export function Scene() {
  return (
    <div className="fixed inset-0 z-0 bg-[#030303] pointer-events-none">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <CameraRig />
          
          {/* Cinematic Lighting Setup */}
          {/* Dark moody ambient base */}
          <ambientLight intensity={0.15} />
          
          {/* Key light: cool blue-ish overhead */}
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={2} 
            color="#b0c4de" 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          
          {/* Fill light: very subtle warm right side */}
          <directionalLight 
            position={[-5, 5, -5]} 
            intensity={0.5} 
            color="#ffe4b5" 
          />
          
          {/* Rim light: striking pure white from back to outline the robot */}
          <spotLight 
            position={[0, 5, -10]} 
            intensity={10} 
            color="#ffffff" 
            penumbra={1} 
            angle={0.6}
          />
          
          {/* HDRI Environment for realistic metallic reflections without heavy processing */}
          <Environment preset="night" environmentIntensity={0.5} />
          
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <RobotModel position={[0, -1, 0]} />
          </Float>
          
          {/* Ground shadow for depth */}
          <ContactShadows 
            position={[0, -1, 0]} 
            resolution={512} 
            scale={10} 
            blur={2} 
            opacity={0.8} 
            far={5} 
            color="#000000" 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
