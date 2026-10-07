import React, { useId } from "react";
import { AbsoluteFill } from "remotion";

/**
 * Look cinematográfico aplicado al video real.
 *  1. Curva S por canal (SVG feComponentTransfer):
 *     - negros ligeramente elevados (el canal nunca baja de ~3-5%)
 *     - sombras frías: el azul/verde arrancan un poco más alto que el rojo
 *     - altas luces cálidas: el rojo llega a 1.0, el azul se queda en 0.96
 *  2. filter CSS: contraste, saturación 105% y brillo.
 *  3. Overlays con mix-blend-mode para redondear el split-toning.
 */
export const CinematicGrade: React.FC<{
  children: React.ReactNode;
  /** 0 = sin grade, 1 = grade completo. */
  intensity?: number;
}> = ({ children, intensity = 1 }) => {
  const id = useId().replace(/:/g, "");
  const mix = (a: number[], b: number[]) =>
    a.map((v, i) => (v + (b[i] - v) * intensity).toFixed(3)).join(" ");
  const linear = [0, 0.25, 0.5, 0.75, 1];

  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={`grade-${id}`} colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues={mix(linear, [0.03, 0.225, 0.5, 0.79, 1.0])} />
            <feFuncG type="table" tableValues={mix(linear, [0.045, 0.235, 0.5, 0.775, 0.985])} />
            <feFuncB type="table" tableValues={mix(linear, [0.06, 0.25, 0.495, 0.755, 0.955])} />
          </feComponentTransfer>
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          filter: `url(#grade-${id}) contrast(${1 + 0.04 * intensity}) saturate(${
            1 + 0.05 * intensity
          }) brightness(${1 + 0.01 * intensity})`,
        }}
      >
        {children}
      </AbsoluteFill>
      {/* sombras frías (teal) */}
      <AbsoluteFill
        style={{
          backgroundColor: "#0d3b48",
          mixBlendMode: "screen",
          opacity: 0.1 * intensity,
        }}
      />
      {/* altas luces cálidas */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 80% at 50% 20%, #ffd7a8 0%, rgba(255,215,168,0) 70%)",
          mixBlendMode: "soft-light",
          opacity: 0.18 * intensity,
        }}
      />
    </AbsoluteFill>
  );
};
