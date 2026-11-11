import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { copy } from "./copy";
import { sans } from "./fonts";

/** Cenefa 4:1 (6000×1500 px: 200×50 cm a 76 ppp, o 120×30 cm a 127 ppp). */
export const SIZE = { w: 6000, h: 1500 };

/** Paleta tomada de la marca: negro, dorado y rojo. */
const C = {
  black: "#000000",
  gold: "#F5C518",
  goldDeep: "#C8920E",
  goldLight: "#FFE58A",
  red: "#D7141E",
  redDeep: "#8E0A10",
  white: "#FFFFFF",
};
const GOLD_GRADIENT = `linear-gradient(180deg, ${C.goldLight} 0%, ${C.gold} 42%, ${C.goldDeep} 58%, ${C.gold} 100%)`;
const CHROME = "linear-gradient(180deg, #FFFFFF 0%, #E8E8E8 40%, #9A9A9A 52%, #F2F2F2 70%, #BDBDBD 100%)";

/** Destello de 4 puntas (como la estrella del logo). */
const Flare: React.FC<{ x: number; y: number; size: number; opacity?: number }> = ({ x, y, size, opacity = 1 }) => (
  <svg style={{ position: "absolute", left: x - size / 2, top: y - size / 2, opacity, overflow: "visible" }} width={size} height={size} viewBox="-50 -50 100 100">
    <defs>
      <radialGradient id={`fl${x}${y}`}>
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle r={30} fill={`url(#fl${x}${y})`} />
    <path d="M0 -50 Q4 -4 50 0 Q4 4 0 50 Q-4 4 -50 0 Q-4 -4 0 -50 Z" fill="#FFFFFF" />
    <path d="M0 -26 Q2 -2 26 0 Q2 2 0 26 Q-2 2 -26 0 Q-2 -2 0 -26 Z" fill="#FFFFFF" transform="rotate(45)" opacity={0.7} />
  </svg>
);

/** Gotas de agua "perladas" (efecto cera recién aplicada). */
const Beads: React.FC<{ x0: number; x1: number; y0: number; y1: number; n: number; seed: string }> = ({ x0, x1, y0, y1, n, seed }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const r = 8 + random(`${seed}r${i}`) * 26;
      const x = x0 + random(`${seed}x${i}`) * (x1 - x0);
      const y = y0 + random(`${seed}y${i}`) * (y1 - y0);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - r,
            top: y - r,
            width: 2 * r,
            height: 2 * r,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0 18%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.03) 62%, rgba(255,255,255,0.25) 100%)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.6)",
            opacity: 0.55,
          }}
        />
      );
    })}
  </>
);

