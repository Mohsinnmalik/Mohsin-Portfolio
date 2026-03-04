"use client";

import { useLayoutEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollAnimationWrapper({ children, containerRef }: { children: React.ReactNode, containerRef: React.RefObject<HTMLDivElement> }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Create references to initial state to prevent drift on resize/refresh
  const initialCamZ = 2.5;

  useLayoutEffect(() => {
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
      
      // Phase 1 (0-25%): Camera slowly pushes closer
      tl.to(camera.position, {
        z: 1.8,
        ease: "none",
        duration: 1
      }, 0);

      // Phase 2 (25-50%): Model rotates slightly (max 15 degrees = ~0.26 radians)
      tl.to(groupRef.current.rotation, {
        y: 0.26,
        ease: "none",
        duration: 1
      }, 1);

      // Phase 3 (50-70%): Model shifts slightly left to make room for text
      tl.to(groupRef.current.position, {
        x: -0.6,
        ease: "none",
        duration: 0.8
      }, 2);
      
      // Phase 4 (70-100%): Hold position smoothly while text fades in via separate HTML animation
      tl.to(groupRef.current.position, {
        x: -0.6,
        ease: "none",
        duration: 1.2
      }, 2.8);

      return () => {
        tl.kill();
      };
    });
    
    // Mobile simpler animation mapping
    mm.add("(max-width: 767px)", () => {
        if (!groupRef.current || !containerRef.current) return;
        
        // Reset to mobile friendly positions
        gsap.set(groupRef.current.scale, { x: 0.9, y: 0.9, z: 0.9 });
        gsap.set(groupRef.current.position, { y: -0.2 }); // Drop it slightly to fit text
        gsap.set(camera.position, { z: 3.5 }); // Pull camera back
        
        // Simpler mobile scroll timeline, no heavy movement
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom+=100% bottom", 
            scrub: true,
            pin: true, 
          }
        });
        
        tl.to(groupRef.current.rotation, {
           y: 0.15,
           ease: "power1.inOut",
           duration: 1 
        });
        
        return () => {
             tl.kill();
        }
    });

    return () => {
      mm.revert(); // clean up matchMedia
    };
  }, [camera, containerRef]);

  return <group ref={groupRef}>{children}</group>;
}
