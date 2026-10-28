import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { audio, brand } from "./brand";
import { copy, customer, headlines } from "./copy";
import { font, tracking } from "./fonts";
import { LockScreen } from "./components/LockScreen";
import { Logo } from "./components/Logo";
import { Notification } from "./components/Notification";
import { PassCard } from "./components/PassCard";
import { City, WORLD, type Walker } from "./three/City";
import { Stage } from "./three/Stage";
import { camAt, toScreen, type Cam, type Key, type V3 } from "./three/camera";
import { EASE_IN, EASE_INOUT, clamp, ease, pop } from "./motion";
import { BigPhone, CX, Dashboard, Eyebrow, Headline, Karaoke, MenuCompare, Pill, SCREEN } from "./ui";
import { DURATION_SEC, SCENES, type SceneId, V, VOICE, wordTime } from "./timeline";

const Y = 0.12; // altura del andén / piso de los cafés

/* ------------------------------------------------------------------ */
/* Caminatas */
const walk = (pts: V3[], start: number, speed: number, t: number): Walker => {
  let d = Math.max(0, (t - start) * speed);
  const moving = t > start;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, , z0] = pts[i];
    const [x1, , z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (d <= len || i === pts.length - 2) {
      const k = Math.min(1, d / len);
      const done = i === pts.length - 2 && d >= len;
      return { pos: [x0 + (x1 - x0) * k, Y, z0 + (z1 - z0) * k], rot: Math.atan2(x1 - x0, z1 - z0), phase: moving && !done ? (t - start) * speed * 4.6 : undefined, visible: true };
    }
    d -= len;
  }
  return { pos: pts[0], rot: 0, visible: true };
};

const LEAVE: V3[] = [
  [2.1, Y, -9.0],
  [2.9, Y, -8.1],
  [2.9, Y, -5.4],
  [3.9, Y, -4.75],
  [22, Y, -4.75],
];
const leaveStart = SCENES.leave.from + 0.15;
const DAYS_ENTER = SCENES.notif.from - 0.35;
const daysStartX = -6.77 - 1.45 * (DAYS_ENTER - SCENES.days.from);
const DAYS: V3[] = [
  [daysStartX, Y, -4.75],
  [-3.2, Y, -4.75],
];
const CROSS: V3 = [WORLD.crosswalkX, Y, 0.2];
const goAt = V.e2.end + 0.2;
const TO_ORIGEN: V3[] = [CROSS, [WORLD.crosswalkX + 0.5, Y, -2.5], [2.9, Y, -4.4], [2.9, Y, -6.6]];

/* ------------------------------------------------------------------ */
/* Estado del mundo 3D y cámara para cada instante */
type World = {
  cam: Cam;
  valentina: Walker;
  ring?: { on: number; pulse: number; flash: number };
  paths?: { origen: number; esquina: number; glow: number };
};

const follow = (v: Walker, off: V3, fov = 40): Cam => ({ pos: [v.pos[0] + off[0], v.pos[1] + off[1], v.pos[2] + off[2]], target: [v.pos[0], v.pos[1] + 0.9, v.pos[2]], fov });

const S = SCENES;
const K = {
  hook: [
    { t: 0, pos: [4, 44, 30], target: [0, 0, -1.5], fov: 34 },
    { t: S.hook.to, pos: [-3, 40, 27], target: [0, 0, -1], fov: 34 },
  ] as Key[],
  same: [
    { t: S.same.from, pos: [0.4, 34, 6], target: [0, 0, 0], fov: 40 },
    { t: S.same.to, pos: [-3, 31, 4], target: [0, 0, 0], fov: 40 },
  ] as Key[],
  diff: [
    { t: S.diff.from, pos: [1.5, 9.5, 2.5], target: [-0.8, 1, -9.5], fov: 44 },
    { t: wordTime("b2", "y") - 0.05, pos: [1.2, 3.9, -7.8], target: [-1.8, 1.0, -11.8], fov: 46 },
    { t: S.diff.to, pos: [6.5, 8.0, 3.5], target: [2.6, 0.6, -5.2], fov: 42 },
  ] as Key[],
  days: [
    { t: S.days.from, pos: [-8, 24, 6], target: [-6.5, 0, -5.5], fov: 40 },
    { t: S.notif.to, pos: [-5, 22, 5], target: [-4.5, 0, -5.5], fov: 40 },
  ] as Key[],
  choice: [
    { t: S.choice.from, pos: [-6, 38, 27], target: [-2.2, 0, -0.5], fov: 34 },
    { t: S.choice.to, pos: [-4, 34, 24], target: [-1.6, 0, -1], fov: 34 },
  ] as Key[],
  you: [
    { t: S.you.from, pos: [3, 34, 26], target: [0, 0, -1.5], fov: 36 },
    { t: DURATION_SEC, pos: [-12, 58, 46], target: [0, 0, -2], fov: 34 },
  ] as Key[],
};

