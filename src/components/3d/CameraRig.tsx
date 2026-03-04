"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CameraRig() {
  const { camera } = useThree();
  const timeline = useRef<gsap.core.Timeline>();
  
  // Target values we tween to
  const camData = useRef({
    x: 0,
    y: 1.5,
    z: 6,
    lookX: 0,
    lookY: 1.5,
    lookZ: 0,
  });

  useGSAP(() => {
    // We attach the scroll trigger to the main body to sync camera with the page scroll
    timeline.current = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // 1.5s delay for smooth interpolation
      },
    });

    // 0-20% (Hero -> About) Let's push in and look slightly up
    timeline.current.to(camData.current, { z: 3.5, y: 1.0, lookY: 1.2, ease: "power1.inOut" }, 0);
    
    // 20-40% (About -> Projects) Pull back a bit, orbit left
    timeline.current.to(camData.current, { x: 2.5, z: 3.5, y: 1.5, lookX: -0.5, ease: "power1.inOut" }, 0.2);
    
    // 40-60% (Projects -> Skills) Orbit right, get close to torso
    timeline.current.to(camData.current, { x: -2, z: 3, y: 0.8, lookX: 0.5, lookY: 1.0, ease: "power1.inOut" }, 0.4);
    
    // 60-80% (Skills -> Impact) Pull way back, dramatic low angle
    timeline.current.to(camData.current, { x: 0, y: -0.5, z: 5, lookX: 0, lookY: 1.8, ease: "power1.inOut" }, 0.6);
    
    // 80-100% (Impact -> Contact) Final close up on face
    timeline.current.to(camData.current, { x: 1, y: 1.8, z: 2.5, lookX: -0.2, lookY: 1.8, ease: "power1.inOut" }, 0.8);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame(() => {
    // Smoothly apply camera data to the actual ThreeJS camera
    camera.position.set(camData.current.x, camData.current.y, camData.current.z);
    camera.lookAt(camData.current.lookX, camData.current.lookY, camData.current.lookZ);
  });

  return null;
}
