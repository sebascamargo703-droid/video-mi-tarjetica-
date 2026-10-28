import React, { useMemo } from "react";
import * as THREE from "three";
import { Cafe } from "./Cafe";
import { Glow, LightPool, Person, StreetLamp, Tree } from "./Props";
import { windowsTexture } from "./textures";

/**
 * La calle: los dos cafés frente a frente (Origen al norte en z=-6, La Esquina al sur en z=+6),
 * andenes, edificios con ventanas, postes, árboles y carros parqueados.
 */
export const WORLD = {
  street: 3.5,
  walk: 6,
  origenDoor: [2.9, 0, -6] as [number, number, number],
  esquinaDoor: [-2.9, 0, 6] as [number, number, number],
  crosswalkX: -6.5,
};

type V3 = [number, number, number];

const Building: React.FC<{ x: number; z: number; w: number; d: number; h: number; face: 1 | -1; seed: number }> = ({ x, z, w, d, h, face, seed }) => {
  const mats = useMemo(() => {
    const front = windowsTexture(seed, Math.max(2, Math.round(w / 1.4)), Math.max(1, Math.round(h / 3)), 0.32);
    const side = windowsTexture(seed + 7, Math.max(2, Math.round(d / 1.6)), Math.max(1, Math.round(h / 3)), 0.18);
    const dark = new THREE.MeshStandardMaterial({ color: "#11161c", roughness: 0.9 });
    const top = new THREE.MeshStandardMaterial({ color: "#161c23", roughness: 0.95 });
    const withMap = (t: THREE.Texture) => new THREE.MeshStandardMaterial({ color: "#2a3038", map: t, emissiveMap: t, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.9, roughness: 0.85 });
    // orden de caras de BoxGeometry: +x, -x, +y, -y, +z, -z
    return face === 1 ? [withMap(side), withMap(side), top, dark, withMap(front), dark] : [withMap(side), withMap(side), top, dark, dark, withMap(front)];
  }, [seed, w, d, h, face]);
  return (
    <mesh position={[x, h / 2, z]} material={mats} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
    </mesh>
  );
};

const Car: React.FC<{ position: V3; color: string; rot?: number }> = ({ position, color, rot = 0 }) => (
  <group position={position} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.45, 0]} castShadow>
      <boxGeometry args={[3.9, 0.55, 1.7]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
    </mesh>
    <mesh position={[-0.2, 0.92, 0]} castShadow>
      <boxGeometry args={[2.0, 0.45, 1.5]} />
      <meshStandardMaterial color="#0d1218" metalness={0.8} roughness={0.15} />
    </mesh>
    {[
      [-1.25, 0.82],
      [1.25, 0.82],
      [-1.25, -0.82],
      [1.25, -0.82],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.32, z]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
    ))}
    <Glow position={[-1.98, 0.5, 0.6]} size={0.5} color="#ff4040" opacity={0.7} />
    <Glow position={[-1.98, 0.5, -0.6]} size={0.5} color="#ff4040" opacity={0.7} />
  </group>
);

