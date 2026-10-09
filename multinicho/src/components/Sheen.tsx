import React from "react";

/** Brillo diagonal que cruza la tarjeta. `p` de 0 a 1; fuera de ese rango no se dibuja. */
export const Sheen: React.FC<{ p: number; strength?: number }> = ({ p, strength = 0.55 }) => {
  if (p <= 0 || p >= 1) return null;
  const x = -60 + p * 220;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `linear-gradient(105deg, transparent ${x - 22}%, rgba(255,255,255,${strength * 0.35}) ${x - 8}%, rgba(255,255,255,${strength}) ${x}%, rgba(255,255,255,${strength * 0.35}) ${x + 8}%, transparent ${x + 22}%)`,
        mixBlendMode: "soft-light",
      }}
    />
  );
};
