"use client";

import { useLayoutEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/store/useUIStore";
import { useMobile } from "@/lib/hooks/useMobile";

export function ScrollAnimationWrapper({ children, containerRef }: { children: React.ReactNode, containerRef: React.RefObject<HTMLDivElement> }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const aiMode = useUIStore((state) => state.aiMode);
  const isMobile = useMobile();
  
  // Track GSAP's intended values
  const gsapGroupPos = useRef(new THREE.Vector3(0, 0, 0));
  const gsapGroupRot = useRef(new THREE.Euler(0, 0, 0));
  const gsapCamPos = useRef(new THREE.Vector3(0, 1.2, 2.5));

  useLayoutEffect(() => {
    // 3D Mobile/Desktop Frame Initialization to prevent position snapping/jumps on reload
    if (isMobile) {
      gsapGroupPos.current.set(0, 0.55, 0);
      gsapCamPos.current.set(0, 0.9, 2.7);
      camera.position.set(0, 0.9, 2.7);
      if (groupRef.current) {
        groupRef.current.position.set(0, 0.55, 0);
        groupRef.current.scale.set(1.15, 1.15, 1.15);
      }
    } else {
      gsapGroupPos.current.set(0, 0, 0);
      gsapCamPos.current.set(0, 1.2, 2.5);
      camera.position.set(0, 1.2, 2.5);
      if (groupRef.current) {
        groupRef.current.position.set(0, 0, 0);
        groupRef.current.scale.set(1, 1, 1);
      }
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // Only apply complex scroll on desktop
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      if (!groupRef.current || !containerRef.current) return;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom+=200% bottom", // Extend scroll distance for a slower, smoother feel
          scrub: 1, // Smoothing scrub slightly for organic feel
          pin: true, 
        }
      });
      
      // Phase 1 (0-25%): Camera pushes closer
      tl.to(gsapCamPos.current, {
        z: 1.8,
        ease: "none",
        duration: 1
      }, 0);

      // Phase 2 (25-50%): Model rotates
      tl.to(gsapGroupRot.current, {
        y: 0.26,
        ease: "none",
        duration: 1
      }, 1);

      // Phase 3 (50-70%): Model shifts left
      tl.to(gsapGroupPos.current, {
        x: -0.6,
        ease: "none",
        duration: 0.8
      }, 2);
      
      // Phase 4 (70-100%): Hold position
      tl.to(gsapGroupPos.current, {
        x: -0.6,
        ease: "none",
        duration: 1.2
      }, 2.8);

      return () => {
        tl.kill();
      };
    });
    
    mm.add("(max-width: 767px)", () => {
        if (!groupRef.current || !containerRef.current) return;
        
        // Scale and frame the model to position the face in the upper-middle viewport
        gsap.set(groupRef.current.scale, { x: 1.15, y: 1.15, z: 1.15 });
        gsap.set(gsapGroupPos.current, { x: 0, y: 0.55, z: 0 }); 
        gsap.set(gsapCamPos.current, { x: 0, y: 0.9, z: 2.7 }); 
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom+=100% bottom", 
            scrub: true,
            pin: true, 
          }
        });
        
        tl.to(gsapGroupRot.current, {
           y: 0.15,
           ease: "power1.inOut",
           duration: 1 
        });
        
        return () => {
             tl.kill();
        }
    });

    return () => {
      mm.revert(); 
    };
  }, [containerRef, isMobile, camera]);

  // Continuously apply either GSAP's intended state, or the AI Mode state
  useFrame(() => {
    if (!groupRef.current) return;

    if (aiMode) {
      // Cinematic Zoom for AI Mode
      // Match the values from the previous dedicated page:
      // Camera: [0, 1.2, 1.8]
      // Model position: [-0.6, -2.4, 0] inside Scene3D
      // We are wrapping the model, so we lerp the wrapper group and camera
      
      const targetCamPos = new THREE.Vector3(0, 1.2, 1.8);
      const targetGroupPos = new THREE.Vector3(-0.6, 0, 0); // Scene3D already applies -2.4 Y
      const targetGroupRot = new THREE.Euler(0, 0.26, 0);

      camera.position.lerp(targetCamPos, 0.05);
      groupRef.current.position.lerp(targetGroupPos, 0.05);
      
      // Lerp rotation smoothly
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetGroupRot.x, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetGroupRot.y, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetGroupRot.z, 0.05);
      
    } else {
      // Return to GSAP controlled proxy values smoothly
      camera.position.lerp(gsapCamPos.current, 0.08);
      groupRef.current.position.lerp(gsapGroupPos.current, 0.08);
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, gsapGroupRot.current.x, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, gsapGroupRot.current.y, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, gsapGroupRot.current.z, 0.08);
    }
    
    camera.lookAt(0, 0, 0); // Keep lookAt centered
  });

  return <group ref={groupRef}>{children}</group>;
}
