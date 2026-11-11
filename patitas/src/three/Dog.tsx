import React from "react";
import * as THREE from "three";

type V3 = [number, number, number];

/**
 * Rocky: schnauzer 3D hecho con primitivas (sin modelos externos). Mira hacia +z.
 * - `pose`: "sit" (sentado, de frente) o "walk" (de pie; `walk` es la fase del paso).
 * - `wag` velocidad/fuerza de la cola, `tilt` inclinación de la cabeza, `yaw` giro de la cabeza,
 *   `happy` abre la boca y saca la lengua, `bow` escala del moñito, `wet` lo oscurece (mojado),
 *   `squash` aplasta/estira el cuerpo (salto), `blink` cierra los ojos.
 */
const GREY = "#7D858C";
const DARK = "#4E555B";
const LIGHT = "#E9E7E1";
const fur = (c: string, wet: number) => new THREE.Color(c).lerp(new THREE.Color("#3A4045"), wet * 0.45);

const Head: React.FC<{ tilt: number; yaw: number; happy: number; bow: number; wet: number; blink: number; t: number }> = ({ tilt, yaw, happy, bow, wet, blink, t }) => {
  const g = fur(GREY, wet);
  const l = fur(LIGHT, wet * 0.6);
  return (
    <group rotation={[0.05 - happy * 0.08, yaw, tilt]}>
      {/* cráneo */}
      <mesh castShadow scale={[1, 0.95, 1.05]}>
        <sphereGeometry args={[0.25, 32, 24]} />
        <meshStandardMaterial color={g} roughness={0.9} />
      </mesh>
      {/* hocico */}
      <mesh position={[0, -0.07, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.12, 8, 16]} />
        <meshStandardMaterial color={l} roughness={0.95} />
      </mesh>
      {/* barba de schnauzer */}
      <mesh position={[0, -0.17, 0.24]} scale={[1.1, 1.1, 0.9]} castShadow>
        <sphereGeometry args={[0.13, 20, 16]} />
        <meshStandardMaterial color={l} roughness={1} />
      </mesh>
      {/* nariz */}
      <mesh position={[0, -0.03, 0.37]} scale={[1.2, 0.9, 1]}>
        <sphereGeometry args={[0.05, 16, 12]} />
        <meshStandardMaterial color="#141414" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* boca / lengua */}
      {happy > 0.05 ? (
        <>
          <mesh position={[0, -0.16, 0.33]} scale={[1, 0.6 * happy, 0.6]}>
            <sphereGeometry args={[0.06, 16, 12]} />
            <meshStandardMaterial color="#3A1C1C" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.2 - 0.03 * happy, 0.34]} rotation={[0.5, 0, 0]} scale={[0.8, 0.35 + 0.65 * happy, 0.4]}>
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshStandardMaterial color="#F07A8A" roughness={0.45} />
          </mesh>
        </>
      ) : null}
      {/* ojos */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.1, 0.05, 0.2]}>
          <mesh scale={[1, Math.max(0.08, 1 - blink), 1]}>
            <sphereGeometry args={[0.045, 16, 12]} />
            <meshStandardMaterial color="#101010" roughness={0.15} />
          </mesh>
          {blink < 0.5 ? (
            <mesh position={[side * 0.012 + 0.008, 0.016, 0.036]}>
              <sphereGeometry args={[0.012, 8, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ) : null}
          {/* cejas tupidas */}
          <mesh position={[side * 0.01, 0.065, 0.02]} rotation={[0, 0, side * -0.25 + Math.sin(t * 2) * 0.05]} scale={[1.6, 0.55, 0.8]}>
            <sphereGeometry args={[0.05, 12, 10]} />
            <meshStandardMaterial color={l} roughness={1} />
          </mesh>
        </group>
      ))}
      {/* orejas dobladas */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.19, 0.13, 0.08]} rotation={[2.3, side * 0.15, side * 0.55 + Math.sin(t * 3 + side) * 0.06]} scale={[1, 1, 0.4]} castShadow>
          <coneGeometry args={[0.11, 0.22, 16]} />
          <meshStandardMaterial color={fur(DARK, wet)} roughness={0.9} />
        </mesh>
      ))}
      {/* moñito menta */}
      {bow > 0.01 ? (
        <group position={[0.11, 0.24, 0.06]} rotation={[0.2, 0, -0.35]} scale={bow}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.065, 0, 0]} rotation={[0, 0, side * Math.PI / 2]} scale={[1, 1, 0.6]}>
              <coneGeometry args={[0.055, 0.12, 16]} />
              <meshStandardMaterial color="#69D3BE" roughness={0.35} />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.03, 12, 10]} />
            <meshStandardMaterial color="#16705D" roughness={0.35} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

