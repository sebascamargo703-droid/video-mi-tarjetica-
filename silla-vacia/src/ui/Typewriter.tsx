import React from "react";

/**
 * Texto con efecto de tipeo. El texto completo siempre ocupa su espacio (la
 * parte sin escribir va transparente), así los renglones no saltan al escribir.
 */
export const Typewriter: React.FC<{
  text: string;
  t: number; // segundo actual
  start: number; // segundo en que empieza a escribirse
  cps?: number; // caracteres por segundo
  cursorColor: string;
  showCursor?: boolean;
  style?: React.CSSProperties;
}> = ({ text, t, start, cps = 19, cursorColor, showCursor = true, style }) => {
  const chars = Array.from(text);
  const n = Math.max(0, Math.min(chars.length, Math.floor((t - start) * cps)));
  const typing = t >= start && n < chars.length;
  const blink = Math.floor(t * 2.4) % 2 === 0;
  const cursorOn = showCursor && t >= start - 0.25 && (typing || blink);
  return (
    <div style={style}>
      <span>{chars.slice(0, n).join("")}</span>
      <span style={{ position: "relative", display: "inline-block", width: 0, height: "1em", verticalAlign: "baseline" }}>
        <span style={{ position: "absolute", left: "0.06em", bottom: "-0.12em", width: "0.085em", height: "1.02em", borderRadius: "0.04em", background: cursorColor, opacity: cursorOn ? 1 : 0 }} />
      </span>
      <span style={{ opacity: 0 }}>{chars.slice(n).join("")}</span>
    </div>
  );
};
