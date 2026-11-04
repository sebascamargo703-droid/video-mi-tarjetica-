import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { font, tracking } from "./fonts";
import { EASE, EASE_IN, clamp, ease } from "./motion";
import { Phone } from "./components/Phone";
import { V, VOICE } from "./timeline";

/** Centro horizontal útil en Reels/TikTok (120 px de la derecha reservados). */
export const CX = 480;

/* ---------------- Titular grande ---------------- */
const parseLine = (line: string) => {
  const out: { t: string; mark: boolean }[] = [];
  const re = /\[([^\]]+)\]|([^[\]]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) out.push(m[1] ? { t: m[1], mark: true } : { t: m[2], mark: false });
  return out;
};

/** Titular en mayúsculas: entra con un "golpe" (escala + blur), el resaltador se pinta y sale hacia arriba. */
export const Headline: React.FC<{ text: string; at: number; exitAt: number; size?: number; top?: number; dark?: boolean; light?: boolean }> = ({ text, at, exitAt, size = 116, top = 262, dark = false, light = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame > exitAt + 8) return null;
  const inn = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 190 } });
  const out = ease(frame, exitAt, 7, EASE_IN);
  const lines = text.split("\n");
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 960,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.98,
        letterSpacing: "-0.04em",
        color: dark || light ? brand.colors.ink : brand.colors.white,
        textAlign: "center",
        textShadow: dark ? "none" : light ? "0 6px 24px rgba(255,255,255,0.8)" : "0 10px 40px rgba(0,0,0,0.65)",
        transform: `translateY(${-out * 30}px) scale(${1.25 - 0.25 * inn})`,
        transformOrigin: "50% 40%",
        opacity: Math.min(1, inn * 1.6) * (1 - out),
        filter: inn < 0.95 || out > 0.02 ? `blur(${(1 - Math.min(1, inn)) * 10 + out * 8}px)` : undefined,
      }}
    >
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {parseLine(ln).map((p, k) =>
            p.mark ? (
              <span key={k} style={{ position: "relative", display: "inline-block", color: dark ? brand.colors.goldLight : light ? brand.colors.white : brand.colors.ink, padding: "0 0.14em", margin: "0.16em 0 0.04em", textShadow: "none" }}>
                <span
                  style={{
                    position: "absolute",
                    inset: "-0.13em 0 0.02em 0",
                    borderRadius: "0.1em",
                    background: dark ? brand.colors.forest : light ? brand.colors.greenMid : brand.colors.highlight,
                    boxShadow: dark ? "0 12px 30px rgba(11,42,34,0.25)" : light ? "0 12px 30px rgba(22,112,93,0.3)" : "0 12px 40px rgba(143,227,192,0.35)",
                    clipPath: `inset(0 ${100 - interpolate(frame, [at + 3, at + 13], [0, 100], { ...clamp, easing: EASE })}% 0 0)`,
                  }}
                />
                <span style={{ position: "relative" }}>{p.t}</span>
              </span>
            ) : (
              <span key={k}>{p.t}</span>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

/* ---------------- Subtítulo palabra por palabra ---------------- */
export const Karaoke: React.FC<{ hide?: (id: string) => boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cur = VOICE.find((v) => t >= V[v.id].at - 0.08 && t <= V[v.id].end + 0.25);
  if (!cur || hide?.(cur.id)) return null;
  const { at, dur, say } = V[cur.id];
  const words = say.split(/\s+/);
  const w = words.map((x) => x.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5);
  const total = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  const starts = w.map((x) => {
    const s = at + (acc / total) * dur * 0.96;
    acc += x;
    return s;
  });
  const inn = ease(frame, Math.round((at - 0.08) * fps), 6);
  const out = ease(frame, Math.round((V[cur.id].end + 0.12) * fps), 4, EASE_IN);
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 1352, display: "flex", justifyContent: "center", opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 10}px)` }}>
      <div
        style={{
          maxWidth: 840,
          padding: "14px 26px",
          borderRadius: 22,
          background: "rgba(5,8,11,0.62)",
          backdropFilter: "blur(8px)",
          fontFamily: font,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.28,
          letterSpacing: tracking.body,
          textAlign: "center",
          color: brand.colors.white,
        }}
      >
        {words.map((word, i) => {
          const on = t >= starts[i];
          const now = on && (i === words.length - 1 || t < starts[i + 1]);
          return (
            <span key={i} style={{ color: now ? brand.colors.highlight : brand.colors.white, opacity: on ? 1 : 0.38 }}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- Etiquetas sobre el 3D ---------------- */
export const Pill: React.FC<{ x: number; y: number; text: string; tone: "mint" | "gray" | "warm"; appear: number; dot?: boolean; size?: number }> = ({ x, y, text, tone, appear, dot = true, size = 30 }) => {
  if (appear <= 0.001) return null;
  const c = tone === "mint" ? { bg: brand.colors.highlight, fg: brand.colors.ink, dot: brand.colors.greenMid } : tone === "warm" ? { bg: "#FFD9A0", fg: "#3a2410", dot: "#E2852A" } : { bg: "rgba(30,36,44,0.92)", fg: "#C9D3DE", dot: "#7C8794" };
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) translateY(${(1 - appear) * 18}px) scale(${0.8 + 0.2 * appear})`,
        opacity: Math.min(1, appear * 1.5),
        display: "flex",
        alignItems: "center",
        gap: size * 0.35,
        padding: `${size * 0.32}px ${size * 0.6}px`,
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
        boxShadow: "0 12px 34px rgba(0,0,0,0.45)",
      }}
    >
      {dot ? <span style={{ width: size * 0.42, height: size * 0.42, borderRadius: "50%", background: c.dot }} /> : null}
      {text}
    </div>
  );
};