const Tail: React.FC<{ wag: number; t: number; wet: number }> = ({ wag, t, wet }) => (
  <group rotation={[0.9, 0, Math.sin(t * (6 + wag * 14)) * (0.15 + 0.55 * wag)]}>
    <mesh position={[0, 0.1, 0]} castShadow>
      <capsuleGeometry args={[0.04, 0.16, 6, 10]} />
      <meshStandardMaterial color={fur(DARK, wet)} roughness={0.9} />
    </mesh>
  </group>
);

const Collar: React.FC<{ y: number; z?: number; r?: number }> = ({ y, z = 0, r = 0.17 }) => (
  <group position={[0, y, z]}>
    <mesh rotation={[Math.PI / 2 - 0.25, 0, 0]}>
      <torusGeometry args={[r, 0.028, 12, 40]} />
      <meshStandardMaterial color="#16705D" roughness={0.4} />
    </mesh>
    <mesh position={[0, -0.05, r + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.012, 24]} />
      <meshStandardMaterial color="#E8B84A" metalness={1} roughness={0.25} />
    </mesh>
  </group>
);

export const Dog3D: React.FC<{
  position?: V3;
  rotation?: V3;
  scale?: number;
  pose?: "sit" | "walk";
  walk?: number;
  wag?: number;
  tilt?: number;
  yaw?: number;
  happy?: number;
  bow?: number;
  wet?: number;
  squash?: number;
  blink?: number;
  t: number;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, pose = "sit", walk = 0, wag = 0.5, tilt = 0, yaw = 0, happy = 0, bow = 1, wet = 0, squash = 0, blink = 0, t }) => {
  const g = fur(GREY, wet);
  const l = fur(LIGHT, wet * 0.6);
  const sq: V3 = [1 + squash * 0.12, 1 - squash * 0.15, 1 + squash * 0.12];
  if (pose === "walk") {
    const bob = Math.abs(Math.sin(walk)) * 0.03;
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 24]} />
          <meshBasicMaterial color="#000" transparent opacity={0.25} depthWrite={false} />
        </mesh>
        <group position={[0, bob, 0]}>
          {/* cuerpo horizontal */}
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.2, 0.42, 8, 16]} />
            <meshStandardMaterial color={g} roughness={0.9} />
          </mesh>
          {/* patas */}
          {[
            [-0.12, 0.22, 1],
            [0.12, 0.22, -1],
            [-0.12, -0.22, -1],
            [0.12, -0.22, 1],
          ].map(([x, z, ph], i) => (
            <group key={i} position={[x, 0.42, z]} rotation={[Math.sin(walk) * 0.5 * ph, 0, 0]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                <capsuleGeometry args={[0.065, 0.28, 6, 10]} />
                <meshStandardMaterial color={l} roughness={0.95} />
              </mesh>
            </group>
          ))}
          <Collar y={0.7} z={0.32} r={0.13} />
          <group position={[0, 0.85, 0.42]} scale={0.85}>
            <Head tilt={tilt} yaw={yaw} happy={happy} bow={bow} wet={wet} blink={blink} t={t} />
          </group>
          <group position={[0, 0.62, -0.38]}>
            <Tail wag={wag} t={t} wet={wet} />
          </group>
        </group>
      </group>
    );
  }
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <group scale={sq}>
        {/* cadera y muslos */}
        <mesh position={[0, 0.27, -0.1]} scale={[1, 0.85, 1.05]} castShadow>
          <sphereGeometry args={[0.3, 24, 18]} />
          <meshStandardMaterial color={g} roughness={0.9} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.22, 0.16, -0.02]} scale={[0.7, 0.75, 1.15]} castShadow>
            <sphereGeometry args={[0.18, 18, 14]} />
            <meshStandardMaterial color={g} roughness={0.9} />
          </mesh>
        ))}
        {/* pecho */}
        <mesh position={[0, 0.55, 0.05]} rotation={[-0.25, 0, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.26, 8, 18]} />
          <meshStandardMaterial color={g} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.52, 0.18]} scale={[0.85, 1.2, 0.6]}>
          <sphereGeometry args={[0.16, 18, 14]} />
          <meshStandardMaterial color={l} roughness={1} />
        </mesh>
        {/* patas delanteras */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.11, 0.22, 0.19]} castShadow>
              <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
              <meshStandardMaterial color={l} roughness={0.95} />
            </mesh>
            <mesh position={[side * 0.11, 0.045, 0.24]} scale={[1, 0.7, 1.3]}>
              <sphereGeometry args={[0.08, 14, 10]} />
              <meshStandardMaterial color={l} roughness={0.95} />
            </mesh>
          </group>
        ))}
        <Collar y={0.76} z={0.06} />
        <group position={[0, 0.98, 0.1]}>
          <Head tilt={tilt} yaw={yaw} happy={happy} bow={bow} wet={wet} blink={blink} t={t} />
        </group>
        <group position={[0, 0.3, -0.4]}>
          <Tail wag={wag} t={t} wet={wet} />
        </group>
      </group>
    </group>
  );
};

