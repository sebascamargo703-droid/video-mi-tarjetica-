import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { business, copy } from "./copy";
import { font } from "./fonts";
import { BusinessIcon } from "./components/BusinessPin";
import { Logo } from "./components/Logo";
import { LockScreen } from "./components/LockScreen";
import { PassCard } from "./components/PassCard";

/**
 * Pantallas 2D que se pegan como textura en el 3D: los monitores de cada escritorio, la pantalla
 * grande de la pared, el letrero de neón y los celulares. `scripts/render-screens.mjs` las exporta a
 * public/screens/<id>.png. Los números son de ejemplo (negocio ficticio).
 */
const C = brand.colors;
const MON = { w: 1000, h: 620 };
const PHONE = { w: 666, h: 1430 };

/* ---------------- piezas ---------------- */
const Monitor: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <AbsoluteFill style={{ background: "#0A1714", fontFamily: font, color: "#fff" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, display: "flex", alignItems: "center", gap: 18, padding: "0 40px", background: "#0E2A23", borderBottom: "2px solid #1E4A3E" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BusinessIcon size={32} color="#fff" />
      </div>
      <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "0.08em" }}>{title}</span>
      <span style={{ marginLeft: "auto", fontSize: 26, fontWeight: 700, color: C.highlight }}>● EN VIVO</span>
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 130, bottom: 36 }}>{children}</div>
  </AbsoluteFill>
);

const Row: React.FC<{ letter: string; color: string; name: string; right: React.ReactNode; hl?: boolean }> = ({ letter, color, name, right, hl }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 20px", marginBottom: 14, borderRadius: 22, background: hl ? "rgba(143,227,192,0.16)" : "rgba(255,255,255,0.05)", border: `3px solid ${hl ? C.highlight : "rgba(255,255,255,0.08)"}` }}>
    <div style={{ width: 66, height: 66, borderRadius: "50%", background: color, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800 }}>{letter}</div>
    <div style={{ flex: 1, fontSize: 40, fontWeight: 800 }}>{name}</div>
    {right}
  </div>
);

const Bar: React.FC<{ n: number; total: number }> = ({ n, total }) => (
  <div style={{ display: "flex", gap: 8 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: i < n ? C.highlight : "transparent", border: `3px solid ${i < n ? C.highlight : "rgba(255,255,255,0.3)"}` }} />
    ))}
  </div>
);

const Sellos: React.FC<{ done: boolean }> = ({ done }) => (
  <Monitor title="SELLOS">
    <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
      <div style={{ transform: "scale(0.62)", transformOrigin: "0 0", width: 372, height: 300 }}>
        <PassCard width={600} stamps={done ? 7 : 6} showQr={false} pulse={done ? 0 : 1} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 34, color: C.soft, fontWeight: 700 }}>Laura · caja 1</div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 10, color: done ? C.highlight : "#fff" }}>{done ? "+1 sello ✓" : "Pagó $9.000"}</div>
        <div style={{ fontSize: 32, marginTop: 14, color: "#CFE2DB" }}>{done ? "Le llegó a su celular" : "Sellando…"}</div>
      </div>
    </div>
  </Monitor>
);

const Cumple: React.FC<{ done: boolean }> = ({ done }) => (
  <Monitor title="CUMPLEAÑOS">
    <Row letter="L" color={C.highlight} name="Laura · hoy" hl right={<span style={{ fontSize: 32, fontWeight: 800, color: done ? C.highlight : C.warm }}>{done ? "Regalo enviado ✓" : "Enviar regalo"}</span>} />
    <Row letter="A" color={C.cold} name="Andrés · 12 nov" right={<span style={{ fontSize: 30, color: C.soft, fontWeight: 700 }}>programado</span>} />
    <Row letter="S" color={C.warm} name="Sofía · 28 nov" right={<span style={{ fontSize: 30, color: C.soft, fontWeight: 700 }}>programado</span>} />
  </Monitor>
);

