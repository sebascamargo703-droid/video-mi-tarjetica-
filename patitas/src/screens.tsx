import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "./brand";
import { business, copy } from "./copy";
import { font, logoFont } from "./fonts";
import { BusinessIcon } from "./components/BusinessPin";
import { Logo } from "./components/Logo";
import { LockScreen } from "./components/LockScreen";
import { Notification } from "./components/Notification";
import { MiniCard, PassCard } from "./components/PassCard";
import { QrCode } from "./components/QrCode";

/**
 * Pantallas 2D que se pegan como textura en los aparatos 3D (celulares, tablet, letreros).
 * `scripts/render-screens.mjs` las exporta a public/screens/<id>.png; el video solo usa esas imágenes.
 */
const C = brand.colors;
export const PHONE = { w: 666, h: 1430 };
export const TABLET = { w: 1280, h: 860 };

/* ---------------- piezas ---------------- */
const StatusBar: React.FC<{ dark?: boolean }> = ({ dark = true }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 58px", fontFamily: font, fontWeight: 700, fontSize: 32, color: dark ? "#fff" : "#000" }}>
    <span>9:41</span>
    <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span style={{ width: 34, height: 20, borderRadius: 4, background: dark ? "#fff" : "#000", opacity: 0.9 }} />
    </span>
  </div>
);

export const Glass: React.FC<{ w: number; children: React.ReactNode; pad?: number }> = ({ w, children, pad = 30 }) => (
  <div style={{ width: w, padding: pad, borderRadius: 34, background: "linear-gradient(180deg, #121C1A 0%, #0B1311 100%)", border: "1.5px solid rgba(167,201,189,0.16)", fontFamily: font, color: C.white, boxSizing: "border-box" }}>{children}</div>
);

export const Avatar: React.FC<{ letter: string; color: string; size?: number }> = ({ letter, color, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 800, fontSize: size * 0.45, flexShrink: 0 }}>{letter}</div>
);

