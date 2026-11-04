import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { font, logoFont, tracking } from "../fonts";
import { EASE, EASE_IN, clamp, ease } from "../motion";

type Unit = { text: string; kind: "plain" | "serif" | "mark" };

/** Separa una línea en unidades: palabras sueltas, `*grupo serif*` o `[grupo resaltado]`. */
const parse = (line: string): Unit[] => {
  const out: Unit[] = [];
  const re = /\*([^*]+)\*|\[([^\]]+)\]|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) m[1].split(" ").forEach((w) => out.push({ text: w, kind: "serif" }));
    else if (m[2]) out.push({ text: m[2], kind: "mark" });
    else out.push({ text: m[3], kind: "plain" });
  }
  return out;
};

/**
 * Subtítulo cinético sincronizado con la voz: las unidades entran repartidas a lo largo de
 * `speak` frames (subida 26 px + opacidad + blur), el resaltador se pinta de izquierda a derecha.
 */
export const Caption: React.FC<{
  text: string;
  at: number;
  speak: number;
  exitAt?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, at, speak, exitAt = Infinity, size = 66, style }) => {
  const frame = useCurrentFrame();
  const lines = text.split("\n").map(parse);
  const n = lines.reduce((a, l) => a + l.length, 0);
  const stagger = Math.max(2, Math.min(7, Math.round((speak * 0.72) / Math.max(1, n))));
  const exitT = exitAt === Infinity ? 0 : ease(frame, exitAt, 7, EASE_IN);
  if (frame < at - 1 || exitT >= 1) return null;
  let k = 0;
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.14,
        letterSpacing: tracking.headline,
        color: brand.colors.white,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textShadow: "0 4px 28px rgba(0,0,0,0.55)",
        opacity: 1 - exitT,
        transform: `translateY(${-exitT * 16}px)`,
        filter: exitT > 0.02 ? `blur(${exitT * 6}px)` : undefined,
        ...style,
      }}
    >
      {lines.map((units, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "baseline", columnGap: "0.24em" }}>
          {units.map((u, ui) => {
            const start = at + k++ * stagger;
            const t = ease(frame, start, 12, EASE);
            const base: React.CSSProperties = {
              display: "inline-block",
              transform: `translateY(${(1 - t) * 26}px)`,
              opacity: t,
              filter: t < 0.98 ? `blur(${(1 - t) * 8}px)` : undefined,
              whiteSpace: "nowrap",
            };
            if (u.kind === "serif")
              return (
                <span key={ui} style={{ ...base, fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: "1.1em", letterSpacing: "-0.01em", color: brand.colors.mint }}>
                  {u.text}
                </span>
              );
            if (u.kind === "mark") {
              const wipe = interpolate(frame, [start + 2, start + 12], [0, 100], { ...clamp, easing: EASE });
              return (
                <span key={ui} style={{ ...base, position: "relative", color: brand.colors.ink, padding: "0 0.16em", textShadow: "none", margin: "0.04em 0" }}>
                  <span
                    style={{
                      position: "absolute",
                      inset: "0.06em 0 0.02em 0",
                      borderRadius: "0.12em",
                      background: brand.colors.highlight,
                      clipPath: `inset(0 ${100 - wipe}% 0 0)`,
                      boxShadow: "0 8px 30px rgba(143,227,192,0.25)",
                    }}
                  />
                  <span style={{ position: "relative" }}>{u.text}</span>
                </span>
              );
            }
            return (
              <span key={ui} style={base}>
                {u.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
