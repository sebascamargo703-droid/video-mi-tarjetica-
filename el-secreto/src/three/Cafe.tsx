import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";
import { Chair, Glow, LightPool, Pendant, Person, Plant, Table } from "./Props";
import { useCanvasTexture } from "./textures";

/**
 * Café visto como "casa de muñecas" (sin techo). Coordenadas locales: el frente (vidriera)
 * está en z=0 y el local se extiende hacia z negativo (7 m de fondo, 9 m de ancho).
 * La puerta queda en x≈2.9. `kind` define el ambiente: "origen" lleno y cálido,
 * "esquina" casi vacío y frío.
 */
export const CAFE = { w: 9, d: 7, h: 3.1, door: { x: 2.9, w: 1.2 } };

type Kind = "origen" | "esquina";

const PALETTE = {
  origen: { floor: "#6e472f", wall: "#7b4a36", wallIn: "#c79b74", trim: "#2a1a12", counter: "#3b2418", top: "#d8c2a2", chair: "#3b2a20", table: "#d9c3a0", light: "#ffb35c" },
  esquina: { floor: "#59626c", wall: "#78838f", wallIn: "#a9b4bf", trim: "#2b333b", counter: "#4a545e", top: "#c9d2db", chair: "#5b6672", table: "#c9d2db", light: "#cfe0ff" },
};

const TABLES: [number, number][] = [
  [-3.2, -1.5],
  [-1.1, -1.7],
  [0.95, -1.45],
  [-2.4, -3.75],
  [-0.1, -3.85],
  [3.4, -4.7],
];
const SHIRTS = ["#c0392b", "#2e86de", "#f5b041", "#16a085", "#8e44ad", "#e67e22", "#ecf0f1", "#27ae60", "#d35400", "#5d6d7e", "#f1948a", "#48c9b0"];

const Sign: React.FC<{ kind: Kind; flicker: number }> = ({ kind, flicker }) => {
  const tex = useCanvasTexture(`sign-${kind}`, 1200, 160, (c, w, h) => {
    if (kind === "origen") {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#1d120c");
      g.addColorStop(1, "#120a06");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#ffd59a";
      c.shadowColor = "#ffb35c";
      c.shadowBlur = 26;
      c.font = "italic 600 100px Fraunces";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("Tu negocio", w / 2 - 130, h / 2 + 4);
      c.font = "800 34px Inter";
      c.shadowBlur = 10;
      c.fillStyle = "#f6e3c4";
      c.fillText("CAFÉ · PANADERÍA", w / 2 + 300, h / 2 + 6);
    } else {
      c.fillStyle = "#1a2129";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#dbe7ff";
      c.shadowColor = "#8db4ff";
      c.shadowBlur = 14;
      c.font = "800 96px Inter";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("LA ESQUINA", w / 2 - 70, h / 2 + 4);
      c.font = "600 34px Inter";
      c.fillText("CAFÉ", w / 2 + 330, h / 2 + 8);
    }
  });
  if (!tex) return null;
  return (
    <mesh position={[0, 2.95, 0.13]}>
      <planeGeometry args={[6.4, 0.85]} />
      <meshBasicMaterial map={tex} toneMapped={false} color={new THREE.Color(1, 1, 1).multiplyScalar(kind === "origen" ? 1.25 : 0.9 * flicker)} />
    </mesh>
  );
};

const MenuBoard: React.FC<{ kind: Kind }> = ({ kind }) => {
  const tex = useCanvasTexture(`menu-${kind}`, 640, 300, (c, w, h) => {
    c.fillStyle = kind === "origen" ? "#1b1411" : "#20262d";
    c.fillRect(0, 0, w, h);
    c.fillStyle = kind === "origen" ? "#f3e2c7" : "#d8e2ee";
    c.font = kind === "origen" ? "italic 600 44px Fraunces" : "800 40px Inter";
    c.fillText(kind === "origen" ? "Menú" : "MENÚ", 30, 58);
    c.font = "600 30px Inter";
    ["Tinto", "Capuchino", "Pandebono", "Croissant"].forEach((it, i) => {
      c.fillText(it, 30, 110 + i * 46);
      c.fillText(["$3.000", kind === "origen" ? "$6.500" : "$6.000", "$3.500", kind === "origen" ? "$7.000" : "$7.500"][i], 440, 110 + i * 46);
    });
  });
  if (!tex) return null;
  return (
    <mesh position={[-2.2, 2.15, -6.88]}>
      <planeGeometry args={[2.3, 1.08]} />
      <meshBasicMaterial map={tex} toneMapped={false} color={kind === "origen" ? "#d9c7b0" : "#aab4c0"} />
    </mesh>
  );
};

