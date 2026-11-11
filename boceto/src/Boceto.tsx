import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { font, handFont, logoFont } from "./fonts";
import { LogoMark } from "./components/Logo";
import { clamp, EASE, EASE_INOUT, pop } from "./motion";
import { City, Cup, Dot, Pin, Ring, TABLE, type V3 } from "./three/City";
import { Panel3D, type Cam } from "./three/Panel3D";
import { T } from "./timeline";

/**
 * "Del boceto al 3D": a la izquierda el boceto a lápiz, a la derecha la versión terminada, sincronizados.
 * El cliente pasa cerca del café → le llega el aviso → sigue la flecha → en la mesa lo espera su premio.
 */
const C = brand.colors;
const INK = "#262626";
const W = 570; // panel grande (coordenadas de diseño de todos los overlays)
const H = 1012;
const BIG = { x: 429, y: 446 };
const SMALL = { x: 75, y: 737, w: 324, h: 575 };

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const seg = (t: number, a: number, b: number, e = EASE_INOUT) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

/* ---------------- recorrido ---------------- */
const RING_C: V3 = [-6, 0, 1.75];
const RING_R = 12.5;
const dotZ = (t: number) => interpolate(t, [T.mapIn, T.enter, T.swoop + 0.6], [31, 14.6, 13.8], clamp);
const DOT_X = -4.4;

const AERIAL0: Cam = { pos: [DOT_X, 115, 31.6], target: [DOT_X, 0, 31], fov: 35 };
const AERIAL1: Cam = { pos: [-2.5, 96, 44], target: [-5.5, 0, 9.5], fov: 35 };
const AERIAL2: Cam = { pos: [-1, 86, 40], target: [-5.5, 0, 9.5], fov: 35 };
const STREET0: Cam = { pos: [-3.0, 1.65, 13.8], target: [-3.6, 1.45, 2], fov: 42 };
const WALK_END: V3 = [-3.35, 1.55, 4.7];
const TABLE_TOP: V3 = [TABLE[0], 0.78, TABLE[2]];

export const camAt = (t: number): Cam => {
  if (t < T.enter) {
    const k = seg(t, T.mapIn, T.enter + 0.4, EASE_INOUT);
    return { pos: lerp3(AERIAL0.pos, AERIAL1.pos, k), target: lerp3(AERIAL0.target, AERIAL1.target, k), fov: 35 };
  }
  if (t < T.swoop) {
    const k0 = seg(t, T.mapIn, T.enter + 0.4, EASE_INOUT);
    const a: Cam = { pos: lerp3(AERIAL0.pos, AERIAL1.pos, k0), target: lerp3(AERIAL0.target, AERIAL1.target, k0), fov: 35 };
    const k = seg(t, T.enter + 0.4, T.swoop, (x) => x);
    return { pos: lerp3(a.pos, AERIAL2.pos, k), target: lerp3(a.target, AERIAL2.target, k), fov: 35 };
  }
  if (t < T.street) {
    const k = seg(t, T.swoop, T.street, Easing.bezier(0.55, 0, 0.25, 1));
    const ky = seg(t, T.swoop, T.street, Easing.bezier(0.45, 0, 0.2, 1));
    const pos: V3 = [lerp(AERIAL2.pos[0], STREET0.pos[0], k), lerp(AERIAL2.pos[1], STREET0.pos[1], ky), lerp(AERIAL2.pos[2], STREET0.pos[2], k)];
    return { pos, target: lerp3(AERIAL2.target, STREET0.target, Math.pow(k, 0.8)), fov: lerp(35, 42, k) };
  }
  if (t < T.table) {
    const k = seg(t, T.street, T.aqui + 0.4, (x) => Easing.bezier(0.3, 0, 0.45, 1)(x));
    const bob = Math.sin((t - T.street) * 9.5) * 0.025 * (1 - seg(t, T.aqui - 0.3, T.aqui + 0.2));
    const pos = lerp3(STREET0.pos, WALK_END, k);
    pos[1] += bob;
    const ahead: V3 = [pos[0] - 0.7, 1.4, pos[2] - 12];
    const kt = seg(t, T.turn - 0.8, T.aqui + 0.2);
    return { pos, target: lerp3(ahead, TABLE_TOP, kt), fov: 42 };
  }
  // vista cenital de la mesa
  const k = seg(t, T.table, T.end, (x) => x);
  return { pos: [TABLE[0] + 0.01, lerp(1.9, 2.2, k), TABLE[2] + 0.02], target: TABLE_TOP, fov: 42 };
};

