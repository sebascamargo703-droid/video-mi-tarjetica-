import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Plate, useTex } from "./Devices";
import { Glow } from "./Props";

type V3 = [number, number, number];

/* ------------------------------------------------------------------ */
/**
 * Un "Tarjetico": trabajador cubito menta con ojos, cachetes y patitas. Mira hacia +z.
 * `tool`: lo que tiene en la mano o en la cabeza. `act` 0–1 es la acción del momento
 * (sellar, mirar por los binoculares…); `type` mueve los brazos como tecleando.
 */
export type Tool = "stamp" | "party" | "binoculars" | "star" | "headset" | "none";
const bodyGeo = new RoundedBoxGeometry(0.52, 0.5, 0.44, 5, 0.12);

export const Tarjetico: React.FC<{ position?: V3; rotation?: V3; scale?: number; color?: string; tool?: Tool; t: number; act?: number; type?: number; seed?: number; happy?: number; blink?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#69D3BE",
  tool = "none",
  t,
  act = 0,
  type = 1,
  seed = 0,
  happy = 0,
  blink = 0,
}) => {
  const bob = Math.abs(Math.sin(t * 6 + seed)) * 0.015 + act * 0.05;
  const armL = -0.9 - type * 0.25 * Math.sin(t * 18 + seed) - (tool === "stamp" ? act * 1.6 : 0);
  const armR = -0.9 - type * 0.25 * Math.sin(t * 18 + seed + 1.7) - (tool === "binoculars" ? act * 0.9 : 0) - (tool === "star" ? act * 1.4 : 0);
  const eye = Math.max(0.1, 1 - blink);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 0.08, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.08, 4, 8]} />
          <meshStandardMaterial color="#0E5244" roughness={0.6} />
        </mesh>
      ))}
      <group position={[0, 0.42 + bob, 0]} rotation={[act * -0.12 + Math.sin(t * 2 + seed) * 0.03, 0, Math.sin(t * 1.4 + seed) * 0.04]}>
        <mesh geometry={bodyGeo} castShadow>
          <meshStandardMaterial color={color} roughness={0.45} />
        </mesh>
        {/* cara */}
        {[-0.11, 0.11].map((x) => (
          <group key={x} position={[x, 0.05, 0.222]}>
            <mesh scale={[1, eye, 1]}>
              <sphereGeometry args={[0.045, 16, 12]} />
              <meshStandardMaterial color="#0B1A16" roughness={0.2} />
            </mesh>
            {eye > 0.5 ? (
              <mesh position={[0.014, 0.016, 0.035]}>
                <sphereGeometry args={[0.012, 8, 6]} />
                <meshBasicMaterial color="#fff" />
              </mesh>
            ) : null}
          </group>
        ))}
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, -0.04, 0.222]} scale={[1, 0.6, 0.3]}>
            <sphereGeometry args={[0.04, 12, 8]} />
            <meshStandardMaterial color="#F59AA8" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, -0.05, 0.224]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.045 + happy * 0.01, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0B1A16" />
        </mesh>
        {/* brazos */}
        {[
          [-0.29, armL],
          [0.29, armR],
        ].map(([x, a], i) => (
          <group key={i} position={[x, 0.0, 0.02]} rotation={[a, 0, 0]}>
            <mesh position={[0, -0.12, 0]} castShadow>
              <capsuleGeometry args={[0.04, 0.16, 4, 8]} />
              <meshStandardMaterial color={color} roughness={0.45} />
            </mesh>
            {i === 0 && tool === "stamp" ? (
              <group position={[0, -0.26, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
                  <meshStandardMaterial color="#8B5A2B" roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.08, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.04, 20]} />
                  <meshStandardMaterial color="#C8382F" roughness={0.4} />
                </mesh>
              </group>
            ) : null}
            {i === 1 && tool === "star" ? (
              <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, t * 2]}>
                <cylinderGeometry args={[0.09, 0.09, 0.03, 5]} />
                <meshStandardMaterial color="#E8B84A" metalness={0.9} roughness={0.25} emissive="#E8B84A" emissiveIntensity={0.2} />
              </mesh>
            ) : null}
          </group>
        ))}
        {/* accesorios de cabeza */}
        {tool === "party" ? (
          <group position={[0.06, 0.37, 0]} rotation={[0, 0, -0.2]}>
            <mesh>
              <coneGeometry args={[0.11, 0.26, 16]} />
              <meshStandardMaterial color="#E0607E" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <sphereGeometry args={[0.035, 10, 8]} />
              <meshStandardMaterial color="#FFD98A" />
            </mesh>
          </group>
        ) : null}
        {tool === "headset" ? (
          <group>
            <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.27, 0.02, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#1B1D20" />
            </mesh>
            {[-0.27, 0.27].map((x) => (
              <mesh key={x} position={[x, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
                <meshStandardMaterial color="#1B1D20" />
              </mesh>
            ))}
            <mesh position={[0.2, -0.04, 0.2]} rotation={[0, 0.6, 0]}>
              <capsuleGeometry args={[0.012, 0.16, 4, 6]} />
              <meshStandardMaterial color="#1B1D20" />
            </mesh>
          </group>
        ) : null}
        {tool === "binoculars" && act > 0.05 ? (
          <group position={[0, 0.06, 0.26 + 0.04 * act]}>
            {[-0.1, 0.1].map((x) => (
              <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.14, 14]} />
                <meshStandardMaterial color="#222" metalness={0.5} roughness={0.3} />
              </mesh>
            ))}
          </group>
        ) : null}
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/** Escritorio con monitor (pantalla con textura), teclado, taza y letrero. */
export const Desk: React.FC<{ position: V3; rotation?: V3; screens: [string, number][]; label?: string; glow?: number }> = ({ position, rotation = [0, 0, 0], screens, label, glow = 0 }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.6, 0.06, 0.8]} />
      <meshStandardMaterial color="#C99A6B" roughness={0.55} />
    </mesh>
    {[
      [-0.74, -0.34],
      [0.74, -0.34],
      [-0.74, 0.34],
      [0.74, 0.34],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.37, z]}>
        <boxGeometry args={[0.05, 0.74, 0.05]} />
        <meshStandardMaterial color="#5A3D27" />
      </mesh>
    ))}
    {/* monitor */}
    <group position={[0, 1.22, -0.2]}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.72, 0.05]} />
        <meshStandardMaterial color="#15191C" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[1.02, 0.633]} />
        <meshBasicMaterial color="#0A1714" toneMapped={false} />
      </mesh>
      {screens.map(([src, o], i) => (
        <ScreenPlane key={src} src={src} o={o} w={1.02} h={0.633} z={0.028 + i * 0.0006} />
      ))}
      <mesh position={[0, -0.45, 0.02]}>
        <boxGeometry args={[0.08, 0.2, 0.04]} />
        <meshStandardMaterial color="#15191C" />
      </mesh>
      {glow > 0 ? <pointLight position={[0, 0, 0.6]} intensity={2.5 * glow} distance={2.5} color="#8FE3C0" /> : null}
    </group>
    <mesh position={[0, 0.79, 0.12]}>
      <boxGeometry args={[0.56, 0.03, 0.18]} />
      <meshStandardMaterial color="#2A2E33" roughness={0.6} />
    </mesh>
    <group position={[0.58, 0.83, 0.12]}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#F6F2EA" roughness={0.4} />
      </mesh>
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.035, 0.01, 6, 12]} />
        <meshStandardMaterial color="#F6F2EA" />
      </mesh>
    </group>
    {label ? <Plate src={`screens/${label}.png`} w={0.72} h={0.158} position={[0, 0.62, 0.42]} /> : null}
  </group>
);