const Cuadra: React.FC<{ done: boolean }> = ({ done }) => (
  <Monitor title="LA CUADRA">
    <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", background: "#12241F" }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 110, height: 34, background: "#24403A" }} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: 60 + i * 200, width: 34, background: "#24403A" }} />
      ))}
      <div style={{ position: "absolute", left: 380, top: 120, width: 220, height: 220, borderRadius: "50%", border: `5px solid ${C.highlight}`, background: "rgba(143,227,192,0.15)" }} />
      <div style={{ position: "absolute", left: 456, top: 196, width: 68, height: 68, borderRadius: 18, background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BusinessIcon size={42} color="#fff" />
      </div>
      <div style={{ position: "absolute", left: done ? 410 : 250, top: done ? 160 : 70, width: 40, height: 40, borderRadius: "50%", background: C.cold, border: "5px solid #fff" }} />
      <div style={{ position: "absolute", left: 24, bottom: 20, fontSize: 34, fontWeight: 800, padding: "10px 22px", borderRadius: 999, background: done ? C.highlight : "rgba(0,0,0,0.5)", color: done ? C.ink : "#fff" }}>{done ? "Andrés está cerca · aviso enviado" : "Andrés va caminando…"}</div>
    </div>
  </Monitor>
);

const Premios: React.FC = () => (
  <Monitor title="PREMIOS">
    <Row letter="L" color={C.highlight} name="Laura" hl right={<div style={{ display: "flex", alignItems: "center", gap: 16 }}><Bar n={7} total={8} /><span style={{ fontSize: 28, fontWeight: 800, color: C.highlight }}>le falta 1</span></div>} />
    <Row letter="S" color={C.warm} name="Sofía" right={<div style={{ display: "flex", alignItems: "center", gap: 16 }}><Bar n={5} total={8} /><span style={{ fontSize: 28, fontWeight: 700, color: C.soft }}>le faltan 3</span></div>} />
    <Row letter="A" color={C.cold} name="Andrés" right={<div style={{ display: "flex", alignItems: "center", gap: 16 }}><Bar n={3} total={8} /><span style={{ fontSize: 28, fontWeight: 700, color: C.soft }}>le faltan 5</span></div>} />
  </Monitor>
);

const Datos: React.FC<{ done: boolean }> = ({ done }) => (
  <Monitor title="DATOS">
    <svg width="920" height="220" viewBox="0 0 920 220" style={{ display: "block" }}>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2="920" y1={20 + i * 60} y2={20 + i * 60} stroke="#1E3A33" strokeWidth="2" />
      ))}
      <polyline points="0,40 150,50 300,60 450,110 600,150 750,180 920,200" fill="none" stroke={C.warm} strokeWidth="8" strokeLinejoin="round" />
      <circle cx="920" cy="200" r="12" fill={C.warm} />
    </svg>
    <div style={{ marginTop: 26 }}>
      <Row letter="S" color={C.warm} name="Sofía · 34 días sin venir" hl={done} right={<span style={{ fontSize: 32, fontWeight: 800, color: done ? C.highlight : C.warm }}>{done ? "Promo enviada ✓" : "Enviar promo"}</span>} />
    </div>
  </Monitor>
);

const Wall: React.FC<{ step: 0 | 1 }> = ({ step }) => (
  <AbsoluteFill style={{ background: "#071512", fontFamily: font, color: "#fff", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
    <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "0.14em", color: C.soft }}>{step ? "VOLVIERON ESTE MES" : "CLIENTES"}</div>
    <div style={{ fontSize: 330, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", color: step ? C.highlight : "#fff", fontVariantNumeric: "tabular-nums" }}>{step ? "63%" : "248"}</div>
    <div style={{ fontSize: 34, fontWeight: 700, color: "#6F8F85", marginTop: 20 }}>Datos de ejemplo · {business.name}</div>
  </AbsoluteFill>
);

const LabelPlate: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: font, fontWeight: 800, fontSize: 64, letterSpacing: "0.1em", color: C.ink, background: C.highlight, padding: "14px 40px", borderRadius: 999 }}>{text}</div>
  </AbsoluteFill>
);

const StatusBar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 58px", fontFamily: font, fontWeight: 700, fontSize: 32, color: "#fff" }}>
    <span>{copy.lockTime}</span>
    <span style={{ width: 34, height: 20, borderRadius: 4, background: "#fff", opacity: 0.9 }} />
  </div>
);

const AppIntro: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${C.greenMid}, #062A22 70%)`, alignItems: "center", justifyContent: "center", gap: 40 }}>
    <StatusBar />
    <Logo height={110} color="#fff" />
    <div style={{ fontFamily: font, fontSize: 34, fontWeight: 700, color: C.highlight }}>Tu equipo está trabajando…</div>
  </AbsoluteFill>
);

