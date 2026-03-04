"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const count = 2000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.02;

      for (let i = 0; i < count; i++) {
        const time = state.clock.getElapsedTime();
        const t = time + i * 0.1;

        dummy.position.set(
          particlesPosition[i * 3] + Math.sin(t) * 0.1,
          particlesPosition[i * 3 + 1] + Math.cos(t) * 0.1,
          particlesPosition[i * 3 + 2] + Math.sin(t * 0.5) * 0.1
        );

        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
    }

    if (light.current) {
      light.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 3;
      light.current.position.y = Math.cos(state.clock.getElapsedTime() * 0.3) * 3;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={5} intensity={5} color="#ffffff" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </instancedMesh>
    </>
  );
}

export function Background() {
  return (
    <div className="absolute inset-0 z-0 bg-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={["black", 2, 7]} />
        <Particles />
      </Canvas>
      {/* Subtle overlay gradient to blend with the hero content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10 pointer-events-none" />
    </div>
  );
}
