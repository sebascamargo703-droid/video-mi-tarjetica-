import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { SIZE } from "./Cenefa";

/**
 * Versión sin texto: solo el logo y los productos. Premium y llamativa: luz de estudio,
 * rayos dorados detrás del logo, cintas de "cera líquida" dorada y roja que cruzan la cenefa,
 * bokeh, destellos y vitrina con reflejo.
 */
const C = { gold: "#F2C230", goldLight: "#FFE69A", goldDeep: "#9C6B06", red: "#D0101F", redDeep: "#6E050C" };

const Flare: React.FC<{ x: number; y: number; size: number; opacity?: number; id: string }> = ({ x, y, size, opacity = 1, id }) => (
  <svg style={{ position: "absolute", left: x - size / 2, top: y - size / 2, opacity, overflow: "visible" }} width={size} height={size} viewBox="-50 -50 100 100">
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} />
        <stop offset="0.35" stopColor={C.goldLight} stopOpacity={0.35} />
        <stop offset="1" stopColor={C.gold} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle r={50} fill={`url(#${id})`} />
    <path d="M0 -50 Q3 -3 50 0 Q3 3 0 50 Q-3 3 -50 0 Q-3 -3 0 -50 Z" fill="#FFFFFF" />
    <path d="M0 -24 Q1.5 -1.5 24 0 Q1.5 1.5 0 24 Q-1.5 1.5 -24 0 Q-1.5 -1.5 0 -24 Z" fill="#FFFFFF" transform="rotate(45)" opacity={0.75} />
  </svg>
);