export const MiniNotif: React.FC<{ title: string; body: string; width: number; when?: string }> = ({ title, body, width, when = "ahora" }) => {
  const k = width / 620;
  return (
    <div style={{ width, display: "flex", gap: 18 * k, alignItems: "center", padding: `${20 * k}px ${22 * k}px`, borderRadius: 30 * k, background: "rgba(48,54,58,0.96)", border: "1.5px solid rgba(255,255,255,0.1)", boxSizing: "border-box", fontFamily: font, color: C.white }}>
      <div style={{ width: 70 * k, height: 70 * k, borderRadius: 18 * k, background: `linear-gradient(145deg, ${C.greenMid}, ${C.greenDeep})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <BusinessIcon size={42 * k} color={C.white} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 * k, fontWeight: 800 }}>
          <span>{title}</span>
          <span style={{ fontWeight: 600, opacity: 0.6 }}>{when}</span>
        </div>
        <div style={{ fontSize: 28 * k, lineHeight: 1.25, marginTop: 4 * k, opacity: 0.92 }}>{body}</div>
      </div>
    </div>
  );
};

const Wallet: React.FC<{ stamps: number; pulse?: number; banner?: boolean }> = ({ stamps, pulse = 0, banner = false }) => (
  <AbsoluteFill style={{ background: "#0B0D0F", fontFamily: font, color: C.white }}>
    <StatusBar />
    <div style={{ position: "absolute", left: 40, top: 130, fontSize: 56, fontWeight: 800, letterSpacing: "-0.02em" }}>Billetera</div>
    <div style={{ position: "absolute", left: 33, top: 230 }}>
      <PassCard width={600} stamps={stamps} pulse={pulse} />
    </div>
    {banner ? (
      <div style={{ position: "absolute", left: 22, top: 40 }}>
        <MiniNotif title={copy.stampNotif.title} body={copy.stampNotif.body} width={622} />
      </div>
    ) : null}
  </AbsoluteFill>
);

const Camera: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #33403b, #0b0d0f 72%)", fontFamily: font }}>
    <StatusBar />
    <div style={{ position: "absolute", left: 133, top: 400, width: 400, height: 400, border: "8px solid rgba(255,255,255,0.9)", borderRadius: 46 }} />
    <div style={{ position: "absolute", left: 183, top: 450, opacity: 0.55, filter: "blur(2px)" }}>
      <QrCode size={300} color="#111" background="#e8e2d4" quiet={2} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontSize: 34, fontWeight: 700, color: "#fff" }}>Apunta al código</div>
    <div style={{ position: "absolute", left: "50%", bottom: 90, width: 130, height: 130, marginLeft: -65, borderRadius: "50%", border: "8px solid #fff" }} />
  </AbsoluteFill>
);

const AddPass: React.FC = () => (
  <AbsoluteFill style={{ background: "#050607", fontFamily: font, color: "#fff" }}>
    <StatusBar />
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, bottom: 0, background: "#17191C", borderRadius: "44px 44px 0 0" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 600 }}>
        <span style={{ opacity: 0.6 }}>Cancelar</span>
        <span style={{ color: C.mint, fontWeight: 800 }}>Añadir</span>
      </div>
      <div style={{ position: "absolute", left: 33, top: 110 }}>
        <PassCard width={600} stamps={1} showQr={false} />
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 110, height: 104, borderRadius: 28, background: "#fff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>{copy.addPass}</div>
    </div>
  </AbsoluteFill>
);

const Lock: React.FC<{ notif?: "near" }> = ({ notif }) => (
  <AbsoluteFill>
    <LockScreen>
      {notif === "near" ? (
        <div style={{ position: "absolute", left: 13, top: 470 }}>
          <Notification width={640} />
        </div>
      ) : null}
    </LockScreen>
    <StatusBar />
  </AbsoluteFill>
);

const Comments: React.FC<{ step: 0 | 1 | 2 | 3 }> = ({ step }) => {
  const users = step >= 2 ? [...copy.cta.users, "tu_negocio"] : copy.cta.users;
  return (
    <AbsoluteFill style={{ background: "#0B0D0F", fontFamily: font, color: "#fff" }}>
      <StatusBar />
      {/* video del reel, atrás */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 560, background: `radial-gradient(circle at 50% 60%, ${C.greenMid}, #06120F 75%)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center" }}>
          <Logo height={90} color="#fff" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, bottom: 0, background: "#16191C", borderRadius: "40px 40px 0 0", padding: "26px 34px" }}>
        <div style={{ width: 80, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.3)", margin: "0 auto" }} />
        <div style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginTop: 20 }}>Comentarios</div>
        {users.map((u, i) => (
          <div key={u} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
            <Avatar letter={u[0].toUpperCase()} color={i === 2 ? C.highlight : i ? C.warm : C.cold} size={64} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.6 }}>{u}</div>
              <div style={{ fontSize: 34, fontWeight: 800 }}>{copy.cta.word}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 70, display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.14)" }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.highlight }} />
          <span style={{ flex: 1, fontSize: 32, fontWeight: step === 1 ? 800 : 600, opacity: step === 1 ? 1 : 0.5 }}>{step === 1 ? copy.cta.word : copy.cta.comment}</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: step === 1 ? C.highlight : "rgba(143,227,192,0.4)" }}>Publicar</span>
        </div>
      </div>
      {step === 3 ? (
        <div style={{ position: "absolute", left: 22, top: 40, width: 622, display: "flex", alignItems: "center", gap: 18, padding: "20px 22px", borderRadius: 30, background: "rgba(48,54,58,0.97)", border: "1.5px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
          <div style={{ width: 70, height: 70, borderRadius: 18, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="44" height="44" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="#fff" strokeWidth="2" />
              <circle cx="8.5" cy="12" r="1.4" fill="#fff" />
              <circle cx="12" cy="12" r="1.4" fill="#fff" />
              <circle cx="15.5" cy="12" r="1.4" fill="#fff" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{copy.cta.reply}</div>
            <div style={{ fontSize: 26, opacity: 0.88 }}>{copy.cta.replyBody}</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------- tablet del negocio ---------------- */
const TabletFrame: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <AbsoluteFill style={{ background: "#0A1110", fontFamily: font, color: "#fff" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, display: "flex", alignItems: "center", gap: 18, padding: "0 50px", borderBottom: "1.5px solid rgba(167,201,189,0.14)" }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BusinessIcon size={40} color={C.cream} />
      </div>
      <span style={{ fontSize: 38, fontWeight: 800 }}>{business.name}</span>
      <span style={{ marginLeft: "auto", fontSize: 26, fontWeight: 800, color: C.highlight, letterSpacing: "0.12em" }}>{title}</span>
    </div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 150 }}>{children}</div>
  </AbsoluteFill>
);

const Pos: React.FC<{ done: boolean }> = ({ done }) => (
  <TabletFrame title="CAJA">
    <div style={{ display: "flex", gap: 40 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.soft, letterSpacing: "0.14em" }}>VENTA</div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 10 }}>Baño + uñas</div>
        <div style={{ fontSize: 40, opacity: 0.6, marginTop: 6 }}>$45.000</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50 }}>
          <Avatar letter="R" color={C.highlight} size={90} />
          <div>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Rocky 🐶</div>
            <div style={{ fontSize: 30, opacity: 0.6 }}>{done ? "7 de 8 patitas" : "6 de 8 patitas"}</div>
          </div>
        </div>
      </div>
      <div style={{ width: 460, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ height: 170, borderRadius: 34, background: done ? C.highlight : C.mint, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontSize: 58, fontWeight: 800 }}>
          {done ? "✓ Sellado" : <><BusinessIcon size={60} color={C.ink} />Sellar</>}
        </div>
      </div>
    </div>
  </TabletFrame>
);

