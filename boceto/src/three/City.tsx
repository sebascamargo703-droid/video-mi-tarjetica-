import React, { createContext, useContext, useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Barrio 3D (estilo colonial colombiano: fachadas de colores, tejas de barro, árboles) que se dibuja
 * de dos formas con la MISMA geometría:
 *  - real: materiales con luz y sombras,
 *  - boceto: blanco papel + contornos negros (EdgesGeometry), como dibujado a lápiz.
 */
export type V3 = [number, number, number];
export const SketchCtx = createContext(false);
const useSketch = () => useContext(SketchCtx);

const INK = "#262626";

/** Malla sólida que en modo boceto se vuelve papel con contorno. */
export const Solid: React.FC<{
  geo: THREE.BufferGeometry;
  color: string;
  position?: V3;
  rotation?: V3;
  scale?: number | V3;
  rough?: number;
  metal?: number;
  emissive?: string;
  emissiveIntensity?: number;
  basic?: boolean;
  opacity?: number;
  edgeAngle?: number;
  paper?: string;
  noEdges?: boolean;
  shadow?: boolean;
}> = ({ geo, color, position, rotation, scale, rough = 0.85, metal = 0, emissive, emissiveIntensity = 1, basic, opacity = 1, edgeAngle = 25, paper = "#FFFFFF", noEdges, shadow = true }) => {
  const sketch = useSketch();
  const edges = useMemo(() => (sketch && !noEdges ? new THREE.EdgesGeometry(geo, edgeAngle) : null), [geo, sketch, edgeAngle, noEdges]);
  const transparent = opacity < 1;
  if (sketch) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh geometry={geo}>
          <meshBasicMaterial color={paper} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} transparent={transparent} opacity={opacity} />
        </mesh>
        {edges ? (
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={INK} transparent={transparent} opacity={opacity} />
          </lineSegments>
        ) : null}
      </group>
    );
  }
  return (
    <mesh geometry={geo} position={position} rotation={rotation} scale={scale} castShadow={shadow} receiveShadow={shadow}>
      {basic ? (
        <meshBasicMaterial color={color} transparent={transparent} opacity={opacity} toneMapped={false} />
      ) : (
        <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? "#000"} emissiveIntensity={emissive ? emissiveIntensity : 0} transparent={transparent} opacity={opacity} />
      )}
    </mesh>
  );
};