export const Cafe: React.FC<{ kind: Kind; position: [number, number, number]; rotation?: number; showValentinaSeat?: boolean }> = ({ kind, position, rotation = 0 }) => {
  const frame = useCurrentFrame();
  const p = PALETTE[kind];
  const full = kind === "origen";
  // parpadeo del tubo fluorescente del café vacío
  const flicker = full ? 1 : 0.75 + 0.25 * (Math.sin(frame * 0.9) > 0.92 ? 0.2 : 1) * (0.92 + 0.08 * Math.sin(frame * 0.37));
  const { w, d, h, door } = CAFE;

  const seated = useMemo(() => {
    const out: { chair: [number, number]; rot: number; person: boolean; seed: number }[] = [];
    TABLES.forEach(([tx, tz], ti) => {
      const n = ti % 2 === 0 ? 3 : 2;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + ti * 0.7;
        const dx = Math.sin(a) * 0.68;
        const dz = Math.cos(a) * 0.68;
        out.push({ chair: [tx + dx, tz + dz], rot: Math.atan2(-dx, -dz), person: full ? (ti * 3 + k) % 5 !== 4 : ti === 1 && k === 0, seed: ti * 3 + k });
      }
    });
    return out;
  }, [full]);

  const wallMat = <meshStandardMaterial color={p.wall} roughness={0.85} />;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* piso */}
      <mesh position={[0, 0.02, -d / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={p.floor} roughness={full ? 0.55 : 0.4} metalness={full ? 0 : 0.1} />
      </mesh>
      {/* muros: fondo y laterales (por dentro de otro color) */}
      <mesh position={[0, h / 2, -d - 0.1]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.4, h, 0.2]} />
        {wallMat}
      </mesh>
      <mesh position={[0, h / 2, -d + 0.005]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={p.wallIn} roughness={0.9} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * (w / 2 + 0.1), h / 2, -d / 2]} castShadow receiveShadow>
            <boxGeometry args={[0.2, h, d + 0.2]} />
            {wallMat}
          </mesh>
          <mesh position={[s * (w / 2 - 0.005), h / 2, -d / 2]} rotation={[0, -s * Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[d, h]} />
            <meshStandardMaterial color={p.wallIn} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* frente: zócalo, parales, viga con letrero y vidrio */}
      {[
        [-w / 2, door.x - door.w / 2],
        [door.x + door.w / 2, w / 2],
      ].map(([a, b], i) => (
        <mesh key={i} position={[(a + b) / 2, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[b - a, 0.6, 0.22]} />
          {wallMat}
        </mesh>
      ))}
      {[-4.5, -2.6, -0.7, 1.2, door.x - door.w / 2, door.x + door.w / 2, 4.5].map((x, i) => (
        <mesh key={i} position={[x, 1.6, 0]} castShadow>
          <boxGeometry args={[0.1, 3.2, 0.14]} />
          <meshStandardMaterial color={p.trim} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 2.95, 0]} castShadow>
        <boxGeometry args={[w + 0.4, 0.95, 0.24]} />
        <meshStandardMaterial color={p.trim} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.45, 0.01]}>
        <planeGeometry args={[w, 1.7]} />
        <meshPhysicalMaterial color={full ? "#ffd8a8" : "#bcd3f0"} transparent opacity={0.1} roughness={0.05} metalness={0} depthWrite={false} />
      </mesh>
      <Sign kind={kind} flicker={flicker} />
      <Glow position={[0, 2.95, 0.6]} size={full ? 6 : 4.5} color={full ? "#ffb35c" : "#8db4ff"} opacity={full ? 0.32 : 0.12 * flicker} />

      {/* barra, máquina, vitrina y menú */}
      <mesh position={[-2.2, 0.5, -5.75]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 1.0, 0.75]} />
        <meshStandardMaterial color={p.counter} roughness={0.6} />
      </mesh>
      <mesh position={[-2.2, 1.03, -5.75]} receiveShadow>
        <boxGeometry args={[4.0, 0.06, 0.85]} />
        <meshStandardMaterial color={p.top} roughness={0.35} />
      </mesh>
      <mesh position={[-3.4, 1.28, -5.85]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.45]} />
        <meshStandardMaterial color="#9aa3ab" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[-1.0, 1.25, -5.7]}>
        <boxGeometry args={[1.3, 0.4, 0.6]} />
        <meshStandardMaterial color={full ? "#ffd9a8" : "#d6e2f0"} emissive={full ? "#ffb35c" : "#6f8fbf"} emissiveIntensity={full ? 0.9 : 0.25} transparent opacity={0.85} />
      </mesh>
      {full
        ? [-1.4, -1.1, -0.8, -0.55].map((x, i) => (
            <mesh key={i} position={[x, 1.12, -5.68]}>
              <sphereGeometry args={[0.09, 10, 8]} />
              <meshStandardMaterial color={i % 2 ? "#c98a3d" : "#e0b26a"} roughness={0.7} />
            </mesh>
          ))
        : null}
      <MenuBoard kind={kind} />
      {/* repisa con frascos */}
      <mesh position={[-2.2, 1.55, -6.82]}>
        <boxGeometry args={[3.4, 0.05, 0.25]} />
        <meshStandardMaterial color={p.trim} />
      </mesh>

      {/* mesas, sillas y gente */}
      {TABLES.map(([x, z], i) => (
        <Table key={i} position={[x, 0, z]} top={p.table} cups={full ? 2 : 0} />
      ))}
      {seated.map((s, i) => (
        <group key={i}>
          <Chair position={[s.chair[0], 0, s.chair[1]]} rot={s.rot} color={p.chair} />
          {s.person ? (
            <Person position={[s.chair[0] + Math.sin(s.rot) * 0.05, 0, s.chair[1] + Math.cos(s.rot) * 0.05]} rot={s.rot} seat shirt={SHIRTS[s.seed % SHIRTS.length]} seed={s.seed} lookDown={!full} phone={!full} />
          ) : null}
        </group>
      ))}
      {/* barista */}
      <Person position={[-2.6, 0, -6.45]} rot={0} shirt={full ? "#1f3d2f" : "#3c4650"} seed={5} phone={!full} lookDown={!full} />
      {full ? (
        <>
          {/* fila en la barra */}
          <Person position={[-1.6, 0, -4.75]} rot={Math.PI} shirt="#c0392b" seed={2} />
          <Person position={[-0.6, 0, -4.4]} rot={Math.PI + 0.3} shirt="#2e86de" seed={8} />
          <Person position={[0.5, 0, -4.9]} rot={Math.PI - 0.5} shirt="#f5b041" seed={4} phone />
          {[
            [-3.8, 2.75, -1.6],
            [-2.0, 2.75, -1.7],
            [0.0, 2.75, -1.55],
            [-1.2, 2.75, -3.8],
            [1.6, 2.75, -3.2],
            [3.4, 2.75, -4.6],
          ].map(([x, y, z], i) => (
            <Pendant key={i} position={[x, y, z]} color="#ffbf73" />
          ))}
          <pointLight position={[-2, 2.6, -2]} intensity={7} distance={8} decay={1.8} color={p.light} />
          <pointLight position={[1.5, 2.6, -2.5]} intensity={7} distance={8} decay={1.8} color={p.light} />
          <pointLight position={[-2, 2.6, -5]} intensity={5} distance={7} decay={1.8} color={p.light} />
          <spotLight position={[0, 7, -2]} angle={0.75} penumbra={0.8} intensity={60} distance={14} decay={1.6} color="#ffcf96" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} target-position={[0, 0, -3.5]} />
          <Plant position={[-4.05, 0, -0.5]} />
          <Plant position={[4.05, 0, -6.4]} scale={1.2} />
          {/* terraza afuera */}
          <Table position={[-2.6, 0, 1.25]} top={p.table} />
          <Chair position={[-3.25, 0, 1.25]} rot={Math.PI / 2} color={p.chair} />
          <Chair position={[-1.95, 0, 1.25]} rot={-Math.PI / 2} color={p.chair} />
          <Person position={[-3.2, 0, 1.25]} rot={Math.PI / 2} seat shirt="#16a085" seed={9} />
          <Person position={[-2.0, 0, 1.25]} rot={-Math.PI / 2} seat shirt="#f1948a" seed={10} />
          <Table position={[0.2, 0, 1.25]} top={p.table} cups={1} />
          <Chair position={[-0.45, 0, 1.25]} rot={Math.PI / 2} color={p.chair} />
          <Person position={[-0.4, 0, 1.25]} rot={Math.PI / 2} seat shirt="#8e44ad" seed={11} />
          <LightPool position={[0, 0.04, 1.6]} size={[11, 4.5]} color="#ffb35c" opacity={0.55} />
          <LightPool position={[0, 0.03, -3.5]} size={[11, 9]} color="#ffb35c" opacity={0.18} />
        </>
      ) : (
        <>
          {[-1.8, 1.4].map((x, i) => (
            <group key={i} position={[x, 2.85, -3.2]}>
              <mesh>
                <boxGeometry args={[2.2, 0.06, 0.12]} />
                <meshBasicMaterial color={new THREE.Color("#e4eeff").multiplyScalar(i === 1 ? flicker : 1)} toneMapped={false} />
              </mesh>
              <Glow position={[0, -0.1, 0]} size={2.6} color="#9cbcff" opacity={0.35 * (i === 1 ? flicker : 1)} />
            </group>
          ))}
          <pointLight position={[-1.8, 2.5, -3.2]} intensity={5} distance={9} decay={1.6} color={p.light} />
          <pointLight position={[1.4, 2.5, -3.2]} intensity={5 * flicker} distance={9} decay={1.6} color={p.light} />
          <spotLight position={[0, 7, -3]} angle={0.75} penumbra={0.9} intensity={30} distance={14} decay={1.6} color="#bcd2ff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} target-position={[0, 0, -3.5]} />
          <LightPool position={[0, 0.04, 1.3]} size={[8, 3]} color="#8db4ff" opacity={0.16} />
        </>
      )}
      {/* tablero de piso (A) junto a la puerta */}
      <group position={[door.x + 1.2, 0, 0.9]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 0.95, 0.04]} />
          <meshStandardMaterial color={full ? "#1b1411" : "#2a3139"} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
