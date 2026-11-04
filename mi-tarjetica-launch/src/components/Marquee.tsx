import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, tracking } from "../fonts";

/**
 * Cinta de palabras en movimiento lineal constante (la única animación
 * lineal del video). Repite los items para que nunca se vea el final
 * dentro de la duración de una escena.
 */
export const Marquee: React.FC<{
  items: readonly string[];
  /** px por segundo; negativo = hacia la izquierda. */
  speed: number;
  fontSize: number;
  color: string;
  pillBg?: string;
  pillBorder?: string;
  offset?: number;
  gap?: number;
  opacity?: number;
}> = ({
  items,
  speed,
  fontSize,
  color,
  pillBg = "transparent",
  pillBorder,
  offset = 0,
  gap,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = offset + (frame / fps) * speed;
  const g = gap ?? fontSize * 0.45;
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        display: "flex",
        gap: g,
        transform: `translateX(${x}px)`,
        whiteSpace: "nowrap",
        opacity,
      }}
    >
      {repeated.map((item, i) => (
        <div
          key={i}
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize,
            letterSpacing: tracking.title,
            color,
            padding: `${fontSize * 0.32}px ${fontSize * 0.75}px`,
            borderRadius: 999,
            background: pillBg,
            border: pillBorder ? `${Math.max(1, fontSize * 0.03)}px solid ${pillBorder}` : undefined,
            flexShrink: 0,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
