"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Model(props: any) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/mohsin.glb");

  // Apply materials gracefully to fix harsh, plastic lighting
  useEffect(() => {
    if (!scene) return;
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
          mat.side = THREE.DoubleSide;
          
          // Force a very matte, non-reflective finish
          // Prevent any environment calculations
          mat.envMapIntensity = 0;
          
          // Disable complex material features for performance
          if (window.innerWidth <= 768) {
             mat.roughness = 1;
             mat.metalness = 0;
          } else {
             mat.roughness = 0.95; 
             mat.metalness = 0.0;
          }
          mat.flatShading = false;
          
          // Disable environment reflections entirely which cause the "wet" or plastic look
          mat.envMapIntensity = 0.0; 
          
          // If the material has a color, we can warm it up significantly
          if (mat.color) {
            const hsl = { h: 0, s: 0, l: 0 };
            mat.color.getHSL(hsl);
            // Blend heavily with a very warm, soft peach/cream color to remove cool digital tones
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
      // Disable all these calculations on mobile to save CPU
      if (window.innerWidth <= 768) return;

      // Subtle cinematic idling
      const targetY = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1);

      // Mouse tracking rotation (very subtle, soft, and delayed)
      // Pointer maps from -1 to 1 on X and Y
      const targetRotationX = (state.pointer.y * 0.1) + (Math.cos(state.clock.elapsedTime * 0.4) * 0.01);
      const targetRotationY = (state.pointer.x * 0.2) + (Math.sin(state.clock.elapsedTime * 0.4) * 0.01);

      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/mohsin.glb");
