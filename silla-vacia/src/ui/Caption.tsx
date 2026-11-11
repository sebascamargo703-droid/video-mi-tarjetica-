import React from "react";
import { COLORS, SAFE } from "../constants";
import { FONT } from "../fonts";
import { EASE, seg } from "../motion";

/** Subtítulo de apoyo en la parte baja de la zona segura. Si `text` está vacío no dibuja nada. */
export const Caption: React.FC<{ text: string; t: number; from: number; to: number }> = ({ text, t, from, to }) => {
  if (!text) return null;
  const inn = seg(t, from, from + 0.5, EASE.out);
  const out = seg(t, to - 0.35, to, EASE.soft);
  if (inn <= 0 || out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.side,
        right: SAFE.side,
        bottom: SAFE.bottom + 70,
        textAlign: "center",
        fontFamily: FONT.text,
        fontWeight: 800,
        fontSize: 60,
        lineHeight: 1.1,
        letterSpacing: "-0.025em",
        color: COLORS.white,
        textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 0 60px rgba(5,10,24,0.9)",
        opacity: inn * (1 - out),
        transform: `translateY(${(1 - inn) * 26}px)`,
      }}
    >
      {text}
    </div>
  );
};
