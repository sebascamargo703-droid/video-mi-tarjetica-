import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { font, tracking } from "../fonts";
import { CARD, STAMP_D, stampCenter } from "../layout";
import { clamp, ease, pop } from "../motion";
import { LogoMark } from "./Logo";
import { Odometer } from "./Odometer";
import { Stamp } from "./Stamp";

const START = 7;
const TOTAL = 10;

const Scissors: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round">
    <circle cx="6" cy="7" r="3" />
    <circle cx="6" cy="17" r="3" />
    <path d="M8.5 8.5L20 18M8.5 15.5L20 6" />
  </svg>
);

/** Brillo diagonal que recorre la tarjeta. */
const Sheen: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = ease(frame, at, Math.round(fps * 1.1));
  if (p <= 0 || p >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 26, mixBlendMode: "screen", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "-40%",
          bottom: "-40%",
          width: "50%",
          left: `${-70 + p * 200}%`,
          transform: "rotate(20deg)",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.12) 65%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
};

/**
 * Pantalla del Wallet de la clienta con la tarjeta de sellos.
 * `lands`: frame en que aterriza cada sello nuevo. `unlockAt`: premio disponible.
 */
export const WalletCard: React.FC<{ lands: number[]; unlockAt: number }> = ({ lands, unlockAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = copy.card;
  const roll = Math.round(fps * 0.45);
  const count = START + lands.reduce((acc, t) => acc + ease(frame, t, roll), 0);
  const left = TOTAL - count;
  const unlock = ease(frame, unlockAt, Math.round(fps * 0.6));
  const unlockPop = pop(frame, fps, unlockAt);
  const updated = ease(frame, lands[0] + 6, Math.round(fps * 0.5));
  const stampTimes = Array.from({ length: TOTAL }, (_, i) => (i < START ? -1 : lands[i - START] ?? null));

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", fontFamily: font, color: brand.colors.white }}>
      <div style={{ position: "absolute", top: 60, left: 22, fontWeight: 800, fontSize: 30, letterSpacing: tracking.title }}>{c.walletTitle}</div>
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 26,
          overflow: "hidden",
          background: `linear-gradient(145deg, ${brand.colors.greenMid} 0%, ${brand.colors.green} 45%, ${brand.colors.greenDeep} 100%)`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 ${60 * unlock}px rgba(105,211,190,${0.35 * unlock}), inset 0 0 0 1px rgba(255,255,255,0.12)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 10% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 55%)" }} />
        {/* Encabezado */}
        <div style={{ position: "absolute", top: 22, left: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scissors size={26} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: tracking.title }}>{c.business}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.7 }}>{c.stampsLabel}</div>
            <div style={{ fontWeight: 800, fontSize: 28, display: "flex", alignItems: "baseline", justifyContent: "flex-end" }}>
              <Odometer value={count} min={0} max={TOTAL} size={28} style={{ width: "1.3em" }} />
              <span style={{ opacity: 0.55 }}>/{TOTAL}</span>
            </div>
          </div>
        </div>
        {/* Sellos */}
        {stampTimes.map((t, i) => {
          const p = stampCenter(i);
          return (
            <div key={i} style={{ position: "absolute", left: p.x - CARD.x - STAMP_D / 2, top: p.y - CARD.y - STAMP_D / 2 }}>
              <Stamp size={STAMP_D} filledAt={t} fill={i === TOTAL - 1 ? brand.colors.mint : brand.colors.white} ink={i === TOTAL - 1 ? brand.colors.greenDeep : brand.colors.green} />
            </div>
          );
        })}
        {/* Bloque TE FALTAN → ¡PREMIO DISPONIBLE! */}
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: 244,
            height: 100,
            borderRadius: 20,
            overflow: "hidden",
            background: `rgba(255,255,255,${0.12 * (1 - unlock)})`,
            transform: `scale(${unlockAt <= frame ? 0.9 + 0.1 * unlockPop : 1})`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: brand.colors.mint, opacity: unlock }} />
          <div style={{ position: "absolute", left: 20, top: 16, transform: `translateY(${-unlock * 60}px)`, opacity: 1 - unlock }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.7 }}>{c.leftLabel}</div>
            <div style={{ fontWeight: 800, fontSize: 36, letterSpacing: tracking.title, display: "flex", alignItems: "baseline" }}>
              <Odometer value={Math.max(0, left)} min={0} max={3} size={36} style={{ width: "0.66em" }} />
              &nbsp;visita<span style={{ opacity: interpolate(left, [1, 2], [0, 1], clamp) }}>s</span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 16,
              color: brand.colors.greenDeep,
              transform: `translateY(${(1 - unlock) * 60}px)`,
              opacity: unlock,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: tracking.caps }}>{c.unlockedLabel}</div>
            <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: tracking.title }}>{c.reward}</div>
          </div>
        </div>
        {/* Premio */}
        <div style={{ position: "absolute", left: 22, top: 366 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.7 }}>{c.rewardLabel}</div>
          <div style={{ position: "relative", height: 28 }}>
            <span style={{ position: "absolute", whiteSpace: "nowrap", fontWeight: 600, fontSize: 21, opacity: 1 - unlock }}>{c.reward}</span>
            <span style={{ position: "absolute", whiteSpace: "nowrap", fontWeight: 600, fontSize: 21, opacity: unlock }}>{c.claim}</span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 22, bottom: 20, opacity: 0.55, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
          <LogoMark height={12} color="#fff" />
          {c.poweredBy}
        </div>
        <Sheen at={unlockAt} />
      </div>
      <div
        style={{
          position: "absolute",
          top: CARD.y + CARD.h + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          color: brand.colors.gray,
          fontSize: 17,
          fontWeight: 600,
          opacity: updated,
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: brand.colors.mint }} />
        {c.updated}
      </div>
    </div>
  );
};

