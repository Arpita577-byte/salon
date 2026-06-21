import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  Html,
  PerspectiveCamera,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

export type HotspotId = "hair" | "nails" | "facial" | "product";

interface SalonSceneProps {
  scroll: number; // 0..1
  onHotspot: (id: HotspotId) => void;
}

const HOTSPOTS: { id: HotspotId; pos: [number, number, number]; label: string }[] = [
  { id: "hair", pos: [-3.2, 1.4, -1.5], label: "Hair Atelier" },
  { id: "nails", pos: [3.2, 1.2, -0.5], label: "Nails Bar" },
  { id: "facial", pos: [0, 1.6, -4.5], label: "Facial Suite" },
  { id: "product", pos: [0, 2.2, 2.4], label: "Apothecary" },
];

function MarbleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={0.7}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#e8e4dd"
        metalness={0.4}
        mirror={0.6}
      />
    </mesh>
  );
}

function Walls() {
  const wallMat = <meshStandardMaterial color="#1a1715" roughness={0.85} metalness={0.05} />;
  return (
    <group>
      {/* back wall */}
      <mesh position={[0, 4, -8]} receiveShadow>
        <planeGeometry args={[24, 8]} />
        {wallMat}
      </mesh>
      {/* side walls */}
      <mesh position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        {wallMat}
      </mesh>
      <mesh position={[10, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        {wallMat}
      </mesh>
      {/* ceiling */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#0e0c0b" roughness={1} />
      </mesh>
      {/* brass trim line */}
      <mesh position={[0, 5.5, -7.95]}>
        <boxGeometry args={[24, 0.04, 0.04]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function VelvetChair({ position, rotation = 0, color = "#3a1a22" }: { position: [number, number, number]; rotation?: number; color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.55, 0.3, 32]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial color="#1a1715" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* seat */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.9, 0.25, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* back */}
      <mesh position={[0, 1.55, -0.4]} castShadow>
        <boxGeometry args={[0.9, 1.4, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* arms */}
      <mesh position={[-0.5, 1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.18, 0.7]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0.5, 1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.18, 0.7]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Vanity({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.4, 1, 0.5]} />
        <meshStandardMaterial color="#0b0a09" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* mirror */}
      <mesh position={[0, 2.2, -0.25]}>
        <ringGeometry args={[0.55, 0.7, 64]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, -0.26]}>
        <circleGeometry args={[0.55, 64]} />
        <meshPhysicalMaterial color="#101010" metalness={1} roughness={0.05} envMapIntensity={1.4} />
      </mesh>
    </group>
  );
}

function ReceptionDesk() {
  return (
    <group position={[0, 0, 2]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[5, 1.2, 1.2]} />
        <meshStandardMaterial color="#0f0d0c" roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <boxGeometry args={[5.05, 0.05, 1.25]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function HoloProduct({ position }: { position: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.4; });
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6} position={position}>
      <group ref={g}>
        {/* serum bottle */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.55, 32]} />
          <meshPhysicalMaterial
            color="#f3d6c8"
            roughness={0.05}
            metalness={0}
            transmission={0.85}
            thickness={0.5}
            ior={1.4}
            attenuationColor="#f4c8b3"
            attenuationDistance={0.6}
          />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.18, 32]} />
          <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.2} />
        </mesh>
        {/* halo ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
          <ringGeometry args={[0.35, 0.4, 64]} />
          <meshBasicMaterial color="#e7c98a" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

function Chandelier({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <torusGeometry args={[0.6, 0.02, 16, 64]} />
        <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.25} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.6, -0.85, Math.sin(a) * 0.6]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#fff1cc" emissive="#f6d894" emissiveIntensity={2} />
          </mesh>
        );
      })}
      <pointLight position={[0, -0.85, 0]} intensity={2.2} color="#ffe4b5" distance={10} decay={2} />
    </group>
  );
}

function Hotspot({ pos, label, onClick }: { pos: [number, number, number]; label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <group position={pos}>
      <Html center distanceFactor={8} zIndexRange={[10, 0]}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="group relative flex items-center gap-2"
        >
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.09_85)] opacity-60" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[oklch(0.82_0.09_85)] ring-2 ring-[oklch(0.96_0.01_80)]/40" />
          </span>
          <span
            className={`whitespace-nowrap rounded-sm border border-[oklch(0.82_0.09_85)]/40 bg-black/70 px-3 py-1 font-[Cormorant_Garamond] text-sm tracking-[0.2em] uppercase text-[oklch(0.96_0.01_80)] backdrop-blur transition-all ${
              hover ? "opacity-100 translate-x-0" : "opacity-80 -translate-x-1"
            }`}
          >
            {label}
          </span>
        </button>
      </Html>
    </group>
  );
}

function CameraRig({ scroll }: { scroll: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.5, 0));

  // Path: street -> entry -> lobby -> main floor -> VIP back
  const waypoints = useMemo<{ p: THREE.Vector3; l: THREE.Vector3 }[]>(() => [
    { p: new THREE.Vector3(0, 2.2, 14), l: new THREE.Vector3(0, 1.8, 0) },
    { p: new THREE.Vector3(0, 1.8, 6), l: new THREE.Vector3(0, 1.6, -2) },
    { p: new THREE.Vector3(-4, 1.7, 2.5), l: new THREE.Vector3(-3.2, 1.4, -1.5) },
    { p: new THREE.Vector3(4, 1.7, 2), l: new THREE.Vector3(3.2, 1.2, -0.5) },
    { p: new THREE.Vector3(0, 1.9, -1.5), l: new THREE.Vector3(0, 1.6, -6) },
    { p: new THREE.Vector3(0, 1.7, -3), l: new THREE.Vector3(0, 1.6, -7.8) },
  ], []);

  useFrame(() => {
    const t = Math.min(0.9999, Math.max(0, scroll)) * (waypoints.length - 1);
    const i = Math.floor(t);
    const f = t - i;
    const a = waypoints[i];
    const b = waypoints[Math.min(i + 1, waypoints.length - 1)];
    const ease = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
    const pos = a.p.clone().lerp(b.p, ease);
    const look = a.l.clone().lerp(b.l, ease);
    camera.position.lerp(pos, 0.08);
    target.current.lerp(look, 0.08);
    camera.lookAt(target.current);
  });

  return null;
}

export default function SalonScene({ scroll, onHotspot }: SalonSceneProps) {
  return (
    <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <PerspectiveCamera makeDefault fov={45} position={[0, 2.2, 14]} />
      <CameraRig scroll={scroll} />

      <Suspense fallback={null}>
        <color attach="background" args={["#0a0908"]} />
        <fog attach="fog" args={["#0a0908", 12, 28]} />

        <ambientLight intensity={0.25} color="#fff1d8" />
        <directionalLight position={[5, 10, 5]} intensity={0.6} color="#ffe4b5" castShadow />
        <spotLight position={[0, 6, 4]} angle={0.6} penumbra={0.8} intensity={1.2} color="#fff0d0" castShadow />

        <MarbleFloor />
        <Walls />

        {/* Hair atelier — left side */}
        <Vanity position={[-3.2, 0, -2]} />
        <VelvetChair position={[-3.2, 0, -1]} rotation={Math.PI} color="#3a1722" />
        <Vanity position={[-5.5, 0, -2]} />
        <VelvetChair position={[-5.5, 0, -1]} rotation={Math.PI} color="#3a1722" />

        {/* Nails bar — right */}
        <mesh position={[3.5, 0.45, -1]} castShadow>
          <boxGeometry args={[3, 0.9, 0.7]} />
          <meshStandardMaterial color="#0f0d0c" roughness={0.35} metalness={0.3} />
        </mesh>
        <mesh position={[3.5, 0.92, -1]}>
          <boxGeometry args={[3.05, 0.04, 0.75]} />
          <meshStandardMaterial color="#d4af6a" metalness={1} roughness={0.25} />
        </mesh>
        <VelvetChair position={[2.7, 0, 0.1]} rotation={-Math.PI} color="#d9b8c2" />
        <VelvetChair position={[4.2, 0, 0.1]} rotation={-Math.PI} color="#d9b8c2" />

        {/* Facial suite — back center */}
        <mesh position={[0, 0.5, -6]} castShadow>
          <boxGeometry args={[2.4, 0.5, 1]} />
          <meshStandardMaterial color="#1a0f12" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.85, -6]} castShadow>
          <boxGeometry args={[2.4, 0.2, 1]} />
          <meshStandardMaterial color="#d9b8c2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.97, -6.4]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.2]} />
          <meshStandardMaterial color="#f4d8c0" roughness={0.5} />
        </mesh>

        {/* Reception + product display */}
        <ReceptionDesk />
        <HoloProduct position={[0, 2.2, 2]} />

        <Chandelier position={[0, 7.5, 0]} />
        <Chandelier position={[-4, 7.5, -3]} />
        <Chandelier position={[4, 7.5, -3]} />

        {/* Hotspots */}
        {HOTSPOTS.map((h) => (
          <Hotspot key={h.id} pos={h.pos} label={h.label} onClick={() => onHotspot(h.id)} />
        ))}

        <ContactShadows position={[0, 0.01, 0]} opacity={0.45} blur={2.5} far={10} />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}

export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}