/** Texto con relleno dorado/cromado, contorno y sombra sólida. */
const Metal: React.FC<{ text: string; size: number; fill: string; stroke: string; shadow: string; style?: React.CSSProperties }> = ({ text, size, fill, stroke, shadow, style }) => (
  <div style={{ position: "relative", fontFamily: sans, fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: "-0.02em", whiteSpace: "nowrap", ...style }}>
    {/* sombra sólida + contorno */}
    <span style={{ position: "absolute", left: size * 0.035, top: size * 0.045, color: shadow, WebkitTextStroke: `${size * 0.06}px ${shadow}` }}>{text}</span>
    <span style={{ position: "absolute", left: 0, top: 0, color: stroke, WebkitTextStroke: `${size * 0.05}px ${stroke}` }}>{text}</span>
    <span style={{ position: "relative", background: fill, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{text}</span>
  </div>
);

export const Cenefa: React.FC = () => {
  const { w, h } = SIZE;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden", fontFamily: sans }}>
      {/* luces de fondo: dorado detrás del logo, rojo al centro, dorado detrás de los productos */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 900px 620px at 900px 760px, rgba(245,197,24,0.30), transparent 70%), radial-gradient(ellipse 1300px 700px at 2950px 760px, rgba(215,20,30,0.30), transparent 72%), radial-gradient(ellipse 1100px 700px at 5000px 800px, rgba(245,197,24,0.26), transparent 70%)` }} />
      {/* fibra de carbono sutil */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, backgroundImage: "repeating-linear-gradient(45deg, #1a1a1a 0 10px, #000 10px 20px), repeating-linear-gradient(-45deg, #141414 0 10px, transparent 10px 20px)", mixBlendMode: "screen" }} />
      {/* haces de velocidad diagonales */}
      <svg style={{ position: "absolute", inset: 0 }} width={w} height={h}>
        {Array.from({ length: 26 }).map((_, i) => {
          const x = 1500 + i * 120 + random(`sl${i}`) * 80;
          const len = 300 + random(`sll${i}`) * 700;
          const y = 120 + random(`sly${i}`) * 1260;
          return <line key={i} x1={x} y1={y} x2={x + len} y2={y - len * 0.18} stroke={i % 3 === 0 ? C.red : C.gold} strokeOpacity={0.12 + random(`slo${i}`) * 0.12} strokeWidth={3 + random(`slw${i}`) * 5} strokeLinecap="round" />;
        })}
      </svg>

      {/* franjas racing arriba y abajo */}
      {[0, h - 70].map((y, i) => (
        <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 70 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: i ? 30 : 0, height: 40, background: GOLD_GRADIENT }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: i ? 0 : 46, height: 18, background: C.red }} />
        </div>
      ))}
      {/* banderas a cuadros en los extremos */}
      {[0, w - 260].map((x, k) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: x,
            top: 70,
            bottom: 70,
            width: 260,
            opacity: 0.9,
            backgroundImage: "conic-gradient(#fff 25%, #000 0 50%, #fff 0 75%, #000 0)",
            backgroundSize: "86px 86px",
            WebkitMaskImage: `linear-gradient(${k ? "270deg" : "90deg"}, rgba(0,0,0,0.55), transparent)`,
          }}
        />
      ))}

      <Beads x0={60} x1={1700} y0={120} y1={1380} n={26} seed="L" />
      <Beads x0={4300} x1={5950} y0={120} y1={1380} n={22} seed="R" />

      {/* LOGO (izquierda) */}
      <Img src={staticFile("meguiars-logo.png")} style={{ position: "absolute", left: 150, top: 225, width: 1700, height: "auto", mixBlendMode: "lighten" }} />
      <Flare x={1515} y={360} size={260} />

      {/* TEXTO (centro) */}
      <div style={{ position: "absolute", left: 1900, top: 165, width: 2200, display: "flex", flexDirection: "column", alignItems: "center", transform: "skewX(-10deg)" }}>
        <div style={{ fontWeight: 800, fontSize: 112, letterSpacing: "0.22em", marginRight: "-0.22em", background: GOLD_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{copy.kicker}</div>
        <Metal text={copy.big} size={470} fill={CHROME} stroke="#111" shadow={C.red} style={{ marginTop: 20 }} />
        {/* cinta roja */}
        <div style={{ position: "relative", marginTop: 70, padding: "26px 90px", background: `linear-gradient(180deg, ${C.red} 0%, ${C.redDeep} 100%)`, clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ fontWeight: 800, fontSize: 112, color: C.white, letterSpacing: "0.02em", textShadow: "0 6px 0 rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>{copy.ribbon}</div>
        </div>
        <div style={{ display: "flex", gap: 46, alignItems: "center", marginTop: 54, fontWeight: 800, fontSize: 76, letterSpacing: "0.08em", color: C.gold }}>
          {copy.services.map((s, i) => (
            <React.Fragment key={s}>
              {i ? <span style={{ width: 22, height: 22, borderRadius: 11, background: C.red, display: "inline-block" }} /> : null}
              <span>{s}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* PRODUCTOS (derecha) */}
      <div style={{ position: "absolute", left: 4180, top: 170, width: 1760, height: 1180, background: "radial-gradient(ellipse at 50% 55%, rgba(255,229,138,0.22), transparent 65%)" }} />
      <Img src={staticFile("meguiars-productos.png")} style={{ position: "absolute", left: 4200, top: 260, width: 1720, height: "auto", mixBlendMode: "lighten" }} />
      {/* reflejo en el piso */}
      <div style={{ position: "absolute", left: 4200, top: 1192, width: 1720, height: 240, overflow: "hidden", opacity: 0.22, WebkitMaskImage: "linear-gradient(180deg, black, transparent 80%)" }}>
        <Img src={staticFile("meguiars-productos.png")} style={{ width: 1720, height: "auto", transform: "scaleY(-1)", transformOrigin: "50% 0", marginTop: 932, mixBlendMode: "lighten" }} />
      </div>
      <Flare x={4500} y={330} size={190} opacity={0.95} />
      <Flare x={5520} y={300} size={150} opacity={0.9} />
      <Flare x={5150} y={900} size={120} opacity={0.8} />

      {/* sello "brillo de exhibición" */}
      <div style={{ position: "absolute", left: 4040, top: 960, width: 470, height: 470, transform: "rotate(-14deg) scale(0.86)" }}>
        <svg width={470} height={470} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <polygon
            points={Array.from({ length: 40 }, (_, i) => {
              const r = i % 2 ? 196 : 235;
              const a = (i / 40) * Math.PI * 2;
              return `${235 + r * Math.cos(a)},${235 + r * Math.sin(a)}`;
            }).join(" ")}
            fill={C.red}
            stroke={C.gold}
            strokeWidth={14}
            strokeLinejoin="round"
          />
          <circle cx={235} cy={235} r={168} fill="none" stroke={C.goldLight} strokeWidth={4} strokeDasharray="10 12" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 800, color: C.white, lineHeight: 1 }}>
          <span style={{ fontSize: 62 }}>{copy.burst[0]}</span>
          <span style={{ fontSize: 66, color: C.goldLight, marginTop: 8 }}>{copy.burst[1]}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
