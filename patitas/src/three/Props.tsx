import React from "react";
import * as THREE from "three";
import { getGlow } from "./textures";

type V3 = [number, number, number];

/** Halo aditivo siempre de frente a la cámara (falso "bloom"). */
export const Glow: React.FC<{ position: V3; size: number; color: string; opacity?: number }> = ({ position, size, color, opacity = 0.8 }) => (
  <sprite position={position} scale={[size, size, size]} renderOrder={10}>
    <spriteMaterial map={getGlow()} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
  </sprite>
);

/** Charco de luz sobre el piso (decal aditivo). */
export const LightPool: React.FC<{ position: V3; size: [number, number]; color: string; opacity?: number }> = ({ position, size, color, opacity = 0.5 }) => (
  <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
    <planeGeometry args={size} />
    <meshBasicMaterial map={getGlow()} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
  </mesh>
);

export const Table: React.FC<{ position: V3; top?: string; cups?: number }> = ({ position, top = "#d9c3a0", cups = 2 }) => (
  <group position={position}>
    <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.46, 0.46, 0.04, 28]} />
      <meshStandardMaterial color={top} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.37, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 0.72, 10]} />
      <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.22, 0.22, 0.03, 18]} />
      <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
    </mesh>
    {Array.from({ length: cups }).map((_, i) => (
      <mesh key={i} position={[Math.cos(i * 2.4) * 0.22, 0.8, Math.sin(i * 2.4) * 0.22]} castShadow>
        <cylinderGeometry args={[0.045, 0.035, 0.09, 12]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.3} />
      </mesh>
    ))}
  </group>
);

export const Chair: React.FC<{ position: V3; rot?: number; color?: string }> = ({ position, rot = 0, color = "#3b2a20" }) => (
  <group position={position} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.42, 0.05, 0.42]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
    <mesh position={[0, 0.72, -0.19]} castShadow>
      <boxGeometry args={[0.42, 0.48, 0.04]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
    {[
      [-0.18, -0.18],
      [0.18, -0.18],
      [-0.18, 0.18],
      [0.18, 0.18],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.22, z]}>
        <cylinderGeometry args={[0.018, 0.018, 0.44, 6]} />
        <meshStandardMaterial color="#1c1c1c" />
      </mesh>
    ))}
  </group>
);

const SKINS = ["#8d5a3b", "#c68a64", "#e0b08c", "#6b4430", "#b07850", "#f0c8a4"];
const HAIRS = ["#1b120d", "#3a2316", "#5a3a22", "#141414", "#7a5a3a", "#2b1d14"];

/**
 * Persona estilizada (cápsulas + esferas). `seat` la sienta (altura de silla 0.47);
 * `walk` = fase de la caminata en radianes (undefined = quieta).
 */
