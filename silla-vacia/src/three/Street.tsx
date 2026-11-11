import React, { useMemo } from "react";
import * as THREE from "three";
import { COLORS, WORLD, type V3 } from "../constants";
import { Box, Cyl, Glow, useDrawTexture, useReflect } from "./primitives";

const { room, window: win, door } = WORLD;
const WIN_CX = (win.x0 + win.x1) / 2;
const DOOR_CX = (door.x0 + door.x1) / 2;

/** Posición de los faroles (junto al borde del andén). */
export const LAMPS: V3[] = [
  [-4.6, 0, 2.8],
  [7.6, 0, 2.8],
];

/** Farol: poste, brazo y cabeza encendida. La luz real la pone <StreetLights/>. */
const StreetLamp: React.FC<{ position: V3 }> = ({ position }) => (
  <group position={position}>
    <Cyl r={0.09} r2={0.11} h={0.5} seg={8} position={[0, 0.25, 0]} color="#0D121E" metal={0.5} rough={0.5} />
    <Cyl r={0.045} h={3.5} seg={8} position={[0, 1.95, 0]} color="#0D121E" metal={0.5} rough={0.5} />
    <Box size={[0.06, 0.06, 0.7]} position={[0, 3.68, -0.3]} color="#0D121E" metal={0.5} rough={0.5} />
    <Box size={[0.26, 0.09, 0.42]} position={[0, 3.66, -0.72]} color="#0D121E" metal={0.5} rough={0.5} />
    <Glow size={[0.2, 0.34]} position={[0, 3.61, -0.72]} rotation={[Math.PI / 2, 0, 0]} color="#FFE2B3" additive={false} double />
  </group>
);

/** Vecinos: edificios oscuros con persianas y alguna ventana encendida. */
const Neighbors: React.FC<{ T: number }> = ({ T }) => (
  <group>
    {[
      { x: -(room.halfW + 0.2) - 4, w: 8, lit: [[-1.5, 5.2, "#FFC987"]] as [number, number, string][] },
      { x: room.halfW + 0.2 + 4.5, w: 9, lit: [[-2.2, 7.3, "#FFC987"], [1.6, 5.0, "#9FC1FF"]] as [number, number, string][] },
    ].map((b, i) => (
      <group key={i} position={[b.x, 0, 0]}>
        <Box size={[b.w, 10.4, 6.5]} position={[0, 5.2, -3.3]} color={i ? "#0F1830" : "#121C36"} rough={0.9} cast={false} />
        {/* persiana metálica cerrada */}
        <Box size={[3.2, 2.5, 0.06]} position={[i ? -2 : 1.6, 1.25, -0.02]} color="#26324F" rough={0.6} metal={0.4} cast={false} />
        {Array.from({ length: 9 }).map((_, r) => (
          <Box key={r} size={[3.2, 0.03, 0.03]} position={[i ? -2 : 1.6, 0.2 + r * 0.27, 0.02]} color="#1A2440" cast={false} />
        ))}
        {b.lit.map(([lx, ly, c], k) => (
          <group key={k} position={[lx, ly, -0.03]}>
            <Box size={[1.2, 1.5, 0.05]} color="#0A1122" cast={false} />
            <Glow size={[1.04, 1.34]} position={[0, 0, 0.03]} color={c} opacity={c === "#9FC1FF" ? 0.3 + 0.08 * Math.sin(T * 6.3) : 0.55} additive={false} />
          </group>
        ))}
      </group>
    ))}
  </group>
);

/** Todo lo que está en la calle y debe reflejarse en el piso mojado. */
export const StreetProps: React.FC<{ T: number }> = ({ T }) => (
  <group>
    {LAMPS.map((p, i) => (
      <StreetLamp key={i} position={p} />
    ))}
    <Neighbors T={T} />
  </group>
);

