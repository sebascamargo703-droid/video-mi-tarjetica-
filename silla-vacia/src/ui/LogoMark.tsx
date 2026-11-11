import React from "react";

/** Isotipo de Mi Tarjetica dibujado en SVG (marco redondeado + 3 puntos que crecen). */
export const LogoMark: React.FC<{ height: number; color: string }> = ({ height, color }) => (
  <svg width={(height * 860) / 487} height={height} viewBox="0 0 860 487" style={{ display: "block" }}>
    <rect x={43.5} y={43.5} width={773} height={400} rx={128} fill="none" stroke={color} strokeWidth={87} />
    <circle cx={237} cy={244} r={58} fill={color} />
    <circle cx={448} cy={244} r={79} fill={color} />
    <circle cx={677} cy={244} r={95} fill={color} />
  </svg>
);