export const CenefaLogo: React.FC = () => {
  const { w, h } = SIZE;
  const logo = { cx: 1500, cy: 760 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* luz de estudio */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            `radial-gradient(ellipse 1300px 900px at ${logo.cx}px ${logo.cy}px, rgba(242,194,48,0.32), transparent 68%)`,
            "radial-gradient(ellipse 1500px 900px at 4350px 800px, rgba(242,194,48,0.22), transparent 70%)",
            "radial-gradient(ellipse 1200px 700px at 3000px 760px, rgba(208,16,31,0.16), transparent 72%)",
            "linear-gradient(180deg, #0b0b0b, #000)",
          ].join(", "),
        }}
      />

      {/* rayos dorados detrás del logo */}
      <svg style={{ position: "absolute", inset: 0 }} width={w} height={h}>
        <defs>
          <radialGradient id="rayFade" cx={logo.cx} cy={logo.cy} r={1500} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.goldLight} stopOpacity={0.4} />
            <stop offset="1" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
        </defs>
        {Array.from({ length: 36 }).map((_, i) => {
          const a0 = (i / 36) * Math.PI * 2;
          const a1 = a0 + Math.PI / 72;
          const R = 1600;
          return <path key={i} d={`M${logo.cx} ${logo.cy} L${logo.cx + R * Math.cos(a0)} ${logo.cy + R * Math.sin(a0)} L${logo.cx + R * Math.cos(a1)} ${logo.cy + R * Math.sin(a1)} Z`} fill="url(#rayFade)" opacity={0.45} />;
        })}
      </svg>

      {/* bokeh dorado */}
      {Array.from({ length: 46 }).map((_, i) => {
        const r = 14 + random(`bk${i}`) * 70;
        const x = random(`bx${i}`) * w;
        const y = 90 + random(`by${i}`) * (h - 180);
        return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,230,154,${0.18 + random(`ba${i}`) * 0.22}) 0%, rgba(242,194,48,0.06) 60%, transparent 72%)`, filter: `blur(${2 + random(`bb${i}`) * 6}px)` }} />;
      })}

      {/* cintas de cera líquida (doradas y roja) */}
      <svg style={{ position: "absolute", inset: 0 }} width={w} height={h}>
        <defs>
          <linearGradient id="ribGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={C.goldDeep} stopOpacity={0} />
            <stop offset="0.18" stopColor={C.gold} />
            <stop offset="0.5" stopColor={C.goldLight} />
            <stop offset="0.82" stopColor={C.gold} />
            <stop offset="1" stopColor={C.goldDeep} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ribRed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={C.redDeep} stopOpacity={0} />
            <stop offset="0.25" stopColor={C.red} />
            <stop offset="0.6" stopColor="#FF3B45" />
            <stop offset="1" stopColor={C.redDeep} stopOpacity={0} />
          </linearGradient>
          <filter id="glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* roja, ancha y baja */}
        <path d={`M-100 1250 C 900 1430, 1900 1000, 3000 1130 S 5100 1380, ${w + 100} 1080 L ${w + 100} 1140 C 5100 1440, 3900 1210, 3000 1200 S 900 1500, -100 1320 Z`} fill="url(#ribRed)" opacity={0.85} filter="url(#glow)" />
        {/* dorada principal */}
        <path d={`M-100 1180 C 1000 1300, 2100 820, 3100 980 S 5000 1260, ${w + 100} 960 L ${w + 100} 990 C 5000 1300, 4000 1060, 3100 1020 S 1000 1360, -100 1215 Z`} fill="url(#ribGold)" filter="url(#glow)" />
        {/* hilos dorados finos */}
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M-100 ${1120 + k * 40} C 1000 ${1240 + k * 30}, 2100 ${760 + k * 50}, 3100 ${930 + k * 40} S 5000 ${1210 + k * 30}, ${w + 100} ${910 + k * 40}`} fill="none" stroke={C.goldLight} strokeOpacity={0.35 - k * 0.08} strokeWidth={4 - k} />
        ))}
        {/* arriba: hilo dorado que enmarca */}
        <path d={`M-100 300 C 1200 120, 2400 420, 3400 260 S 5300 120, ${w + 100} 300`} fill="none" stroke="url(#ribGold)" strokeWidth={6} opacity={0.55} filter="url(#glow)" />
      </svg>

      {/* marco dorado fino */}
      <div style={{ position: "absolute", inset: 40, border: `3px solid ${C.gold}`, opacity: 0.8, boxShadow: `0 0 30px rgba(242,194,48,0.35), inset 0 0 30px rgba(242,194,48,0.15)` }} />

      {/* LOGO héroe */}
      <Img src={staticFile("meguiars-logo-cutout.png")} style={{ position: "absolute", left: logo.cx - 900, top: logo.cy - 556, width: 1800, height: "auto", filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(242,194,48,0.35))" }} />
      <Flare id="f1" x={logo.cx + 445} y={logo.cy - 365} size={380} />

      {/* PRODUCTOS en vitrina */}
      <div style={{ position: "absolute", left: 3250, top: 1225, width: 2300, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,230,154,0.5), transparent 70%)", filter: "blur(10px)" }} />
      <Img src={staticFile("meguiars-productos-cutout.png")} style={{ position: "absolute", left: 3220, top: 130, width: 2300, height: "auto", filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.8))" }} />
      <div style={{ position: "absolute", left: 3220, top: 1376, width: 2300, height: 84, overflow: "hidden", opacity: 0.22, WebkitMaskImage: "linear-gradient(180deg, black, transparent 90%)" }}>
        <Img src={staticFile("meguiars-productos-cutout.png")} style={{ width: 2300, height: "auto", transform: "scaleY(-1)", transformOrigin: "50% 0", marginTop: 1247 }} />
      </div>

      {/* destellos sobre las botellas */}
      <Flare id="f2" x={3560} y={300} size={230} opacity={0.95} />
      <Flare id="f3" x={4420} y={230} size={200} opacity={0.9} />
      <Flare id="f4" x={5300} y={330} size={220} opacity={0.95} />
      <Flare id="f5" x={4900} y={980} size={150} opacity={0.8} />
      <Flare id="f6" x={2860} y={520} size={160} opacity={0.7} />
    </AbsoluteFill>
  );
};
