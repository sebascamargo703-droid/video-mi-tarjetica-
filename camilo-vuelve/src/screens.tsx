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

const Lock: React.FC<{ notif?: "near" | "push" }> = ({ notif }) => (
  <AbsoluteFill>
    <LockScreen>
      {notif === "near" ? (
        <div style={{ position: "absolute", left: 13, top: 470 }}>
          <Notification width={640} />
        </div>
      ) : notif === "push" ? (
        <div style={{ position: "absolute", left: 22, top: 470 }}>
          <MiniNotif title={business.name} body={copy.push.msg} width={622} />
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
      <div style={{ width: 64, height: 64, borderRadius: 18, background: "#1F2A33", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 10 }}>Corte clásico</div>
        <div style={{ fontSize: 40, opacity: 0.6, marginTop: 6 }}>$25.000</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50 }}>
          <Avatar letter="C" color={C.highlight} size={90} />
          <div>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Camilo</div>
            <div style={{ fontSize: 30, opacity: 0.6 }}>{done ? "4 de 5 sellos" : "3 de 5 sellos"}</div>
          </div>
        </div>
      </div>
      <div style={{ width: 460, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ height: 170, borderRadius: 34, background: done ? C.highlight : C.mint, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58, fontWeight: 800 }}>{done ? "✓ Sellado" : "Sellar"}</div>
      </div>
    </div>
  </TabletFrame>
);

const Panel: React.FC<{ back?: boolean; select?: boolean }> = ({ back = false, select = false }) => (
  <TabletFrame title="PANEL">
    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.18em", color: C.soft, marginBottom: 8 }}>{copy.panel.section}</div>
    {copy.panel.rows.map((r, i) => {
      const isBack = back && i === 0;
      const sel = select && i > 0;
      return (
        <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 30px", marginTop: 22, borderRadius: 30, background: isBack ? "rgba(143,227,192,0.16)" : sel ? "rgba(255,184,102,0.14)" : "rgba(255,255,255,0.04)", border: `3px solid ${isBack ? C.highlight : sel ? C.warm : "rgba(255,255,255,0.06)"}` }}>
          <Avatar letter={r.name[0]} color={r.color} size={84} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 42, fontWeight: 800 }}>{r.name}</div>
            <div style={{ fontSize: 30, opacity: 0.6 }}>{r.detail}</div>
          </div>
          {isBack ? (
            <div style={{ fontSize: 32, fontWeight: 800, color: C.ink, background: C.highlight, padding: "12px 24px", borderRadius: 999 }}>{copy.panel.back}</div>
          ) : (
            <div style={{ fontSize: 32, fontWeight: 700, opacity: 0.55 }}>{r.days} días</div>
          )}
        </div>
      );
    })}
  </TabletFrame>
);

const Compose: React.FC<{ step: 0 | 1 | 2 }> = ({ step }) => (
  <TabletFrame title="AVISOS">
    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.18em", color: C.soft }}>{copy.push.to}</div>
    <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
      {copy.panel.rows.slice(1).map((r) => (
        <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px 10px 10px", borderRadius: 999, background: "rgba(255,184,102,0.14)", border: `2px solid ${C.warm}`, fontSize: 30, fontWeight: 800 }}>
          <Avatar letter={r.name[0]} color={r.color} size={52} />
          {r.name}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 34, padding: "30px 34px", borderRadius: 28, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.14)", fontSize: 50, fontWeight: 700, minHeight: 70 }}>
      {step >= 1 ? copy.push.msg : <span style={{ opacity: 0.4 }}>Escribe tu aviso…</span>}
    </div>
    <div style={{ marginTop: 34, height: 130, borderRadius: 32, background: step === 2 ? C.highlight : C.mint, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, fontWeight: 800 }}>{step === 2 ? "✓ Enviado a 2 clientes" : copy.push.button}</div>
  </TabletFrame>
);

/* ---------------- objetos sueltos ---------------- */
const Sign: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream, fontFamily: font, color: C.ink, alignItems: "center", paddingTop: 60 }}>
    <div style={{ width: 120, height: 120, borderRadius: 32, background: "#1F2A33", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <BusinessIcon size={74} color={C.cream} />
    </div>
    <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 58, marginTop: 20 }}>{business.name}</div>
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
        <div key={l} style={{ fontSize: lines.length > 1 ? 96 : 120, lineHeight: 1, letterSpacing: "-0.03em" }}>
          {l}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const FacadeSign: React.FC = () => (
  <AbsoluteFill style={{ background: "#14181B", alignItems: "center", justifyContent: "center", gap: 36, flexDirection: "row", border: "10px solid #3a2e1c", boxSizing: "border-box" }}>
    <BusinessIcon size={130} color="#F2C46B" />
    <span style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 150, color: "#F2C46B", whiteSpace: "nowrap" }}>{business.name}</span>
  </AbsoluteFill>
);