const LockVolvio: React.FC = () => (
  <AbsoluteFill>
    <LockScreen>
      <div style={{ position: "absolute", left: 22, top: 470, width: 622, display: "flex", gap: 18, alignItems: "center", padding: "20px 22px", borderRadius: 30, background: "rgba(48,54,58,0.96)", border: "1.5px solid rgba(255,255,255,0.1)", boxSizing: "border-box", fontFamily: font, color: "#fff" }}>
        <div style={{ width: 70, height: 70, borderRadius: 18, background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <BusinessIcon size={42} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 800 }}>
            <span>{business.name}</span>
            <span style={{ fontWeight: 600, opacity: 0.6 }}>ahora</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>¡Laura volvió! ☕</div>
          <div style={{ fontSize: 26, opacity: 0.9 }}>Canjeó su café gratis.</div>
        </div>
      </div>
    </LockScreen>
    <StatusBar />
  </AbsoluteFill>
);

const Chat: React.FC<{ step: 0 | 1 }> = ({ step }) => (
  <AbsoluteFill style={{ background: "#0F1A17", fontFamily: font, color: "#fff" }}>
    <StatusBar />
    <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 130, display: "flex", alignItems: "center", gap: 20, padding: "0 36px", background: "#16241F" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.cold, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 800 }}>P</div>
      <div>
        <div style={{ fontSize: 36, fontWeight: 800 }}>Pipe (panadería)</div>
        <div style={{ fontSize: 26, color: C.highlight }}>en línea</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 30, top: 290, maxWidth: 520, padding: "22px 26px", borderRadius: "28px 28px 28px 8px", background: "#26332F", fontSize: 34, lineHeight: 1.3 }}>Este año sí dejo la tarjeta de papel, te lo juro</div>
    {step ? (
      <div style={{ position: "absolute", right: 30, top: 470, width: 440, borderRadius: "28px 28px 8px 28px", background: C.greenMid, padding: 16, boxSizing: "border-box" }}>
        <div style={{ height: 330, borderRadius: 20, background: `radial-gradient(circle at 50% 45%, #1B7A5E, #062A22 70%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "22px solid transparent", borderBottom: "22px solid transparent", borderLeft: `34px solid ${C.green}`, marginLeft: 8 }} />
          </div>
          <Logo height={50} color="#fff" />
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14 }}>mira esto</div>
      </div>
    ) : null}
    <div style={{ position: "absolute", left: 24, right: 24, bottom: 60, height: 90, borderRadius: 999, background: "#1C2925", display: "flex", alignItems: "center", padding: "0 30px", fontSize: 30, color: "#7F948D" }}>Mensaje</div>
  </AbsoluteFill>
);

/* ---------------- registro ---------------- */
type Def = { w: number; h: number; el: React.ReactNode; transparent?: boolean };
export const SCREENS: Record<string, Def> = {
  "m-sellos-a": { ...MON, el: <Sellos done={false} /> },
  "m-sellos-b": { ...MON, el: <Sellos done /> },
  "m-cumple-a": { ...MON, el: <Cumple done={false} /> },
  "m-cumple-b": { ...MON, el: <Cumple done /> },
  "m-cuadra-a": { ...MON, el: <Cuadra done={false} /> },
  "m-cuadra-b": { ...MON, el: <Cuadra done /> },
  "m-premios": { ...MON, el: <Premios /> },
  "m-datos-a": { ...MON, el: <Datos done={false} /> },
  "m-datos-b": { ...MON, el: <Datos done /> },
  "wall-a": { w: 1400, h: 800, el: <Wall step={0} /> },
  "wall-b": { w: 1400, h: 800, el: <Wall step={1} /> },
  neon: { w: 1200, h: 360, transparent: true, el: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", filter: `drop-shadow(0 0 18px ${C.highlight})` }}><Logo height={240} color={C.highlight} /></AbsoluteFill> },
  ...Object.fromEntries(
    [
      ["l-sellos", "SELLOS"],
      ["l-cumple", "CUMPLEAÑOS"],
      ["l-cuadra", "LA CUADRA"],
      ["l-premios", "PREMIOS"],
      ["l-datos", "DATOS"],
    ].map(([id, t]) => [id, { w: 640, h: 140, transparent: true, el: <LabelPlate text={t} /> }]),
  ),
  "app-intro": { ...PHONE, el: <AppIntro /> },
  "lock-volvio": { ...PHONE, el: <LockVolvio /> },
  "chat-a": { ...PHONE, el: <Chat step={0} /> },
  "chat-b": { ...PHONE, el: <Chat step={1} /> },
};

export const ScreenStill: React.FC<{ id: string }> = ({ id }) => {
  const d = SCREENS[id];
  return <AbsoluteFill style={{ background: d.transparent ? "transparent" : "#000", overflow: "hidden" }}>{d.el}</AbsoluteFill>;
};

