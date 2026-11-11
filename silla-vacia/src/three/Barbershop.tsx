import React, { useMemo } from "react";
import * as THREE from "three";
import { BUSINESS, COLORS, WORLD, type V3 } from "../constants";
import { rand } from "../motion";
import { Chair } from "./Chair";
import { Box, CHROME, Cyl, Glow, Sphere, useDrawTexture, useReflect, useTextTexture } from "./primitives";

const { room, window: win, door: doorDef, chair, lampY } = WORLD;
const WIN_CX = (win.x0 + win.x1) / 2;
const WIN_W = win.x1 - win.x0;
const WIN_H = win.y1 - win.y0;
const DOOR_CX = (doorDef.x0 + doorDef.x1) / 2;
const DOOR_W = doorDef.x1 - doorDef.x0;

/* ════════════════════════════ INTERIOR ════════════════════════════ */

/** Lámpara colgante sobre la silla: foco con sombras + cono de luz "volumétrico" + polvo flotando. */
const HeroLamp: React.FC<{ lamp: number; T: number }> = ({ lamp, T }) => {
  const target = useMemo(() => new THREE.Object3D(), []);
  const coneTex = useDrawTexture(8, 128, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.35, "#8a8a8a");
    grad.addColorStop(1, "#000000");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
  });
  const poolTex = useDrawTexture(128, 128, (g, w, h) => {
    const grad = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.5, "#555555");
    grad.addColorStop(1, "#000000");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
  });
  const [cx, , cz] = chair.pos;
  const coneGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 1.5, lampY, 28, 1, true), []);
  const dust = useMemo(() => Array.from({ length: 34 }, (_, i) => ({ a: rand(i) * Math.PI * 2, r: 0.1 + rand(i + 50) * 0.75, y: rand(i + 100), s: 0.006 + rand(i + 150) * 0.008, v: 0.02 + rand(i + 200) * 0.04 })), []);
  const k = Math.min(1.6, lamp);
  return (
    <group>
      <primitive object={target} position={[cx, 0.55, cz]} />
      <spotLight position={[cx, lampY - 0.02, cz]} target={target} angle={0.66} penumbra={0.8} intensity={17 * lamp} distance={9} decay={1.5} color={COLORS.amber} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0006} shadow-normalBias={0.02} shadow-camera-near={0.3} shadow-camera-far={6} />
      {/* cable, pantalla y bombillo */}
      <Cyl r={0.008} h={room.height - lampY - 0.2} seg={6} position={[cx, (room.height + lampY + 0.2) / 2, cz]} color="#0B0D12" cast={false} />
      <Cyl r={0.07} r2={0.27} h={0.2} seg={20} position={[cx, lampY + 0.1, cz]} color="#14171D" rough={0.5} metal={0.6} flat={false} cast={false} />
      <Sphere r={0.055} position={[cx, lampY + 0.02, cz]} color="#FFE9C4" emissive={COLORS.amber} emissiveIntensity={3 * lamp} cast={false} />
      <Glow size={[0.5, 0.5]} position={[cx, lampY - 0.005, cz]} rotation={[Math.PI / 2, 0, 0]} color={COLORS.amber} map={poolTex} opacity={Math.min(1, 0.8 * lamp)} />
      {/* cono de luz: cilindro abierto con degradado, sumado al fondo */}
      <mesh geometry={coneGeo} position={[cx, lampY / 2, cz]} renderOrder={3}>
        <meshBasicMaterial color={COLORS.amber} map={coneTex} transparent opacity={0.13 * k} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} fog={false} />
      </mesh>
      <Glow size={[3.2, 3.2]} position={[cx, 0.012, cz]} rotation={[-Math.PI / 2, 0, 0]} color={COLORS.amber} map={poolTex} opacity={0.2 * k} />
      {/* polvo en el haz de luz */}
      {dust.map((d, i) => {
        const y = ((d.y + T * d.v) % 1) * (lampY - 0.3) + 0.15;
        const spread = 0.25 + (1 - y / lampY) * 0.95;
        const a = d.a + T * 0.12 * (i % 2 ? 1 : -1);
        return (
          <mesh key={i} position={[cx + Math.cos(a) * d.r * spread, y, cz + Math.sin(a) * d.r * spread]}>
            <sphereGeometry args={[d.s, 4, 4]} />
            <meshBasicMaterial color="#FFE2B0" transparent opacity={0.55 * Math.min(1, k)} toneMapped={false} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Puesto del barbero: espejo, repisa y frascos, detrás de la silla. */
const Station: React.FC<{ interior: number }> = ({ interior }) => {
  const x = chair.pos[0];
  const z = -room.depth;
  const bottles: [number, string, number][] = [
    [-0.7, "#2F6F8F", 0.26],
    [-0.5, "#C98A2B", 0.2],
    [-0.32, "#E9E4D8", 0.3],
    [0.35, "#7A1F26", 0.22],
    [0.55, "#2E5B45", 0.28],
    [0.74, "#E9E4D8", 0.18],
  ];
  return (
    <group position={[x, 0, z]}>
      {/* espejo con marco */}
      <mesh position={[0, 1.95, 0.09]}>
        <planeGeometry args={[1.4, 1.7]} />
        <meshStandardMaterial color="#8FA6C6" metalness={1} roughness={0.08} envMapIntensity={2.2} />
      </mesh>
      <Box size={[1.56, 0.08, 0.08]} position={[0, 2.84, 0.1]} color={COLORS.wood} rough={0.6} />
      <Box size={[1.56, 0.08, 0.08]} position={[0, 1.06, 0.1]} color={COLORS.wood} rough={0.6} />
      <Box size={[0.08, 1.86, 0.08]} position={[-0.74, 1.95, 0.1]} color={COLORS.wood} rough={0.6} />
      <Box size={[0.08, 1.86, 0.08]} position={[0.74, 1.95, 0.1]} color={COLORS.wood} rough={0.6} />
      {/* apliques a los lados del espejo */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.95, 2.2, 0.14]}>
          <Box size={[0.06, 0.16, 0.06]} color="#B08A3E" metal={0.9} rough={0.3} cast={false} />
          <Sphere r={0.06} position={[0, 0.13, 0.03]} color="#FFE9C4" emissive={COLORS.warm} emissiveIntensity={0.5 + 3 * interior} cast={false} />
        </group>
      ))}
      {/* mueble y repisa */}
      <Box size={[2.1, 0.07, 0.46]} position={[0, 0.98, 0.3]} color={COLORS.wood} rough={0.55} />
      <Box size={[2.0, 0.94, 0.4]} position={[0, 0.47, 0.28]} color="#131C33" rough={0.8} />
      {[-0.5, 0.5].map((dx) => (
        <group key={dx} position={[dx, 0.5, 0.485]}>
          <Box size={[0.9, 0.36, 0.012]} color="#1A2644" rough={0.8} cast={false} />
          <Box size={[0.16, 0.025, 0.03]} position={[0, 0.1, 0.015]} {...CHROME} cast={false} />
        </group>
      ))}
      {bottles.map(([bx, color, h], i) => (
        <group key={i} position={[bx, 1.015, 0.3 + (i % 2) * 0.06]}>
          <Cyl r={0.04} h={h} seg={8} position={[0, h / 2, 0]} color={color} rough={0.3} />
          <Cyl r={0.018} h={0.05} seg={6} position={[0, h + 0.025, 0]} color="#1B1B1F" cast={false} />
        </group>
      ))}
      {/* toalla doblada y máquina */}
      <Box size={[0.28, 0.06, 0.2]} position={[0.02, 1.045, 0.3]} color="#E9E4D8" rough={0.95} />
      <Box size={[0.05, 0.05, 0.19]} position={[-0.15, 1.04, 0.38]} rotation={[0, 0.4, 0]} color="#1B1B1F" rough={0.4} metal={0.5} />
    </group>
  );
};