/** Anillo de cercanía (geocerca) sobre el piso, con pulso. */
export const Geofence: React.FC<{ center: V3; r: number; on: number; pulse: number; flash: number }> = ({ center, r, on, pulse, flash }) => {
  if (on <= 0.001) return null;
  return (
    <group position={[center[0], 0.07, center[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh renderOrder={3}>
        <circleGeometry args={[r * on, 72]} />
        <meshBasicMaterial color="#69D3BE" transparent opacity={(0.07 + 0.18 * flash) * on} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh renderOrder={4}>
        <ringGeometry args={[r * on - 0.14, r * on, 96]} />
        <meshBasicMaterial color="#8FE3C0" transparent opacity={0.9 * on} depthWrite={false} toneMapped={false} />
      </mesh>
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const rr = r * on * 0.82;
        return (
          <mesh key={i} position={[Math.cos(a) * rr, Math.sin(a) * rr, 0]} rotation={[0, 0, a]} renderOrder={4}>
            <planeGeometry args={[0.06, 0.4]} />
            <meshBasicMaterial color="#69D3BE" transparent opacity={0.5 * on} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
      {pulse > 0 && pulse < 1 ? (
        <mesh renderOrder={4}>
          <ringGeometry args={[r * (0.2 + pulse * 0.9) - 0.1, r * (0.2 + pulse * 0.9), 96]} />
          <meshBasicMaterial color="#8FE3C0" transparent opacity={(1 - pulse) * 0.8} depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
};

/** Camino punteado sobre el piso entre dos puntos (progreso 0–1). */
export const DashPath: React.FC<{ pts: V3[]; progress: number; color: string; width?: number; glow?: number }> = ({ pts, progress, color, width = 0.18, glow = 0 }) => {
  const dashes = useMemo(() => {
    const segs: { p: V3; a: number; d: number }[] = [];
    let acc = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, , z0] = pts[i];
      const [x1, , z1] = pts[i + 1];
      const len = Math.hypot(x1 - x0, z1 - z0);
      for (let s = 0; s < len; s += 0.6) {
        const t = s / len;
        segs.push({ p: [x0 + (x1 - x0) * t, 0.08, z0 + (z1 - z0) * t], a: Math.atan2(x1 - x0, z1 - z0), d: acc + s });
      }
      acc += len;
    }
    return { segs, total: acc };
  }, [pts]);
  return (
    <>
      {dashes.segs
        .filter((s) => s.d <= progress * dashes.total)
        .map((s, i) => (
          <mesh key={i} position={s.p} rotation={[-Math.PI / 2, 0, -s.a]} renderOrder={5}>
            <planeGeometry args={[width, 0.34]} />
            <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      {glow > 0 ? <LightPool position={[pts[pts.length - 1][0], 0.09, pts[pts.length - 1][2]]} size={[3, 3]} color={color} opacity={glow} /> : null}
    </>
  );
};

export type Walker = { pos: V3; rot: number; phase?: number; visible: boolean };

export const City: React.FC<{
  valentina: Walker;
  ring?: { on: number; pulse: number; flash: number };
  paths?: { origen: number; esquina: number; glow: number };
}> = ({ valentina, ring, paths }) => {
  const buildings = useMemo(() => {
    const out: { x: number; z: number; w: number; d: number; h: number; face: 1 | -1; seed: number }[] = [];
    let seed = 1;
    for (const side of [-1, 1] as const) {
      // fila al lado de los cafés (más bajos cerca, más altos lejos)
      for (const [x0, x1] of [
        [-40, -5.2],
        [5.2, 40],
      ]) {
        let x = x0;
        while (x < x1 - 1) {
          const w = Math.min(x1 - x, 4 + ((seed * 37) % 5));
          const near = Math.min(Math.abs(x + w / 2), 30);
          // del lado de la cámara (sur) son bajos para no tapar los cafés
          const h = side === 1 ? 3.2 + ((seed * 53) % 3) : 4.5 + ((seed * 53) % 7) + near * 0.25;
          out.push({ x: x + w / 2, z: side * (WORLD.walk + 4), w: w - 0.3, d: 8, h, face: side === -1 ? 1 : -1, seed: seed++ });
          x += w;
        }
      }
      // fondo, detrás de cada café
      if (side === -1) for (let x = -24; x < 24; x += 6) out.push({ x: x + 3, z: side * 20, w: 5.6, d: 8, h: 9 + ((seed * 29) % 12), face: side === -1 ? 1 : -1, seed: seed++ });
    }
    return out;
  }, []);

  return (
    <group>
      {/* suelo, calle y andenes */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#0a0d10" roughness={1} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, WORLD.street * 2]} />
        <meshStandardMaterial color="#14171b" roughness={0.92} />
      </mesh>
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh key={i} position={[-60 + i * 3 + 0.75, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.14]} />
          <meshStandardMaterial color="#c9a54a" roughness={0.6} emissive="#c9a54a" emissiveIntensity={0.08} />
        </mesh>
      ))}
      {/* cebra */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[WORLD.crosswalkX, 0.013, -3.1 + i * 0.78]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 0.42]} />
          <meshStandardMaterial color="#d8dde3" roughness={0.7} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[0, 0.06, s * (WORLD.street + (WORLD.walk - WORLD.street) / 2)]} receiveShadow>
            <boxGeometry args={[120, 0.12, WORLD.walk - WORLD.street]} />
            <meshStandardMaterial color="#2a2f35" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.07, s * (WORLD.street + 0.08)]}>
            <boxGeometry args={[120, 0.14, 0.16]} />
            <meshStandardMaterial color="#454c55" roughness={0.8} />
          </mesh>
        </group>
      ))}

      <Cafe kind="origen" position={[0, 0.12, -WORLD.walk]} />
      <Cafe kind="esquina" position={[0, 0.12, WORLD.walk]} rotation={Math.PI} />

      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}

      {[-15, -6.5, 9, 18].map((x) => (
        <StreetLamp key={`n${x}`} position={[x, 0.12, -4.0]} light={Math.abs(x) < 12} />
      ))}
      {[-18, -9, 6.5, 15].map((x) => (
        <StreetLamp key={`s${x}`} position={[x, 0.12, 4.0]} rot={Math.PI} light={Math.abs(x) < 12} />
      ))}
      {[-11.5, 12.5].map((x) => (
        <Tree key={`tn${x}`} position={[x, 0.12, -4.6]} />
      ))}
      {[-13, 11].map((x) => (
        <Tree key={`ts${x}`} position={[x, 0.12, 4.6]} scale={0.9} />
      ))}
      <Car position={[13, 0, -2.3]} color="#7a1f24" />
      <Car position={[-14, 0, 2.3]} color="#2b4a6f" rot={Math.PI} />
      <Car position={[-24, 0, -2.3]} color="#c8c8c8" />

      {ring ? <Geofence center={[0, 0, -7.2]} r={7.2} {...ring} /> : null}
      {paths ? (
        <>
          <DashPath pts={[valentina.pos, [WORLD.crosswalkX + 0.5, 0, -2.5], [2.9, 0, -4.4], WORLD.origenDoor]} progress={paths.origen} color="#8FE3C0" glow={paths.glow} />
          <DashPath pts={[valentina.pos, [WORLD.crosswalkX + 0.5, 0, 2.5], [-2.9, 0, 4.4], WORLD.esquinaDoor]} progress={paths.esquina} color="#6b7684" width={0.12} />
        </>
      ) : null}

      {valentina.visible ? (
        <group>
          <Person position={valentina.pos} rot={valentina.rot} walk={valentina.phase} shirt="#1f9e7a" pants="#1d2633" seed={3} scale={1.05} />
          <LightPool position={[valentina.pos[0], 0.1, valentina.pos[2]]} size={[2.2, 2.2]} color="#69D3BE" opacity={0.35} />
        </group>
      ) : null}
    </group>
  );
};
