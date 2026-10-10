import React from "react";
import { Img } from "remotion";
import { assets } from "../assets";
import { grid, palette } from "../brand";
import type { Slide } from "../carousels";
import { Arch } from "../components/Arch";
import { Beans, CoffeeBranch } from "../components/Ornaments";
import { display, sans } from "../fonts";

/** Fachada minimalista de una cafetería con toldo, taza humeante y ramas de café (si no hay foto). */
const Storefront: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const c = palette.coffee;
  return (
    <svg width={w} height={h} viewBox="0 0 440 480" preserveAspectRatio="xMidYMax slice" style={{ display: "block" }}>
      <rect width={440} height={480} fill={palette.latte} />
      <circle cx={220} cy={190} r={170} fill="#F0E6D8" />
      {/* piso */}
      <path d="M0 436 H440" stroke={c} strokeWidth={3} />
      {/* fachada */}
      <rect x={70} y={168} width={300} height={268} rx={6} fill={palette.light} stroke={c} strokeWidth={3} />
      {/* letrero con grano */}
      <rect x={160} y={118} width={120} height={40} rx={20} fill={c} />
      <g transform="translate(220 138) rotate(-20)">
        <ellipse rx={9} ry={13} fill="#F3E7D7" />
        <path d="M0 -10 C4 -3 -4 3 0 10" stroke={c} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </g>
      {/* toldo a rayas */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <rect x={58 + i * 40.5} y={176} width={40.5} height={46} fill={i % 2 ? palette.light : c} stroke={c} strokeWidth={2} />
          <path d={`M${58 + i * 40.5} 222 a20.25 16 0 0 0 40.5 0`} fill={i % 2 ? palette.light : c} stroke={c} strokeWidth={2} />
        </g>
      ))}
      {/* ventana con taza */}
      <rect x={98} y={262} width={146} height={120} rx={8} fill={palette.latte} stroke={c} strokeWidth={3} />
      <path d="M98 300 H244" stroke={c} strokeWidth={2} opacity={0.4} />
      <g transform="translate(171 330)" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-26 -6 H26 V8 C26 24 14 32 0 32 C-14 32 -26 24 -26 8 Z" fill={palette.light} />
        <path d="M26 0 H31 C38 0 40 5 40 9 C40 15 35 18 29 18 H25" />
        <path d="M-12 -16 C-17 -24 -7 -28 -12 -38 M0 -16 C-5 -26 5 -30 0 -42 M12 -16 C7 -24 17 -28 12 -38" stroke={palette.caramel} />
      </g>
      {/* puerta */}
      <rect x={270} y={262} width={74} height={174} rx={6} fill={c} />
      <rect x={282} y={276} width={50} height={64} rx={4} fill={palette.latte} opacity={0.9} />
      <circle cx={331} cy={366} r={4.5} fill={palette.caramel} />
      {/* macetas con ramas de café */}
      {[44, 396].map((x, i) => (
        <g key={x} transform={`translate(${x} 436)`}>
          <path d="M-18 0 L-14 -30 H14 L18 0 Z" fill={palette.latte} stroke={c} strokeWidth={2.5} />
          <g fill="none" stroke={c} strokeWidth={2.4} strokeLinecap="round">
            <path d={`M0 -30 C${i ? -4 : 4} -60 ${i ? 6 : -6} -80 0 -110`} />
            {[-48, -70, -92].map((y, k) => (
              <g key={k}>
                <path d={`M0 ${y} C-14 ${y - 6} -24 ${y - 2} -28 ${y + 6} C-18 ${y + 10} -8 ${y + 6} 0 ${y}`} fill={palette.light} />
                <path d={`M0 ${y - 6} C14 ${y - 12} 24 ${y - 8} 28 ${y} C18 ${y + 4} 8 ${y} 0 ${y - 6}`} fill={palette.light} />
              </g>
            ))}
            <circle cx={6} cy={-58} r={5} fill={palette.caramel} stroke="none" />
            <circle cx={-6} cy={-80} r={5} fill={palette.caramel} stroke="none" />
          </g>
        </g>
      ))}
    </svg>
  );
};

/** Esquina decorada del marco del póster. */
const Corner: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <svg style={{ position: "absolute", left: x - 28, top: y - 28, overflow: "visible" }} width={56} height={56} viewBox="-28 -28 56 56">
    <g transform={`rotate(${rot})`} fill="none" stroke={palette.caramel} strokeWidth={2}>
      <path d="M-4 22 A26 26 0 0 1 22 -4" />
      <rect x={-6} y={-6} width={12} height={12} transform="rotate(45)" fill={palette.caramel} />
    </g>
  </svg>
);

/** Lámina 1 · gancho "SE BUSCA" (sin logo de Mi Tarjetica). */
export const WantedSlide: React.FC<{ s: Extract<Slide, { type: "wanted" }> }> = ({ s }) => {
  const photo = assets.cafePhoto();
  const inset = 44;
  const archW = 420;
  const archH = 440;
  return (
    <>
      {/* marco del póster */}
      <div style={{ position: "absolute", inset, border: `2px solid ${palette.caramel}`, borderRadius: 6 }} />
      <div style={{ position: "absolute", inset: inset + 12, border: `1px solid ${palette.caramel}`, borderRadius: 4, opacity: 0.7 }} />
      {[
        [inset, inset, 0],
        [1080 - inset, inset, 90],
        [1080 - inset, 1350 - inset, 180],
        [inset, 1350 - inset, 270],
      ].map(([x, y, r]) => (
        <Corner key={`${x}-${y}`} x={x} y={y} rot={r} />
      ))}

      <div style={{ position: "absolute", left: grid.m, right: grid.m, top: 104, textAlign: "center", ...display, fontWeight: 600, fontSize: 176, lineHeight: 1, letterSpacing: "0.01em", color: palette.brand }}>
        {s.title}
      </div>
      <div style={{ position: "absolute", left: grid.m, right: grid.m, top: 302, display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
        <span style={{ width: 60, height: 2, background: palette.caramel }} />
        <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 32, letterSpacing: "0.32em", color: palette.ink, marginRight: "-0.32em" }}>{s.business}</span>
        <span style={{ width: 60, height: 2, background: palette.caramel }} />
      </div>

      <div style={{ position: "absolute", left: (1080 - archW) / 2, top: 380 }}>
        <Arch w={archW} h={archH} border={`2px solid ${palette.caramel}`} shadow={`0 30px 60px ${palette.shadow}`}>
          {photo ? <Img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Storefront w={archW - 4} h={archH - 4} />}
        </Arch>
      </div>

      <div style={{ position: "absolute", left: 130, right: 130, top: 864, textAlign: "center", ...display, fontWeight: 400, fontSize: 40, lineHeight: 1.3, color: palette.ink }}>
        {s.text}
      </div>

      <div style={{ position: "absolute", right: grid.m + 4, bottom: 128, fontFamily: sans, fontWeight: 600, fontSize: 30, color: palette.ink }}>{s.swipe}</div>

      <CoffeeBranch color={palette.coffee} opacity={0.3} size={250} style={{ position: "absolute", left: 66, top: 1040 }} rotate={-8} />
      <Beans color={palette.coffee} opacity={0.3} size={110} style={{ position: "absolute", right: 80, top: 404 }} />
      <Beans color={palette.coffee} opacity={0.25} size={90} style={{ position: "absolute", left: 92, top: 470 }} />
    </>
  );
};