/** Interior completo de la barbería. No se dibuja en el reflejo del piso. */
export const Interior: React.FC<{ lamp: number; interior: number; T: number }> = ({ lamp, interior, T }) => {
  const floorTex = useDrawTexture(
    128,
    128,
    (g) => {
      g.fillStyle = COLORS.floorA;
      g.fillRect(0, 0, 128, 128);
      g.fillStyle = COLORS.floorB;
      g.fillRect(0, 0, 64, 64);
      g.fillRect(64, 64, 64, 64);
    },
    [room.halfW * 2, room.depth],
  );
  const W = room.halfW * 2;
  const D = room.depth;
  const H = room.height;
  return (
    <group>
      {/* piso de baldosas en damero */}
      <mesh position={[0, 0, -D / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floorTex} roughness={0.32} metalness={0.15} envMapIntensity={0.6} />
      </mesh>
      {/* paredes y techo */}
      <Box size={[W, H, 0.15]} position={[0, H / 2, -D - 0.075]} color={COLORS.wall} cast={false} />
      <Box size={[0.15, H, D]} position={[-room.halfW - 0.075, H / 2, -D / 2]} color={COLORS.wall} cast={false} />
      <Box size={[0.15, H, D]} position={[room.halfW + 0.075, H / 2, -D / 2]} color={COLORS.wall} cast={false} />
      <Box size={[W, 0.1, D]} position={[0, H + 0.05, -D / 2]} color={COLORS.wallDark} cast={false} />
      {/* zócalo de madera */}
      <Box size={[W, 1.0, 0.04]} position={[0, 0.5, -D + 0.02]} color="#2B1D14" rough={0.7} cast={false} />
      <Box size={[0.04, 1.0, D]} position={[-room.halfW + 0.02, 0.5, -D / 2]} color="#2B1D14" rough={0.7} cast={false} />
      <Box size={[0.04, 1.0, D]} position={[room.halfW - 0.02, 0.5, -D / 2]} color="#2B1D14" rough={0.7} cast={false} />

      <Chair position={chair.pos} yaw={chair.yaw} />
      <HeroLamp lamp={lamp} T={T} />
      <Station interior={interior} />

      {/* estante con productos */}
      <group position={[2.3, 0, -D + 0.2]}>
        <Box size={[1.3, 2.3, 0.3]} position={[0, 1.15, 0]} color="#131C33" rough={0.8} />
        {[0.55, 1.1, 1.65].map((y, r) => (
          <group key={y} position={[0, y, 0.02]}>
            <Box size={[1.2, 0.04, 0.3]} color={COLORS.wood} rough={0.6} cast={false} />
            {[-0.42, -0.2, 0.02, 0.24, 0.44].map((bx, i) => (
              <Cyl key={i} r={0.045} h={0.16 + ((i + r) % 3) * 0.05} seg={8} position={[bx, 0.11 + ((i + r) % 3) * 0.025, 0.04]} color={["#2F6F8F", "#C98A2B", "#E9E4D8", "#7A1F26", "#2E5B45"][(i + r) % 5]} rough={0.35} cast={false} />
            ))}
          </group>
        ))}
      </group>

      {/* cuadros y reloj en la pared izquierda */}
      {[
        [-4.6, "#7A1F26", "#E9E4D8"],
        [-2.9, "#1E3A6B", "#C98A2B"],
      ].map(([z, a, b], i) => (
        <group key={i} position={[-room.halfW + 0.05, 1.95, z as number]} rotation={[0, Math.PI / 2, 0]}>
          <Box size={[0.9, 1.2, 0.04]} color="#0B0D12" cast={false} />
          <Box size={[0.78, 1.08, 0.045]} color={a as string} rough={0.9} cast={false} />
          <Box size={[0.5, 0.12, 0.05]} position={[0, 0.25, 0]} color={b as string} cast={false} />
          <Box size={[0.36, 0.36, 0.05]} position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 4]} color={b as string} cast={false} />
        </group>
      ))}
      <group position={[-room.halfW + 0.06, 2.45, -1.4]} rotation={[0, Math.PI / 2, 0]}>
        <Cyl r={0.24} h={0.04} seg={20} rotation={[Math.PI / 2, 0, 0]} color="#E9E4D8" rough={0.6} cast={false} />
        <Box size={[0.02, 0.17, 0.05]} position={[0.03, 0.06, 0]} rotation={[0, 0, -0.5]} color="#0B0D12" cast={false} />
        <Box size={[0.015, 0.2, 0.05]} position={[-0.05, 0.05, 0]} rotation={[0, 0, 0.9]} color="#0B0D12" cast={false} />
      </group>

      {/* banca de espera en la pared derecha */}
      <group position={[room.halfW - 0.4, 0, -3.3]}>
        <Box size={[0.5, 0.12, 1.9]} radius={0.04} position={[0, 0.46, 0]} color={COLORS.leather} rough={0.5} />
        <Box size={[0.1, 0.5, 1.9]} radius={0.04} position={[0.22, 0.78, 0]} color={COLORS.leather} rough={0.5} />
        {[-0.8, 0.8].map((z) => (
          <Box key={z} size={[0.44, 0.4, 0.04]} position={[0, 0.2, z]} {...CHROME} />
        ))}
      </group>
      {/* perchero junto a la puerta */}
      <group position={[room.halfW - 0.35, 0, -0.75]}>
        <Cyl r={0.16} h={0.03} seg={12} position={[0, 0.015, 0]} color="#0B0D12" />
        <Cyl r={0.02} h={1.8} seg={8} position={[0, 0.9, 0]} color="#0B0D12" />
        <Box size={[0.4, 0.02, 0.02]} position={[0, 1.72, 0]} color="#0B0D12" cast={false} />
        <Box size={[0.02, 0.02, 0.4]} position={[0, 1.72, 0]} color="#0B0D12" cast={false} />
      </group>

      {/* luces generales: apagadas al inicio, encienden cuando Andrés vuelve */}
      {[
        [-1.6, -3.4],
        [1.5, -2.2],
      ].map(([x, z], i) => (
        <group key={i}>
          <Glow size={[1.1, 0.5]} position={[x, H - 0.005, z]} rotation={[Math.PI / 2, 0, 0]} color={COLORS.warm} opacity={0.08 + 0.92 * interior} additive={false} />
          <pointLight position={[x, H - 0.35, z]} intensity={7.5 * interior} distance={10} decay={1.6} color={COLORS.warm} />
        </group>
      ))}
    </group>
  );
};

