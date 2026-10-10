import React from "react";

/** Indicador de página: el punto activo es una píldora. */
export const Dots: React.FC<{ total: number; active: number; color: string; y: number }> = ({ total, active, color, y }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y - 6, display: "flex", justifyContent: "center", gap: 12 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ width: i === active ? 34 : 12, height: 12, borderRadius: 6, background: color, opacity: i === active ? 1 : 0.3 }} />
    ))}
  </div>
);