const worldAt = (t: number): World => {
  const hidden: Walker = { pos: [0, Y, 0], rot: 0, visible: false };
  if (t < S.leave.from) {
    const cam = t < S.same.from ? camAt(K.hook, t) : t < S.diff.from ? camAt(K.same, t) : camAt(K.diff, t);
    return { cam, valentina: hidden };
  }
  if (t < S.days.from) {
    const v = walk(LEAVE, leaveStart, 1.4, t);
    return { cam: follow(v, [3.6, 3.0, 6.0], 42), valentina: v };
  }
  if (t < S.choice.from) {
    const v = walk(DAYS, S.days.from, 1.45, t);
    const ringOn = ease(t * 30, (S.days.from + 0.2) * 30, 24);
    const flash = t > DAYS_ENTER ? interpolate(t - DAYS_ENTER, [0, 0.12, 1.0], [0, 1, 0], clamp) : 0;
    const pulse = ((t - S.days.from) * 0.7) % 1;
    return { cam: camAt(K.days, t), valentina: v, ring: { on: ringOn, pulse, flash } };
  }
  if (t < S.product.from) {
    const v = t < goAt ? { pos: CROSS, rot: Math.PI * 0.85, visible: true } : walk(TO_ORIGEN, goAt, 1.6, t);
    const paths = {
      origen: ease(t * 30, (V.e1.at + 0.3) * 30, 36, EASE_INOUT),
      esquina: ease(t * 30, (wordTime("e2", "cuál") + 0.1) * 30, 30, EASE_INOUT),
      glow: 0.55 * ease(t * 30, (V.e1.at + 1.4) * 30, 15),
    };
    return { cam: camAt(K.choice, t), valentina: v as Walker, paths };
  }
  return { cam: camAt(K.you, t), valentina: { pos: [2.9, Y, -6.4], rot: Math.PI, visible: true } };
};

const ORIGEN_TAG: V3 = [2.2, 3.9, -6];
const ESQUINA_TAG: V3 = [0, 3.9, 6];

/* ------------------------------------------------------------------ */
const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps, s: (x: number) => Math.round(x * fps) };
};
const inScene = (t: number, id: SceneId, pad = 0) => t >= S[id].from - pad && t < S[id].to + pad;

/** Capa 3D: un solo lienzo para todas las escenas de calle; se desenfoca bajo los celulares. */
const World3D: React.FC = () => {
  const { t, s, frame } = useT();
  if (inScene(t, "product")) return null;
  const w = worldAt(t);
  const under = inScene(t, "card") || inScene(t, "notif") || inScene(t, "cta");
  const blurIn = under ? ease(frame, s(inScene(t, "card") ? S.card.from : inScene(t, "notif") ? S.notif.from : S.cta.from), 10) : 0;
  return (
    <AbsoluteFill style={{ filter: blurIn > 0 ? `blur(${blurIn * 14}px) brightness(${1 - 0.45 * blurIn})` : undefined, transform: blurIn > 0 ? `scale(${1 + 0.05 * blurIn})` : undefined }}>
      <Stage cam={w.cam}>
        <City valentina={w.valentina} ring={w.ring} paths={w.paths} />
      </Stage>
    </AbsoluteFill>
  );
};