/* ════════════════════════════ FACHADA ════════════════════════════ */

/** Letrero de neón de la vidriera: texto dibujado en canvas con resplandor. */
const Neon: React.FC<{ T: number }> = ({ T }) => {
  const reflect = useReflect();
  const tex = useTextTexture(1024, 320, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.lineJoin = "round";
    g.font = "italic 600 190px Fraunces, Georgia, serif";
    const draw = (blur: number, width: number, color: string) => {
      g.shadowColor = COLORS.neon;
      g.shadowBlur = blur;
      g.strokeStyle = color;
      g.lineWidth = width;
      g.strokeText(BUSINESS.neonText, w / 2, h / 2 - 26);
      g.beginPath();
      g.moveTo(w * 0.2, h - 62);
      g.lineTo(w * 0.8, h - 62);
      g.stroke();
    };
    draw(70, 16, COLORS.neon);
    draw(40, 12, COLORS.neon);
    draw(14, 5, COLORS.neonCore);
  });
  // zumbido del neón: variación mínima de brillo
  const hum = 0.9 + 0.1 * Math.sin(T * 13) * Math.sin(T * 3.1);
  return (
    <group position={[WIN_CX, win.y1 - 0.36, -0.16]}>
      {tex ? <Glow size={[1.55, 0.485]} color="#ffffff" map={tex} opacity={hum} double /> : null}
      {reflect ? null : <pointLight position={[0, -0.1, 0.5]} intensity={3.5 * hum} distance={6} decay={1.7} color={COLORS.neon} />}
      {reflect ? null : <pointLight position={[0, -0.2, -0.7]} intensity={2.2 * hum} distance={5} decay={1.7} color={COLORS.neon} />}
    </group>
  );
};

