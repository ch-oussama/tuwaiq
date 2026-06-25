"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ── Orbiting dynamic lights ── */
function DynamicLights() {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Two point lights orbit the object in opposite directions
    if (light1.current) {
      light1.current.position.set(Math.sin(t * 0.9) * 6, Math.cos(t * 0.6) * 4, 5);
    }
    if (light2.current) {
      light2.current.position.set(Math.sin(t * 0.7 + Math.PI) * 5, Math.cos(t * 0.5 + 1) * 3, -4);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#fff8e7" />
      <directionalLight position={[8, 8, 8]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-6, -6, -6]} intensity={0.6} color="#D4AF37" />
      <pointLight ref={light1} intensity={3} color="#FFD700" distance={20} decay={2} />
      <pointLight ref={light2} intensity={2} color="#fff8e7" distance={18} decay={2} />
      <pointLight position={[0, 8, 3]} intensity={1.5} color="#D4AF37" distance={15} decay={2} />
    </>
  );
}

/* ── Spinning golden halo ring ── */
function GoldenRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.4;
      ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.3;
    }
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.2, 0.018, 16, 100]} />
      <meshStandardMaterial
        color="#D4AF37"
        metalness={1}
        roughness={0.1}
        emissive="#B8860B"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

/* ── Second outer ring, counter-rotating ── */
function OuterRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = -clock.elapsedTime * 0.25;
      ringRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.2;
    }
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.65, 0.01, 12, 100]} />
      <meshStandardMaterial
        color="#C8A020"
        metalness={1}
        roughness={0.15}
        emissive="#A07010"
        emissiveIntensity={0.3}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/* ── The camera logo extruded 3D ── */
function AbstractShape() {
  const groupRef = useRef<THREE.Group>(null);
  const texture  = useLoader(THREE.TextureLoader, "/3d-test.png");

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
  }, [texture]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.65;
    }
  });

  const layers  = 120;
  const depth   = 0.12;
  const size    = 1.5;
  const outline = 1.08;

  /* Gold material for the outline glow — reacts to orbiting lights */
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:             new THREE.Color("#D4AF37"),
    emissive:          new THREE.Color("#8B6914"),
    emissiveIntensity: 0.3,
    metalness:         0.95,
    roughness:         0.1,
    transparent:       true,
    depthWrite:        false,
  }), []);

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={1}>
      <group ref={groupRef} scale={2.8}>

        {/* ── FRONT layers ── */}
        {Array.from({ length: layers }).map((_, i) => {
          const z = (i / (layers - 1) - 0.5) * depth;
          return (
            <group key={`f${i}`}>
              {/* shimmering gold outline — uses standard mat so it catches light */}
              <mesh position={[0, 0, z - 0.0005]} scale={[outline, outline, 1]}>
                <planeGeometry args={[size, size]} />
                <primitive object={goldMat} attach="material" map={texture} />
              </mesh>
              {/* crisp image layer */}
              <mesh position={[0, 0, z]}>
                <planeGeometry args={[size, size]} />
                <meshBasicMaterial map={texture} transparent alphaTest={0.05}
                  depthWrite={true} side={THREE.FrontSide} />
              </mesh>
            </group>
          );
        })}

        {/* ── BACK layers (rotated 180° on Y) ── */}
        {Array.from({ length: layers }).map((_, i) => {
          const z = (i / (layers - 1) - 0.5) * depth;
          return (
            <group key={`b${i}`} rotation={[0, Math.PI, 0]}>
              <mesh position={[0, 0, z - 0.0005]} scale={[outline, outline, 1]}>
                <planeGeometry args={[size, size]} />
                <primitive object={goldMat} attach="material" map={texture} />
              </mesh>
              <mesh position={[0, 0, z]}>
                <planeGeometry args={[size, size]} />
                <meshBasicMaterial map={texture} transparent alphaTest={0.05}
                  depthWrite={true} side={THREE.FrontSide} />
              </mesh>
            </group>
          );
        })}

      </group>
    </Float>
  );
}

/* ── Scene wrapper ── */
export default function AbstractScene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Beautiful radial glow behind the 3D canvas — dark theme */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 55% 55% at 62% 42%, rgba(240,192,64,0.08) 0%, transparent 70%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4 }}
      >
        <DynamicLights />
        <AbstractShape />
      </Canvas>
    </div>
  );
}
