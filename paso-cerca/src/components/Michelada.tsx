import React from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

/**
 * Michelada ilustrada en SVG: vaso con borde escarchado de sal y chile, rodaja de limón,
 * hielo y burbujas que suben en loop.
 */
export const Michelada: React.FC<{ width: number; seed: string }> = ({ width, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const h = (width * 380) / 260;
  const glass = "M22 46 L238 46 L212 352 Q210 368 194 368 L66 368 Q50 368 48 352 Z";
  const bubbles = Array.from({ length: 14 }, (_, i) => {
    const r = (k: string) => random(`${seed}-b${i}-${k}`);
    const speed = 50 + r("s") * 60;
    const period = 270 / speed;
    const phase = ((t + r("p") * period) % period) / period; // 0→1 en loop
    const y = 350 - phase * 270;
    const x = 70 + r("x") * 120 + Math.sin((t + i) * 3) * 4;
    const size = 2.5 + r("r") * 4.5;
    const op = phase < 0.1 ? phase * 10 : phase > 0.85 ? (1 - phase) / 0.15 : 1;
    return { x, y, size, op: op * 0.75 };
  });
  const salt = Array.from({ length: 60 }, (_, i) => ({
    x: 26 + random(`${seed}-sx${i}`) * 208,
    y: 36 + random(`${seed}-sy${i}`) * 22,
    r: 1.6 + random(`${seed}-sr${i}`) * 2.4,
    chile: random(`${seed}-sc${i}`) > 0.55,
  }));
  return (
    <svg width={width} height={h} viewBox="0 0 260 380" style={{ overflow: "visible", filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.55))" }}>
      <defs>
        <linearGradient id={`${seed}-liq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={brand.drink.beerTop} />
          <stop offset="1" stopColor={brand.drink.beerBottom} />
        </linearGradient>
        <linearGradient id={`${seed}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${seed}-clip`}>
          <path d={glass} />
        </clipPath>
      </defs>
      {/* Líquido */}
      <g clipPath={`url(#${seed}-clip)`}>
        <rect x="0" y="78" width="260" height="300" fill={`url(#${seed}-liq)`} />
        <rect x="0" y="74" width="260" height="10" fill="#F6D9A8" opacity="0.8" />
        {/* hielo */}
        <rect x="70" y="96" width="54" height="50" rx="10" fill="rgba(255,255,255,0.28)" transform="rotate(-12 97 121)" />
        <rect x="138" y="112" width="50" height="46" rx="10" fill="rgba(255,255,255,0.22)" transform="rotate(10 163 135)" />
        {bubbles.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.size} fill="rgba(255,255,255,0.85)" opacity={b.op} />
        ))}
        {/* borde escarchado: sal y chile */}
        <rect x="0" y="40" width="260" height="22" fill={brand.drink.rimChile} />
        {salt.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.chile ? "#8E1F18" : brand.drink.rimSalt} />
        ))}
        <rect x="0" y="0" width="260" height="380" fill={`url(#${seed}-shine)`} />
      </g>
      {/* Vidrio */}
      <path d={glass} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" />
      {/* Rodaja de limón en el borde */}
      <g transform="translate(222 46) rotate(-18)">
        <circle r="44" fill={brand.drink.limeDark} />
        <circle r="38" fill="#D9EBB5" />
        <circle r="33" fill={brand.drink.lime} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 32} y2={Math.sin(a) * 32} stroke="#D9EBB5" strokeWidth="2.5" />;
        })}
        <circle r="5" fill="#D9EBB5" />
      </g>
    </svg>
  );
};
