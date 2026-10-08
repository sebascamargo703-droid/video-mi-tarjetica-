import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, tones } from "../../brand";
import { fonts, tracking } from "../../fonts";
import { ActivityLog } from "../../components/ActivityLog";
import { LogoMark } from "../../components/Logo";
import { LockScreenNotification } from "../../components/LockScreenNotification";
import { PaperCard } from "../../components/PaperCard";
import { PhoneMockup } from "../../components/PhoneMockup";
import { LockScreen, WalletScreen, notificationOffsetY } from "../../components/Screens";
import { softShadow } from "../../components/Stage";
import { WalletCard, prefilled } from "../../components/WalletCard";
import { AddToWallet } from "../instagram/InstagramStories";
import { inkTone } from "../kit";
import { CarouselTone, Slide, Visual, carousels } from "./data";

/* Diapositivas estáticas 1080×1350 para carrusel de Instagram. */

const W = 1080;
const H = 1350;
const M = 90;
const PAST = -9999; // animaciones ya terminadas en el frame 0

type Palette = { bg: string; glow: string; fg: string; sub: string; accent: string; dark: boolean };
const palette = (t: CarouselTone): Palette =>
  t === "ink"
    ? { ...inkTone, glow: "rgba(14,82,68,0.4)", dark: true }
    : { ...tones[t], dark: t === "dark" || t === "brand" };

/** Texto estático con *acentos* y saltos de línea. */
const Rich: React.FC<{
  text: string;
  size: number;
  color: string;
  accent: string;
  weight?: number;
  font?: "display" | "body";
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({ text, size, color, accent, weight = 800, font = "display", lineHeight = 1.04, style }) => {
  let on = false;
  return (
    <div
      style={{
        fontFamily: font === "display" ? fonts.display : fonts.body,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: size >= 70 ? tracking.display : tracking.body,
        color,
        ...style,
      }}
    >
      {text.split("\n").map((line, i) => (
        <div key={i}>
          {line.split(" ").map((raw, j) => {
            let w = raw;
            if (w.startsWith("*")) {
              on = true;
              w = w.slice(1);
            }
            const isAccent = on;
            if (w.endsWith("*")) {
              on = false;
              w = w.slice(0, -1);
            }
            return (
              <span key={j} style={{ color: isAccent ? accent : undefined }}>
                {w}
                {j < line.split(" ").length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- Visuales ---------- */

const MathVisual: React.FC<{ p: Palette }> = ({ p }) => {
  const row = (n: number, label: string, color: string, filled: boolean) => (
    <div style={{ marginBottom: 46 }}>
      <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: p.sub, marginBottom: 18 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 900 }}>
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: i < n && filled ? color : "transparent",
              border: `3px ${i < n ? "solid" : "dashed"} ${i < n ? color : p.sub}`,
              opacity: i < n ? 1 : 0.35,
            }}
          />
        ))}
      </div>
    </div>
  );
  return (
    <div>
      {row(10, "Cada 5 semanas → 10 visitas al año", p.sub, true)}
      {row(13, "Cada 4 semanas → 13 visitas al año", p.accent, true)}
    </div>
  );
};

const EndowedVisual: React.FC<{ p: Palette }> = ({ p }) => {
  const card = (total: number, given: number, pct: string, label: string) => (
    <div
      style={{
        flex: 1,
        borderRadius: 28,
        padding: 28,
        background: "rgba(255,255,255,0.08)",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.12)",
      }}
    >
      <div style={{ fontFamily: fonts.body, fontSize: 24, fontWeight: 600, color: p.sub, marginBottom: 16 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: "50%",
              background: i < given ? brand.colors.mint : "transparent",
              border: `3px ${i < given ? "solid" : "dashed"} ${i < given ? brand.colors.mint : "rgba(255,255,255,0.4)"}`,
            }}
          />
        ))}
      </div>
      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: p.fg, marginTop: 18, letterSpacing: tracking.display }}>
        {pct}
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 22, color: p.sub }}>la completaron</div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 24, width: 900 }}>
      {card(8, 0, "19%", "Tarjeta de 8, vacía")}
      {card(10, 2, "34%", "Tarjeta de 10, 2 de regalo")}
    </div>
  );
};