/** Distancia (m) y ángulo de la flecha desde la cámara hasta la mesa. */
const nav = (cam: Cam) => {
  const dx = TABLE[0] - cam.pos[0];
  const dz = TABLE[2] - cam.pos[2];
  const d = Math.hypot(dx, dz);
  const fx = cam.target[0] - cam.pos[0];
  const fz = cam.target[2] - cam.pos[2];
  const ang = Math.atan2(fx * dz - fz * dx, fx * dx + fz * dz); // + = a la derecha... en pantalla
  return { d, ang };
};

/* ---------------- mundo 3D ---------------- */
const World: React.FC<{ t: number }> = ({ t }) => {
  const z = dotZ(t);
  const aerialPin = interpolate(t, [T.mapIn, T.mapIn + 0.5, T.swoop + 0.2, T.swoop + 0.7], [0, 2.4, 2.4, 0], clamp);
  const streetPin = interpolate(t, [T.street - 0.3, T.street + 0.2, T.turn + 0.2, T.turn + 0.7], [0, 0.2, 0.2, 0], clamp);
  const ringOn = interpolate(t, [T.mapIn + 0.6, T.mapIn + 1.2, T.swoop + 0.4, T.swoop + 0.9], [0, 1, 1, 0], clamp);
  const flash = interpolate(t, [T.enter, T.enter + 0.15, T.enter + 0.9], [0, 1, 0], clamp);
  const pulse = (t * 0.7) % 1;
  const tableRings = t > T.table - 0.05;
  return (
    <>
      <City />
      {aerialPin > 0 ? <Pin position={[-7, 8.4, 2.2]} scale={aerialPin * 1.25} bob={Math.sin(t * 3) * 0.3} /> : null}
      {streetPin > 0 ? <Pin position={[TABLE[0], 2.3, TABLE[2]]} scale={streetPin} bob={Math.sin(t * 3) * 0.05} /> : null}
      {t < T.swoop + 0.7 ? <Dot position={[DOT_X, 0.05, z]} scale={2.4 * (1 - seg(t, T.swoop, T.swoop + 0.7))} halo={(t * 0.9) % 1} /> : null}
      {ringOn > 0 ? (
        <>
          <Ring position={[RING_C[0], 0.3, RING_C[2]]} r={RING_R} width={0.5 + flash * 0.8} color="#69D3BE" opacity={ringOn * (0.85 + flash * 0.15)} />
          <Ring position={[RING_C[0], 0.29, RING_C[2]]} r={RING_R * pulse} width={0.35} color="#69D3BE" opacity={ringOn * 0.6 * (1 - pulse)} />
          {flash > 0 ? <Ring position={[RING_C[0], 0.28, RING_C[2]]} r={RING_R / 2} width={RING_R} color="#69D3BE" opacity={0.2 * flash} /> : null}
        </>
      ) : null}
      {t > T.turn ? <pointLight position={[TABLE[0] + 0.6, 2.6, TABLE[2] + 0.8]} intensity={6} distance={5} color="#FFF1DC" /> : null}
      <Cup position={[TABLE_TOP[0], TABLE_TOP[1] + 0.001, TABLE_TOP[2]]} t={t} />
      {tableRings
        ? [0, 1, 2].map((i) => {
            const k = interpolate(t, [T.table + i * 0.25, T.table + i * 0.25 + 0.9], [0, 1], { ...clamp, easing: EASE });
            const kk = t > T.reward + 0.5 ? ((t - T.reward - 0.5) * 0.6 + i / 3) % 1 : -1;
            const r = kk >= 0 ? 0.16 + kk * 0.3 : 0.16 + k * (0.1 + i * 0.1);
            return <Ring key={i} position={[TABLE_TOP[0], TABLE_TOP[1] + 0.003, TABLE_TOP[2]]} r={r} width={0.016} color="#1FB57E" opacity={kk >= 0 ? 1 - kk : k} />;
          })
        : null}
    </>
  );
};

/* ---------------- piezas 2D (real y boceto) ---------------- */
const Txt: React.FC<{ sketch: boolean; size: number; weight?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ sketch, size, weight = 800, color, style, children }) => (
  <div style={{ fontFamily: sketch ? handFont : font, fontSize: sketch ? size * 1.25 : size, fontWeight: sketch ? 700 : weight, color: sketch ? INK : color, letterSpacing: sketch ? 0 : "-0.02em", lineHeight: 1.08, ...style }}>{children}</div>
);

