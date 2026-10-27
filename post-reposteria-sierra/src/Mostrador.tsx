import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { palette } from "./brand";
import { Photo } from "./components/Photo";
import { QrCode } from "./components/QrCode";
import { SierraLogo } from "./components/SierraLogo";
import { display, sans } from "./fonts";
import { mostrador } from "./mostrador";
import { business } from "./post";

/** Tamaño A5 a 300 ppp (148 × 210 mm). */
export const A5 = { w: 1748, h: 2480 };
const M = 130;

const BrownieStamp: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <rect x={3} y={5} width={34} height={30} rx={8} fill={palette.cocoa} />
    <path d="M9 14 C14 11 19 16 24 12 C27 10 30 12 32 13" fill="none" stroke={palette.butter} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);

const Gift: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <circle cx={20} cy={20} r={19} fill={palette.brand} />
    <g fill="none" stroke={palette.light} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
      <rect x={11} y={17} width={18} height={13} rx={2} />
      <path d="M9.5 13.5 H30.5 V17 H9.5 Z M20 13.5 V30" />
      <path d="M20 13.5 C17 13.5 14.5 12.5 14.5 10.8 C14.5 9.4 16 8.8 17.2 9.5 C18.6 10.3 20 13.5 20 13.5 C20 13.5 21.4 10.3 22.8 9.5 C24 8.8 25.5 9.4 25.5 10.8 C25.5 12.5 23 13.5 20 13.5 Z" />
    </g>
  </svg>
);

/** Cartel de mostrador: antojo (foto) + promesa (5 visitas = brownie gratis) + QR real + 3 pasos. */
export const Mostrador: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: palette.butter, fontFamily: sans, color: palette.cocoa }}>
    {/* foto a sangre */}
    <Photo src="red-velvet.jpg" w={A5.w} h={960} position="50% 60%" zoom={1.05} vignette={0.18} />
    <div style={{ position: "absolute", left: M - 20, top: M - 30 }}>
      <SierraLogo size={330} />
    </div>

    {/* panel mantequilla */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 830, bottom: 0, background: palette.butter, borderRadius: "90px 90px 0 0", boxShadow: "0 -20px 60px rgba(22,14,10,0.18)" }} />

    <div style={{ position: "absolute", left: M, right: M, top: 905, ...display, fontWeight: 600, fontSize: 132, lineHeight: 1.02, letterSpacing: "-0.005em", textAlign: "center", textWrap: "balance" }}>
      {mostrador.headline}
    </div>

    {/* 4 sellos + regalo */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1215, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
      {Array.from({ length: business.total - 1 }).map((_, i) => (
        <BrownieStamp key={i} size={128} />
      ))}
      <div style={{ position: "relative" }}>
        <Gift size={150} />
        <div style={{ position: "absolute", left: "50%", top: 158, transform: "translateX(-50%)", fontWeight: 800, fontSize: 34, color: palette.brand, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{mostrador.free}</div>
      </div>
    </div>

    {/* QR + pasos */}
    <div style={{ position: "absolute", left: M - 20, top: 1455, width: 720, borderRadius: 56, background: palette.light, padding: "40px 40px 28px", boxSizing: "border-box", boxShadow: "0 30px 70px rgba(22,14,10,0.22)", border: `6px solid ${palette.cocoa}` }}>
      <QrCode size={628} color={palette.cocoa} background={palette.light} />
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 50, marginTop: 10, letterSpacing: "0.02em" }}>{mostrador.scan} ↑</div>
    </div>
    <div style={{ position: "absolute", left: 900, right: M - 20, top: 1490, display: "flex", flexDirection: "column", gap: 54 }}>
      {mostrador.steps.map((st, i) => (
        <div key={st} style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
          <span style={{ width: 92, height: 92, borderRadius: 46, background: palette.brand, color: palette.light, fontWeight: 800, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
          <span style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.18, paddingTop: 10 }}>{st}</span>
        </div>
      ))}
      <div style={{ fontSize: 38, lineHeight: 1.3, color: "#4A3524", borderTop: `3px solid rgba(22,14,10,0.2)`, paddingTop: 30 }}>{mostrador.reassurance}</div>
    </div>

    {/* pie */}
    <div style={{ position: "absolute", left: M, right: M, bottom: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 34, color: "#4A3524" }}>
        {mostrador.poweredBy}
        <Img src={staticFile("mitarjetica-logo.png")} style={{ height: 78, display: "block" }} />
      </div>
      <span style={{ fontSize: 32, fontWeight: 600, color: "#4A3524" }}>{mostrador.url}</span>
    </div>
  </AbsoluteFill>
);
