import React, { useMemo } from "react";
import * as THREE from "three";

type V3 = [number, number, number];

/* ---------------- Estrella dorada 3D ---------------- */
const starShape = (() => {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 1 : 0.45;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
})();
const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.09, bevelSegments: 4, curveSegments: 4 });
starGeo.center();

export const GOLD = { color: "#E8B84A", metalness: 1, roughness: 0.22 };
export const Star3D: React.FC<{ position?: V3; rotation?: V3; scale?: number; dim?: number; emissive?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, dim = 0, emissive = 0 }) => (
  <mesh geometry={starGeo} position={position} rotation={rotation} scale={scale} castShadow>
    <meshStandardMaterial
      color={dim ? new THREE.Color("#E8B84A").lerp(new THREE.Color("#8C8676"), dim) : "#E8B84A"}
      metalness={1 - dim * 0.7}
      roughness={0.22 + dim * 0.4}
      emissive="#FFB733"
      emissiveIntensity={emissive}
    />
  </mesh>
);

/* ---------------- Vaso de café 3D (genérico, sin marca) ---------------- */
const lathe = (pts: [number, number][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const cupBody = lathe([
  [0, 0],
  [0.62, 0],
  [0.64, 0.04],
  [0.86, 2.3],
  [0.88, 2.34],
  [0, 2.34],
]);
const sleeve = lathe([
  [0.728, 0.85],
  [0.818, 1.75],
  [0.83, 1.75],
  [0.74, 0.85],
  [0.728, 0.85],
]);
const lid = lathe([
  [0, 2.62],
  [0.62, 2.6],
  [0.86, 2.48],
  [0.95, 2.42],
  [0.95, 2.32],
  [0.86, 2.3],
  [0, 2.3],
]);
export const Cup3D: React.FC<{ position?: V3; rotation?: V3; scale?: number; fade?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, fade = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={cupBody} castShadow receiveShadow>
      <meshPhysicalMaterial color="#F6F1E6" roughness={0.45} clearcoat={0.4} clearcoatRoughness={0.3} transparent={fade < 1} opacity={fade} />
    </mesh>
    <mesh geometry={sleeve} castShadow>
      <meshStandardMaterial color="#0F5A44" roughness={0.75} side={THREE.DoubleSide} transparent={fade < 1} opacity={fade} />
    </mesh>
    <mesh geometry={lid} castShadow>
      <meshPhysicalMaterial color="#1B1B1B" roughness={0.35} clearcoat={0.6} transparent={fade < 1} opacity={fade} />
    </mesh>
    {/* estrella en la faja */}
    <group position={[0, 1.3, 0.82]} rotation={[0.04, 0, 0]}>
      <Star3D scale={0.2} />
    </group>
  </group>
);

/* ---------------- Persona (ícono 3D) que se ilumina en dorado ---------------- */
export const Member: React.FC<{ position: V3; on: number; scale?: number }> = ({ position, on, scale = 1 }) => {
  const col = useMemo(() => new THREE.Color(), []);
  col.set("#2F5D4E").lerp(new THREE.Color("#E8B84A"), Math.min(1, on));
  const pop = 1 + 0.25 * Math.sin(Math.min(1, on) * Math.PI);
  return (
    <group position={position} scale={scale * pop}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.32, 6, 16]} />
        <meshStandardMaterial color={col} metalness={on > 0.5 ? 0.85 : 0.1} roughness={on > 0.5 ? 0.3 : 0.7} emissive="#FFB733" emissiveIntensity={0.25 * Math.min(1, on)} />
      </mesh>
      <mesh position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 18]} />
        <meshStandardMaterial color={col} metalness={on > 0.5 ? 0.85 : 0.1} roughness={on > 0.5 ? 0.3 : 0.7} emissive="#FFB733" emissiveIntensity={0.25 * Math.min(1, on)} />
      </mesh>
    </group>
  );
};

/* ---------------- Moneda dorada ---------------- */
export const Coin: React.FC<{ position: V3; rotation: V3; scale?: number }> = ({ position, rotation, scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
      <meshStandardMaterial {...GOLD} />
    </mesh>
    <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.2, 0.24, 32]} />
      <meshStandardMaterial {...GOLD} roughness={0.4} />
    </mesh>
  </group>
);

/** Piso que solo recibe sombra (invisible). */
export const ShadowFloor: React.FC<{ y?: number; opacity?: number }> = ({ y = 0, opacity = 0.35 }) => (
  <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[40, 40]} />
    <shadowMaterial opacity={opacity} />
  </mesh>
);

/** Pedestal cilíndrico (vitrina). */
export const Pedestal: React.FC<{ position: V3; color: string; glow?: number }> = ({ position, color, glow = 0 }) => (
  <group position={position}>
    <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.25, 1.35, 0.6, 64]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.2} />
    </mesh>
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.12, 1.25, 64]} />
      <meshStandardMaterial color="#E8B84A" metalness={1} roughness={0.25} emissive="#FFB733" emissiveIntensity={glow} />
    </mesh>
  </group>
);