/** Etiquetas ancladas a puntos del 3D. */
const Labels: React.FC = () => {
  const { t, frame, s } = useT();
  if (inScene(t, "product") || inScene(t, "card") || inScene(t, "notif") || inScene(t, "cta")) return null;
  const w = worldAt(t);
  const o = toScreen(ORIGEN_TAG, w.cam);
  const e = toScreen(ESQUINA_TAG, w.cam);
  const vv = w.valentina.visible ? toScreen([w.valentina.pos[0], 2.35, w.valentina.pos[2]], w.cam) : null;
  const out: React.ReactNode[] = [];
  if (inScene(t, "hook")) {
    out.push(<Pill key="o" x={o.x} y={o.y} text={copy.full} tone="mint" appear={ease(frame, s(V.a1.at + 0.6), 12)} />);
    out.push(<Pill key="e" x={e.x} y={e.y} text={copy.empty} tone="gray" appear={ease(frame, s(V.a1.at + 1.3), 12)} />);
  }
  if (inScene(t, "same")) {
    out.push(<Pill key="o" x={o.x} y={o.y} text="ORIGEN" tone="warm" dot={false} appear={ease(frame, s(S.same.from + 0.2), 10) * (1 - ease(frame, s(wordTime("b1", "productos") - 0.1), 6))} />);
    out.push(<Pill key="e" x={e.x} y={e.y} text="LA ESQUINA" tone="gray" dot={false} appear={ease(frame, s(S.same.from + 0.35), 10) * (1 - ease(frame, s(wordTime("b1", "productos") - 0.1), 6))} />);
  }
  if (inScene(t, "leave") && vv) {
    const a = ease(frame, s(V.c1.at + 1.4), 10) * (1 - ease(frame, s(S.leave.to - 0.3), 8));
    const hip = toScreen([w.valentina.pos[0], 1.5, w.valentina.pos[2]], w.cam);
    out.push(<Pill key="st" x={hip.x + 170} y={hip.y} text={`☕ ${copy.stampAdded}`} tone="mint" dot={false} appear={a} size={36} />);
  }
  if (inScene(t, "days") && vv) out.push(<Pill key="v" x={vv.x} y={vv.y} text={customer} tone="mint" appear={ease(frame, s(S.days.from + 0.3), 10)} size={26} />);
  if (inScene(t, "choice")) {
    const od = toScreen([3.4, 0.2, -4.4], w.cam);
    out.push(<Pill key="o" x={od.x} y={od.y} text={copy.withCard} tone="mint" appear={ease(frame, s(V.e1.at + 0.7), 12)} />);
    out.push(<Pill key="e" x={e.x} y={e.y} text={copy.noCard} tone="gray" appear={ease(frame, s(wordTime("e2", "cuál") + 0.3), 12)} />);
    if (vv) out.push(<Pill key="v" x={vv.x} y={vv.y} text={customer} tone="mint" appear={ease(frame, s(S.choice.from + 0.2), 10)} size={26} />);
  }
  if (inScene(t, "you")) {
    out.push(<Pill key="o" x={o.x} y={o.y} text="ORIGEN · CON MI TARJETICA" tone="mint" appear={ease(frame, s(wordTime("g1", "cuál")), 12)} size={26} />);
    out.push(<Pill key="e" x={e.x} y={e.y} text="LA ESQUINA · SIN TARJETA" tone="gray" appear={ease(frame, s(wordTime("g1", "cuál") + 0.25), 12)} size={26} />);
  }
  return <>{out}</>;
};