export const Person: React.FC<{
  position: V3;
  rot?: number;
  seat?: boolean;
  walk?: number;
  shirt: string;
  pants?: string;
  seed?: number;
  scale?: number;
  phone?: boolean;
  lookDown?: boolean;
}> = ({ position, rot = 0, seat = false, walk, shirt, pants = "#2a2f3a", seed = 0, scale = 1, phone = false, lookDown = false }) => {
  const skin = SKINS[seed % SKINS.length];
  const hair = HAIRS[(seed * 7 + 3) % HAIRS.length];
  const swing = walk === undefined ? 0 : Math.sin(walk) * 0.55;
  const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk)) * 0.035;
  const hipY = seat ? 0.5 : 0.86;
  return (
    <group position={position} rotation={[0, rot, 0]} scale={scale}>
      {/* sombra de contacto */}
      {!seat ? (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.32, 20]} />
          <meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} />
        </mesh>
      ) : null}
      <group position={[0, bob, 0]}>
        {/* piernas */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.1, hipY, 0]} rotation={[seat ? -Math.PI / 2 : side * swing, 0, 0]}>
            <mesh position={[0, seat ? -0.22 : -0.42, 0]} castShadow>
              <capsuleGeometry args={[0.085, seat ? 0.3 : 0.62, 4, 8]} />
              <meshStandardMaterial color={pants} roughness={0.8} />
            </mesh>
            {seat ? (
              <mesh position={[0, -0.42, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <capsuleGeometry args={[0.075, 0.36, 4, 8]} />
                <meshStandardMaterial color={pants} roughness={0.8} />
              </mesh>
            ) : null}
          </group>
        ))}
        {/* torso */}
        <mesh position={[0, hipY + 0.32, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.36, 6, 12]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        {/* brazos */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.25, hipY + 0.52, 0]} rotation={[phone && side === 1 ? -1.0 : -side * swing * 0.8 + (seat ? -0.7 : 0), 0, side * 0.08]}>
            <mesh position={[0, -0.24, 0]} castShadow>
              <capsuleGeometry args={[0.06, 0.38, 4, 8]} />
              <meshStandardMaterial color={shirt} roughness={0.75} />
            </mesh>
          </group>
        ))}
        {phone ? (
          <mesh position={[0.22, hipY + 0.38, 0.32]} rotation={[-0.6, 0, 0]}>
            <boxGeometry args={[0.08, 0.15, 0.015]} />
            <meshStandardMaterial color="#111" emissive="#7fb4ff" emissiveIntensity={0.9} />
          </mesh>
        ) : null}
        {/* cabeza */}
        <group position={[0, hipY + 0.78, 0]} rotation={[lookDown ? 0.35 : 0, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.135, 18, 14]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.04, -0.02]} scale={[1.05, 0.85, 1.05]}>
            <sphereGeometry args={[0.135, 18, 14, 0, Math.PI * 2, 0, Math.PI / 1.9]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/** Lámpara colgante de café (pantalla + bombillo emisivo + halo). */
export const Pendant: React.FC<{ position: V3; color: string; on?: number }> = ({ position, color, on = 1 }) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.006, 0.006, 1, 4]} />
      <meshBasicMaterial color="#111" />
    </mesh>
    <mesh>
      <coneGeometry args={[0.22, 0.22, 20, 1, true]} />
      <meshStandardMaterial color="#1f1a16" side={THREE.DoubleSide} metalness={0.4} roughness={0.5} />
    </mesh>
    <mesh position={[0, -0.08, 0]}>
      <sphereGeometry args={[0.07, 12, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
    <Glow position={[0, -0.12, 0]} size={1.6} color={color} opacity={0.55 * on} />
  </group>
);

export const Plant: React.FC<{ position: V3; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.22, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.16, 0.44, 14]} />
      <meshStandardMaterial color="#c9b49a" roughness={0.8} />
    </mesh>
    {[
      [0, 0.75, 0, 0.32],
      [0.14, 0.62, 0.08, 0.24],
      [-0.12, 0.6, -0.06, 0.25],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial color={i ? "#2f6b3e" : "#3a7d48"} roughness={0.9} flatShading />
      </mesh>
    ))}
  </group>
);

/** Poste de alumbrado con luz cálida hacia abajo. */
export const StreetLamp: React.FC<{ position: V3; rot?: number; light?: boolean }> = ({ position, rot = 0, light = true }) => (
  <group position={position} rotation={[0, rot, 0]}>
    <mesh position={[0, 2.6, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.08, 5.2, 10]} />
      <meshStandardMaterial color="#20262c" metalness={0.5} roughness={0.5} />
    </mesh>
    <mesh position={[0, 5.15, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
      <meshStandardMaterial color="#20262c" metalness={0.5} roughness={0.5} />
    </mesh>
    <mesh position={[0, 5.08, 1.05]}>
      <boxGeometry args={[0.36, 0.08, 0.2]} />
      <meshBasicMaterial color="#fff1d6" toneMapped={false} />
    </mesh>
    <Glow position={[0, 4.95, 1.05]} size={2.6} color="#ffd9a0" opacity={0.6} />
    {light ? <pointLight position={[0, 4.7, 1.05]} intensity={9} distance={9} decay={1.6} color="#ffd29a" /> : null}
    <LightPool position={[0, 0.03, 1.05]} size={[6, 6]} color="#ffc98a" opacity={0.28} />
  </group>
);

export const Tree: React.FC<{ position: V3; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.9, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.1, 1.8, 8]} />
      <meshStandardMaterial color="#2a1d14" />
    </mesh>
    {[
      [0, 2.2, 0, 0.9],
      [0.4, 1.9, 0.2, 0.6],
      [-0.35, 2.0, -0.2, 0.65],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial color="#163a26" roughness={0.95} flatShading />
      </mesh>
    ))}
  </group>
);
