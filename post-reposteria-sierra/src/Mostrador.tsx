import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { palette } from "./brand";
import { Photo } from "./components/Photo";
import { QrCode } from "./components/QrCode";
import { SierraLogo } from "./components/SierraLogo";
import { sans } from "./fonts";
import { mostrador } from "./mostrador";
import { business } from "./post";

/** Tamaño A5 a 300 ppp (148 × 210 mm). */
export const A5 = { w: 1748, h: 2480 };
const M = 110;
/** Rojo red velvet: acentos y sombras "pop" (sobre cacao 4.6:1; mantequilla sobre él 6+). */
const RED = "#E8473B";
const { butter, cocoa } = palette;

/** Rayos de sol retro detrás de todo. */
const Sunburst: React.FC<{ cx: number; cy: number; r: number; rays: number; color: string }> = ({ cx, cy, r, rays, color }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={A5.w} height={A5.h}>
    {Array.from({ length: rays }).map((_, i) => {
      const a0 = (i / rays) * Math.PI * 2;
      const a1 = ((i + 0.5) / rays) * Math.PI * 2;
      return <path key={i} d={`M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} L${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`} fill={color} />;
    })}
  </svg>
);

/** Estrella de sello (badge) con puntas. */
const Starburst: React.FC<{ size: number; points: number; fill: string; stroke?: string; children?: React.ReactNode; rotate?: number; style?: React.CSSProperties }> = ({
  size,
  points,
  fill,
  stroke,
  children,
  rotate = 0,
  style,
}) => {
  const r = size / 2;
  const pts = Array.from({ length: points * 2 }, (_, i) => {
    const rr = i % 2 ? r * 0.84 : r;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    return `${r + rr * Math.cos(a)},${r + rr * Math.sin(a)}`;
  }).join(" ");
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={stroke ? 8 : 0} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

/** Foto recortada en círculo, como sticker con borde mantequilla. */
const PhotoSticker: React.FC<{ src: string; size: number; position: string; zoom?: number; rotate?: number; style?: React.CSSProperties }> = ({ src, size, position, zoom = 1.2, rotate = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", border: `14px solid ${butter}`, overflow: "hidden", boxShadow: `14px 16px 0 ${RED}, 0 30px 60px rgba(0,0,0,0.45)`, transform: `rotate(${rotate}deg)`, ...style }}>
    <Photo src={src} w={size} h={size} position={position} zoom={zoom} vignette={0.12} />
  </div>
);

const BrownieStamp: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: cocoa, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 0 6px ${butter}` }}>
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 40 40">
      <rect x={3} y={5} width={34} height={30} rx={8} fill={butter} />
      <path d="M9 14 C14 11 19 16 24 12 C27 10 30 12 32 13" fill="none" stroke={cocoa} strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  </div>
);

/** Texto gigante con sombra sólida retro. */
const Pop: React.FC<{ text: string; size: number; color: string; shadow: string; top: number; rotate?: number }> = ({ text, size, color, shadow, top, rotate = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top,
      textAlign: "center",
      fontFamily: sans,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.92,
      letterSpacing: "-0.035em",
      color,
      textShadow: `${size * 0.035}px ${size * 0.04}px 0 ${shadow}`,
      transform: `rotate(${rotate}deg)`,
    }}
  >
    {text}
  </div>
);

/** Cartel de mostrador "pop retro": antojo + promesa gigante + sellos + QR real + 3 pasos. */
export const Mostrador: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cocoa, fontFamily: sans, color: butter, overflow: "hidden" }}>
    <Sunburst cx={A5.w / 2} cy={1050} r={2200} rays={44} color="rgba(247, 220, 158, 0.06)" />

    {/* ── Arriba: logo + fotos como stickers ── */}
    <div style={{ position: "absolute", left: M - 10, top: 96 }}>
      <SierraLogo size={420} style={{ boxShadow: `14px 16px 0 ${RED}, 0 30px 60px rgba(0,0,0,0.45)` }} />
    </div>
    <div style={{ position: "absolute", left: 1010, top: 70 }}>
      <PhotoSticker src="red-velvet.jpg" size={600} position="50% 58%" zoom={1.35} rotate={4} />
    </div>
    <div style={{ position: "absolute", left: 600, top: 470 }}>
      <PhotoSticker src="oreo.jpg" size={380} position="48% 60%" zoom={1.6} rotate={-6} />
    </div>
    <div style={{ position: "absolute", left: 130, top: 560 }}>
      <PhotoSticker src="galleta.jpg" size={300} position="45% 66%" zoom={1.5} rotate={5} />
    </div>
    <div style={{ position: "absolute", left: 1330, top: 560 }}>
      <Starburst size={330} points={18} fill={RED} stroke={butter} rotate={-12}>
        {mostrador.badge.map((t, i) => (
          <span key={t} style={{ fontWeight: 800, fontSize: i === 0 ? 130 : i === 1 ? 50 : 40, lineHeight: i === 0 ? 0.9 : 1.05, color: butter, letterSpacing: "-0.01em" }}>
            {t}
          </span>
        ))}
      </Starburst>
    </div>

    {/* ── La promesa, gigante ── */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontWeight: 800, fontSize: 74, letterSpacing: "0.02em", color: butter }}>{mostrador.kicker}</div>
    <Pop text={mostrador.big1} size={300} color={butter} shadow={RED} top={985} rotate={-3} />
    <Pop text={mostrador.big2} size={300} color={RED} shadow={butter} top={1240} rotate={-3} />

    {/* ── Ticket de 5 sellos ── */}
    <div
      style={{
        position: "absolute",
        left: M,
        right: M,
        top: 1550,
        height: 230,
        borderRadius: 40,
        background: butter,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        boxShadow: `14px 16px 0 ${RED}`,
        WebkitMaskImage: "radial-gradient(circle 34px at 0 50%, transparent 98%, black 100%), radial-gradient(circle 34px at 100% 50%, transparent 98%, black 100%)",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      {Array.from({ length: business.total - 1 }).map((_, i) => (
        <BrownieStamp key={i} size={170} />
      ))}
      <Starburst size={200} points={14} fill={RED} rotate={8}>
        <span style={{ fontWeight: 800, fontSize: 44, color: butter, letterSpacing: "0.02em" }}>{mostrador.free}</span>
      </Starburst>
    </div>

    {/* ── QR real + pasos ── */}
    <div style={{ position: "absolute", left: M, top: 1840, width: 520, padding: 28, borderRadius: 44, background: palette.light, boxShadow: `14px 16px 0 ${RED}`, transform: "rotate(-2deg)" }}>
      <QrCode size={464} color={cocoa} background={palette.light} />
    </div>
    <div style={{ position: "absolute", left: 690, top: 1850, right: M, display: "flex", flexDirection: "column", gap: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontWeight: 800, fontSize: 76, color: RED, letterSpacing: "-0.02em" }}>
        <svg width={110} height={70} viewBox="0 0 110 70" style={{ transform: "rotate(10deg)" }}>
          <path d="M104 14 C80 4 40 6 18 44" fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" />
          <path d="M10 26 L16 50 L40 42" fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {mostrador.scan}
      </div>
      {mostrador.steps.map((st, i) => (
        <div key={st} style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <span style={{ width: 76, height: 76, borderRadius: 38, background: butter, color: cocoa, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
          <span style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.15, color: butter }}>{st}</span>
        </div>
      ))}
      <div style={{ fontSize: 34, color: butter, opacity: 0.85, marginTop: 6 }}>{mostrador.reassurance}</div>
    </div>

    {/* ── Pie ── */}
    <div style={{ position: "absolute", left: 690, right: M - 30, top: 2348, display: "flex", alignItems: "center", gap: 22 }}>
      <Img src={staticFile("mitarjetica-logo-light.png")} style={{ height: 58, width: "auto", display: "block", opacity: 0.95 }} />
      <span style={{ fontSize: 29, fontWeight: 600, color: butter, opacity: 0.9, whiteSpace: "nowrap" }}>{mostrador.url}</span>
    </div>
  </AbsoluteFill>
);
