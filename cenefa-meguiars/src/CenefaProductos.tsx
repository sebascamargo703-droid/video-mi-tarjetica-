import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { SIZE } from "./Cenefa";

/**
 * Versión sin texto con los productos de referencia (public/productos/, recortados de su fondo):
 * logo al centro con rayos dorados y, a cada lado, una vitrina de dos niveles (repisa de atrás con
 * filo dorado y piso de adelante) con sombra y reflejo. Cintas de "cera líquida", bokeh y destellos.
 */
export const C = { gold: "#F2C230", goldLight: "#FFE69A", goldDeep: "#9C6B06", red: "#D0101F", redDeep: "#6E050C" };

export const Flare: React.FC<{ x: number; y: number; size: number; opacity?: number; id: string }> = ({ x, y, size, opacity = 1, id }) => (
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

/** Vitrina de dos niveles: repisa de atrás (BACK) y piso de adelante (FLOOR). */
const FLOOR = 1340;
const BACK = 1105;
const PRODUCTS: Record<string, { w: number; h: number }> = {
  "kit-pulido": { w: 1157, h: 1222 },
  "all-wheel-cleaner": { w: 437, h: 1220 },
  "cleaner-wax": { w: 496, h: 1277 },
  "linea-limpieza": { w: 1279, h: 808 },
  "ultimate-compound": { w: 509, h: 1248 },
  "endurance-tire-gel": { w: 495, h: 1274 },
  "cleaner-wax-pasta": { w: 1499, h: 1515 },
  "little-joe": { w: 967, h: 713 },
  "air-refresher": { w: 1012, h: 738 },
};
/** Producto recortado, apoyado en `floor`, con sombra y reflejo. */
export const Product: React.FC<{ name: keyof typeof PRODUCTS; x: number; height: number; z?: number; floor?: number; reflect?: number }> = ({ name, x, height, z = 1, floor = FLOOR, reflect }) => {
  const p = PRODUCTS[name];
  const width = (p.w / p.h) * height;
  const src = staticFile(`productos/${name}.png`);
  return (
    <>
      <div style={{ position: "absolute", left: x + width * 0.08, top: floor - 26, width: width * 0.84, height: 52, borderRadius: "50%", background: "rgba(0,0,0,0.85)", filter: "blur(14px)", zIndex: z }} />
      <Img src={src} style={{ position: "absolute", left: x, top: floor - height, width, height, zIndex: z + 1, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))" }} />
      <div style={{ position: "absolute", left: x, top: floor + 4, width, height: reflect ?? (floor === FLOOR ? 150 : 90), overflow: "hidden", opacity: 0.22, zIndex: z, WebkitMaskImage: "linear-gradient(180deg, black, transparent 85%)" }}>
        <Img src={src} style={{ width, height, transform: "scaleY(-1)", transformOrigin: "50% 0", marginTop: height - 4 }} />
      </div>
    </>
  );
};

export const CenefaProductos: React.FC = () => {
  const { w, h } = SIZE;
  const logo = { cx: 3000, cy: 700 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* luz de estudio */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            `radial-gradient(ellipse 1300px 900px at ${logo.cx}px ${logo.cy}px, rgba(242,194,48,0.32), transparent 68%)`,
            "radial-gradient(ellipse 1100px 800px at 1000px 860px, rgba(242,194,48,0.20), transparent 70%)", "radial-gradient(ellipse 1100px 800px at 4900px 860px, rgba(242,194,48,0.20), transparent 70%)",
            "radial-gradient(ellipse 1400px 600px at 3000px 1150px, rgba(208,16,31,0.18), transparent 72%)",
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

      {/* vitrina: piso con brillo */}
      <div style={{ position: "absolute", left: 80, right: 80, top: FLOOR - 6, height: 6, background: "linear-gradient(90deg, transparent, rgba(255,230,154,0.7), transparent)", filter: "blur(2px)" }} />

      {/* LOGO héroe al centro */}
      <Img src={staticFile("meguiars-logo-cutout.png")} style={{ position: "absolute", left: logo.cx - 850, top: logo.cy - 525, width: 1700, height: "auto", zIndex: 5, filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.85)) drop-shadow(0 0 50px rgba(242,194,48,0.4))" }} />
      <Flare id="f1" x={logo.cx + 420} y={logo.cy - 345} size={360} />

      {/* repisas de atrás (vidrio oscuro con filo dorado) */}
      {[
        [90, 2160],
        [3840, 5910],
      ].map(([x0, x1]) => (
        <div key={x0} style={{ position: "absolute", left: x0, top: BACK - 4, width: x1 - x0, height: 40, zIndex: 1 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,230,154,0.25), rgba(20,20,20,0.9) 30%, rgba(0,0,0,0.6))" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: "linear-gradient(90deg, transparent, #FFE69A, transparent)" }} />
        </div>
      ))}

      {/* izquierda · atrás */}
      <Product name="all-wheel-cleaner" x={120} height={880} z={2} floor={BACK} />
      <Product name="cleaner-wax" x={430} height={810} z={2} floor={BACK} />
      <Product name="kit-pulido" x={740} height={840} z={2} floor={BACK} />
      <Product name="endurance-tire-gel" x={1560} height={830} z={2} floor={BACK} />
      {/* izquierda · adelante */}
      <Product name="cleaner-wax-pasta" x={560} height={480} z={8} />

      {/* derecha · atrás */}
      <Product name="linea-limpieza" x={3990} height={800} z={2} floor={BACK} />
      <Product name="ultimate-compound" x={5330} height={880} z={2} floor={BACK} />
      {/* derecha · adelante */}
      <Product name="air-refresher" x={4150} height={460} z={8} />
      <Product name="little-joe" x={4930} height={420} z={8} />

      {/* destellos */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
        <Flare id="f2" x={260} y={250} size={200} opacity={0.9} />
        <Flare id="f3" x={1700} y={300} size={180} opacity={0.9} />
        <Flare id="f4" x={4300} y={420} size={190} opacity={0.9} />
        <Flare id="f5" x={5640} y={300} size={210} opacity={0.95} />
        <Flare id="f8" x={820} y={900} size={150} opacity={0.85} />
        <Flare id="f6" x={2100} y={260} size={140} opacity={0.7} />
        <Flare id="f7" x={3900} y={240} size={150} opacity={0.75} />
      </div>
    </AbsoluteFill>
  );
};
