"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

export function Model(props: any) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/mohsin.glb");
  const setAiMode = useUIStore((state) => state.setAiMode);

  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      setIsHolding(false);
      setAiMode(true);
    }, 5000);
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
    </group>
  );
}

useGLTF.preload("/models/mohsin.glb");
