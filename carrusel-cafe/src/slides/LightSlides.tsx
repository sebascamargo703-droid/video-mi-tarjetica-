import React from "react";
import { grid, palette } from "../brand";
import type { Slide } from "../carousels";
import { Arch } from "../components/Arch";
import { CoffeeCard } from "../components/CoffeeCard";
import { Beans, CoffeeBranch, SteamCup } from "../components/Ornaments";
import { ChargeHeader, Note, Title } from "../components/SlideFrame";
import { display, sans } from "../fonts";
import { WithEmoji } from "../components/Emoji";

const corner = (opacity = 0.25) => (
  <>
    <Beans color={palette.coffee} opacity={opacity} size={100} style={{ position: "absolute", right: 70, top: 46 }} />
    <CoffeeBranch color={palette.coffee} opacity={opacity} size={230} flip style={{ position: "absolute", right: 30, top: 1172 }} />
  </>
);

/** Lámina 5 · 04 · Sus clientes (panel light dentro de un arco, sobre latte). */
export const ClientsSlide: React.FC<{ s: Extract<Slide, { type: "clients" }>; header: string }> = ({ s, header }) => {
  const panelTop = 640;
  const rowH = 140;
  return (
    <>
      {corner()}
      <ChargeHeader bg={s.bg} label={header} number={s.number} />
      <Title bg={s.bg} text={s.title} />
      {/* arco latte con rama de café; el panel blanco se monta encima */}
      <div style={{ position: "absolute", left: (1080 - 700) / 2, top: grid.visualTop - 20 }}>
        <Arch w={700} h={560} fill="rgba(107, 68, 35, 0.07)" border={`2px solid ${palette.caramel}`}>
          <CoffeeBranch color={palette.coffee} opacity={0.35} size={230} style={{ position: "absolute", left: 236, top: 22 }} rotate={-14} />
        </Arch>
      </div>
      <div
        style={{
          position: "absolute",
          left: grid.m,
          right: grid.m,
          top: panelTop,
          borderRadius: 32,
          background: palette.light,
          boxShadow: `0 40px 90px ${palette.shadow}, 0 2px 0 ${palette.latte}`,
          padding: "30px 36px 14px",
          fontFamily: sans,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ ...display, fontWeight: 600, fontSize: 40, color: palette.ink, letterSpacing: "-0.01em" }}>{s.panelTitle}</span>
          <span style={{ fontSize: 20, fontWeight: 600, color: palette.inkSecondary, padding: "8px 16px", borderRadius: 999, background: palette.latte }}>
            {s.badge}
          </span>
        </div>
        {s.rows.map((r, i) => {
          const lost = Boolean(r.tag);
          return (
            <div key={r.name} style={{ display: "flex", alignItems: "center", height: rowH, borderTop: i ? `1.5px solid ${palette.latte}` : `1.5px solid ${palette.latte}` }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: palette.latte, color: palette.coffee, fontWeight: 600, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {r.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </div>
              <div style={{ marginLeft: 20, width: 300 }}>
                <div style={{ fontSize: 30, fontWeight: 600, color: palette.ink }}>{r.name}</div>
                <div style={{ fontSize: 24, color: palette.inkSecondary, marginTop: 6, letterSpacing: "0.02em" }}>{r.phone}</div>
              </div>
              <div style={{ width: 200, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 24, fontWeight: lost ? 600 : 400, color: lost ? palette.alertText : palette.inkSecondary }}>{r.lastVisit}</span>
                {r.tag ? <span style={{ fontSize: 19, fontWeight: 600, color: palette.alertText, background: palette.alertBg, padding: "6px 12px", borderRadius: 999 }}>{r.tag}</span> : null}
              </div>
              <div style={{ marginLeft: "auto", width: 190 }}>
                <div style={{ fontSize: 26, fontWeight: 600, color: palette.ink, textAlign: "right" }}>
                  {r.stamps}/{r.total}
                </div>
                <div style={{ marginTop: 10, height: 12, borderRadius: 6, background: palette.latte, overflow: "hidden" }}>
                  <div style={{ width: `${(r.stamps / r.total) * 100}%`, height: "100%", borderRadius: 6, background: palette.brand }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/** "× 2" → ["×", "2"]: el operador va en Inter (en Fraunces se ve diminuto). */
const splitOp = (v: string): [string, string] => {
  const m = v.match(/^([×=+−-])\s*(.*)$/);
  return m ? [m[1], m[2]] : ["", v];
};
const Op: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <span style={{ fontFamily: sans, fontWeight: 400, fontSize: size, marginRight: size * 0.35, verticalAlign: "0.06em" }}>{children}</span>
);

/** Lámina 6 · 05 · Lo que ganaste (cuenta alineada). */
export const MathSlide: React.FC<{ s: Extract<Slide, { type: "math" }>; header: string }> = ({ s, header }) => {
  const valueW = 290;
  return (
    <>
      {corner(0.3)}
      <ChargeHeader bg={s.bg} label={header} number={s.number} />
      <Title bg={s.bg} text={s.title} style={{ right: 360 }} />
      {/* taza humeante en arco */}
      <div style={{ position: "absolute", right: grid.m, top: 240 }}>
        <Arch w={250} h={300} fill={palette.latte} border={`2px solid ${palette.caramel}`}>
          <SteamCup color={palette.coffee} opacity={0.75} size={170} style={{ position: "absolute", left: 38, top: 92 }} />
        </Arch>
      </div>
      <div style={{ position: "absolute", left: grid.m, right: grid.m, top: 600, fontFamily: sans }}>
        {s.lines.map((l) => {
          const [op, num] = splitOp(l.value);
          return (
            <div key={l.label} style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 22 }}>
              <span style={{ width: valueW, textAlign: "right", ...display, fontWeight: 600, fontSize: 66, color: palette.ink, fontVariantNumeric: "lining-nums tabular-nums" }}>
                {op ? <Op size={52}>{op}</Op> : null}
                {num}
              </span>
              <span style={{ fontSize: 32, color: palette.inkSecondary }}>{l.label}</span>
            </div>
          );
        })}
        <div style={{ height: 2, background: palette.caramel, margin: "18px 0 26px", width: 760 }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ ...display, fontWeight: 600, fontSize: 112, lineHeight: 1, color: palette.brand, letterSpacing: "-0.01em", fontVariantNumeric: "lining-nums" }}>
            {splitOp(s.total.value)[0] ? <Op size={76}>{splitOp(s.total.value)[0]}</Op> : null}
            {splitOp(s.total.value)[1]}
          </span>
          <span style={{ fontSize: 36, fontWeight: 600, color: palette.brand }}>{s.total.label}</span>
        </div>
        <div style={{ marginTop: 44, ...display, fontWeight: 400, fontSize: 48, color: palette.ink }}>{s.per}</div>
      </div>
      <Note bg={s.bg} text={s.note} size={26} />
    </>
  );
};

/** Tarjetas genéricas del Wallet (sin marcas). */
const BankCard: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.62, borderRadius: w * 0.06, background: "linear-gradient(135deg, #3A4652 0%, #232C35 100%)", padding: w * 0.065, boxSizing: "border-box", color: palette.light, fontFamily: sans, position: "relative", boxShadow: `0 20px 40px ${palette.shadow}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ width: w * 0.12, height: w * 0.09, borderRadius: 8, background: "linear-gradient(135deg, #E2C48A, #B8924E)" }} />
      <div style={{ display: "flex" }}>
        <span style={{ width: w * 0.08, height: w * 0.08, borderRadius: "50%", background: "rgba(246, 244, 235, 0.55)" }} />
        <span style={{ width: w * 0.08, height: w * 0.08, borderRadius: "50%", background: "rgba(246, 244, 235, 0.3)", marginLeft: -w * 0.03 }} />
      </div>
    </div>
    <div style={{ marginTop: w * 0.06, fontSize: w * 0.05, fontWeight: 600, letterSpacing: "0.12em" }}>•••• 4821</div>
  </div>
);

const BoardingPass: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.62, borderRadius: w * 0.06, background: "#DDE6EE", padding: w * 0.065, boxSizing: "border-box", fontFamily: sans, color: palette.ink, boxShadow: `0 20px 40px ${palette.shadow}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: w * 0.034, fontWeight: 600, color: "#3F4A55", letterSpacing: "0.08em" }}>
      <span>PASABORDO</span>
      <span>PUERTA 7</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: w * 0.04, marginTop: w * 0.035, fontSize: w * 0.075, fontWeight: 600 }}>
      BOG
      <svg width={w * 0.08} height={w * 0.05} viewBox="0 0 32 20">
        <path d="M2 10 H26 M20 4 L27 10 L20 16" fill="none" stroke={palette.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      BAQ
    </div>
  </div>
);

/** Lámina 7 · 06 · Dónde vivía (pila de tarjetas en un Wallet genérico). */
export const WalletSlide: React.FC<{ s: Extract<Slide, { type: "wallet" }>; header: string }> = ({ s, header }) => {
  const archW = 720;
  const cardW = 470;
  const left = (archW - cardW) / 2;
  const archTop = 420;
  return (
    <>
      {corner()}
      <ChargeHeader bg={s.bg} label={header} number={s.number} />
      <Title bg={s.bg} text={s.title} />
      <div style={{ position: "absolute", left: (1080 - archW) / 2, top: archTop }}>
        <Arch w={archW} h={grid.visualBottom - archTop} fill={palette.light}>
          <div style={{ position: "absolute", left, top: 150 }}>
            <BankCard w={cardW} />
          </div>
          <div style={{ position: "absolute", left, top: 226 }}>
            <BoardingPass w={cardW} />
          </div>
          <div style={{ position: "absolute", left: left - 18, top: 296 }}>
            <CoffeeCard w={cardW + 36} style={{ boxShadow: `0 44px 70px rgba(43, 29, 20, 0.4), 0 10px 20px rgba(43, 29, 20, 0.2)` }} />
          </div>
        </Arch>
      </div>
      <Note bg={s.bg} text={s.text} size={28} />
    </>
  );
};

/** Lámina 8 · Lo intentamos en privado (chat genérico sobre latte, en lámina light). */
export const ChatSlide: React.FC<{ s: Extract<Slide, { type: "chat" }> }> = ({ s }) => {
  const archW = 760;
  return (
    <>
      {corner(0.3)}
      <Title bg={s.bg} text={s.title} top={grid.chargeY} />
      <div style={{ position: "absolute", left: (1080 - archW) / 2, top: 300 }}>
        <Arch w={archW} h={890} fill={palette.latte} shadow={`0 40px 90px ${palette.shadow}`}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, fontFamily: sans }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: palette.coffee, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={34} height={44} viewBox="0 0 28 36">
                <g transform="translate(14 18) rotate(-18)">
                  <ellipse rx={10.5} ry={15} fill="#F3E7D7" />
                  <path d="M0 -12 C5 -4 -5 4 0 12" fill="none" stroke={palette.coffee} strokeWidth={2.4} strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: palette.ink }}>{s.contact}</div>
            <div style={{ width: 560, height: 1.5, background: "#D6C4AE", marginTop: 10 }} />
          </div>
          <div style={{ position: "absolute", left: 48, right: 48, top: 300, display: "flex", flexDirection: "column", alignItems: "flex-end", fontFamily: sans }}>
            {s.messages.map((m, i) => (
              <React.Fragment key={m.day}>
                <div style={{ alignSelf: "center", fontSize: 20, fontWeight: 600, color: palette.inkSecondary, background: palette.light, padding: "6px 16px", borderRadius: 999, margin: `${i ? 30 : 0}px 0 16px`, textTransform: "capitalize" }}>
                  {m.day}
                </div>
                <div
                  style={{
                    maxWidth: 520,
                    background: palette.brand,
                    color: palette.light,
                    fontSize: 29,
                    lineHeight: 1.32,
                    padding: "18px 26px",
                    borderRadius: "28px 28px 8px 28px",
                    boxShadow: "0 8px 20px rgba(20, 91, 68, 0.18)",
                  }}
                >
                  <WithEmoji text={m.text} />
                </div>
              </React.Fragment>
            ))}
            <div style={{ marginTop: 10, fontSize: 21, color: palette.inkSecondary, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width={22} height={14} viewBox="0 0 22 14">
                <path d="M1 7 L5 11 L13 2 M9 11 L10 12 L20 2" fill="none" stroke={palette.inkSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {s.seen}
            </div>
          </div>
        </Arch>
      </div>
    </>
  );
};