/** Poste de barbero giratorio junto a la puerta. */
const BarberPole: React.FC<{ T: number }> = ({ T }) => {
  const reflect = useReflect();
  const tex = useDrawTexture(
    64,
    64,
    (g) => {
      g.fillStyle = "#F4F1EA";
      g.fillRect(0, 0, 64, 64);
      const stripe = (color: string, off: number) => {
        g.fillStyle = color;
        for (let k = -2; k < 3; k++) {
          g.beginPath();
          g.moveTo(0, off + k * 64);
          g.lineTo(64, off + k * 64 + 64);
          g.lineTo(64, off + k * 64 + 80);
          g.lineTo(0, off + k * 64 + 16);
          g.fill();
        }
      };
      stripe("#D2232A", 0);
      stripe("#1E4FA8", 32);
    },
    [1, 2],
  );
  tex.offset.y = -T * 0.35;
  return (
    <group position={[doorDef.x1 + 0.42, 1.75, 0.2]}>
      <Box size={[0.08, 0.08, 0.2]} position={[0, 0.3, -0.1]} color="#1B1B1F" cast={false} />
      <Box size={[0.08, 0.08, 0.2]} position={[0, -0.3, -0.1]} color="#1B1B1F" cast={false} />
      <mesh>
        <cylinderGeometry args={[0.085, 0.085, 0.62, 16]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <Cyl r={0.1} h={0.07} seg={14} position={[0, 0.345, 0]} {...CHROME} cast={false} />
      <Cyl r={0.1} h={0.07} seg={14} position={[0, -0.345, 0]} {...CHROME} cast={false} />
      <Sphere r={0.07} position={[0, 0.41, 0]} {...CHROME} cast={false} />
      {reflect ? null : <pointLight position={[0, 0, 0.35]} intensity={1.6} distance={3} color="#DCE6FF" />}
    </group>
  );
};

/** Aviso pintado sobre la vidriera. */
const Sign: React.FC = () => {
  const tex = useTextTexture(1024, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "800 74px Inter, sans-serif";
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "10px";
    g.fillStyle = "#F1E6CF";
    g.fillText(BUSINESS.signText, w / 2, h / 2 + 4);
  });
  return (
    <group position={[WIN_CX, win.y1 + 0.33, 0.04]}>
      <Box size={[WIN_W + 0.3, 0.56, 0.1]} color={COLORS.facadeTrim} rough={0.7} />
      {tex ? <Glow size={[3.6, 0.45]} position={[0, 0, 0.056]} color="#ffffff" map={tex} opacity={0.55} additive={false} /> : null}
    </group>
  );
};

