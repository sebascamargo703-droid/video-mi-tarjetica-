import React from "react";

/** Celular genérico (sin marca): marco espresso, isla superior y pantalla redondeada. */
export const Phone: React.FC<{ w: number; h: number; screen: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, screen, children, style }) => {
  const pad = w * 0.04;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.15, background: "#241A14", padding: pad, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0, 0, 0, 0.35), inset 0 0 0 2px rgba(255,255,255,0.08)", ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.115, background: screen, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: w * 0.03, width: w * 0.28, height: w * 0.075, marginLeft: -w * 0.14, borderRadius: w * 0.04, background: "#120C09", zIndex: 5 }} />
        {children}
      </div>
    </div>
  );
};

/** Barra de estado genérica (hora + señal + batería). */
export const StatusBar: React.FC<{ color: string; size: number; time?: string }> = ({ color, size, time = "9:41" }) => (
  <div style={{ position: "absolute", left: size * 1.6, right: size * 1.6, top: size * 1.05, display: "flex", justifyContent: "space-between", alignItems: "center", color, fontWeight: 600, fontSize: size, zIndex: 6 }}>
    <span>{time}</span>
    <span style={{ display: "flex", gap: size * 0.3, alignItems: "flex-end" }}>
      {[0.4, 0.6, 0.8, 1].map((k) => (
        <span key={k} style={{ width: size * 0.18, height: size * 0.7 * k, borderRadius: 2, background: color }} />
      ))}
      <span style={{ width: size * 1.4, height: size * 0.7, borderRadius: size * 0.18, border: `2px solid ${color}`, marginLeft: size * 0.25, position: "relative" }}>
        <span style={{ position: "absolute", left: 2, top: 2, bottom: 2, width: "70%", borderRadius: 2, background: color }} />
      </span>
    </span>
  </div>
);