/** Bañera blanca con patas doradas, agua y espuma. */
export const Tub: React.FC<{ foam: number; t: number }> = ({ foam, t }) => (
  <group>
    <mesh position={[0, 0.32, 0]} scale={[1, 1, 0.62]} castShadow receiveShadow>
      <cylinderGeometry args={[0.95, 0.8, 0.62, 48, 1, true]} />
      <meshPhysicalMaterial color="#FFFFFF" roughness={0.2} clearcoat={1} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.63, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.62, 1]}>
      <torusGeometry args={[0.95, 0.05, 12, 64]} />
      <meshPhysicalMaterial color="#FFFFFF" roughness={0.15} clearcoat={1} />
    </mesh>
    <mesh position={[0, 0.03, 0]} scale={[1, 1, 0.62]}>
      <cylinderGeometry args={[0.8, 0.8, 0.04, 48]} />
      <meshStandardMaterial color="#F2F2F2" />
    </mesh>
    <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.92, 0.57, 1]}>
      <circleGeometry args={[1, 48]} />
      <meshPhysicalMaterial color="#8FD3E8" roughness={0.05} transparent opacity={0.75} clearcoat={1} />
    </mesh>
    {[
      [-0.62, -0.32],
      [0.62, -0.32],
      [-0.62, 0.32],
      [0.62, 0.32],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.02, z]}>
        <sphereGeometry args={[0.07, 14, 10]} />
        <meshStandardMaterial color="#E8B84A" metalness={1} roughness={0.25} />
      </mesh>
    ))}
    {/* espuma */}
    {Array.from({ length: 34 }).map((_, i) => {
      const a = (i / 34) * Math.PI * 2 * 3.1;
      const r = 0.25 + ((i * 37) % 10) / 16;
      const x = Math.cos(a) * r * 0.85;
      const z = Math.sin(a) * r * 0.5;
      if (Math.abs(x) > 0.85 || Math.abs(z) > 0.5) return null;
      const s = (0.07 + ((i * 13) % 7) / 60) * foam * (1 + 0.08 * Math.sin(t * 3 + i));
      return (
        <mesh key={i} position={[x, 0.56 + ((i * 7) % 5) / 40, z]} scale={s}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.1} clearcoat={1} transparent opacity={0.92} />
        </mesh>
      );
    })}
  </group>
);

/** Burbujas que suben (alrededor de `center`). */
export const Bubbles: React.FC<{ t: number; n?: number; center?: V3; spread?: number; on?: number }> = ({ t, n = 16, center = [0, 0.6, 0], spread = 1.2, on = 1 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const life = (t * (0.35 + (i % 5) * 0.06) + i * 0.137) % 1;
      const x = center[0] + Math.sin(i * 12.9) * spread * 0.6 + Math.sin(t * 2 + i) * 0.05;
      const z = center[2] + Math.cos(i * 7.3) * spread * 0.3;
      const y = center[1] + life * 1.6;
      const r = (0.03 + (i % 4) * 0.015) * on * (1 - life * 0.3);
      if (r <= 0.002) return null;
      return (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 12, 10]} />
          <meshPhysicalMaterial color="#DFF6FF" roughness={0} clearcoat={1} transparent opacity={0.55 * (1 - life)} />
        </mesh>
      );
    })}
  </>
);

/** Confeti 3D que estalla desde `origin` en el segundo `at`. */
export const Confetti: React.FC<{ t: number; at: number; origin: V3; n?: number }> = ({ t, at, origin, n = 40 }) => {
  const k = t - at;
  if (k < 0 || k > 2.6) return null;
  const cols = ["#69D3BE", "#E8B84A", "#E0607E", "#8DB4FF", "#FFFFFF"];
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = i * 2.399;
        const up = 2.2 + (i % 7) * 0.35;
        const sp = 0.8 + (i % 5) * 0.35;
        const x = origin[0] + Math.cos(a) * sp * k;
        const z = origin[2] + Math.sin(a) * sp * k * 0.6;
        const y = origin[1] + up * k - 2.6 * k * k;
        return (
          <mesh key={i} position={[x, y, z]} rotation={[k * 7 + i, k * 5, i]}>
            <planeGeometry args={[0.07, 0.11]} />
            <meshStandardMaterial color={cols[i % cols.length]} side={THREE.DoubleSide} roughness={0.4} />
          </mesh>
        );
      })}
    </>
  );
};