export const Eyebrow: React.FC<{ text: string; appear: number; top?: number }> = ({ text, appear, top = 200 }) => (
  <div style={{ position: "absolute", left: 0, width: 960, top, display: "flex", justifyContent: "center", opacity: appear, transform: `translateY(${(1 - appear) * -10}px)` }}>
    <div style={{ fontFamily: font, fontWeight: 800, fontSize: 24, letterSpacing: "0.24em", color: brand.colors.soft, padding: "10px 22px", borderRadius: 999, border: "1.5px solid rgba(167,201,189,0.35)", background: "rgba(5,8,11,0.45)" }}>{text}</div>
  </div>
);

/* ---------------- Celular grande ---------------- */
export const SCREEN = 720 - 2 * (720 * 0.012 + 720 * 0.026);
export const BigPhone: React.FC<{ y: number; w?: number; tilt?: number; shake?: number; screenBg?: string; statusColor?: string; children: React.ReactNode }> = ({
  y,
  w = 600,
  tilt = 0,
  shake = 0,
  screenBg = "#000",
  statusColor = "#fff",
  children,
}) => (
  <div style={{ position: "absolute", left: CX - 360, top: y, width: 720, transformOrigin: "50% 0", transform: `scale(${w / 720}) translateX(${shake}px) rotate(${tilt}deg)` }}>
    <Phone width={720} screenBg={screenBg} statusColor={statusColor} time="9:41" shadow="0 60px 140px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)">
      {children}
    </Phone>
  </div>
);

/* ---------------- Panel del negocio ---------------- */
export const Dashboard: React.FC<{ at: number; width?: number }> = ({ at, width = 860 }) => {
  const frame = useCurrentFrame();
  const kpis: [string, number, string][] = [
    ["Clientes", 248, ""],
    ["Volvieron este mes", 63, "%"],
    ["Sellos hoy", 18, ""],
    ["Premios canjeados", 6, ""],
  ];
  const bars = [32, 41, 38, 52, 47, 61, 58, 70, 66, 78, 74, 88];
  return (
    <div style={{ width, borderRadius: 30, background: "#F4F6F5", boxShadow: "0 40px 100px rgba(0,0,0,0.6)", fontFamily: font, color: "#0A2E22", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 30px", background: "#FFFFFF", borderBottom: "1.5px solid #E2ECE7" }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: tracking.title }}>Tu panel</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: brand.colors.greenMid, background: "#E3F5EE", padding: "6px 14px", borderRadius: 999 }}>EN VIVO</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: "22px 26px 10px" }}>
        {kpis.map(([k, v, suf], i) => {
          const p = ease(frame, at + 4 + i * 4, 26);
          return (
            <div key={k} style={{ background: "#FFFFFF", borderRadius: 18, padding: "16px 16px", border: "1.5px solid #E2ECE7" }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#5B7268", lineHeight: 1.2, minHeight: 42 }}>{k}</div>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: i === 1 ? brand.colors.greenMid : "#0A2E22" }}>
                {Math.round(v * p)}
                {suf}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 150, padding: "10px 30px 26px" }}>
        {bars.map((b, i) => {
          const p = ease(frame, at + 10 + i * 2, 18);
          return <div key={i} style={{ flex: 1, height: `${b * p}%`, borderRadius: 8, background: i === bars.length - 1 ? brand.colors.greenMid : "#B9E5D5" }} />;
        })}
      </div>
    </div>
  );
};

export { EASE, clamp };
