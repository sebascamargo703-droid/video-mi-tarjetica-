import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BenefitHeader } from "../components/BenefitHeader";
import { useCounterValue } from "../components/Counter";
import { AppleWalletIcon, BoltIcon, CheckIcon, GoogleWalletIcon } from "../components/Icons";
import { WalletCard } from "../components/WalletCard";
import { BENEFIT_NUMBER, SCENE_TIMING } from "../data/timeline";
import { clamp, enterProgress, enterStyle } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { colors, easeOutQuint, fonts, springs, weights } from "../theme";
import type { SceneProps } from "./types";

const { stopwatchStart, stopwatchFrames } = SCENE_TIMING.wallet;
const DONE = stopwatchStart + stopwatchFrames;

const WalletBadge: React.FC<{ icon: React.ReactNode; label: string; u: number; delay: number }> = ({
  icon,
  label,
  u,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterProgress(frame, fps, delay);
  return (
    <div
      style={{
        ...enterStyle(p, u),
        display: "flex",
        alignItems: "center",
        gap: 18 * u,
        padding: `${16 * u}px ${28 * u}px ${16 * u}px ${16 * u}px`,
        borderRadius: 999,
        background: colors.glass,
        backdropFilter: `blur(${20 * u}px)`,
        boxShadow: `inset 0 0 0 ${1.5 * u}px ${colors.hairline}`,
        fontFamily: fonts.text,
        fontWeight: weights.semibold,
        fontSize: 32 * u,
        letterSpacing: fonts.tracking,
        color: colors.white,
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </div>
  );
};

/**
 * La tarjeta se desliza dentro de un "bolsillo" de Wallet mientras el
 * cronómetro corre de 0.0 a 2.0 s; al terminar, check verde.
 */
const WalletDrop: React.FC<{ u: number; width: number }> = ({ u, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardH = width * 0.63;
  const pocketH = cardH * 0.56;
  const slide = interpolate(frame, [stopwatchStart - 6, DONE], [0, 1], { ...clamp, easing: easeOutQuint });
  const appear = enterProgress(frame, fps, 14);
  const settle = spring({ frame: frame - DONE, fps, config: springs.settle });
  const cardY = interpolate(slide, [0, 1], [-cardH * 0.18, cardH * 0.24]) + settle * 6 * u;

  return (
    <div style={{ position: "relative", width: width * 1.12, height: cardH * 1.3, ...enterStyle(appear, u) }}>
      {/* parte trasera del bolsillo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: pocketH + 30 * u,
          borderRadius: 36 * u,
          background: "linear-gradient(180deg, #15151D 0%, #0D0D13 100%)",
          boxShadow: `inset 0 0 0 ${1.5 * u}px ${colors.hairline}`,
        }}
      />
      {/* tarjeta */}
      <div style={{ position: "absolute", left: width * 0.06, top: cardY, opacity: interpolate(slide, [0, 0.2], [0, 1], clamp), filter: `blur(${interpolate(slide, [0, 0.25], [10, 0], clamp) * u}px)` }}>
        <WalletCard width={width} stamps={interpolate(frame, [DONE, DONE + 14], [0, 1], clamp)} />
      </div>
      {/* frente del bolsillo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: pocketH,
          borderRadius: `${28 * u}px ${28 * u}px ${36 * u}px ${36 * u}px`,
          background: "linear-gradient(180deg, rgba(34,34,44,0.92) 0%, rgba(14,14,20,0.98) 100%)",
          backdropFilter: `blur(${24 * u}px)`,
          boxShadow: `0 -${10 * u}px ${30 * u}px rgba(0,0,0,0.45), inset 0 ${1.5 * u}px 0 rgba(255,255,255,0.12)`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 28 * u,
          boxSizing: "border-box",
          fontFamily: fonts.text,
          fontWeight: weights.medium,
          fontSize: 24 * u,
          color: colors.textTertiary,
          letterSpacing: "0.12em",
        }}
      >
        AGREGADA A WALLET
      </div>
    </div>
  );
};

const Stopwatch: React.FC<{ u: number }> = ({ u }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // cronómetro lineal (como uno real), en saltos de 0.1 s
  const value = useCounterValue({ from: 0, to: 20, start: stopwatchStart, duration: stopwatchFrames, stepped: true }) / 10;
  const appear = enterProgress(frame, fps, stopwatchStart - 10);
  const done = spring({ frame: frame - DONE, fps, config: springs.smooth });
  const check = interpolate(frame, [DONE + 2, DONE + 16], [0, 1], { ...clamp, easing: easeOutQuint });

  return (
    <div style={{ ...enterStyle(appear, u), display: "flex", alignItems: "center", gap: 30 * u }}>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: weights.bold,
          fontSize: 120 * u,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          color: colors.white,
          lineHeight: 1,
        }}
      >
        {value.toFixed(1)}
        <span style={{ fontSize: 60 * u, opacity: 0.55, marginLeft: 8 * u }}>s</span>
      </div>
      <div
        style={{
          width: 96 * u,
          height: 96 * u,
          borderRadius: "50%",
          background: colors.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(done, [0, 1], [0.4, 1])})`,
          opacity: done,
          boxShadow: `0 0 ${40 * u}px rgba(48,209,88,${0.45 * done})`,
        }}
      >
        <CheckIcon size={58 * u} progress={check} />
      </div>
      <div
        style={{
          fontFamily: fonts.text,
          fontWeight: weights.medium,
          fontSize: 32 * u,
          color: colors.textSecondary,
          opacity: interpolate(done, [0, 1], [0, 1]),
          transform: `translateX(${(1 - done) * -20 * u}px)`,
          whiteSpace: "nowrap",
        }}
      >
        2 segundos
      </div>
    </div>
  );
};

/**
 * ESCENA 6 · BENEFICIO · Cero descargas ⚡
 * Logos de Apple Wallet / Google Wallet, tarjeta entrando al Wallet y
 * cronómetro 0.0 → 2.0 s con check verde.
 */
export const Scene6Benefit3: React.FC<SceneProps> = () => {
  const { u, isVertical, safe, W, H } = useLayout();

  const header = (
    <BenefitHeader
      number={BENEFIT_NUMBER.wallet}
      align="left"
      title={[[{ text: "Cero" }, { text: "descargas", gradient: true, icon: (s) => <BoltIcon size={s} color={colors.blueText} /> }]]}
    />
  );
  const badges = (
    <div style={{ display: "flex", gap: 20 * u, flexWrap: "wrap" }}>
      <WalletBadge u={u} delay={16} icon={<AppleWalletIcon size={64 * u} />} label="Apple Wallet" />
      <WalletBadge u={u} delay={22} icon={<GoogleWalletIcon size={64 * u} />} label="Google Wallet" />
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop glowY={isVertical ? 52 : 50} glowX={isVertical ? 50 : 68} particles={14} />
      {isVertical ? (
        <AbsoluteFill style={{ padding: `${safe.y}px ${safe.x}px 0`, display: "flex", flexDirection: "column" }}>
          {header}
          <div style={{ marginTop: 44 * u }}>{badges}</div>
          <div style={{ marginTop: 50 * u, display: "flex", justifyContent: "center" }}>
            <WalletDrop u={u} width={760 * u} />
          </div>
          <div style={{ marginTop: 40 * u, display: "flex", justifyContent: "center" }}>
            <Stopwatch u={u} />
          </div>
        </AbsoluteFill>
      ) : (
        <>
          <div style={{ position: "absolute", left: safe.x, top: H * 0.24, width: W * 0.4 }}>
            {header}
            <div style={{ marginTop: 50 * u }}>{badges}</div>
            <div style={{ marginTop: 80 * u }}>
              <Stopwatch u={u} />
            </div>
          </div>
          <div style={{ position: "absolute", right: safe.x, top: H * 0.16 }}>
            <WalletDrop u={u} width={680 * u} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
