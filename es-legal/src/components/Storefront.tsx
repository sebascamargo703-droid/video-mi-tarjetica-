import React from "react";
import { useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { business } from "../copy";
import { font, logoFont } from "../fonts";
import { QrCode } from "./QrCode";

/**
 * Fachada ilustrada del café de noche (todo SVG/divs, 1080×1100). La vitrina tiene un
 * adhesivo con el QR de la tarjeta, como en un local real con Mi Tarjetica.
 */
export const STORE_H = 1100;
export const SIDEWALK_Y = 1000;

export const Storefront: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.92 + 0.08 * Math.sin(frame * 0.21) * Math.sin(frame * 0.07);
  const stripes = Array.from({ length: 12 });
  return (
    <div style={{ position: "relative", width: 1080, height: STORE_H }}>
      <svg width={1080} height={STORE_H} viewBox={`0 0 1080 ${STORE_H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD08A" />
            <stop offset="0.55" stopColor="#E09A4C" />
            <stop offset="1" stopColor="#7A3F1C" />
          </linearGradient>
          <radialGradient id="spill" cx="0.5" cy="0" r="0.8">
            <stop offset="0" stopColor="#F2B35A" stopOpacity={0.4} />
            <stop offset="1" stopColor="#F2B35A" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="lamp">
            <stop offset="0" stopColor="#FFF4D6" />
            <stop offset="0.4" stopColor="#FFD08A" stopOpacity={0.8} />
            <stop offset="1" stopColor="#FFD08A" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* edificio */}
        <rect x={0} y={0} width={1080} height={SIDEWALK_Y} fill="#0B1E18" />
        {[80, 330, 750, 960].map((x, i) => (
          <rect key={x} x={x} y={40} width={90} height={130} rx={6} fill={i % 2 ? "#2A4A3E" : "#3D2F1E"} opacity={0.8} />
        ))}
        {/* marco del local */}
        <rect x={150} y={230} width={780} height={SIDEWALK_Y - 230} rx={8} fill="#122C24" />
        {/* letrero */}
        <rect x={210} y={250} width={660} height={120} rx={14} fill={brand.colors.green} stroke="#D9C7A3" strokeWidth={4} />
        {/* toldo a rayas */}
        {stripes.map((_, i) => (
          <rect key={i} x={170 + i * 62} y={392} width={62} height={96} fill={i % 2 ? brand.colors.cream : brand.colors.green} />
        ))}
        {stripes.map((_, i) => (
          <circle key={`c${i}`} cx={201 + i * 62} cy={488} r={31} fill={i % 2 ? brand.colors.cream : brand.colors.green} />
        ))}
        <rect x={164} y={384} width={752} height={14} rx={7} fill="#0A231C" />
        {/* vitrina */}
        <rect x={196} y={540} width={430} height={400} rx={10} fill="url(#glass)" opacity={flicker} />
        <rect x={196} y={820} width={430} height={120} fill="#3A1F10" opacity={0.85} />
        {[300, 520].map((x) => (
          <g key={x}>
            <line x1={x} y1={540} x2={x} y2={600} stroke="#3A1F10" strokeWidth={4} />
            <circle cx={x} cy={622} r={70} fill="url(#lamp)" opacity={flicker} />
            <path d={`M${x - 26} 618 h52 l-10 -22 h-32 z`} fill="#3A1F10" />
          </g>
        ))}
        {/* tazas sobre el mostrador */}
        {[250, 330, 410].map((x) => (
          <g key={x} fill="#F6F2EA" opacity={0.9}>
            <rect x={x} y={790} width={44} height={32} rx={8} />
            <path d={`M${x + 44} 798 a10 10 0 0 1 0 18`} fill="none" stroke="#F6F2EA" strokeWidth={5} />
          </g>
        ))}
        <rect x={196} y={540} width={430} height={400} rx={10} fill="none" stroke="#D9C7A3" strokeWidth={8} />
        {/* puerta */}
        <rect x={666} y={540} width={226} height={SIDEWALK_Y - 540} rx={8} fill="url(#glass)" opacity={0.92 * flicker} />
        <rect x={666} y={540} width={226} height={SIDEWALK_Y - 540} rx={8} fill="none" stroke="#D9C7A3" strokeWidth={8} />
        <rect x={696} y={570} width={166} height={180} rx={6} fill="#7A3F1C" opacity={0.35} />
        <circle cx={712} cy={790} r={9} fill="#D9C7A3" />
        {/* andén */}
        <rect x={0} y={SIDEWALK_Y} width={1080} height={STORE_H - SIDEWALK_Y} fill="#0A1813" />
        <rect x={0} y={SIDEWALK_Y} width={1080} height={8} fill="#183A30" />
        <ellipse cx={540} cy={SIDEWALK_Y + 10} rx={520} ry={70} fill="url(#spill)" />
      </svg>
      {/* textos del letrero */}
      <div style={{ position: "absolute", left: 210, top: 250, width: 660, height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: brand.colors.cream }}>
        <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 64, lineHeight: 1 }}>{business.name}</div>
        <div style={{ fontFamily: font, fontWeight: 800, fontSize: 18, letterSpacing: "0.3em", opacity: 0.8, marginTop: 6 }}>CAFÉ · PANADERÍA</div>
      </div>
      {/* adhesivo con QR en la vitrina */}
      <div style={{ position: "absolute", left: 500, top: 600, width: 110, padding: 10, borderRadius: 12, background: brand.colors.cream, transform: "rotate(-3deg)", boxShadow: "0 8px 18px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: font }}>
        <QrCode size={86} color={brand.colors.ink} background={brand.colors.cream} quiet={0} />
        <div style={{ fontSize: 11, fontWeight: 800, color: brand.colors.green, textAlign: "center", lineHeight: 1.1 }}>TU TARJETA DE SELLOS</div>
      </div>
    </div>
  );
};

/** Persona caminando (trazo blanco, como un pictograma) con el celular en la mano. */
export const Walker: React.FC<{ x: number; y: number; height?: number; phase: number; opacity?: number }> = ({ x, y, height = 380, phase, opacity = 1 }) => {
  const k = height / 380;
  const sw = Math.sin(phase);
  const leg = 26 * sw;
  const arm = -22 * sw;
  const bob = Math.abs(Math.cos(phase)) * 6;
  const c = "#F4F1EA";
  return (
    <svg width={220 * k} height={400 * k} viewBox="-110 -390 220 400" style={{ position: "absolute", left: x - 110 * k, top: y - 390 * k, overflow: "visible", opacity }}>
      <ellipse cx={0} cy={4} rx={70} ry={10} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(0 ${-bob})`} stroke={c} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* piernas */}
        <path d={`M0 -150 L${leg * 0.6} -80 L${leg} 0`} />
        <path d={`M0 -150 L${-leg * 0.6} -80 L${-leg} 0`} opacity={0.85} />
        {/* torso */}
        <path d="M0 -150 L4 -265" />
        {/* brazo libre */}
        <path d={`M4 -250 L${arm * 0.8 - 6} -195 L${arm - 4} -140`} opacity={0.85} />
        {/* brazo con celular */}
        <path d="M4 -250 L38 -205 L70 -232" />
        <rect x={62} y={-262} width={22} height={38} rx={5} fill="#111" stroke={c} strokeWidth={5} />
        {/* cabeza */}
        <circle cx={6} cy={-308} r={34} fill="#0B1E18" strokeWidth={14} />
      </g>
    </svg>
  );
};
