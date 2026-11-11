import React from "react";
import { COLORS, type V3 } from "../constants";
import { Box, CHROME, Cyl, Sphere } from "./primitives";

/**
 * La protagonista: silla de barbero clásica. Cuero rojo oscuro, base y brazos
 * cromados, reposapiés y palanca. El frente de la silla mira hacia +z.
 * Medidas útiles: asiento a 0,67 m; reposapiés a 0,22 m.
 */
export const SEAT_TOP = 0.67;

const LEATHER = { color: COLORS.leather, rough: 0.42, metal: 0.05, env: 1.6 } as const;
const LEATHER_DARK = { color: COLORS.leatherDark, rough: 0.5 } as const;

export const Chair: React.FC<{ position?: V3; yaw?: number }> = ({ position = [0, 0, 0], yaw = 0 }) => (
  <group position={position} rotation={[0, yaw, 0]}>
    {/* base cromada y columna hidráulica */}
    <Cyl r={0.36} r2={0.38} h={0.04} seg={28} position={[0, 0.02, 0]} {...CHROME} />
    <Cyl r={0.2} r2={0.3} h={0.06} seg={28} position={[0, 0.07, 0]} {...CHROME} />
    <Cyl r={0.1} h={0.14} seg={16} position={[0, 0.17, 0]} color="#15171C" rough={0.7} flat={false} />
    <Cyl r={0.065} h={0.3} seg={16} position={[0, 0.36, 0]} {...CHROME} />
    {/* armazón y cojín del asiento */}
    <Box size={[0.6, 0.05, 0.6]} position={[0, 0.515, 0]} {...CHROME} />
    <Box size={[0.58, 0.14, 0.58]} radius={0.05} position={[0, 0.6, 0]} {...LEATHER} />
    <Box size={[0.5, 0.012, 0.012]} position={[0, 0.671, 0.12]} {...LEATHER_DARK} cast={false} />
    <Box size={[0.5, 0.012, 0.012]} position={[0, 0.671, -0.08]} {...LEATHER_DARK} cast={false} />
    {/* espaldar inclinado + cabecero */}
    <group position={[0, 0.66, -0.27]} rotation={[-0.14, 0, 0]}>
      <Box size={[0.54, 0.72, 0.13]} radius={0.05} position={[0, 0.38, 0]} {...LEATHER} />
      <Box size={[0.5, 0.62, 0.02]} position={[0, 0.37, -0.075]} {...CHROME} />
      {[-0.2, 0, 0.2].map((y) => (
        <Box key={y} size={[0.46, 0.012, 0.012]} position={[0, 0.4 + y, 0.066]} {...LEATHER_DARK} cast={false} />
      ))}
      <Cyl r={0.012} h={0.2} seg={8} position={[-0.08, 0.83, 0]} {...CHROME} />
      <Cyl r={0.012} h={0.2} seg={8} position={[0.08, 0.83, 0]} {...CHROME} />
      <Box size={[0.3, 0.15, 0.1]} radius={0.04} position={[0, 0.96, 0.01]} {...LEATHER} />
    </group>
    {/* brazos */}
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 0.34, 0, 0]}>
        <Box size={[0.035, 0.3, 0.035]} position={[0, 0.7, 0.14]} {...CHROME} />
        <Box size={[0.035, 0.3, 0.035]} position={[0, 0.7, -0.17]} {...CHROME} />
        <Box size={[0.05, 0.025, 0.44]} position={[0, 0.855, -0.02]} {...CHROME} />
        <Box size={[0.09, 0.06, 0.46]} radius={0.025} position={[0, 0.895, -0.02]} {...LEATHER} />
      </group>
    ))}
    {/* reposapiés */}
    {[-0.16, 0.16].map((x) => (
      <Box key={x} size={[0.03, 0.44, 0.03]} position={[x, 0.35, 0.455]} rotation={[-0.852, 0, 0]} {...CHROME} />
    ))}
    <group position={[0, 0.2, 0.63]} rotation={[0.22, 0, 0]}>
      <Box size={[0.44, 0.03, 0.22]} {...CHROME} />
      {[-0.07, -0.02, 0.03, 0.08].map((z) => (
        <Box key={z} size={[0.4, 0.012, 0.018]} position={[0, 0.02, z]} color="#3A3F48" metal={0.8} rough={0.4} cast={false} />
      ))}
    </group>
    {/* palanca de la bomba */}
    <Cyl r={0.013} h={0.34} seg={8} position={[0.34, 0.4, -0.12]} rotation={[0, 0, -0.9]} {...CHROME} />
    <Sphere r={0.032} position={[0.475, 0.505, -0.12]} color="#15171C" rough={0.5} />
  </group>
);