/* ---------------- geometrías cacheadas ---------------- */
const cache = new Map<string, THREE.BufferGeometry>();
const cached = (key: string, make: () => THREE.BufferGeometry) => {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g;
};
export const boxGeo = (w: number, h: number, d: number) => cached(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
export const cylGeo = (rt: number, rb: number, h: number, seg = 24) => cached(`c${rt},${rb},${h},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
const boxAt = (w: number, h: number, d: number, x: number, y: number, z: number) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);

const rand = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* ---------------- trazado del barrio ---------------- */
// Calle principal a lo largo de z (x = 0), calles paralelas en x = ±26, transversales en z = ±35 y 105.
export const ROAD = 3.5; // media calzada
export const WALK = 6; // borde exterior del andén
export const CAFE = { x0: -12.5, x1: -6, z0: -3, z1: 6.5 };
export const TABLE: V3 = [-4.75, 0, 2.2];
export const TABLES: V3[] = [[-4.75, 0, -1.4], TABLE, [-4.75, 0, 5.6]];

const FACADES = ["#EEE6D8", "#E2C27E", "#D9A088", "#A9C4B5", "#F2EFE8", "#C3D3DF", "#DDB5A3", "#E8DAB0"];
const ROOFS = ["#9C5A42", "#8E5039", "#A9664B"];

type Lot = { x: number; z: number; w: number; d: number; h: number; c: number; r: number; front: 1 | -1 | 0 };

const makeLots = (): Lot[] => {
  const R = rand(7);
  const lots: Lot[] = [];
  const xBlocks: [number, number][] = [
    [6, 20],
    [32, 46],
    [-20, -6],
    [-46, -32],
  ];
  const zBlocks: [number, number][] = [
    [-31, 31],
    [39, 101],
    [-101, -39],
  ];
  for (const [x0, x1] of xBlocks) {
    for (const [z0, z1] of zBlocks) {
      for (const side of [0, 1]) {
        const dep = 6.5;
        const lx = side === 0 ? x0 + dep / 2 : x1 - dep / 2;
        // fachada que da a la calle principal
        const front: 1 | -1 | 0 = x0 === 6 && side === 0 ? -1 : x1 === -6 && side === 1 ? 1 : 0;
        let z = z0;
        while (z < z1 - 0.5) {
          let w = 5 + Math.floor(R() * 5);
          if (front === 1 && z < CAFE.z0 && z + w > CAFE.z0) w = CAFE.z0 - z; // deja el lote del café
          if (front === 1 && z >= CAFE.z0 && z < CAFE.z1) {
            z = CAFE.z1;
            continue;
          }
          w = Math.min(w, z1 - z);
          if (w < 2) break;
          lots.push({ x: lx, z: z + w / 2, w: dep, d: w, h: 6 + Math.floor(R() * 3) * 3 + (R() < 0.15 ? 3 : 0), c: Math.floor(R() * FACADES.length), r: Math.floor(R() * ROOFS.length), front });
          z += w;
        }
      }
    }
  }
  return lots;
};
const LOTS = makeLots();

/** Edificios agrupados por color en una sola geometría (rápido y con contornos limpios). */
const useCityGeo = () =>
  useMemo(() => {
    const bodies: THREE.BufferGeometry[][] = FACADES.map(() => []);
    const roofs: THREE.BufferGeometry[][] = ROOFS.map(() => []);
    const windows: THREE.BufferGeometry[] = [];
    const frames: THREE.BufferGeometry[] = [];
    for (const l of LOTS) {
      bodies[l.c].push(boxAt(l.w, l.h, l.d - 0.06, l.x, l.h / 2, l.z));
      // tejado: losa + caballete
      roofs[l.r].push(boxAt(l.w + 0.5, 0.35, l.d + 0.1, l.x, l.h + 0.17, l.z));
      roofs[l.r].push(boxAt(l.w * 0.55, 0.5, l.d - 0.2, l.x, l.h + 0.55, l.z));
      if (l.front !== 0 && Math.abs(l.z) < 75) {
        const fx = l.x + l.front * (l.w / 2 + 0.04);
        const cols = Math.max(1, Math.floor(l.d / 2.6));
        for (let f = 0; f * 3 + 3 <= l.h; f++) {
          for (let c = 0; c < cols; c++) {
            const z = l.z - l.d / 2 + (c + 0.5) * (l.d / cols);
            const y = f === 0 ? 1.25 : f * 3 + 1.6;
            const hh = f === 0 ? 2.3 : 1.5;
            windows.push(boxAt(0.1, hh, f === 0 ? 1.5 : 1.05, fx, y, z));
            frames.push(boxAt(0.14, 0.12, (f === 0 ? 1.5 : 1.05) + 0.3, fx, y - hh / 2 - 0.06, z));
            if (f > 0) frames.push(boxAt(0.5, 0.08, 1.4, fx + l.front * 0.2, y - hh / 2 - 0.1, z)); // balcón
          }
        }
      }
    }
    const m = (a: THREE.BufferGeometry[]) => (a.length ? mergeGeometries(a) : null);
    return { bodies: bodies.map(m), roofs: roofs.map(m), windows: m(windows), frames: m(frames) };
  }, []);

const useStreetGeo = () =>
  useMemo(() => {
    const walks: THREE.BufferGeometry[] = [];
    const lines: THREE.BufferGeometry[] = [];
    const zebra: THREE.BufferGeometry[] = [];
    // andenes de la calle principal y de las paralelas
    for (const cx of [0, 26, -26]) {
      for (const [z0, z1] of [
        [-31, 31],
        [39, 101],
        [-101, -39],
      ]) {
        for (const s of [-1, 1]) walks.push(boxAt(WALK - ROAD, 0.16, z1 - z0 + 1, cx + s * ((ROAD + WALK) / 2), 0.08, (z0 + z1) / 2));
      }
      for (let z = -100; z < 100; z += 6) if (Math.abs(z - 35) > 5 && Math.abs(z + 35) > 5) lines.push(boxAt(0.15, 0.02, 2.6, cx, 0.01, z));
    }
    // andenes de las transversales
    for (const cz of [35, -35]) {
      for (const [x0, x1] of [
        [6, 20],
        [-20, -6],
        [32, 46],
        [-46, -32],
      ]) {
        for (const s of [-1, 1]) walks.push(boxAt(x1 - x0 + 1, 0.16, WALK - ROAD - 0.5, (x0 + x1) / 2, 0.08, cz + s * ((ROAD + WALK) / 2 - 0.25)));
      }
      for (const cx of [0, 26, -26]) for (let i = -3; i <= 3; i++) zebra.push(boxAt(0.6, 0.02, 2.6, cx + i * 0.95, 0.012, cz - 4.6), boxAt(0.6, 0.02, 2.6, cx + i * 0.95, 0.012, cz + 4.6));
    }
    return { walks: mergeGeometries(walks), lines: mergeGeometries(lines), zebra: mergeGeometries(zebra) };
  }, []);

const TREE_POS: V3[] = (() => {
  const a: V3[] = [];
  for (let z = -28; z < 100; z += 9) {
    if (Math.abs(z - 35) < 6) continue;
    a.push([5.25, 0, z + 2]);
    if (!(z > -8 && z < 10)) a.push([-5.25, 0, z]);
  }
  // patios internos
  const R = rand(3);
  for (const cx of [13, 39, -13, -39]) for (let z = -95; z < 95; z += 7) if (R() < 0.6) a.push([cx + (R() - 0.5) * 1.5, 0, z + R() * 3]);
  return a;
})();

const useTreeGeo = () =>
  useMemo(() => {
    const crowns: THREE.BufferGeometry[] = [];
    const trunks: THREE.BufferGeometry[] = [];
    TREE_POS.forEach(([x, , z], i) => {
      const s = 1 + ((i * 37) % 10) / 25;
      crowns.push(new THREE.IcosahedronGeometry(1.6 * s, 1).translate(x, 3.6 * s, z));
      crowns.push(new THREE.IcosahedronGeometry(1.1 * s, 1).translate(x + 0.7, 4.3 * s, z - 0.4));
      trunks.push(new THREE.CylinderGeometry(0.14, 0.2, 2.6 * s, 6).translate(x, 1.3 * s, z));
    });
    return { crowns: mergeGeometries(crowns), trunks: mergeGeometries(trunks) };
  }, []);

const CARS: [number, number, string][] = [
  [2.4, 18, "#C8323C"],
  [-2.4, 30, "#E9E9E9"],
  [2.4, -12, "#2D5DA8"],
  [-2.4, -24, "#1F1F22"],
  [2.4, 52, "#E9E9E9"],
  [27.5, 8, "#F1C232"],
  [-24.5, -6, "#E9E9E9"],
  [2.4, 76, "#1F1F22"],
];

const Car: React.FC<{ position: V3; color: string }> = ({ position, color }) => (
  <group position={position}>
    <Solid geo={boxGeo(1.8, 0.7, 4.2)} color={color} position={[0, 0.55, 0]} rough={0.35} metal={0.3} />
    <Solid geo={boxGeo(1.6, 0.6, 2.2)} color="#2A3440" position={[0, 1.15, -0.2]} rough={0.2} metal={0.4} />
    {[-1.35, 1.35].map((z) =>
      [-0.85, 0.85].map((x) => <Solid key={`${x}${z}`} geo={cylGeo(0.34, 0.34, 0.24, 14)} color="#151515" position={[x, 0.34, z]} rotation={[0, 0, Math.PI / 2]} />),
    )}
  </group>
);

const Lamp: React.FC<{ position: V3 }> = ({ position }) => (
  <group position={position}>
    <Solid geo={cylGeo(0.06, 0.09, 4.2, 8)} color="#1E2A26" position={[0, 2.1, 0]} metal={0.5} rough={0.4} />
    <Solid geo={boxGeo(0.32, 0.45, 0.32)} color="#FFE6A8" position={[0, 4.35, 0]} emissive="#FFD27A" emissiveIntensity={0.6} />
    <Solid geo={boxGeo(0.42, 0.08, 0.42)} color="#1E2A26" position={[0, 4.6, 0]} />
  </group>
);

/* ---------------- el café ---------------- */
const useSignTex = (sketch: boolean) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = sketch ? "#FFFFFF" : "#0E5244";
    g.fillRect(0, 0, 1024, 256);
    if (sketch) {
      g.strokeStyle = INK;
      g.lineWidth = 6;
      g.strokeRect(8, 8, 1008, 240);
    }
    g.fillStyle = sketch ? INK : "#F6F2EA";
    g.font = sketch ? "bold 150px Caveat, cursive" : "bold 120px Georgia, 'Times New Roman', serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("Café Origen", 512, 136);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [sketch]);

export const Cafe: React.FC = () => {
  const sketch = useSketch();
  const sign = useSignTex(sketch);
  const w = CAFE.x1 - CAFE.x0;
  const d = CAFE.z1 - CAFE.z0;
  const cx = (CAFE.x0 + CAFE.x1) / 2;
  const cz = (CAFE.z0 + CAFE.z1) / 2;
  const fx = CAFE.x1 + 0.05;
  return (
    <group>
      <Solid geo={boxGeo(w, 7.5, d)} color="#F6F3EC" position={[cx, 3.75, cz]} />
      <Solid geo={boxGeo(w + 0.5, 0.35, d + 0.2)} color="#A64A2A" position={[cx, 7.67, cz]} />
      <Solid geo={boxGeo(w * 0.55, 0.5, d - 0.3)} color="#A64A2A" position={[cx, 8.05, cz]} />
      {/* zócalo verde y vitrina */}
      <Solid geo={boxGeo(0.12, 0.7, d - 0.4)} color="#0E5244" position={[fx, 0.35, cz]} />
      <Solid geo={boxGeo(0.08, 2.0, 3.2)} color="#2A2622" position={[fx, 1.75, CAFE.z0 + 2]} emissive="#FFB866" emissiveIntensity={0.08} rough={0.15} metal={0.3} />
      <Solid geo={boxGeo(0.08, 2.0, 3.2)} color="#2A2622" position={[fx, 1.75, CAFE.z1 - 2]} emissive="#FFB866" emissiveIntensity={0.08} rough={0.15} metal={0.3} />
      <Solid geo={boxGeo(0.1, 2.5, 1.4)} color="#0E5244" position={[fx, 1.25, TABLE[2]]} />
      {/* toldo menta */}
      <Solid geo={boxGeo(1.9, 0.1, d - 0.6)} color="#69D3BE" position={[fx + 0.95, 3.15, cz]} rotation={[0, 0, -0.32]} />
      <Solid geo={boxGeo(0.1, 0.35, d - 0.6)} color="#4FB89B" position={[fx + 1.85, 2.72, cz]} />
      {/* letrero */}
      <mesh position={[fx + 0.02, 4.25, cz]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 1.3]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* ventanas del segundo piso */}
      {[CAFE.z0 + 1.8, cz, CAFE.z1 - 1.8].map((z, i) => (
        <group key={i}>
          <Solid geo={boxGeo(0.1, 1.5, 1.1)} color="#2A3440" position={[fx, 5.6, z]} rough={0.2} />
          <Solid geo={boxGeo(0.5, 0.08, 1.4)} color="#3B2A1E" position={[fx + 0.2, 4.8, z]} />
        </group>
      ))}
      {TABLES.map((p, i) => (
        <Table key={i} position={p} chairs={i !== 1} />
      ))}
    </group>
  );
};

export const Table: React.FC<{ position: V3; chairs?: boolean }> = ({ position, chairs = true }) => (
  <group position={position}>
    <Solid geo={cylGeo(0.48, 0.48, 0.04, 40)} color="#EDE6DA" position={[0, 0.76, 0]} rough={0.35} edgeAngle={40} />
    <Solid geo={cylGeo(0.05, 0.05, 0.72, 10)} color="#1E1E1E" position={[0, 0.38, 0]} metal={0.6} rough={0.3} />
    <Solid geo={cylGeo(0.26, 0.3, 0.04, 24)} color="#1E1E1E" position={[0, 0.02, 0]} metal={0.6} rough={0.3} />
    {chairs
      ? [0.9, -0.9].map((z) => (
          <group key={z} position={[0.15, 0, z]}>
            <Solid geo={cylGeo(0.22, 0.22, 0.04, 20)} color="#5B3A24" position={[0, 0.47, 0]} />
            <Solid geo={boxGeo(0.4, 0.45, 0.04)} color="#5B3A24" position={[0, 0.72, z > 0 ? 0.2 : -0.2]} />
            <Solid geo={cylGeo(0.02, 0.02, 0.46, 6)} color="#1E1E1E" position={[0, 0.23, 0]} />
          </group>
        ))
      : null}
  </group>
);

/** Pocillo de café con plato y vapor (vapor solo en la versión real). */
export const Cup: React.FC<{ position: V3; t: number; steam?: number }> = ({ position, t, steam = 1 }) => {
  const sketch = useSketch();
  return (
    <group position={position}>
      <Solid geo={cylGeo(0.13, 0.11, 0.015, 32)} color="#FFFFFF" position={[0, 0.008, 0]} rough={0.25} edgeAngle={50} />
      <Solid geo={cylGeo(0.065, 0.05, 0.085, 28)} color="#FFFFFF" position={[0, 0.058, 0]} rough={0.25} edgeAngle={50} />
      <Solid geo={cylGeo(0.058, 0.058, 0.004, 28)} color="#4A2A17" position={[0, 0.1, 0]} rough={0.3} edgeAngle={50} />
      <mesh position={[0.075, 0.06, 0]}>
        <torusGeometry args={[0.025, 0.007, 8, 16]} />
        {sketch ? <meshBasicMaterial color={INK} /> : <meshStandardMaterial color="#FFFFFF" roughness={0.25} />}
      </mesh>
      {!sketch && steam > 0
        ? [0, 1, 2].map((i) => {
            const k = (t * 0.6 + i / 3) % 1;
            return (
              <mesh key={i} position={[Math.sin((k + i) * 5) * 0.015, 0.12 + k * 0.22, 0]}>
                <sphereGeometry args={[0.025 + k * 0.03, 12, 12]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35 * (1 - k) * steam} depthWrite={false} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

/* ---------------- ciudad completa ---------------- */
export const City: React.FC = () => {
  const sketch = useSketch();
  const city = useCityGeo();
  const street = useStreetGeo();
  const trees = useTreeGeo();
  const ground = useMemo(() => new THREE.PlaneGeometry(600, 600).rotateX(-Math.PI / 2), []);
  return (
    <group>
      {/* suelo y calzada */}
      <Solid geo={ground} color="#55585A" rough={0.95} noEdges />
      <Solid geo={street.walks} color="#D2C8B6" rough={0.9} edgeAngle={60} />
      {sketch ? null : <Solid geo={street.lines} color="#EDE4CF" rough={0.8} />}
      <Solid geo={street.zebra} color="#EFEFEA" rough={0.8} />
      {city.bodies.map((g, i) => (g ? <Solid key={i} geo={g} color={FACADES[i]} rough={0.9} /> : null))}
      {city.roofs.map((g, i) => (g ? <Solid key={i} geo={g} color={ROOFS[i]} rough={0.8} /> : null))}
      {city.windows ? <Solid geo={city.windows} color="#29323A" rough={0.15} metal={0.3} paper="#F2F2F2" /> : null}
      {city.frames ? <Solid geo={city.frames} color="#5A3D27" rough={0.7} /> : null}
      <Solid geo={trees.crowns} color="#4E7E3A" rough={0.9} edgeAngle={35} />
      <Solid geo={trees.trunks} color="#5A3D27" />
      {CARS.map(([x, z, c], i) => (
        <Car key={i} position={[x, 0, z]} color={c} />
      ))}
      {[-26, -12, 16, 28].map((z) => (
        <Lamp key={z} position={[-5.4, 0.16, z]} />
      ))}
      {[-20, 0, 22].map((z) => (
        <Lamp key={z} position={[5.4, 0.16, z]} />
      ))}
      <Cafe />
    </group>
  );
};

/* ---------------- marcadores del mapa ---------------- */
/** Pin del café: gota blanca con centro menta (se ve bien desde arriba y de lado). */
export const Pin: React.FC<{ position: V3; scale?: number; bob?: number }> = ({ position, scale = 1, bob = 0 }) => {
  const sketch = useSketch();
  const cone = useMemo(() => new THREE.ConeGeometry(0.62, 1.5, 24).rotateX(Math.PI), []);
  const head = useMemo(() => new THREE.SphereGeometry(0.9, 28, 20), []);
  return (
    <group position={[position[0], position[1] + bob, position[2]]} scale={scale}>
      <Solid geo={head} color="#FFFFFF" position={[0, 1.95, 0]} rough={0.3} edgeAngle={80} shadow={false} />
      <Solid geo={cone} color="#FFFFFF" position={[0, 0.95, 0]} rough={0.3} edgeAngle={80} shadow={false} />
      <mesh position={[0, 2.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 28]} />
        <meshBasicMaterial color={sketch ? "#FFFFFF" : "#0E5244"} toneMapped={false} />
      </mesh>
      {/* pocillo esquemático sobre el pin */}
      <Solid geo={cylGeo(0.22, 0.17, 0.26, 20)} color="#F6F2EA" position={[0, 3.0, 0]} rough={0.3} edgeAngle={60} shadow={false} />
    </group>
  );
};

/** Punto azul del cliente sobre el suelo, con halo. */
export const Dot: React.FC<{ position: V3; scale?: number; halo?: number }> = ({ position, scale = 1, halo = 0 }) => {
  const sketch = useSketch();
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
        <circleGeometry args={[1.0, 40]} />
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}>
        <circleGeometry args={[0.72, 40]} />
        <meshBasicMaterial color={sketch ? INK : "#2F7CF6"} toneMapped={false} depthWrite={false} />
      </mesh>
      {halo > 0 ? (
        <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={4}>
          <circleGeometry args={[1 + halo * 2.2, 40]} />
          <meshBasicMaterial color={sketch ? INK : "#2F7CF6"} transparent opacity={(sketch ? 0.12 : 0.25) * (1 - halo)} toneMapped={false} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
};

/** Anillo plano (geocerca o pulsos de "Aquí"). */
export const Ring: React.FC<{ position: V3; r: number; width: number; color: string; opacity?: number }> = ({ position, r, width, color, opacity = 1 }) => {
  const sketch = useSketch();
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
      <ringGeometry args={[Math.max(0.001, r - width / 2), r + width / 2, 96]} />
      <meshBasicMaterial color={sketch ? INK : color} transparent opacity={opacity} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
};