/* ------------------------------------------------------------------ */
/* Escenas 2D */
const CardScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  if (!inScene(t, "card", 0.3)) return null;
  const rise = spring({ frame: frame - s(S.card.from), fps, config: { damping: 22, stiffness: 120 } });
  const out = ease(frame, s(S.card.to - 0.05), 8, EASE_IN);
  const stampAt = s(wordTime("c2", "razón"));
  const st = 6 + Math.min(1, frame < stampAt ? 0 : spring({ frame: frame - stampAt, fps, config: { damping: 11, stiffness: 200 } }));
  const pulse = frame > stampAt + 20 ? (Math.sin((t - stampAt / fps) * Math.PI * 3) + 1) / 2 : 0;
  const saved = ease(frame, s(wordTime("c2", "guardada")), 10);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - rise) * 1100}px)` }}>
        <BigPhone y={560} w={520} tilt={Math.sin(t * 1.2) * 1.2}>
          <AbsoluteFill style={{ background: "#050505" }}>
            <div style={{ position: "absolute", top: 140, left: 32, right: 32, display: "flex", justifyContent: "space-between", fontFamily: font, fontWeight: 600, fontSize: 32, color: "#fff" }}>
              <span>Listo</span>
              <span style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>···</span>
            </div>
            <div style={{ position: "absolute", left: 32, top: 210 }}>
              <PassCard width={SCREEN - 64} stamps={st} pulse={pulse} />
            </div>
            <div style={{ position: "absolute", left: 22, right: 22, top: 1075 }}>
              {["#C2410C", "#1D4ED8", "#6D28D9"].map((c, i) => (
                <div key={c} style={{ height: 90, borderRadius: "26px 26px 0 0", background: c, marginTop: i ? -30 : 0, boxShadow: "0 -6px 18px rgba(0,0,0,0.35)" }} />
              ))}
            </div>
          </AbsoluteFill>
        </BigPhone>
        <div style={{ position: "absolute", left: 0, width: 960, top: 1250, display: "flex", justifyContent: "center", opacity: saved, transform: `scale(${0.9 + 0.1 * saved})` }}>
          <div style={{ padding: "14px 28px", borderRadius: 999, background: brand.colors.highlight, color: brand.colors.ink, fontFamily: font, fontWeight: 800, fontSize: 32, boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>✓ Guardada en su celular</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const NotifScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  if (!inScene(t, "notif", 0.3)) return null;
  const rise = spring({ frame: frame - s(S.notif.from), fps, config: { damping: 22, stiffness: 120 } });
  const out = ease(frame, s(S.notif.to - 0.05), 8, EASE_IN);
  const nAt = s(S.notif.from + 0.45);
  const n = pop(frame, fps, nAt);
  const shake = frame >= nAt && frame < nAt + s(0.35) ? Math.sin((frame - nAt) * 2.4) * 7 : 0;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - rise) * 1100}px)` }}>
        <BigPhone y={560} w={540} shake={shake}>
          <LockScreen>
            <div style={{ position: "absolute", left: 20, top: 400, transformOrigin: "50% 0", transform: `scale(${0.85 + 0.15 * n}) translateY(${(1 - n) * -30}px)`, opacity: Math.min(1, n * 1.5) }}>
              <Notification width={SCREEN - 40} />
            </div>
            <div style={{ position: "absolute", left: 60, right: 60, top: 640, opacity: ease(frame, nAt + s(0.5), 12) }}>
              <PassCard width={SCREEN - 120} pulse={(Math.sin(t * Math.PI * 3) + 1) / 2} showQr={false} />
            </div>
          </LockScreen>
        </BigPhone>
      </div>
    </AbsoluteFill>
  );
};

const ProductScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  if (!inScene(t, "product", 0.3)) return null;
  const inn = ease(frame, s(S.product.from), 8);
  const logoBig = 1 - ease(frame, s(V.f2.at - 0.1), 18, EASE_INOUT);
  const cardAt = s(V.f2.at);
  const cardIn = spring({ frame: frame - cardAt, fps, config: { damping: 18, stiffness: 120 } });
  const reward = pop(frame, fps, s(wordTime("f2", "premios")));
  const notif = spring({ frame: frame - s(wordTime("f2", "avisos")), fps, config: { damping: 18, stiffness: 150 } });
  const panelAt = s(wordTime("f2", "clientes") - 0.1);
  const panel = spring({ frame: frame - panelAt, fps, config: { damping: 20, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ opacity: inn, background: `radial-gradient(ellipse 900px 900px at 480px 800px, #0F3A2F 0%, ${brand.colors.bg} 72%)` }}>
      {/* rejilla sutil */}
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(105,211,190,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(105,211,190,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at 50% 45%, black, transparent 70%)" }} />
      <div style={{ position: "absolute", left: 0, width: 960, top: 250 + logoBig * 470, display: "flex", justifyContent: "center", transform: `scale(${1 + logoBig * 0.6})`, transformOrigin: "50% 0" }}>
        <Logo height={130} color={brand.colors.white} animateAt={s(S.product.from + 0.05)} />
      </div>
      <div style={{ position: "absolute", left: CX - 220, top: 560, transform: `translateY(${(1 - cardIn) * 700}px) rotate(${(1 - cardIn) * 8 - 3}deg)`, opacity: Math.min(1, cardIn * 2) }}>
        <PassCard width={440} stamps={7} pulse={(Math.sin(t * Math.PI * 3) + 1) / 2} />
      </div>
      {reward > 0 ? (
        <div style={{ position: "absolute", left: CX + 110, top: 730, transform: `scale(${reward}) rotate(7deg)`, padding: "16px 26px", borderRadius: 22, background: "#FFD9A0", color: "#3a2410", fontFamily: font, fontWeight: 800, fontSize: 36, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>{copy.reward}</div>
      ) : null}
      {notif > 0.001 ? (
        <div style={{ position: "absolute", left: CX - 310, top: 405 + (1 - notif) * -260, opacity: Math.min(1, notif * 2) }}>
          <Notification width={620} />
        </div>
      ) : null}
      {panel > 0.001 ? (
        <div style={{ position: "absolute", left: CX - 430, top: 955 + (1 - panel) * 900 }}>
          <Dashboard at={panelAt} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const CtaScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  if (!inScene(t, "cta")) return null;
  const at = s(V.h1.at);
  const title = spring({ frame: frame - at + 2, fps, config: { damping: 14, stiffness: 170 } });
  const word = spring({ frame: frame - at - s(0.25), fps, config: { damping: 12, stiffness: 190 } });
  const sub = ease(frame, at + s(0.7), s(0.5));
  const bar = ease(frame, at + s(0.5), s(0.5));
  const typeStart = at + s(1.0);
  const typed = copy.cta.word.slice(0, Math.max(0, Math.min(copy.cta.word.length, Math.floor((frame - typeStart) / 3))));
  const sentAt = typeStart + copy.cta.word.length * 3 + s(0.25);
  const sent = ease(frame, sentAt, s(0.4));
  const logoAt = at + s(2.2);
  const caret = Math.floor(frame / 15) % 2 === 0;
  const arrow = Math.sin((frame / fps) * Math.PI * 2 * 1.2) * 10;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 960, top: 330, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: font, color: brand.colors.white, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 126, fontWeight: 800, letterSpacing: tracking.headline, lineHeight: 1, transform: `scale(${0.7 + 0.3 * title})`, opacity: Math.min(1, title * 1.5) }}>{copy.cta.top}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, transform: `scale(${0.6 + 0.4 * word})`, opacity: Math.min(1, word * 1.5) }}>
          <span style={{ fontSize: 116, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, background: brand.colors.highlight, color: brand.colors.ink, padding: "0 20px", borderRadius: 18, textShadow: "none", boxShadow: "0 18px 60px rgba(143,227,192,0.3)" }}>{copy.cta.word}</span>
          <span style={{ fontSize: 100, fontWeight: 800, transform: `translateY(${arrow}px)` }}>↓</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 44, fontWeight: 600, color: brand.colors.soft, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>{copy.cta.sub}</div>
      </div>
      <div style={{ position: "absolute", left: CX - 420, width: 840, top: 1010, opacity: bar, transform: `translateY(${(1 - bar) * 40}px)` }}>
        <div style={{ height: 112, borderRadius: 999, background: "rgba(5,8,11,0.6)", border: "2px solid rgba(255,255,255,0.16)", display: "flex", alignItems: "center", padding: "0 20px", gap: 20, fontFamily: font, backdropFilter: "blur(10px)" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(145deg, ${brand.colors.mint}, ${brand.colors.greenMid})` }} />
          <div style={{ flex: 1, fontSize: 40, fontWeight: typed && sent === 0 ? 800 : 400, color: typed && sent === 0 ? brand.colors.white : "rgba(255,255,255,0.5)" }}>
            {sent > 0 ? copy.cta.comment : typed || copy.cta.comment}
            {typed && sent === 0 && caret ? <span style={{ fontWeight: 400 }}>|</span> : null}
          </div>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: typed.length === copy.cta.word.length ? "#2F7BF6" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 44, fontWeight: 800, transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, sent) * Math.PI)})` }}>↑</div>
        </div>
        {sent > 0 ? (
          <div style={{ position: "absolute", right: 30, top: -96 - 30 * sent, opacity: Math.min(1, sent * 2), padding: "14px 28px", borderRadius: 26, background: "#2F7BF6", color: "#fff", fontFamily: font, fontWeight: 800, fontSize: 40 }}>{copy.cta.word}</div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1240, display: "flex", justifyContent: "center", opacity: ease(frame, logoAt, s(0.3)) }}>
        <Logo height={150} color={brand.colors.white} animateAt={logoAt} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Titulares, rótulos y cortes */
const Headlines: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const SCENE_OF: Record<string, SceneId> = { a2: "hook", b1: "same", b2: "diff", c1: "leave", c2: "card", d1: "days", d2: "notif", e1: "choice", e2: "choice", g1: "you" };
  const list: { text: string; at: number; scene: SceneId }[] = [];
  for (const v of VOICE) for (const [text, needle] of headlines[v.id] ?? []) list.push({ text, at: Math.max(wordTime(v.id, needle), S[SCENE_OF[v.id]].from + 0.05), scene: SCENE_OF[v.id] });
  return (
    <>
      {list.map((h, i) => {
        const next = list[i + 1];
        const end = next && next.scene === h.scene ? next.at - 0.12 : S[h.scene].to - 0.1;
        return <Headline key={i} text={h.text} at={s(h.at)} exitAt={s(end)} size={h.text.length > 22 ? 104 : 116} />;
      })}
    </>
  );
};

const Eyebrows: React.FC = () => {
  const { t, frame, s } = useT();
  if (inScene(t, "hook")) return <Eyebrow text={copy.sameStreet} appear={ease(frame, s(0.2), 12) * (1 - ease(frame, s(V.a2.at - 0.2), 6))} top={280} />;
  if (inScene(t, "days")) return <Eyebrow text={copy.daysLater} appear={ease(frame, s(S.days.from + 0.1), 10) * (1 - ease(frame, s(S.days.to - 0.2), 6))} top={200} />;
  return null;
};

/** Golpe de corte: oscurece 3 cuadros a cada lado del cambio de escena. */
const Cuts: React.FC = () => {
  const { frame, s } = useT();
  let o = 0;
  for (const id of Object.keys(S) as SceneId[]) {
    if (id === "hook") continue;
    const c = s(S[id].from);
    o = Math.max(o, interpolate(frame, [c - 4, c, c + 5], [0, 0.85, 0], clamp));
  }
  return o > 0 ? <AbsoluteFill style={{ background: "#000", opacity: o, pointerEvents: "none" }} /> : null;
};

/** Grano de película muy suave (textura de ruido que cambia de posición cada cuadro). */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame * 137) % 512;
  const y = (frame * 251) % 512;
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile("grain.png")})`, backgroundPosition: `${x}px ${y}px`, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};

/* ------------------------------------------------------------------ */
/* Audio */
const musicVolume = (f: number, fps: number, total: number) => {
  const t = f / fps;
  const speaking = VOICE.some((v) => t > V[v.id].at - 0.15 && t < V[v.id].end + 0.15);
  const near = VOICE.reduce((m, v) => Math.min(m, Math.abs(t - V[v.id].at), Math.abs(t - V[v.id].end)), 9);
  const base = speaking ? audio.music.duckTo : audio.music.duckTo + (audio.music.volume - audio.music.duckTo) * Math.min(1, near / 0.3);
  return base * Math.min(1, t / 0.4) * Math.min(1, (total / fps - t) / 1.4);
};
const Sfx: React.FC<{ at: number; file: string; vol: number }> = ({ at, file, vol }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} layout="none">
      <Html5Audio src={staticFile(`sfx/${file}.mp3`)} volume={vol} />
    </Sequence>
  );
};

export const DosLocales: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const fx = audio.sfx;
  return (
    <AbsoluteFill style={{ background: brand.colors.bg }}>
      <World3D />
      {/* viñeta cinematográfica */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,11,0.55) 0%, rgba(5,8,11,0) 28%, rgba(5,8,11,0) 62%, rgba(5,8,11,0.5) 100%)", pointerEvents: "none" }} />
      <Labels />
      <SameMenus />
      <CardScene />
      <NotifScene />
      <ProductScene />
      <CtaScene />
      <Eyebrows />
      <Headlines />
      <Karaoke hide={(id) => id === "h1"} />
      <Cuts />
      <Grain />

      <Html5Audio src={staticFile(audio.music.file)} volume={(f) => musicVolume(f, fps, durationInFrames)} />
      {VOICE.map((v) => (
        <Sequence key={v.id} from={Math.round(V[v.id].at * fps)} layout="none">
          <Html5Audio src={staticFile(`voz/${v.id}.wav`)} volume={audio.voice.volume} />
        </Sequence>
      ))}
      {(Object.keys(S) as SceneId[])
        .filter((id) => id !== "hook")
        .map((id) => (
          <Sfx key={id} at={S[id].from - 0.08} file="whoosh-soft" vol={fx.whoosh} />
        ))}
      <Sfx at={V.a1.at + 0.6} file="pop" vol={fx.pop * 0.7} />
      <Sfx at={V.a1.at + 1.3} file="pop" vol={fx.pop * 0.5} />
      <Sfx at={wordTime("b1", "precios") + 0.25} file="pop" vol={fx.pop} />
      <Sfx at={V.c1.at + 1.4} file="pop" vol={fx.pop} />
      <Sfx at={wordTime("c2", "razón")} file="tap" vol={fx.tap} />
      <Sfx at={DAYS_ENTER} file="ring-pulse" vol={fx.ringPulse} />
      <Sfx at={S.notif.from + 0.4} file="haptic" vol={fx.haptic} />
      <Sfx at={S.notif.from + 0.45} file="notification" vol={fx.notification} />
      <Sfx at={V.e1.at + 0.7} file="pop" vol={fx.pop * 0.7} />
      <Sfx at={wordTime("f2", "premios")} file="pop" vol={fx.pop} />
      <Sfx at={wordTime("f2", "avisos")} file="notification" vol={fx.notification * 0.7} />
      <Sfx at={V.h1.at + 1.0 + (copy.cta.word.length * 3) / 30 + 0.25} file="tap" vol={fx.tap} />
    </AbsoluteFill>
  );
};

/** Menús comparados en "Productos parecidos. Precios parecidos." */
const SameMenus: React.FC = () => {
  const { t, frame, s } = useT();
  if (!inScene(t, "same", 0.2)) return null;
  const inAt = s(wordTime("b1", "productos") - 0.15);
  const dim = ease(frame, inAt, 10) * (1 - ease(frame, s(S.same.to - 0.1), 6));
  return (
    <>
      <AbsoluteFill style={{ background: "rgba(5,8,11,0.6)", opacity: dim, backdropFilter: dim > 0.01 ? `blur(${dim * 6}px)` : undefined }} />
      <div style={{ opacity: 1 - ease(frame, s(S.same.to - 0.1), 6) }}>
        <MenuCompare inAt={inAt} itemsAt={inAt + 4} pricesAt={s(wordTime("b1", "precios"))} />
      </div>
    </>
  );
};
