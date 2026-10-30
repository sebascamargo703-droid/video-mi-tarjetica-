import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SIZE } from "./Cenefa";
import { venta } from "./copy";
import { sans } from "./fonts";

/** Versión "punto de venta": sobria y premium (negro, dorado fino, un toque de rojo). */
const C = {
  black: "#050505",
  gold: "#E8B923",
  goldLight: "#F7DC7A",
  goldDeep: "#A9780C",
  red: "#C8102E",
  white: "#F7F7F5",
  grey: "#B9B9B4",
};
const GOLD = `linear-gradient(180deg, ${C.goldLight} 0%, ${C.gold} 45%, ${C.goldDeep} 100%)`;
const goldText: React.CSSProperties = { background: GOLD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };

const Icon: React.FC<{ kind: "shield" | "drop" | "bag" }> = ({ kind }) => (
  <svg width={76} height={76} viewBox="0 0 48 48" style={{ display: "block", flexShrink: 0 }}>
    <circle cx={24} cy={24} r={22.5} fill="none" stroke={C.gold} strokeWidth={1.6} />
    <g fill="none" stroke={C.gold} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {kind === "shield" ? <path d="M24 12 L34 16 V24 C34 30 29.5 34 24 36 C18.5 34 14 30 14 24 V16 Z M19.5 24 L23 27.5 L29 21" /> : null}
      {kind === "drop" ? <path d="M24 11 C24 11 15 21 15 27 A9 9 0 0 0 33 27 C33 21 24 11 24 11 Z M20 28 Q20.5 31.5 24 32" /> : null}
      {kind === "bag" ? <path d="M15 19 H33 L31.5 35 H16.5 Z M19.5 19 V17 A4.5 4.5 0 0 1 28.5 17 V19" /> : null}
    </g>
  </svg>
);

export const CenefaVenta: React.FC = () => {
  const { w, h } = SIZE;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden", fontFamily: sans }}>
      {/* iluminación de estudio */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse 1100px 800px at 4900px 760px, rgba(232,185,35,0.20), transparent 70%)",
            "radial-gradient(ellipse 900px 700px at 860px 760px, rgba(232,185,35,0.13), transparent 70%)",
            "radial-gradient(ellipse 2200px 900px at 2900px 380px, rgba(255,255,255,0.06), transparent 70%)",
            "linear-gradient(180deg, #0c0c0c 0%, #050505 55%, #000 100%)",
          ].join(", "),
        }}
      />
      {/* metal cepillado muy sutil */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 4px)" }} />

      {/* marco dorado fino con esquinas */}
      <div style={{ position: "absolute", inset: 48, border: `3px solid ${C.gold}`, opacity: 0.85 }} />
      <div style={{ position: "absolute", inset: 66, border: "1.5px solid rgba(232,185,35,0.35)" }} />
      {[
        [48, 48],
        [w - 48, 48],
        [48, h - 48],
        [w - 48, h - 48],
      ].map(([x, y]) => (
        <div key={`${x}-${y}`} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, background: C.gold, transform: "rotate(45deg)" }} />
      ))}
      {/* filete rojo inferior */}
      <div style={{ position: "absolute", left: 600, right: 600, bottom: 48, height: 10, background: C.red, transform: "translateY(5px)" }} />

      {/* LOGO */}
      <Img src={staticFile("meguiars-logo.png")} style={{ position: "absolute", left: 170, top: 290, width: 1500, height: "auto", mixBlendMode: "lighten" }} />
      {/* divisor */}
      <div style={{ position: "absolute", left: 1790, top: 260, width: 3, height: 980, background: `linear-gradient(180deg, transparent, ${C.gold}, transparent)` }} />

      {/* MENSAJE */}
      <div style={{ position: "absolute", left: 1930, top: 380, width: 2200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <span style={{ width: 120, height: 3, background: C.gold }} />
          <span style={{ fontWeight: 600, fontSize: 78, letterSpacing: "0.34em", ...goldText }}>{venta.kicker}</span>
        </div>
        <div style={{ marginTop: 40, fontWeight: 600, fontSize: 172, lineHeight: 1, letterSpacing: "-0.025em", color: C.white }}>{venta.line1}</div>
        <div style={{ marginTop: 18, fontWeight: 800, fontSize: 178, lineHeight: 1.06, letterSpacing: "-0.03em", whiteSpace: "nowrap", ...goldText, filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.6))" }}>{venta.line2}</div>
        <div style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 46 }}>
          {venta.props.map((p, i) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Icon kind={(["shield", "drop", "bag"] as const)[i]} />
              <span style={{ fontSize: 46, fontWeight: 600, color: i === 2 ? C.gold : C.grey, whiteSpace: "nowrap" }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTOS en vitrina */}
      <div style={{ position: "absolute", left: 4250, top: 1170, width: 1640, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(232,185,35,0.35), transparent 70%)", filter: "blur(6px)" }} />
      <Img src={staticFile("meguiars-productos.png")} style={{ position: "absolute", left: 4250, top: 270, width: 1640, height: "auto", mixBlendMode: "lighten" }} />
      <div style={{ position: "absolute", left: 4250, top: 1158, width: 1640, height: 230, overflow: "hidden", opacity: 0.18, WebkitMaskImage: "linear-gradient(180deg, black, transparent 75%)" }}>
        <Img src={staticFile("meguiars-productos.png")} style={{ width: 1640, height: "auto", transform: "scaleY(-1)", transformOrigin: "50% 0", marginTop: 888, mixBlendMode: "lighten" }} />
      </div>
    </AbsoluteFill>
  );
};