/** Visual principal anclado abajo de la diapositiva. */
const VisualBlock: React.FC<{ v: Visual; p: Palette; placement: "cover" | "below" }> = ({ v, p, placement }) => {
  const cover = placement === "cover";
  switch (v) {
    case "paperCard":
      return (
        <div style={{ position: "absolute", right: cover ? -90 : -40, bottom: cover ? 190 : 230, transform: "rotate(-9deg)", boxShadow: softShadow(1, 1, p.dark), borderRadius: 16 }}>
          <PaperCard width={cover ? 620 : 560} stamped={4} />
        </div>
      );
    case "walletCard":
    case "walletCardFull":
      return (
        <div
          style={{
            position: "absolute",
            right: cover ? -110 : -60,
            bottom: cover ? 120 : 220,
            transform: "perspective(2400px) rotateY(-14deg) rotateX(8deg) rotate(-6deg)",
          }}
        >
          <WalletCard
            width={cover ? 600 : 600}
            stampTimes={prefilled(v === "walletCardFull" ? 10 : 7)}
            rewardAt={v === "walletCardFull" ? PAST : undefined}
            shadow={softShadow(1, 1.3, p.dark)}
          />
        </div>
      );
    case "phoneWallet":
      return (
        <div style={{ position: "absolute", right: 70, top: cover ? 640 : 700 }}>
          <PhoneMockup width={400} shadow={softShadow(1, 1.2, p.dark)}>
            <WalletScreen phoneWidth={400} cardEnterAt={PAST} stampTimes={prefilled(7)} />
          </PhoneMockup>
        </div>
      );
    case "phoneLock": {
      const pw = 400;
      const top = placement === "cover" ? 690 : 740;
      return (
        <>
          <div style={{ position: "absolute", left: W / 2 - pw / 2, top }}>
            <PhoneMockup width={pw} shadow={softShadow(1, 1.2, true)}>
              <LockScreen phoneWidth={pw} notifyAt={PAST} showNotification={false} />
            </PhoneMockup>
          </div>
          <div style={{ position: "absolute", left: W / 2 - (pw * 1.55) / 2, top: top + pw * 1.03 + notificationOffsetY(pw) }}>
            <LockScreenNotification width={pw * 1.55} enterAt={PAST} />
          </div>
        </>
      );
    }
    case "log":
      return (
        <div style={{ position: "absolute", left: M, top: 640 }}>
          <ActivityLog width={900} enterAt={PAST} compact />
        </div>
      );
    case "math":
      return (
        <div style={{ position: "absolute", left: M, top: 760 }}>
          <MathVisual p={p} />
        </div>
      );
    case "endowed":
      return (
        <div style={{ position: "absolute", left: M, top: 760 }}>
          <EndowedVisual p={p} />
        </div>
      );
    case "addWallet":
      return (
        <>
          <div style={{ position: "absolute", left: M, top: 790, transform: "scale(1.5)", transformOrigin: "left top" }}>
            <AddToWallet />
          </div>
          <div style={{ position: "absolute", right: -70, bottom: 175, transform: "perspective(2400px) rotateY(-14deg) rotate(-5deg)" }}>
            <WalletCard width={580} stampTimes={prefilled(1)} shadow={softShadow(1, 1.3, p.dark)} />
          </div>
        </>
      );
  }
};