/* ---------------- registro ---------------- */
type Def = { w: number; h: number; el: React.ReactNode; transparent?: boolean };
export const SCREENS: Record<string, Def> = {
  "w-s0": { ...PHONE, el: <Wallet stamps={0} /> },
  "w-s3": { ...PHONE, el: <Wallet stamps={3} /> },
  "w-s4": { ...PHONE, el: <Wallet stamps={4} /> },
  "w-s4-banner": { ...PHONE, el: <Wallet stamps={4} banner /> },
  "w-s4-pulse": { ...PHONE, el: <Wallet stamps={4} pulse={1} /> },
  cam: { ...PHONE, el: <Camera /> },
  add: { ...PHONE, el: <AddPass /> },
  lock: { ...PHONE, el: <Lock /> },
  "lock-near": { ...PHONE, el: <Lock notif="near" /> },
  "lock-push": { ...PHONE, el: <Lock notif="push" /> },
  "cm-0": { ...PHONE, el: <Comments step={0} /> },
  "cm-1": { ...PHONE, el: <Comments step={1} /> },
  "cm-2": { ...PHONE, el: <Comments step={2} /> },
  "cm-3": { ...PHONE, el: <Comments step={3} /> },
  "pos-a": { ...TABLET, el: <Pos done={false} /> },
  "pos-b": { ...TABLET, el: <Pos done /> },
  "pan-a": { ...TABLET, el: <Panel /> },
  "pan-b": { ...TABLET, el: <Panel back /> },
  "pan-c": { ...TABLET, el: <Panel back select /> },
  "cmp-a": { ...TABLET, el: <Compose step={0} /> },
  "cmp-b": { ...TABLET, el: <Compose step={1} /> },
  "cmp-c": { ...TABLET, el: <Compose step={2} /> },
  sign: { w: 640, h: 1000, el: <Sign /> },
  pass: { w: 600, h: 820, el: <PassCard width={600} stamps={4} /> },
  ...Object.fromEntries(copy.brands.map((b, i) => [`mini-${i}`, { w: 440, h: 270, el: <MiniCard name={b.name} color={b.color} icon={b.icon} stamps={b.stamps} total={b.total} width={440} /> }])),
  logo: { w: 1000, h: 340, transparent: true, el: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><Logo height={260} color="#fff" /></AbsoluteFill> },
  "notif-near": { w: 700, h: 260, transparent: true, el: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><Notification width={660} light /></AbsoluteFill> },
  medal: { w: 512, h: 512, transparent: true, el: <Round bg={C.gold} fg={C.ink} ring={C.goldLight} lines={["CORTE", "GRATIS"]} icon /> },
  volvio: { w: 512, h: 512, transparent: true, el: <Round bg="#08120F" fg={C.highlight} ring={C.highlight} lines={["CAMILO", "VOLVIÓ"]} /> },
  gratis: { w: 512, h: 512, transparent: true, el: <Round bg={C.highlight} fg={C.ink} ring="#C9F4E2" lines={["GRATIS"]} /> },
  token: { w: 256, h: 256, transparent: true, el: <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><div style={{ width: 240, height: 240, borderRadius: "50%", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center" }}><BusinessIcon size={150} color={C.green} /></div></AbsoluteFill> },
  facade: { w: 1400, h: 300, el: <FacadeSign /> },
};

export const ScreenStill: React.FC<{ id: string }> = ({ id }) => {
  const d = SCREENS[id];
  return <AbsoluteFill style={{ background: d.transparent ? "transparent" : "#000", overflow: "hidden" }}>{d.el}</AbsoluteFill>;
};
