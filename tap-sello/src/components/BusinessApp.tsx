import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { font, tracking } from "../fonts";
import { BUTTON, SCREEN_W } from "../layout";
import { EASE, clamp, ease, pop } from "../motion";
import { Odometer } from "./Odometer";
import { Check } from "./Stamp";
import { TapRipple } from "./TapRipple";

const START = 7;
const TOTAL = 10;

/** App del negocio: buscador, ficha de la clienta, botón "+1 sello" y actividad. */
export const BusinessApp: React.FC<{ taps: number[] }> = ({ taps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = copy.businessApp;
  const count = START + taps.reduce((acc, t) => acc + ease(frame, t, Math.round(fps * 0.35)), 0);
  const filledInt = START + taps.filter((t) => frame >= t).length;

  // Botón: se hunde a 0.94 en cada toque y vuelve con ease.
  let press = 0;
  for (const t of taps) {
    const down = interpolate(frame, [t - 3, t + 2], [0, 1], { ...clamp, easing: EASE });
    const up = interpolate(frame, [t + 4, t + Math.round(fps * 0.3)], [0, 1], { ...clamp, easing: EASE });
    press = Math.max(press, down * (1 - up));
  }
  const btnScale = 1 - 0.06 * press;

  const rowH = 62;
  return (
    <div style={{ position: "absolute", inset: 0, background: brand.colors.appBg, fontFamily: font, color: brand.colors.ink }}>
      {/* Encabezado */}
      <div style={{ position: "absolute", top: 62, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: tracking.title }}>{a.title}</span>
        <span style={{ fontWeight: 600, fontSize: 15, color: brand.colors.green, background: "rgba(14,82,68,0.1)", padding: "6px 12px", borderRadius: 999 }}>
          {a.register}
        </span>
      </div>
      {/* Buscador */}
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 18,
          right: 18,
          height: 54,
          borderRadius: 16,
          background: "#E6E6EB",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 16px",
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: "0.02em",
        }}
      >
        <svg width={22} height={22} viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke={brand.colors.gray} strokeWidth={2.4} />
          <path d="M15.5 15.5L20 20" stroke={brand.colors.gray} strokeWidth={2.4} strokeLinecap="round" />
        </svg>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{a.search}</span>
        <div style={{ width: 2, height: 26, background: brand.colors.green, marginLeft: -6 }} />
      </div>
      {/* Ficha de la clienta */}
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 18,
          right: 18,
          height: 222,
          borderRadius: 24,
          background: brand.colors.white,
          boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: brand.colors.green,
              color: brand.colors.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            {a.customerInitials}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: tracking.title }}>{a.customerName}</div>
            <div style={{ fontWeight: 600, fontSize: 19, color: brand.colors.gray, display: "flex", alignItems: "baseline" }}>
              <Odometer value={count} min={0} max={TOTAL} size={19} style={{ width: "1.25em", color: brand.colors.green }} />
              &nbsp;{a.progressSuffix(TOTAL)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          {Array.from({ length: TOTAL }).map((_, i) => {
            const tapIdx = i - START;
            const p = i < START ? 1 : tapIdx < taps.length ? pop(frame, fps, taps[tapIdx]) : 0;
            return (
              <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", border: "2px dashed #C7C7CC", position: "relative" }}>
                <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: brand.colors.green, transform: `scale(${p})` }} />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, fontSize: 15, color: brand.colors.gray, fontWeight: 600 }}>
          {filledInt >= TOTAL ? a.rewardReady : a.rewardPending(copy.card.reward)}
        </div>
      </div>
      {/* Botón +1 sello */}
      <div
        style={{
          position: "absolute",
          left: BUTTON.x,
          top: BUTTON.y,
          width: BUTTON.w,
          height: BUTTON.h,
          borderRadius: 28,
          background: brand.colors.green,
          transform: `scale(${btnScale})`,
          boxShadow: `0 ${14 - 10 * press}px ${30 - 16 * press}px rgba(14,82,68,${0.35 - 0.15 * press})`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          color: brand.colors.white,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: tracking.title,
        }}
      >
        {taps.map((t, i) => (
          <TapRipple key={i} at={t} x={BUTTON.w / 2} y={BUTTON.h / 2} size={BUTTON.w} />
        ))}
        <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: "relative" }}>
          <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.18)" />
          <path d="M12 7v10M7 12h10" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
        </svg>
        <span style={{ position: "relative" }}>{a.button}</span>
      </div>
      {/* Actividad */}
      <div style={{ position: "absolute", top: 572, left: 22, fontSize: 14, fontWeight: 600, letterSpacing: tracking.caps, textTransform: "uppercase", color: brand.colors.gray }}>
        {a.activityTitle}
      </div>
      {taps.map((t, i) => {
        const appear = ease(frame, t, Math.round(fps * 0.45));
        if (appear <= 0) return null;
        const pushedBy = taps.slice(i + 1).reduce((acc, tt) => acc + ease(frame, tt, Math.round(fps * 0.45)), 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 18,
              width: SCREEN_W - 36,
              top: 600 + pushedBy * rowH,
              height: 52,
              borderRadius: 16,
              background: brand.colors.white,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 14px",
              opacity: appear,
              transform: `translateY(${(1 - appear) * -16}px)`,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(14,82,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={18} color={brand.colors.green} />
            </div>
            <span style={{ flex: 1 }}>{a.activityRow(START + i + 1)}</span>
            <span style={{ color: brand.colors.gray, fontSize: 14 }}>ahora</span>
          </div>
        );
      })}
    </div>
  );
};