/**
 * Fachada con vidriera, puerta y pisos de arriba. Se dibuja dos veces: normal e
 * invertida (reflejo en el piso mojado); en el reflejo la vidriera y la puerta
 * abierta se reemplazan por paneles de luz.
 */
export const Facade: React.FC<{ door: number; lamp: number; interior: number; T: number }> = ({ door, lamp, interior, T }) => {
  const reflect = useReflect();
  const H = room.height;
  const wall = (size: V3, position: V3, color: string = COLORS.facade) => <Box size={size} position={position} color={color} rough={0.85} cast={false} />;
  const glowIn = 0.1 + 0.08 * Math.min(1, lamp) + 0.5 * interior;
  const upper: { x: number; y: number; lit?: string }[] = [
    { x: -2.3, y: 4.9, lit: "#FFC987" },
    { x: -0.2, y: 4.9 },
    { x: 1.9, y: 4.9 },
    { x: -2.3, y: 7.2 },
    { x: -0.2, y: 7.2, lit: "#8FB4FF" },
    { x: 1.9, y: 7.2 },
  ];
  return (
    <group>
      {/* muro alrededor de la vidriera y la puerta */}
      {wall([win.x0 + room.halfW + 0.2, H, 0.2], [(win.x0 - room.halfW - 0.2) / 2, H / 2, -0.1])}
      {wall([WIN_W, win.y0, 0.24], [WIN_CX, win.y0 / 2, -0.1], COLORS.facadeTrim)}
      {wall([WIN_W, H - win.y1, 0.2], [WIN_CX, (H + win.y1) / 2, -0.1])}
      {wall([doorDef.x0 - win.x1, H, 0.2], [(doorDef.x0 + win.x1) / 2, H / 2, -0.1])}
      {wall([DOOR_W, H - doorDef.height, 0.2], [DOOR_CX, (H + doorDef.height) / 2, -0.1])}
      {wall([room.halfW + 0.2 - doorDef.x1, H, 0.2], [(room.halfW + 0.2 + doorDef.x1) / 2, H / 2, -0.1])}
      {/* marco de la vidriera */}
      <Box size={[WIN_W + 0.08, 0.06, 0.26]} position={[WIN_CX, win.y1, -0.1]} color="#0B0D12" cast={false} />
      <Box size={[WIN_W + 0.08, 0.06, 0.26]} position={[WIN_CX, win.y0, -0.1]} color="#0B0D12" cast={false} />
      <Box size={[0.06, WIN_H, 0.26]} position={[win.x0, (win.y0 + win.y1) / 2, -0.1]} color="#0B0D12" cast={false} />
      <Box size={[0.06, WIN_H, 0.26]} position={[win.x1, (win.y0 + win.y1) / 2, -0.1]} color="#0B0D12" cast={false} />
      {reflect ? (
        // en el reflejo: la vidriera es un panel de luz cálida
        <Glow size={[WIN_W, WIN_H]} position={[WIN_CX, (win.y0 + win.y1) / 2, 0.02]} color={COLORS.amber} opacity={glowIn} additive={false} />
      ) : (
        <mesh position={[WIN_CX, (win.y0 + win.y1) / 2, -0.1]} renderOrder={1}>
          <planeGeometry args={[WIN_W, WIN_H]} />
          <meshStandardMaterial color="#9CC4FF" transparent opacity={0.1} roughness={0.05} metalness={0.9} envMapIntensity={1.5} depthWrite={false} />
        </mesh>
      )}
      <Neon T={T} />
      <Sign />
      <BarberPole T={T} />

      {/* puerta: gira sobre la bisagra izquierda, hacia adentro */}
      <Box size={[0.07, doorDef.height, 0.24]} position={[doorDef.x0, doorDef.height / 2, -0.1]} color="#0B0D12" cast={false} />
      <Box size={[0.07, doorDef.height, 0.24]} position={[doorDef.x1, doorDef.height / 2, -0.1]} color="#0B0D12" cast={false} />
      <Box size={[DOOR_W + 0.07, 0.07, 0.24]} position={[DOOR_CX, doorDef.height, -0.1]} color="#0B0D12" cast={false} />
      <group position={[doorDef.x0 + 0.035, 0, -0.1]} rotation={[0, door * 1.42, 0]}>
        <Box size={[DOOR_W - 0.07, doorDef.height - 0.06, 0.05]} position={[(DOOR_W - 0.07) / 2, doorDef.height / 2 - 0.02, 0]} color={COLORS.facadeTrim} rough={0.6} />
        <Glow size={[0.56, 0.9]} position={[(DOOR_W - 0.07) / 2, 1.5, 0.028]} color={COLORS.amber} opacity={0.16 + 0.5 * interior} additive={false} />
        <Box size={[0.03, 0.3, 0.05]} position={[DOOR_W - 0.2, 1.1, 0.045]} {...CHROME} cast={false} />
      </group>
      {reflect ? (
        <Glow size={[DOOR_W - 0.1, doorDef.height - 0.05]} position={[DOOR_CX, doorDef.height / 2, 0.02]} color={COLORS.warm} opacity={0.85 * door} additive={false} />
      ) : (
        // resplandor cálido en el vano cuando la puerta se abre
        <Glow size={[DOOR_W - 0.08, doorDef.height - 0.04]} position={[DOOR_CX, doorDef.height / 2, -0.22]} color={COLORS.amber} opacity={0.5 * door} />
      )}

      {/* pisos de arriba con un par de ventanas encendidas */}
      <Box size={[room.halfW * 2 + 0.4, 6.2, room.depth]} position={[0, H + 3.1, -room.depth / 2 - 0.1]} color="#111B33" rough={0.9} cast={false} />
      <Box size={[room.halfW * 2 + 0.6, 0.14, 0.4]} position={[0, H + 0.05, 0.1]} color="#0B1226" cast={false} />
      {upper.map((u, i) => (
        <group key={i} position={[u.x, u.y, 0.11]}>
          <Box size={[1.2, 1.5, 0.05]} color="#0A1122" cast={false} />
          {u.lit ? <Glow size={[1.04, 1.34]} position={[0, 0, 0.03]} color={u.lit} opacity={u.lit === "#8FB4FF" ? 0.35 + 0.1 * Math.sin(T * 7) : 0.6} additive={false} /> : null}
          <Box size={[1.3, 0.06, 0.12]} position={[0, -0.78, 0.03]} color="#1B2A4A" cast={false} />
        </group>
      ))}
    </group>
  );
};
