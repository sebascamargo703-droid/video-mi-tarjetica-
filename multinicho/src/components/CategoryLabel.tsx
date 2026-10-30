import React from "react";
import { font, tracking } from "../fonts";
import { palette } from "../brand";
import { SlotText } from "./SlotText";

/** Kicker pequeño + categoría grande (con cambio tipo tragamonedas). Ajusta el tamaño al ancho. */
export const CategoryLabel: React.FC<{
  kicker: string;
  text: string;
  prev?: string | null;
  p: number;
  maxWidth: number;
  maxSize: number;
  color: string;
  kickerSize: number;
  opacity?: number;
}> = ({ kicker, text, prev, p, maxWidth, maxSize, color, kickerSize, opacity = 1 }) => {
  const sizeFor = (t: string) => Math.min(maxSize, Math.floor(maxWidth / (t.length * 0.6)));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: kickerSize * 0.25, opacity, fontFamily: font }}>
      <div style={{ fontSize: kickerSize, fontWeight: 600, letterSpacing: tracking.caps, color: palette.textSecondary }}>{kicker}</div>
      <SlotText
        text={text}
        prev={prev}
        p={p}
        align="center"
        sizeFor={sizeFor}
        style={{ fontWeight: 800, letterSpacing: tracking.headline, lineHeight: 1.05, color, whiteSpace: "nowrap" }}
      />
    </div>
  );
};
