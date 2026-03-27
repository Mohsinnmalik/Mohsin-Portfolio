"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";
import { DoodleHint } from "../ui/DoodleHint";

export function Model(props: any) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/mohsin.glb");
  const setAiMode = useUIStore((state) => state.setAiMode);
  const aiMode = useUIStore((state) => state.aiMode);

  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      setIsHolding(false);
      setAiMode(true);
    }, 2500); // 2.5 seconds for snappier entry
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    setIsHolding(false);
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  // Apply materials gracefully to fix harsh, plastic lighting
  useEffect(() => {
    if (!scene) return;
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
          mat.side = THREE.DoubleSide;
          
          mat.envMapIntensity = 0;
          
          if (window.innerWidth <= 768) {
             mat.roughness = 1;
             mat.metalness = 0;
          } else {
             mat.roughness = 0.95; 
             mat.metalness = 0.0;
          }
          mat.flatShading = false;
          mat.envMapIntensity = 0.0; 
          
          if (mat.color) {
            const hsl = { h: 0, s: 0, l: 0 };
            mat.color.getHSL(hsl);
            if (hsl.s > 0) {
              mat.color.lerp(new THREE.Color("#ffeed4"), 0.15); 
            }
          }
          
          mat.needsUpdate = true;
        }
        const isMobile = window.innerWidth <= 768;
        mesh.castShadow = !isMobile;
        mesh.receiveShadow = !isMobile;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (group.current) {
      if (isHolding) {
        // Vibration effect: random tiny offsets on XYZ
        const xOffset = (Math.random() - 0.5) * 0.05;
        const yOffset = (Math.random() - 0.5) * 0.05;
        const zOffset = (Math.random() - 0.5) * 0.05;
        group.current.position.set(xOffset, yOffset, zOffset);
      } else {
        // Normal behavior
        // Need to reset to zero since we offset it during vibration
        const targetY = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1);
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 0, 0.1);
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, 0.1);

        if (window.innerWidth > 768) {
          const targetRotationX = (state.pointer.y * 0.1) + (Math.cos(state.clock.elapsedTime * 0.4) * 0.01);
          const targetRotationY = (state.pointer.x * 0.2) + (Math.sin(state.clock.elapsedTime * 0.4) * 0.01);

          group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
          group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
        }
      }
    }
  });

  return (
    <group 
      ref={group} 
      {...props} 
      dispose={null}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <primitive object={scene} />

      {!aiMode && !isHolding && (
        <Html 
          position={[0.6, 1.2, 0]} 
          center 
          zIndexRange={[100, 0]}
          className="pointer-events-none transition-opacity duration-300"
        >
          <div style={{ transform: "scale(1.5)", zIndex: 999 }}>
            <DoodleHint />
          </div>
        </Html>
      )}

      {isHolding && !aiMode && (
        <Html 
          position={[0, 1.5, 0]} 
          center 
          zIndexRange={[100, 0]}
          className="pointer-events-none transition-opacity duration-300"
        >
          <div className="flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-orange-500/50">
            <span className="text-orange-500 font-mono text-sm tracking-widest uppercase animate-pulse">
              Initializing AI...
            </span>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500"
                style={{ 
                  animation: "fillProgress 2.5s linear forwards" 
                }}
              />
            </div>
          </div>
          <style>{`
            @keyframes fillProgress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload("/models/mohsin.glb");
