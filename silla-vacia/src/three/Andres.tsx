import React from "react";
import { COLORS } from "../constants";
import { lerp } from "../motion";
import type { AndresState } from "../story";
import { SEAT_TOP } from "./Chair";
import { Box, Cyl, useReflect } from "./primitives";

/**
 * Andrés, personaje low-poly: chaqueta, audífonos y celular en la mano.
 * Camina (ciclo por `phase`), mira el celular (`phoneRaise`), gira la cabeza
 * y se sienta (`seated`). El frente del personaje mira hacia +z; su mano
 * derecha queda en -x.
 */
const HIP = 0.9; // altura de la cadera de pie
const THIGH = 0.44;
const SHIN = 0.42;

export const Andres: React.FC<{ state: AndresState }> = ({ state }) => {
  const reflect = useReflect();
  const { pos, yaw, phase, walk, headYaw, headPitch, phoneRaise, phoneGlow, seated, sitDrop } = state;
  const sw = Math.sin(phase) * 0.6 * walk;
  const bob = Math.abs(Math.cos(phase)) * 0.035 * walk;
  const hipY = lerp(HIP + bob, SEAT_TOP + 0.09 + sitDrop, seated);
  const hipZ = lerp(0, -0.06, seated);
  const lean = lerp(0.05 * walk, -0.12, seated);

  const leg = (side: 1 | -1) => {
    const a = side * sw; // + = pierna atrás
    const lift = Math.max(0, Math.sin(phase + (side > 0 ? 0.6 : Math.PI + 0.6))) * 0.75 * walk;
    const thigh = lerp(a - lift * 0.35, -Math.PI / 2, seated);
    const knee = lerp(lift, Math.PI / 2 - 0.05, seated);
    return (
      <group position={[side * 0.11, 0, 0]} rotation={[thigh, 0, 0]}>
        <Box size={[0.16, THIGH, 0.18]} position={[0, -THIGH / 2, 0]} color={COLORS.pants} rough={0.9} />
        <group position={[0, -THIGH, 0]} rotation={[knee, 0, 0]}>
          <Box size={[0.14, SHIN, 0.16]} position={[0, -SHIN / 2, 0]} color={COLORS.pants} rough={0.9} />
          <Box size={[0.15, 0.09, 0.29]} position={[0, -SHIN - 0.01, 0.055]} color={COLORS.shoes} rough={0.6} />
          <Box size={[0.152, 0.03, 0.292]} position={[0, -SHIN - 0.045, 0.055]} color="#B9BDC6" rough={0.7} cast={false} />
        </group>
      </group>
    );
  };

  /** Brazo: `raise` 0 = balanceo natural, 1 = sosteniendo el celular frente al pecho. */
  const arm = (side: 1 | -1, raise: number, phone: boolean) => {
    const swing = -side * sw * 0.8;
    const shoulder = lerp(lerp(swing, -0.42, raise), -0.32, seated);
    const elbow = lerp(lerp(-0.25 - Math.max(0, -swing) * 0.5, -1.75, raise), -1.15, seated);
    const inward = lerp(lerp(0, -side * 0.3, raise), side * 0.12, seated); // hacia el pecho / hacia el apoyabrazos
    return (
      <group position={[side * 0.27, 0.54, 0]} rotation={[shoulder, 0, inward]}>
        <Box size={[0.12, 0.32, 0.13]} position={[0, -0.15, 0]} color={COLORS.jacket} rough={0.85} />
        <group position={[0, -0.3, 0]} rotation={[elbow, 0, 0]}>
          <Box size={[0.11, 0.27, 0.12]} position={[0, -0.13, 0]} color={COLORS.jacket} rough={0.85} />
          <Box size={[0.115, 0.04, 0.125]} position={[0, -0.26, 0]} color={COLORS.jacketDark} rough={0.85} cast={false} />
          <Box size={[0.085, 0.09, 0.1]} position={[0, -0.32, 0]} color={COLORS.skin} rough={0.7} />
          {phone && seated < 0.5 ? (
            <group position={[0, -0.4, 0.03]} rotation={[Math.PI - 0.15, 0, 0]}>
              <Box size={[0.082, 0.165, 0.012]} color="#0D0F14" rough={0.3} metal={0.4} />
              <mesh position={[0, 0, -0.0075]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[0.072, 0.152]} />
                <meshBasicMaterial color={phoneGlow > 0.5 ? "#DCE8FF" : "#5C6C99"} toneMapped={false} />
              </mesh>
              {!reflect && raise > 0.05 ? <pointLight position={[0, 0.02, -0.12]} intensity={0.25 + 0.5 * phoneGlow * raise} distance={1.2} color="#BFD4FF" /> : null}
            </group>
          ) : null}
        </group>
      </group>
    );
  };

  return (
    <group position={[pos[0], 0, pos[2]]} rotation={[0, yaw, 0]}>
      <group position={[0, hipY, hipZ]}>
        {leg(1)}
        {leg(-1)}
        {/* torso con chaqueta */}
        <group rotation={[lean, 0, 0]}>
          <Box size={[0.44, 0.6, 0.27]} radius={0.05} position={[0, 0.3, 0]} color={COLORS.jacket} rough={0.85} />
          <Box size={[0.45, 0.07, 0.28]} position={[0, 0.03, 0]} color={COLORS.jacketDark} rough={0.85} cast={false} />
          <Box size={[0.02, 0.5, 0.01]} position={[0, 0.3, 0.137]} color={COLORS.jacketDark} rough={0.6} cast={false} />
          <Box size={[0.3, 0.07, 0.24]} position={[0, 0.615, 0]} color={COLORS.jacketDark} rough={0.85} cast={false} />
          {arm(1, 0, false)}
          {arm(-1, phoneRaise, true)}
          {/* cuello y cabeza */}
          <Box size={[0.11, 0.08, 0.11]} position={[0, 0.66, 0]} color={COLORS.skin} rough={0.7} cast={false} />
          <group position={[0, 0.7, 0]} rotation={[headPitch, headYaw, 0]}>
            <Box size={[0.23, 0.26, 0.24]} radius={0.045} position={[0, 0.13, 0.005]} color={COLORS.skin} rough={0.7} />
            {/* pelo crecido: dos meses sin corte */}
            <Box size={[0.24, 0.11, 0.25]} radius={0.04} position={[0, 0.265, -0.005]} color={COLORS.hair} rough={0.95} cast={false} />
            <Box size={[0.245, 0.17, 0.09]} position={[0, 0.17, -0.085]} color={COLORS.hair} rough={0.95} cast={false} />
            {/* ojos y cejas */}
            <Box size={[0.03, 0.035, 0.01]} position={[-0.055, 0.15, 0.126]} color="#15110E" cast={false} />
            <Box size={[0.03, 0.035, 0.01]} position={[0.055, 0.15, 0.126]} color="#15110E" cast={false} />
            <Box size={[0.05, 0.012, 0.01]} position={[-0.055, 0.185, 0.126]} color={COLORS.hair} cast={false} />
            <Box size={[0.05, 0.012, 0.01]} position={[0.055, 0.185, 0.126]} color={COLORS.hair} cast={false} />
            {/* audífonos de diadema */}
            <mesh position={[0, 0.16, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.145, 0.016, 6, 14, Math.PI]} />
              <meshStandardMaterial color={COLORS.headphones} roughness={0.5} flatShading />
            </mesh>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.133, 0.13, 0]}>
                <Cyl r={0.055} h={0.045} seg={12} rotation={[0, 0, Math.PI / 2]} color={COLORS.headphones} rough={0.5} />
                <Cyl r={0.03} h={0.05} seg={10} rotation={[0, 0, Math.PI / 2]} color={COLORS.headphonesGlow} emissive={COLORS.headphonesGlow} emissiveIntensity={1.4} cast={false} />
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
};