const ScreenPlane: React.FC<{ src: string; o: number; w: number; h: number; z: number }> = ({ src, o, w, h, z }) => {
  const tex = useTex(`screens/${src}.png`);
  if (!tex || o <= 0.01) return null;
  return (
    <mesh position={[0, 0, z]} renderOrder={5}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent opacity={o} toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

/* ------------------------------------------------------------------ */
/** Reloj de pared; `speed` lo pone a correr (¿cuándo descansan? nunca). */
export const Clock: React.FC<{ position: V3; t: number; speed?: number }> = ({ position, t, speed = 0 }) => {
  const h = (t * speed) / 12 + 1.2;
  const m = t * speed + 0.4;
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 40]} />
        <meshStandardMaterial color="#F6F2EA" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <ringGeometry args={[0.38, 0.42, 40]} />
        <meshStandardMaterial color="#1B1D20" />
      </mesh>
      <mesh position={[0, 0, 0.04]} rotation={[0, 0, -h]}>
        <planeGeometry args={[0.035, 0.36]} />
        <meshBasicMaterial color="#1B1D20" />
      </mesh>
      <mesh position={[0, 0, 0.045]} rotation={[0, 0, -m]}>
        <planeGeometry args={[0.025, 0.62]} />
        <meshBasicMaterial color="#C8382F" />
      </mesh>
    </group>
  );
};

