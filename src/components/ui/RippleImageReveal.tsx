"use client";

import React, { useRef, useMemo, useState, Suspense, useEffect, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface RippleImageRevealProps {
  activeImage: string;
  onNext: () => void;
  className?: string;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  uniform sampler2D u_image1;
  uniform sampler2D u_image2;
  uniform float u_progress;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform vec2 u_imageRes;
  uniform float u_time;
  
  void main() {
    // 1. OBJECT-FIT: COVER MATH
    vec2 s = u_resolution; // Screen
    vec2 i = u_imageRes;   // Image
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 newUv = vUv;
    
    if (rs > ri) {
        newUv.y = vUv.y * (ri / rs) + (1.0 - ri / rs) * 0.5;
    } else {
        newUv.x = vUv.x * (rs / ri) + (1.0 - rs / ri) * 0.5;
    }

    vec2 p = newUv;
    
    // 2. WATER DROP PHYSICS
    vec2 center = u_mouse;
    vec2 aspectCorrectedP = p * vec2(rs, 1.0);
    vec2 aspectCorrectedCenter = center * vec2(rs, 1.0);
    float dist = distance(aspectCorrectedP, aspectCorrectedCenter);
    
    float radius = u_progress * 1.5;
    float thickness = 0.15;
    
    float ring = smoothstep(radius - thickness, radius, dist) - smoothstep(radius, radius + thickness, dist);
    float displacement = ring * 0.06;
    
    vec4 tex1 = vec4(
        texture2D(u_image1, p + displacement * 0.5).r,
        texture2D(u_image1, p + displacement * 0.3).g,
        texture2D(u_image1, p + displacement * 0.1).b,
        1.0
    );
    
    vec4 tex2 = vec4(
        texture2D(u_image2, p - displacement * 0.5).r,
        texture2D(u_image2, p - displacement * 0.3).g,
        texture2D(u_image2, p - displacement * 0.1).b,
        1.0
    );
    
    // Softer Expansion Mask
    float revealMask = smoothstep(radius - 0.25, radius + 0.1, dist);
    
    vec4 finalColor = mix(tex2, tex1, revealMask);
    
    // Subtle Light Glint
    finalColor.rgb += ring * 0.15 * (1.0 - u_progress);
    
    // Cinematic Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.6, length(vUv - 0.5));
    finalColor.rgb *= 0.7 + 0.3 * vignette;
    
    gl_FragColor = finalColor;
  }
`;

const RippleSurface = ({ activeImage, onNext }: { activeImage: string, onNext: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const activeImageRef = useRef(activeImage);
  const transitioningRef = useRef(false);
  const { invalidate, viewport, size } = useThree();
  
  const [textures, setTextures] = useState({ prev: activeImage, curr: activeImage });

  const tex1 = useTexture(textures.prev);
  const tex2 = useTexture(textures.curr);
  
  tex1.colorSpace = THREE.SRGBColorSpace;
  tex2.colorSpace = THREE.SRGBColorSpace;

  // Stable uniforms object
  const uniforms = useMemo(() => ({
    u_image1: { value: tex1 },
    u_image2: { value: tex2 },
    u_progress: { value: 0.0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_resolution: { value: new THREE.Vector2(size.width, size.height) },
    u_imageRes: { value: new THREE.Vector2(1920, 1080) }, // Default fallback
    u_time: { value: 0.0 }
  }), []); 

  // Manual sync for textures, aspect, and resolution
  useEffect(() => {
    if (uniforms && tex1.image && tex2.image) {
      uniforms.u_image1.value = tex1;
      uniforms.u_image2.value = tex2;
      uniforms.u_resolution.value.set(size.width, size.height);
      // Use the raw image dimensions for perfect cover-fit
      uniforms.u_imageRes.value.set(tex1.image.width || 1920, tex1.image.height || 1080);
      invalidate();
    }
  }, [tex1, tex2, size, uniforms, invalidate]);

  useEffect(() => {
    activeImageRef.current = activeImage;
  }, [activeImage]);

  useEffect(() => {
    if (activeImage !== textures.curr && !transitioningRef.current) {
      console.log(`[WebGL] Auto-rippling for: ${activeImage}`);
      
      // Default to center if no mouse event
      materialRef.current?.uniforms.u_mouse.value.set(0.5, 0.5);
      materialRef.current!.uniforms.u_progress.value = 0.0;
      
      transitioningRef.current = true;
      setTextures(prev => ({ ...prev, curr: activeImage }));

      gsap.to(materialRef.current!.uniforms.u_progress, {
        value: 1.0,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => invalidate(),
        onComplete: () => {
          setTextures({ prev: activeImage, curr: activeImage });
          materialRef.current!.uniforms.u_progress.value = 0.0;
          transitioningRef.current = false;
          invalidate();
        }
      });
    }
  }, [activeImage, textures.curr, invalidate]);

  // Keep u_time running for subtle movement if desired
  useEffect(() => {
    let frameId: number;
    const animate = (time: number) => {
      if (uniforms) uniforms.u_time.value = time / 1000;
      invalidate();
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [uniforms, invalidate]);

  const triggerGalleryTransition = useCallback((e: any) => {
    if (transitioningRef.current || !materialRef.current) return;
    
    // UV coordinates are normalized 0-1
    const uv = e.intersections[0]?.uv;
    if (!uv) return;

    console.log(`[WebGL] Rippling at ${uv.x.toFixed(2)}, ${uv.y.toFixed(2)} -> target: ${activeImageRef.current}`);
    
    materialRef.current.uniforms.u_mouse.value.set(uv.x, uv.y);
    materialRef.current.uniforms.u_progress.value = 0.0;
    
    transitioningRef.current = true;
    onNext(); // Advance parent state
    
    // CINEMATIC WATER DROP TRANSITION
    gsap.to(materialRef.current.uniforms.u_progress, {
      value: 1.0,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => invalidate(),
      onComplete: () => {
        const finishedImage = activeImageRef.current;
        console.log(`[WebGL] Transition complete. Locking to: ${finishedImage}`);
        
        setTextures({ prev: finishedImage, curr: finishedImage });
        materialRef.current!.uniforms.u_progress.value = 0.0;
        transitioningRef.current = false;
        invalidate();
      }
    });
  }, [onNext, invalidate]);

  return (
    <mesh onPointerDown={triggerGalleryTransition} ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

export default function RippleImageReveal({ activeImage, onNext, className = "" }: RippleImageRevealProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={`absolute inset-0 w-full h-full bg-black ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <Canvas 
        frameloop="demand" 
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
      >
        <Suspense fallback={null}>
          <RippleSurface activeImage={activeImage} onNext={onNext} />
        </Suspense>
      </Canvas>
    </div>
  );
}