/* ---------- Íconos de CTA ---------- */
const Icon: React.FC<{ name: "save" | "share" | "link" | "comment"; color: string }> = ({ name, color }) => {
  const d = {
    save: "M6 3h12v18l-6-4-6 4V3z",
    share: "M21 3L3 10.5l7 2.5 2.5 7L21 3zM10 13l5-5",
    link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
    comment: "M4 5h16v11H9l-5 4V5z",
  }[name];
  return (
    <svg width={44} height={44} viewBox="0 0 24 24">
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ---------- Hilo de sellos que cruza todas las diapositivas ---------- */
const STEP = 216; // un sello cada 216 px → 5 por diapositiva, los bordes se parten entre dos
const threadY = (x: number) => 1268 + 16 * Math.sin((2 * Math.PI * x) / 1300);

const Thread: React.FC<{ index: number; total: number; p: Palette }> = ({ index, total, p }) => {
  const offset = index * W;
  const endX = (total - 1) * W + 760; // el hilo termina en el premio de la última diapositiva
  const pts: string[] = [];
  for (let x = Math.max(0, offset - 20); x <= Math.min(endX, offset + W + 20); x += 10) {
    pts.push(`${x - offset},${threadY(x).toFixed(1)}`);
  }
  const dots: number[] = [];
  for (let k = 0; k * STEP <= endX - 60; k++) {
    const x = k * STEP;
    if (x >= offset - 40 && x <= offset + W + 40) dots.push(x);
  }
  const lineColor = p.dark ? "rgba(255,255,255,0.22)" : "rgba(14,82,68,0.22)";
  const dotColor = p.accent;
  const isLast = index === total - 1;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {pts.length > 1 ? <polyline points={pts.join(" ")} fill="none" stroke={lineColor} strokeWidth={3} /> : null}
      {dots.map((x) => (
        <circle key={x} cx={x - offset} cy={threadY(x)} r={13} fill={dotColor} />
      ))}
      {isLast ? (
        <g transform={`translate(${endX - offset}, ${threadY(endX)})`}>
          <circle r={34} fill={dotColor} />
          <path d="M-12 -2h24v14h-24zM-14 -9h28v7h-28zM0 -9v21M0 -9c-3-8-12-8-10-2 1 3 7 2 10 2 3 0 9 1 10-2 2-6-7-6-10 2" fill="none" stroke={p.bg} strokeWidth={3} strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
};

/* ---------- Diapositiva ---------- */
export const CarouselSlide: React.FC<{ day: number; index: number }> = ({ day, index }) => {
  const car = carousels.find((c) => c.day === day)!;
  const slide: Slide = car.slides[index];
  const total = car.slides.length;
  const p = palette(slide.tone);
  const text = { color: p.fg, accent: p.accent };

  const kicker = (k?: string) =>
    k ? (
      <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 28, letterSpacing: tracking.caps, textTransform: "uppercase", color: p.accent, marginBottom: 26 }}>
        {k}
      </div>
    ) : null;
  const body = (b?: string, size = 38, maxWidth = 860) =>
    b ? <Rich text={b} size={size} weight={400} font="body" color={p.sub} accent={p.fg} lineHeight={1.35} style={{ marginTop: 30, maxWidth }} /> : null;

  let content: React.ReactNode = null;
  let visual: React.ReactNode = null;
  let footer: React.ReactNode = null;

  switch (slide.t) {
    case "cover":
      content = (
        <>
          <div
            style={{
              alignSelf: "flex-start",
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 26,
              color: p.dark ? p.fg : brand.colors.white,
              background: p.dark ? "rgba(255,255,255,0.12)" : brand.colors.green,
              padding: "12px 26px",
              borderRadius: 999,
              marginBottom: 40,
            }}
          >
            {slide.kicker}
          </div>
          <Rich text={slide.title} size={108} {...text} />
          {body(slide.sub, 40, 520)}
        </>
      );
      if (slide.visual) visual = <VisualBlock v={slide.visual} p={p} placement="cover" />;
      footer = (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: p.fg, background: p.dark ? "rgba(255,255,255,0.12)" : "rgba(14,82,68,0.08)", padding: "14px 28px", borderRadius: 999 }}>
          Desliza
          <svg width={30} height={30} viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke={p.fg} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      );
      break;
    case "statement":
      content = (
        <>
          {kicker(slide.kicker)}
          <Rich text={slide.title} size={86} {...text} />
          {body(slide.body)}
        </>
      );
      if (slide.visual) visual = <VisualBlock v={slide.visual} p={p} placement="below" />;
      break;
    case "stat": {
      const bigSize = Math.min(230, Math.floor(900 / (slide.big.length * 0.56)));
      content = (
        <>
          {kicker(slide.kicker)}
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: bigSize, lineHeight: 0.95, letterSpacing: "-0.05em", color: p.accent, marginBottom: 26 }}>{slide.big}</div>
          <Rich text={slide.title} size={66} {...text} lineHeight={1.08} />
          {body(slide.body, 34)}
        </>
      );
      if (slide.visual) visual = <VisualBlock v={slide.visual} p={p} placement="below" />;
      break;
    }
    case "step":
      content = (
        <>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: p.accent, color: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 64, marginBottom: 44 }}>
            {slide.n}
          </div>
          <Rich text={slide.title} size={104} {...text} />
          {body(slide.body, slide.visual ? 40 : 46, slide.visual ? 820 : 880)}
        </>
      );
      if (slide.visual) visual = <VisualBlock v={slide.visual} p={p} placement="below" />;
      break;
    case "ideas":
      content = (
        <>
          {kicker(slide.kicker)}
          {slide.items.map((it, i) => (
            <div key={it.biz} style={{ padding: "44px 0", borderTop: i === 0 ? undefined : `2px solid ${p.dark ? brand.colors.hairlineDark : brand.colors.hairlineLight}` }}>
              <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: tracking.caps, textTransform: "uppercase", color: p.sub }}>{it.biz}</div>
              <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 76, letterSpacing: tracking.display, color: p.fg, lineHeight: 1.05, marginTop: 10 }}>
                {it.reward.split(" = ")[0]} <span style={{ color: p.accent }}>= {it.reward.split(" = ")[1]}</span>
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 34, color: p.sub, marginTop: 14 }}>{it.detail}</div>
            </div>
          ))}
        </>
      );
      break;
    case "checklist":
      content = (
        <>
          {kicker(slide.kicker)}
          <Rich text={slide.title} size={96} {...text} />
          <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 30 }}>
            {slide.items.map((it) => (
              <div key={it} style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: brand.colors.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={32} height={32} viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 42, color: p.fg, letterSpacing: tracking.title }}>{it}</span>
              </div>
            ))}
          </div>
        </>
      );
      break;
    case "faq":
      content = (
        <>
          {kicker(slide.kicker)}
          {slide.items.map((it, i) => (
            <div key={it.q} style={{ padding: "40px 0", borderTop: i === 0 ? undefined : `2px solid ${p.dark ? brand.colors.hairlineDark : brand.colors.hairlineLight}` }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 56, letterSpacing: tracking.display, color: p.fg, lineHeight: 1.1 }}>{it.q}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 38, color: p.sub, marginTop: 16, lineHeight: 1.3 }}>
                <span style={{ color: p.accent, fontWeight: 600 }}>{it.a.split(/[.,]/)[0]}</span>
                {it.a.slice(it.a.split(/[.,]/)[0].length)}
              </div>
            </div>
          ))}
        </>
      );
      break;
    case "cta":
      content = (
        <>
          <Rich text={slide.title} size={slide.title.length > 40 ? 84 : 104} {...text} />
          {body(slide.body, 40)}
          <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 22 }}>
            {slide.actions.map((a) => (
              <div
                key={a.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "24px 30px",
                  borderRadius: 28,
                  background: p.dark ? "rgba(255,255,255,0.08)" : "rgba(14,82,68,0.07)",
                }}
              >
                <Icon name={a.icon} color={p.accent} />
                <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 38, color: p.fg, letterSpacing: tracking.title }}>{a.text}</span>
              </div>
            ))}
          </div>
        </>
      );
      break;
  }

  const source = "source" in slide ? slide.source : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: p.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 80% 85%, ${p.glow} 0%, rgba(0,0,0,0) 60%)` }} />
      <Thread index={index} total={total} p={p} />
      {visual}
      {/* Encabezado */}
      <div style={{ position: "absolute", top: 64, left: M, right: M, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LogoMark height={30} color={p.dark ? brand.colors.white : brand.colors.green} />
          <span style={{ fontFamily: fonts.logo, fontWeight: 700, fontSize: 30, color: p.dark ? brand.colors.white : brand.colors.green }}>Mi Tarjetica</span>
        </div>
        <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: p.sub, fontVariantNumeric: "tabular-nums" }}>
          {index + 1}/{total}
        </span>
      </div>
      {/* Contenido */}
      <div
        style={{
          position: "absolute",
          top: 200,
          bottom: 250,
          left: M,
          right: M,
          display: "flex",
          flexDirection: "column",
          justifyContent: visual || slide.t === "cover" ? "flex-start" : "center",
        }}
      >
        {content}
      </div>
      {/* Pie */}
      <div style={{ position: "absolute", left: M, right: M, bottom: 140, display: "flex", alignItems: "flex-end" }}>
        {footer}
        {source ? <div style={{ fontFamily: fonts.body, fontSize: 22, color: p.sub, lineHeight: 1.35, maxWidth: 880 }}>{source}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