/** Luces reales de la calle (no se duplican en el reflejo). */
export const StreetLights: React.FC<{ door: number; interior: number }> = ({ door: doorOpen, interior }) => {
  const reflect = useReflect();
  const lampTarget = useMemo(() => new THREE.Object3D(), []);
  const doorTarget = useMemo(() => new THREE.Object3D(), []);
  if (reflect) return null;
  return (
    <group>
      {/* relleno frío desde la calle: evita que las caras que miran a la cámara queden negras */}
      <directionalLight position={[3, 2.4, 9]} intensity={0.5} color="#B9CCFF" />
      {/* farol izquierdo: luz suave sin sombras */}
      <pointLight position={[LAMPS[0][0], 3.4, LAMPS[0][2] - 0.7]} intensity={15} distance={11} decay={1.7} color="#FFD9A0" />
      {/* farol derecho: el que proyecta la sombra de Andrés */}
      <primitive object={lampTarget} position={[4.0, 0, 1.4]} />
      <spotLight position={[LAMPS[1][0], 3.55, LAMPS[1][2] - 0.72]} target={lampTarget} angle={1.0} penumbra={0.9} intensity={60} distance={13} decay={1.6} color="#FFD9A0" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0008} shadow-normalBias={0.03} shadow-camera-near={0.5} shadow-camera-far={12} />
      {/* luz cálida de la vidriera sobre el andén */}
      <pointLight position={[WIN_CX, 1.5, 0.5]} intensity={2.2 + 7 * interior} distance={6} decay={1.6} color={COLORS.amber} />
      {/* la puerta se abre: la luz inunda la calle y Andrés proyecta sombra hacia la cámara */}
      <primitive object={doorTarget} position={[DOOR_CX + 0.5, 0, 3.2]} />
      <spotLight position={[DOOR_CX - 0.1, 2.05, -0.75]} target={doorTarget} angle={0.62} penumbra={0.85} intensity={85 * doorOpen} distance={10} decay={1.5} color={COLORS.warm} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0008} shadow-normalBias={0.03} shadow-camera-near={0.3} shadow-camera-far={9} />
    </group>
  );
};

/** Piso mojado: plano oscuro semitransparente; debajo va la copia invertida del mundo. */
export const WetGround: React.FC<{ door: number; interior: number; lamp: number }> = ({ door: doorOpen, interior, lamp }) => {
  const pool = useDrawTexture(128, 128, (g, w, h) => {
    const grad = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.45, "#606060");
    grad.addColorStop(1, "#000000");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
  });
  // luz que sale por la vidriera / la puerta: intensa junto a la fachada y se desvanece
  const spill = useDrawTexture(128, 128, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = 1 - y / h; // 1 junto a la fachada
        const u = Math.abs(x / w - 0.5) * 2;
        const side = Math.max(0, 1 - Math.pow(u / (0.55 + 0.45 * (1 - v)), 3));
        const c = Math.round(255 * Math.pow(v, 1.6) * side);
        const i = (y * w + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = c;
        img.data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
  });
  const tiles = useDrawTexture(
    128,
    128,
    (g) => {
      g.fillStyle = "#000000";
      g.fillRect(0, 0, 128, 128);
      g.strokeStyle = "#3a4666";
      g.lineWidth = 2;
      g.strokeRect(1, 1, 126, 126);
    },
    [40, 3],
  );
  const flat: V3 = [-Math.PI / 2, 0, 0];
  return (
    <group>
      <mesh position={[0, 0, 10]} rotation={flat} receiveShadow renderOrder={1}>
        <planeGeometry args={[60, 20]} />
        <meshStandardMaterial color="#070B17" roughness={0.28} metalness={0.55} envMapIntensity={0.5} transparent opacity={0.72} />
      </mesh>
      {/* juntas del andén, bordillo y línea de la calle */}
      <Glow size={[60, 3]} position={[0, 0.004, 1.5]} rotation={flat} color="#ffffff" map={tiles} opacity={0.35} />
      <Box size={[60, 0.05, 0.2]} position={[0, 0.025, 3.12]} color="#2A3350" rough={0.6} cast={false} />
      {[-9, -5, -1, 3, 7, 11].map((x) => (
        <Box key={x} size={[1.7, 0.012, 0.14]} position={[x, 0.006, 6.6]} color="#8E8452" rough={0.6} cast={false} />
      ))}
      {/* charcos de luz */}
      <Glow size={[5.4, 3.6]} position={[WIN_CX, 0.008, 1.8]} rotation={flat} color={COLORS.amber} map={spill} opacity={0.1 + 0.08 * Math.min(1, lamp) + 0.42 * interior} />
      <Glow size={[2.6, 0.9]} position={[WIN_CX, 0.009, 0.5]} rotation={flat} color={COLORS.neon} map={pool} opacity={0.16} />
      <Glow size={[2.6, 5.2]} position={[DOOR_CX + 0.25, 0.01, 2.6]} rotation={flat} color={COLORS.warm} map={spill} opacity={0.75 * doorOpen} />
      {LAMPS.map((p, i) => (
        <Glow key={i} size={[4.6, 4.6]} position={[p[0], 0.007, p[2] - 0.7]} rotation={flat} color="#FFD9A0" map={pool} opacity={0.2} />
      ))}
    </group>
  );
};