/* ---------------- objetos sueltos ---------------- */
const Sign: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream, fontFamily: font, color: C.ink, alignItems: "center", paddingTop: 60 }}>
    <div style={{ width: 120, height: 120, borderRadius: 32, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <BusinessIcon size={78} color={C.cream} />
    </div>
    <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 62, marginTop: 20 }}>{business.name}</div>
    <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.08, marginTop: 18, textAlign: "center" }}>
      {copy.qrSign.top}
      <br />
      {copy.qrSign.bottom}
    </div>
    <div style={{ padding: 18, background: "#fff", borderRadius: 26, marginTop: 34 }}>
      <QrCode size={380} color={C.ink} background="#fff" quiet={1} />
    </div>
  </AbsoluteFill>
);

const Round: React.FC<{ bg: string; fg: string; ring: string; lines: string[]; icon?: boolean }> = ({ bg, fg, ring, lines, icon }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 500, height: 500, borderRadius: "50%", background: bg, border: `22px solid ${ring}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 800, color: fg }}>
      {icon ? <BusinessIcon size={130} color={fg} /> : null}
      {lines.map((l) => (
        <div key={l} style={{ fontSize: lines.length > 1 ? 92 : 120, lineHeight: 1, letterSpacing: "-0.03em" }}>
          {l}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const FacadeSign: React.FC<{ text: string; mine: boolean }> = ({ text, mine }) => (
  <AbsoluteFill style={{ background: mine ? C.green : "#3B3F45", alignItems: "center", justifyContent: "center", gap: 30, flexDirection: "row", border: `10px solid ${mine ? C.highlight : "#5A5F66"}`, boxSizing: "border-box" }}>
    {mine ? <BusinessIcon size={120} color={C.cream} /> : null}
    <span style={{ fontFamily: mine ? logoFont : font, fontStyle: mine ? "italic" : "normal", fontWeight: mine ? 600 : 800, fontSize: mine ? 140 : 110, color: mine ? C.cream : "#C9CED4", whiteSpace: "nowrap" }}>{text}</span>
  </AbsoluteFill>
);

const Checklist: React.FC<{ done: number }> = ({ done }) => (
  <AbsoluteFill style={{ background: "#FBF8F1", fontFamily: font, color: C.ink, padding: "54px 56px", boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 70, height: 70, borderRadius: 20, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BusinessIcon size={46} color={C.cream} />
      </div>
      <span style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 48 }}>{business.name}</span>
    </div>
    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.14em", opacity: 0.55, marginTop: 34, borderTop: "3px dashed rgba(6,35,27,0.2)", paddingTop: 22 }}>{copy.checklist.title}</div>
    {copy.checklist.items.map((it, i) => (
      <div key={it} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 34 }}>
        <div style={{ width: 66, height: 66, borderRadius: 16, border: `5px solid ${i < done ? C.greenMid : "rgba(6,35,27,0.3)"}`, background: i < done ? C.greenMid : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 46, fontWeight: 800 }}>{i < done ? "✓" : ""}</div>
        <span style={{ fontSize: 58, fontWeight: 800, opacity: i < done ? 1 : 0.45 }}>{it}</span>
      </div>
    ))}
  </AbsoluteFill>
);

const CalendarPage: React.FC<{ big: string; label?: string }> = ({ big, label }) => (
  <AbsoluteFill style={{ background: "#FFFFFF", fontFamily: font, color: C.ink }}>
    <div style={{ height: 150, background: "#E0607E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 800, letterSpacing: "0.12em" }}>{copy.calendar.month}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 330, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{big}</div>
      {label ? <div style={{ fontSize: 56, fontWeight: 700, opacity: 0.6, marginTop: 10 }}>{label}</div> : null}
    </div>
  </AbsoluteFill>
);

/* ---------------- registro ---------------- */
type Def = { w: number; h: number; el: React.ReactNode; transparent?: boolean };
export const SCREENS: Record<string, Def> = {
  ...Object.fromEntries([0, 3, 6, 7, 8].map((n) => [`w-s${n}`, { ...PHONE, el: <Wallet stamps={n} /> }])),
  "w-s7-banner": { ...PHONE, el: <Wallet stamps={7} banner /> },
  "w-s7-pulse": { ...PHONE, el: <Wallet stamps={7} pulse={1} /> },
  cam: { ...PHONE, el: <Camera /> },
  add: { ...PHONE, el: <AddPass /> },
  lock: { ...PHONE, el: <Lock /> },
  "lock-near": { ...PHONE, el: <Lock notif="near" /> },
  "cm-0": { ...PHONE, el: <Comments step={0} /> },
  "cm-1": { ...PHONE, el: <Comments step={1} /> },
  "cm-2": { ...PHONE, el: <Comments step={2} /> },
  "cm-3": { ...PHONE, el: <Comments step={3} /> },
  "pos-a": { ...TABLET, el: <Pos done={false} /> },
  "pos-b": { ...TABLET, el: <Pos done /> },
  sign: { w: 640, h: 1000, el: <Sign /> },
  ...Object.fromEntries([0, 1, 2, 3].map((n) => [`chk-${n}`, { w: 640, h: 760, el: <Checklist done={n} /> }])),
  "cal-a": { w: 700, h: 760, el: <CalendarPage big={copy.calendar.from} /> },
  "cal-b": { w: 700, h: 760, el: <CalendarPage big={copy.calendar.to} label={copy.calendar.label} /> },
  "facade-mine": { w: 1400, h: 300, el: <FacadeSign text={copy.doors.mine} mine /> },
  "facade-other": { w: 1400, h: 300, el: <FacadeSign text={copy.doors.other} mine={false} /> },
  ...Object.fromEntries(copy.themes.map((t, i) => [`theme-${i}`, { w: 880, h: 540, el: <MiniCard name={t.name} color={t.color} icon="paw" stamps={i === 2 ? 8 : i * 3 + 2} total={8} width={880} /> }])),
  ...Object.fromEntries(copy.niches.map((n, i) => [`niche-${i}`, { w: 880, h: 540, el: <MiniCard name={n.name} color={n.color} icon={n.icon} stamps={n.stamps} total={n.total} width={880} /> }])),
  logo: { w: 1000, h: 340, transparent: true, el: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><Logo height={260} color="#fff" /></AbsoluteFill> },
  "notif-near": { w: 720, h: 270, transparent: true, el: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><Notification width={680} light /></AbsoluteFill> },
  medal: { w: 512, h: 512, transparent: true, el: <Round bg={C.gold} fg={C.ink} ring={C.goldLight} lines={["SU", "PREMIO"]} icon /> },
  gratis: { w: 512, h: 512, transparent: true, el: <Round bg={C.highlight} fg={C.ink} ring="#C9F4E2" lines={["GRATIS"]} /> },
  token: { w: 256, h: 256, transparent: true, el: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><div style={{ width: 240, height: 240, borderRadius: "50%", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}><BusinessIcon size={160} color={C.green} /></div></AbsoluteFill> },
};

export const ScreenStill: React.FC<{ id: string }> = ({ id }) => {
  const d = SCREENS[id];
  return <AbsoluteFill style={{ background: d.transparent ? "transparent" : "#000", overflow: "hidden" }}>{d.el}</AbsoluteFill>;
};