/** Línea ondulada que en el boceto reemplaza un texto secundario. */
const Squiggle: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={14} style={{ display: "block" }}>
    <path d={`M2 7 ${Array.from({ length: Math.floor(w / 12) }, (_, i) => `q 3 -6 6 0 t 6 0`).join(" ")}`} fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const AppIcon: React.FC<{ size: number; sketch: boolean }> = ({ size, sketch }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.23,
      background: sketch ? "#FFFFFF" : `linear-gradient(160deg, #1D8A6E 0%, ${C.green} 60%, #083A30 100%)`,
      border: sketch ? `${Math.max(2, size * 0.014)}px solid ${INK}` : "none",
      boxShadow: sketch ? "none" : `0 ${size * 0.08}px ${size * 0.2}px rgba(0,0,0,0.35), inset 0 ${size * 0.02}px 0 rgba(255,255,255,0.18)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
    }}
  >
    <LogoMark height={size * 0.38} color={sketch ? INK : C.white} />
  </div>
);

const Stamps: React.FC<{ sketch: boolean; filled: number; size: number; popLast?: number }> = ({ sketch, filled, size, popLast = 1 }) => (
  <div style={{ display: "flex", gap: size * 0.28 }}>
    {Array.from({ length: 8 }).map((_, i) => {
      const on = i < filled;
      const s = i === filled - 1 ? popLast : 1;
      return (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            boxSizing: "border-box",
            background: on ? (sketch ? "repeating-linear-gradient(45deg, #262626 0 2px, transparent 2px 6px)" : C.mint) : "transparent",
            border: sketch ? `2px solid ${INK}` : on ? "none" : `3px dashed #B8C4C0`,
            transform: `scale(${on ? s : 1})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.ink,
            fontSize: size * 0.55,
            fontWeight: 800,
          }}
        >
          {on && !sketch ? "✓" : ""}
        </div>
      );
    })}
  </div>
);

const Notification: React.FC<{ t: number; sketch: boolean }> = ({ t, sketch }) => {
  const { fps } = useVideoConfig();
  const f = Math.round(t * fps);
  const inn = pop(f, fps, Math.round(T.enter * fps));
  const out = seg(t, T.swoop - 0.25, T.swoop + 0.15, Easing.in(Easing.cubic));
  if (inn <= 0 || out >= 1) return null;
  const y = lerp(-190, 26, Math.min(inn, 1.05)) - out * 230;
  return (
    <div
      style={{
        position: "absolute",
        left: 18,
        top: y,
        width: W - 36,
        boxSizing: "border-box",
        padding: "20px 22px",
        borderRadius: sketch ? 22 : 30,
        background: sketch ? "#FFFFFF" : "rgba(250,250,250,0.94)",
        border: sketch ? `2.5px solid ${INK}` : "none",
        boxShadow: sketch ? "none" : "0 18px 50px rgba(0,0,0,0.35)",
        display: "flex",
        gap: 18,
        alignItems: "center",
      }}
    >
      <AppIcon size={74} sketch={sketch} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Txt sketch={sketch} size={21} weight={600} color="#6B6B70">
            MI TARJETICA
          </Txt>
          <Txt sketch={sketch} size={21} weight={600} color="#6B6B70">
            ahora
          </Txt>
        </div>
        <Txt sketch={sketch} size={29} color="#111" style={{ marginTop: 4 }}>
          Café Origen ☕
        </Txt>
        {sketch ? (
          <div style={{ marginTop: 8 }}>
            <Txt sketch size={25}>
              Estás cerca: te falta 1 sello
            </Txt>
          </div>
        ) : (
          <Txt sketch={false} size={25} weight={400} color="#222" style={{ marginTop: 4 }}>
            Estás cerca: te falta 1 sello para tu café gratis
          </Txt>
        )}
      </div>
    </div>
  );
};

const Sheet: React.FC<{ t: number; sketch: boolean }> = ({ t, sketch }) => {
  const inn = seg(t, T.sheet, T.sheet + 0.55, EASE);
  const out = seg(t, T.swoop - 0.1, T.swoop + 0.35, Easing.in(Easing.cubic));
  if (inn <= 0 || out >= 1) return null;
  const press = interpolate(t, [T.tap - 0.08, T.tap, T.tap + 0.18], [1, 0.93, 1], clamp);
  const ripple = interpolate(t, [T.tap, T.tap + 0.5], [0, 1], clamp);
  const y = H - 360 * inn + 400 * out;
  const btn = (label: string, icon: string, accent: string, pressed: boolean) => (
    <div
      style={{
        flex: 1,
        height: 110,
        borderRadius: 22,
        background: sketch ? "#FFFFFF" : "#F1F2F2",
        border: sketch ? `2.5px solid ${INK}` : "none",
        padding: "16px 18px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        transform: `scale(${pressed ? press : 1})`,
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: sketch ? "#FFFFFF" : accent, border: sketch ? `2.5px solid ${INK}` : "none", display: "flex", alignItems: "center", justifyContent: "center", color: sketch ? INK : "#fff", fontSize: 24, fontWeight: 800, boxSizing: "border-box" }}>{icon}</div>
      <Txt sketch={sketch} size={23} color="#111" style={{ marginTop: 10 }}>
        {label}
      </Txt>
      {pressed && ripple > 0 && ripple < 1 ? (
        <div style={{ position: "absolute", left: 60 - 160 * ripple, top: 50 - 160 * ripple, width: 320 * ripple, height: 320 * ripple, borderRadius: "50%", background: sketch ? "rgba(38,38,38,0.12)" : "rgba(22,112,93,0.18)", opacity: 1 - ripple }} />
      ) : null}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: W,
        height: 400,
        boxSizing: "border-box",
        padding: "16px 26px 0",
        borderRadius: "32px 32px 0 0",
        background: sketch ? "#FFFFFF" : "#FFFFFF",
        borderTop: sketch ? `2.5px solid ${INK}` : "none",
        boxShadow: sketch ? "none" : "0 -14px 40px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ width: 64, height: 6, borderRadius: 3, background: sketch ? INK : "#D5D5D8", margin: "0 auto 14px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Txt sketch={sketch} size={36} color="#111">
            Café Origen
          </Txt>
          {sketch ? (
            <div style={{ marginTop: 6 }}>
              <Squiggle w={210} />
            </div>
          ) : (
            <Txt sketch={false} size={21} weight={400} color="#77777C" style={{ marginTop: 4 }}>
              Calle 10 · a 120 m
            </Txt>
          )}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: sketch ? "#fff" : "#EEEEF0", border: sketch ? `2.5px solid ${INK}` : "none", display: "flex", alignItems: "center", justifyContent: "center", color: sketch ? INK : "#8A8A8F", fontSize: 22, fontWeight: 800, boxSizing: "border-box" }}>×</div>
      </div>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
        <Stamps sketch={sketch} filled={7} size={36} />
        <Txt sketch={sketch} size={20} weight={600} color="#16705D">
          7/8
        </Txt>
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
        {btn("Ver tarjeta", "▭", C.mint, false)}
        {btn("Cómo llegar", "➤", "#16705D", true)}
      </div>
    </div>
  );
};

const Arrow: React.FC<{ sketch: boolean; size: number }> = ({ sketch, size }) =>
  sketch ? (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <path d="M50 92 C49 70 51 45 50 14 M50 12 L30 34 M50 12 C57 20 63 28 70 33" fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.45))" }}>
      <path d="M50 8 L84 44 L62 44 L62 92 L38 92 L38 44 L16 44 Z" fill="#FFFFFF" strokeLinejoin="round" stroke="#FFFFFF" strokeWidth={8} />
    </svg>
  );

const StreetHud: React.FC<{ t: number; cam: Cam; sketch: boolean }> = ({ t, cam, sketch }) => {
  const o = interpolate(t, [T.street - 0.3, T.street + 0.2, T.aqui - 0.05, T.aqui + 0.2], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const { d, ang } = nav(cam);
  const m = Math.max(1, Math.round(d));
  const side = ang < -0.26 ? "a tu izquierda" : ang > 0.26 ? "a tu derecha" : "adelante";
  const rot = Math.max(-75, Math.min(75, (ang * 180) / Math.PI));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {sketch ? null : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />}
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", textShadow: sketch ? "none" : "0 3px 14px rgba(0,0,0,0.5)" }}>
        <Txt sketch={sketch} size={24} weight={600} color="rgba(255,255,255,0.8)">
          Yendo a
        </Txt>
        <Txt sketch={sketch} size={38} color="#FFFFFF">
          Café Origen
        </Txt>
      </div>
      <div style={{ position: "absolute", left: W / 2 - 100, top: 560, width: 200, height: 200, transform: `perspective(600px) rotateX(${sketch ? 0 : 38}deg) rotate(${rot}deg)` }}>
        <Arrow sketch={sketch} size={200} />
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 70, textShadow: sketch ? "none" : "0 4px 18px rgba(0,0,0,0.5)" }}>
        <Txt sketch={sketch} size={104} color="#FFFFFF" style={{ letterSpacing: "-0.04em" }}>
          {m} m
        </Txt>
        <Txt sketch={sketch} size={28} weight={600} color="rgba(255,255,255,0.85)">
          {side}
        </Txt>
      </div>
    </div>
  );
};

const Aqui: React.FC<{ t: number; sketch: boolean }> = ({ t, sketch }) => {
  if (t < T.aqui || t > T.table + 0.4) return null;
  const { fps } = useVideoConfig();
  const p = pop(Math.round(t * fps), fps, Math.round(T.aqui * fps));
  const grow = seg(t, T.aqui + 0.55, T.table, Easing.bezier(0.6, 0, 0.9, 0.6));
  const fade = seg(t, T.table, T.table + 0.35, (x) => x);
  const r = 120 * p + grow * 700;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - fade, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: W / 2 - r,
          top: 600 - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          boxSizing: "border-box",
          background: sketch ? "rgba(255,255,255,0.85)" : "#1FB57E",
          border: sketch ? `3px solid ${INK}` : "none",
          boxShadow: sketch ? "none" : "0 0 60px rgba(31,181,126,0.6)",
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 600 - 38 + grow * 40, textAlign: "center", opacity: p }}>
        <Txt sketch={sketch} size={64 + grow * 50} color="#FFFFFF">
          Aquí
        </Txt>
      </div>
    </div>
  );
};

const Reward: React.FC<{ t: number; sketch: boolean }> = ({ t, sketch }) => {
  const { fps } = useVideoConfig();
  const f = Math.round(t * fps);
  const inn = seg(t, T.reward, T.reward + 0.5, EASE);
  const out = seg(t, T.out - 0.1, T.out + 0.25, (x) => x);
  if (inn <= 0 || out >= 1) return null;
  const last = pop(f, fps, Math.round((T.reward + 0.45) * fps));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: inn }}>
        <Txt sketch={sketch} size={24} weight={600} color="#5D5A52">
          Café Origen
        </Txt>
        <Txt sketch={sketch} size={40} color="#1B1613">
          ¡Tu premio!
        </Txt>
      </div>
      <div
        style={{
          position: "absolute",
          left: 26,
          right: 26,
          bottom: 40 - (1 - inn) * 260,
          padding: "24px 24px 26px",
          borderRadius: 30,
          background: "#FFFFFF",
          border: sketch ? `2.5px solid ${INK}` : "none",
          boxShadow: sketch ? "none" : "0 18px 50px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Txt sketch={sketch} size={34} color="#111">
          ¡Completaste tu tarjeta!
        </Txt>
        <Stamps sketch={sketch} filled={last > 0 ? 8 : 7} size={40} popLast={last} />
        <Txt sketch={sketch} size={26} weight={600} color="#16705D">
          Tu café de hoy es gratis ☕
        </Txt>
      </div>
    </div>
  );
};

/** Ícono de la app: al inicio (zoom hacia adentro) y al final (vuelve y aparece el nombre). */
const IconLayer: React.FC<{ t: number; sketch: boolean }> = ({ t, sketch }) => {
  const { fps } = useVideoConfig();
  const f = Math.round(t * fps);
  const S = 250;
  if (t < T.mapIn + 0.35) {
    const p = pop(f, fps, Math.round(T.iconIn * fps));
    const z = interpolate(t, [T.zoomIn, T.mapIn + 0.1], [0, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.9, 0.5) });
    const scale = p * (1 + z * 22);
    const fade = seg(t, T.mapIn - 0.1, T.mapIn + 0.35, (x) => x);
    // origen del zoom: el punto grande del isotipo
    const ox = (S - S * 0.38 * (860 / 487)) / 2 + (677 / 860) * S * 0.38 * (860 / 487);
    const oy = S / 2;
    return (
      <AbsoluteFill style={{ background: sketch ? "#FFFFFF" : "#EEEDEA", opacity: 1 - fade }}>
        <div style={{ position: "absolute", left: W / 2 - S / 2, top: H / 2 - S / 2 - 40, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${scale})` }}>
          <AppIcon size={S} sketch={sketch} />
        </div>
      </AbsoluteFill>
    );
  }
  if (t < T.out) return null;
  const bg = seg(t, T.out, T.out + 0.4, (x) => x);
  const p = pop(f, fps, Math.round((T.out + 0.3) * fps));
  const sc = interpolate(t, [T.out + 0.3, T.out + 1.0], [1.5, 1], { ...clamp, easing: EASE });
  const name = seg(t, T.out + 0.8, T.out + 1.3, EASE);
  return (
    <AbsoluteFill style={{ background: sketch ? "#FFFFFF" : "#EEEDEA", opacity: bg }}>
      <div style={{ position: "absolute", left: W / 2 - S / 2, top: H / 2 - S / 2 - 70, transform: `scale(${p * sc})` }}>
        <AppIcon size={S} sketch={sketch} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 + 95, textAlign: "center", opacity: name, transform: `translateY(${(1 - name) * 20}px)` }}>
        {sketch ? (
          <Txt sketch size={58}>
            Mi Tarjetica
          </Txt>
        ) : (
          <div style={{ fontFamily: logoFont, fontWeight: 700, fontSize: 58, color: "#1B1613" }}>Mi Tarjetica</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Contenido de un panel (mismo diseño para real y boceto; el boceto se escala). */
export const PanelContent: React.FC<{ t: number; cam: Cam; sketch: boolean; w: number; h: number }> = ({ t, cam, sketch, w, h }) => {
  const k = w / W;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: sketch ? "#FFFFFF" : "linear-gradient(180deg, #A8C8DE 0%, #E9D6BE 70%, #E5C9A6 100%)" }}>
      {t > T.mapIn - 0.2 && t < T.out + 0.5 ? (
        <Panel3D w={w} h={h} cam={cam} sketch={sketch}>
          <World t={t} />
        </Panel3D>
      ) : null}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${k})`, transformOrigin: "0 0" }}>
        <StreetHud t={t} cam={cam} sketch={sketch} />
        <Notification t={t} sketch={sketch} />
        <Sheet t={t} sketch={sketch} />
        <Aqui t={t} sketch={sketch} />
        <Reward t={t} sketch={sketch} />
        <IconLayer t={t} sketch={sketch} />
      </div>
    </div>
  );
};

export const Boceto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cam = camAt(t);
  const seed = Math.floor(frame / 4) % 7; // el trazo "hierve" como dibujo a mano
  const intro = seg(t, 0, 0.35, EASE);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 1200px at 540px 900px, #1A2522 0%, #0B100E 60%, #050706 100%)" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="lapiz">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={2.6} />
        </filter>
      </svg>
      {/* títulos */}
      <div style={{ position: "absolute", left: BIG.x, width: W, top: 352, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, opacity: intro }}>
        <LogoMark height={36} color={C.mint} />
        <div style={{ fontFamily: logoFont, fontWeight: 700, fontSize: 54, color: C.white }}>Mi Tarjetica</div>
      </div>
      <div style={{ position: "absolute", left: SMALL.x, width: SMALL.w, top: 652, textAlign: "center", fontFamily: font, fontWeight: 800, fontSize: 50, color: C.white, letterSpacing: "-0.02em", opacity: intro }}>Boceto</div>
      {/* panel boceto */}
      <div style={{ position: "absolute", left: SMALL.x, top: SMALL.y, width: SMALL.w, height: SMALL.h, borderRadius: 6, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", filter: "url(#lapiz)" }}>
        <PanelContent t={t} cam={cam} sketch w={SMALL.w} h={SMALL.h} />
      </div>
      {/* panel real */}
      <div style={{ position: "absolute", left: BIG.x, top: BIG.y, width: W, height: H, borderRadius: 6, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
        <PanelContent t={t} cam={cam} sketch={false} w={W} h={H} />
      </div>
      {/* llamado */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1515, textAlign: "center", fontFamily: font, fontWeight: 700, fontSize: 48, color: C.white, letterSpacing: "-0.02em", opacity: intro }}>
        Comenta <span style={{ color: C.mint }}>“TARJETICA”</span> y te mando el link
      </div>
      <Audio src={staticFile("music.mp3")} volume={0.9} />
    </AbsoluteFill>
  );
};
