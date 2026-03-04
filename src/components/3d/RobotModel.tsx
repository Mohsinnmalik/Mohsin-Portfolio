"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function RobotModel(props: any) {
  const group = useRef<THREE.Group>(null);
  
  // ==========================================
  // INSTRUCTIONS TO USE YOUR CUSTOM GLB ROBOT:
  // ==========================================
  // 1. Place your 'robot.glb' inside the '/public/models/' directory.
  // 2. Uncomment the useGLTF line below and use your model's nodes.
  // 3. (Optional) Extract actions from useAnimations if your robot is rigged.
  // 
  // const { scene, animations } = useGLTF('/models/robot.glb');
  // const { actions } = useAnimations(animations, group);

  useFrame((state) => {
    if (group.current) {
      // Subtle cinematic idling: breathing motion
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      // Slight head tracking or scanning motion
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* 
        This is a programmatic placeholder designed to look like a premium, sleek AI core/robot bust. 
        Once you add your own GLB, replace this entire <group> content with:
        <primitive object={scene} /> 
      */}
      
      {/* Head / Core */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial 
          color="#0f0f15" 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
        />
      </mesh>

      {/* Glowing Visor */}
      <mesh position={[0, 1.85, 0.35]}>
        <boxGeometry args={[0.5, 0.15, 0.1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={2} 
          toneMapped={false}
        />
      </mesh>

      {/* Floating Neck Rings */}
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
        <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <torusGeometry args={[0.25, 0.04, 16, 32]} />
        <meshStandardMaterial color="#222233" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Torso Base */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.2, 32]} />
        <meshPhysicalMaterial 
          color="#151520" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
    </group>
  );
}

// Preload instruction:
// useGLTF.preload('/models/robot.glb');