/** Regalo (caja con lazo) que se abre de un salto. */
export const Gift: React.FC<{ position: V3; p: number }> = ({ position, p }) => {
  if (p <= 0.001) return null;
  return (
    <group position={[position[0], position[1] + Math.sin(Math.min(1, p) * Math.PI) * 0.25, position[2]]} scale={Math.min(1, p * 1.4)} rotation={[0, p * 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.26, 0.32]} />
        <meshStandardMaterial color="#E0607E" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <boxGeometry args={[0.34, 0.27, 0.07]} />
        <meshStandardMaterial color="#FFD98A" />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <boxGeometry args={[0.07, 0.27, 0.34]} />
        <meshStandardMaterial color="#FFD98A" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.06, 0.17, 0]} rotation={[0, 0, s * 0.7]}>
          <torusGeometry args={[0.05, 0.018, 8, 16]} />
          <meshStandardMaterial color="#FFD98A" />
        </mesh>
      ))}
    </group>
  );
};

/** Avión de papel (la promo que sale volando). */
export const PaperPlane: React.FC<{ position: V3; rotation?: V3; scale?: number }> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const v = new Float32Array([0, 0, 0.3, -0.18, 0, -0.2, 0, 0.04, -0.12, 0, 0, 0.3, 0.18, 0, -0.2, 0, 0.04, -0.12, 0, 0, 0.3, 0, 0.04, -0.12, 0, -0.08, -0.18]);
    g.setAttribute("position", new THREE.BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={position} rotation={rotation} scale={scale}>
      <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} roughness={0.5} />
    </mesh>
  );
};

/* ------------------------------------------------------------------ */
/** La oficina: piso, gradas, paredes, neón, pantalla grande, ventana día/noche, lámparas. */
export const Room: React.FC<{ wall: [string, number][]; night?: number }> = ({ wall, night = 1 }) => {
  const sky = new THREE.Color("#8FD3F0").lerp(new THREE.Color("#0B1630"), night);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -1]}>
        <planeGeometry args={[30, 30]} />
        <meshLambertMaterial color="#5A4232" />
      </mesh>
      {/* gradas */}
      {[1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.45 - 0.225, -i * 1.7 - 0.1]} receiveShadow castShadow>
          <boxGeometry args={[8, 0.45, 1.7]} />
          <meshLambertMaterial color={i === 1 ? "#33463F" : "#2C3D37"} />
        </mesh>
      ))}
      {/* pared del fondo */}
      <mesh position={[0, 3, -4.6]} receiveShadow>
        <boxGeometry args={[12, 8, 0.2]} />
        <meshLambertMaterial color="#0F2E27" />
      </mesh>
      <Plate src="screens/neon.png" w={2.6} h={0.78} position={[-1.6, 4.9, -4.48]} />
      <Glow position={[-1.6, 4.9, -4.3]} size={3.4} color="#8FE3C0" opacity={0.25} />
      {/* pantalla grande */}
      <group position={[1.4, 4.2, -4.45]}>
        <mesh>
          <boxGeometry args={[2.5, 1.48, 0.08]} />
          <meshStandardMaterial color="#15191C" roughness={0.4} />
        </mesh>
        {wall.map(([src, o], i) => (
          <ScreenPlane key={src} src={src} o={o} w={2.4} h={1.37} z={0.045 + i * 0.0006} />
        ))}
      </group>
      {/* ventana */}
      <group position={[-3.6, 3.2, -4.48]}>
        <mesh>
          <planeGeometry args={[1.4, 1.8]} />
          <meshBasicMaterial color={sky} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.05, 1.8, 0.02]} />
          <meshStandardMaterial color="#C99A6B" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[1.4, 0.05, 0.02]} />
          <meshStandardMaterial color="#C99A6B" />
        </mesh>
      </group>
      {/* lámparas colgantes */}
      {[
        [-1.0, 3.5, 0.2],
        [1.0, 3.5, 0.2],
        [-2.4, 4.4, -1.6],
        [2.6, 4.4, -1.6],
        [-1.4, 5.3, -3.3],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 1.2, 4]} />
            <meshBasicMaterial color="#111" />
          </mesh>
          <mesh>
            <coneGeometry args={[0.2, 0.18, 20, 1, true]} />
            <meshStandardMaterial color="#1B1D20" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <meshBasicMaterial color="#FFE2B0" toneMapped={false} />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={9} distance={5} color="#FFD9A0" />
        </group>
      ))}
    </group>
  );
};

/** Las 5 mesas: posición de cada una (sellos, cumpleaños, cuadra, premios, datos). */
export const DESKS: Record<"sellos" | "cumple" | "cuadra" | "premios" | "datos", V3> = {
  sellos: [-1.0, 0, 0],
  cumple: [1.0, 0, 0],
  cuadra: [-1.0, 0.45, -1.8],
  premios: [1.0, 0.45, -1.8],
  datos: [0, 0.9, -3.5],
};
