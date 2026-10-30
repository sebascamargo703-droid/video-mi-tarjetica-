import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { C, Flare, Product } from "./CenefaProductos";

/**
 * Banner de canal de YouTube (2560×1440, el tamaño recomendado) con el diseño de la cenefa de productos.
 * YouTube recorta según el dispositivo:
 *  - TV: todo el lienzo (2560×1440).
 *  - Computador: la franja central de 2560×423.
 *  - Celular / zona segura en todos: el centro de 1546×423 (logo + kit de pulido + Ultimate Compound).
 * Todo lo importante va en la franja de 423 px; el resto es fondo para TV.
 */
export const YT = { w: 2560, h: 1440 };
export const BAND = { top: (1440 - 423) / 2, bottom: (1440 + 423) / 2 };
export const SAFE = { left: (2560 - 1546) / 2, right: (2560 + 1546) / 2 };

const FLOOR = 900;
const FRONT = 918;

export const BannerYouTube: React.FC = () => {
  const { w, h } = YT;
  const logo = { cx: 1280, cy: 712, w: 620 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* luz de estudio */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            `radial-gradient(ellipse 620px 420px at ${logo.cx}px ${logo.cy}px, rgba(242,194,48,0.34), transparent 70%)`,
            "radial-gradient(ellipse 520px 360px at 420px 760px, rgba(242,194,48,0.18), transparent 70%)",
            "radial-gradient(ellipse 520px 360px at 2140px 760px, rgba(242,194,48,0.18), transparent 70%)",
            "radial-gradient(ellipse 900px 300px at 1280px 900px, rgba(208,16,31,0.16), transparent 72%)",
            "linear-gradient(180deg, #0b0b0b, #000)",
          ].join(", "),
        }}
      />

      {/* rayos dorados detrás del logo (llenan el lienzo completo para TV) */}
      <svg style={{ position: "absolute", inset: 0 }} width={w} height={h}>
        <defs>
          <radialGradient id="rayFade" cx={logo.cx} cy={logo.cy} r={1100} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.goldLight} stopOpacity={0.42} />
            <stop offset="1" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
        </defs>
        {Array.from({ length: 36 }).map((_, i) => {
          const a0 = (i / 36) * Math.PI * 2;
          const a1 = a0 + Math.PI / 72;
          const R = 1500;
          return <path key={i} d={`M${logo.cx} ${logo.cy} L${logo.cx + R * Math.cos(a0)} ${logo.cy + R * Math.sin(a0)} L${logo.cx + R * Math.cos(a1)} ${logo.cy + R * Math.sin(a1)} Z`} fill="url(#rayFade)" opacity={0.45} />;
        })}
      </svg>

      {/* bokeh dorado */}
      {Array.from({ length: 40 }).map((_, i) => {
        const r = 8 + random(`yk${i}`) * 34;
        const x = random(`yx${i}`) * w;
        const y = 60 + random(`yy${i}`) * (h - 120);
        return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,230,154,${0.18 + random(`ya${i}`) * 0.22}) 0%, rgba(242,194,48,0.06) 60%, transparent 72%)`, filter: `blur(${1 + random(`yb${i}`) * 4}px)` }} />;
      })}

      {/* cintas de cera líquida: pasan por debajo de la vitrina y salen de la franja hacia arriba/abajo */}
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
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={`M-60 905 C 400 980, 820 830, 1280 880 S 2180 975, ${w + 60} 850 L ${w + 60} 880 C 2180 1000, 1700 915, 1280 912 S 400 1010, -60 935 Z`} fill="url(#ribRed)" opacity={0.85} filter="url(#glow)" />
        <path d={`M-60 880 C 430 930, 880 770, 1300 830 S 2150 925, ${w + 60} 815 L ${w + 60} 828 C 2150 942, 1720 852, 1300 846 S 430 952, -60 895 Z`} fill="url(#ribGold)" filter="url(#glow)" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M-60 ${860 + k * 18} C 430 ${905 + k * 14}, 880 ${745 + k * 22}, 1300 ${812 + k * 18} S 2150 ${905 + k * 14}, ${w + 60} ${795 + k * 18}`} fill="none" stroke={C.goldLight} strokeOpacity={0.35 - k * 0.08} strokeWidth={2.5 - k * 0.6} />
        ))}
        {/* hilo superior, dentro de la franja visible */}
        <path d={`M-60 560 C 520 500, 1040 600, 1460 545 S 2240 500, ${w + 60} 560`} fill="none" stroke="url(#ribGold)" strokeWidth={3} opacity={0.5} filter="url(#glow)" />
        {/* para TV: cintas que enmarcan arriba y abajo */}
        <path d={`M-60 300 C 600 200, 1200 380, 1800 260 S 2400 220, ${w + 60} 300`} fill="none" stroke="url(#ribGold)" strokeWidth={5} opacity={0.4} filter="url(#glow)" />
        <path d={`M-60 1180 C 600 1100, 1300 1260, 1900 1150 S 2400 1120, ${w + 60} 1170`} fill="none" stroke="url(#ribRed)" strokeWidth={6} opacity={0.55} filter="url(#glow)" />
      </svg>

      {/* marco dorado fino (solo se ve completo en TV) */}
      <div style={{ position: "absolute", inset: 28, border: `2px solid ${C.gold}`, opacity: 0.75, boxShadow: "0 0 20px rgba(242,194,48,0.35), inset 0 0 20px rgba(242,194,48,0.15)" }} />

      {/* vitrina: piso con brillo */}
      <div style={{ position: "absolute", left: 40, right: 40, top: FLOOR - 3, height: 3, background: "linear-gradient(90deg, transparent, rgba(255,230,154,0.7), transparent)", filter: "blur(1px)" }} />

      {/* LOGO al centro */}
      <Img src={staticFile("meguiars-logo-cutout.png")} style={{ position: "absolute", left: logo.cx - logo.w / 2, top: logo.cy - (logo.w * 1020) / 1652 / 2, width: logo.w, height: "auto", zIndex: 5, filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.85)) drop-shadow(0 0 26px rgba(242,194,48,0.4))" }} />
      <Flare id="y1" x={logo.cx + 155} y={logo.cy - 130} size={140} />

      {/* izquierda: fuera de la zona segura (computador/TV) */}
      <Product name="all-wheel-cleaner" x={70} height={340} z={2} floor={FLOOR} reflect={40} />
      <Product name="cleaner-wax" x={200} height={322} z={2} floor={FLOOR} reflect={40} />
      <Product name="endurance-tire-gel" x={334} height={330} z={2} floor={FLOOR} reflect={40} />
      {/* izquierda: zona segura */}
      <Product name="kit-pulido" x={585} height={345} z={2} floor={FLOOR} reflect={40} />
      <Product name="cleaner-wax-pasta" x={518} height={190} z={8} floor={FRONT} reflect={14} />

      {/* derecha: zona segura */}
      <Product name="ultimate-compound" x={1690} height={345} z={2} floor={FLOOR} reflect={40} />
      <Product name="air-refresher" x={1768} height={195} z={8} floor={FRONT} reflect={14} />
      {/* derecha: fuera de la zona segura */}
      <Product name="linea-limpieza" x={2050} height={305} z={2} floor={FLOOR} reflect={40} />
      <Product name="little-joe" x={2290} height={165} z={8} floor={FRONT} reflect={14} />

      {/* destellos */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
        <Flare id="y2" x={120} y={590} size={90} opacity={0.9} />
        <Flare id="y3" x={880} y={600} size={80} opacity={0.85} />
        <Flare id="y4" x={1700} y={590} size={80} opacity={0.85} />
        <Flare id="y5" x={2470} y={600} size={95} opacity={0.9} />
        <Flare id="y6" x={640} y={300} size={110} opacity={0.6} />
        <Flare id="y7" x={2000} y={1120} size={110} opacity={0.6} />
      </div>
    </AbsoluteFill>
  );
};
