import React from "react";
import { brand } from "../brand";
import { business } from "../copy";
import { font, tracking } from "../fonts";

export const BusinessIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const common = { fill: "none", stroke: color, strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {business.icon === "beer" ? (
        <>
          <path d="M5 8h10v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z" {...common} />
          <path d="M15 10h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" {...common} />
          <path d="M5 8c0-2 1.5-3.5 3.3-3.5.6-1 1.6-1.5 2.7-1.5 1.8 0 3.3 1.3 3.5 3 .9.3 1.5 1.1 1.5 2" {...common} />
          <path d="M8.5 12v6M11.5 12v6" {...common} />
        </>
      ) : business.icon === "coffee" ? (
        <>
          <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" {...common} />
          <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" {...common} />
        </>
      ) : business.icon === "scissors" ? (
        <>
          <circle cx="6" cy="7" r="3" {...common} />
          <circle cx="6" cy="17" r="3" {...common} />
          <path d="M8.5 8.5L20 18M8.5 15.5L20 6" {...common} />
        </>
      ) : (
        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" {...common} />
      )}
    </svg>
  );
};

/**
 * Pin del negocio dibujado "de pie" (billboard) sobre el mapa inclinado, con etiqueta.
 * `x, y` es el punto del suelo ya proyectado a pantalla; `k` la escala de perspectiva.
 */
export const BusinessPin: React.FC<{ x: number; y: number; k: number; appear: number; pop: number }> = ({ x, y, k, appear, pop }) => {
  const s = 1.1 * k;
  const w = 92 * s;
  const h = 118 * s;
  return (
    <>
      {/* Etiqueta */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y - h - 30 * s,
          transform: `translate(-50%, -100%) translateY(${(1 - appear) * 20}px)`,
          opacity: appear,
          padding: `${12 * s}px ${22 * s}px`,
          borderRadius: 999,
          background: "rgba(20,20,22,0.82)",
          border: "1.5px solid rgba(255,255,255,0.14)",
          fontFamily: font,
          fontWeight: 800,
          fontSize: 34 * s,
          letterSpacing: tracking.title,
          color: brand.colors.white,
          whiteSpace: "nowrap",
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
        }}
      >
        {business.name} {business.emoji}
      </div>
      {/* Pin */}
      <div style={{ position: "absolute", left: x - w / 2, top: y - h, width: w, height: h, transformOrigin: "50% 100%", transform: `scale(${pop})` }}>
        <svg width={w} height={h} viewBox="0 0 92 118" style={{ overflow: "visible", filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.55))" }}>
          <path d="M46 116C46 116 6 70 6 44a40 40 0 0 1 80 0c0 26-40 72-40 72z" fill={brand.colors.mint} />
          <circle cx="46" cy="44" r="27" fill={brand.colors.greenDeep} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: (44 - 15) * s, display: "flex", justifyContent: "center" }}>
          <BusinessIcon size={30 * s} color={brand.colors.mint} />
        </div>
      </div>
    </>
  );
};
