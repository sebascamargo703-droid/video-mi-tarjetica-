import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { useCounterValue } from "../components/Counter";
import { TrendDownIcon } from "../components/Icons";
import { KineticTitle } from "../components/KineticTitle";
import { SCENE_TIMING } from "../data/timeline";
import { clamp, enterProgress, enterStyle } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { colors, fonts, gradients, springs, weights } from "../theme";
import type { SceneProps } from "./types";

const { counterStart, counterStep } = SCENE_TIMING.problem;

const Bar: React.FC<{
  label: string;
  value: string;
  ratio: number;
  maxHeight: number;
  width: number;
  u: number;
  fill: string;
  glow?: string;
  delay: number;
}> = ({ label, value, ratio, maxHeight, width, u, fill, glow, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - delay, fps, config: springs.soft });
  const labelP = enterProgress(frame, fps, delay + 6);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width }}>
      <div
        style={{
          ...enterStyle(labelP, u, 20),
          fontFamily: fonts.display,
          fontWeight: weights.bold,
          fontSize: 44 * u,
          color: colors.white,
          marginBottom: 16 * u,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={{ height: maxHeight, display: "flex", alignItems: "flex-end" }}>
        <div
          style={{
            width,
            height: Math.max(0.0001, maxHeight * ratio * grow),
            borderRadius: 20 * u,
            background: fill,
            boxShadow: glow,
          }}
        />
      </div>
      <div
        style={{
          ...enterStyle(labelP, u, 20),
          marginTop: 22 * u,
          fontFamily: fonts.text,
          fontWeight: weights.medium,
          fontSize: 32 * u,
          color: colors.textSecondary,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/**
 * ESCENA 2 · EL PROBLEMA
 * "Retener cuesta 5x menos 📉": contador gigante 1x → 5x con gradiente y glow,
 * y gráfica de dos barras (Cliente nuevo vs Cliente actual).
 */
export const Scene2Problem: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, isVertical, safe, H } = useLayout();

  const n = useCounterValue({
    from: 1,
    to: 5,
    start: counterStart,
    duration: counterStep * 4 + 1,
    stepped: true,
  });
  const heroP = enterProgress(frame, fps, 10, springs.soft);
  const tick = spring({
    frame: frame - (counterStart + (n - 1) * counterStep),
    fps,
    config: springs.settle,
    durationInFrames: 8,
  });
  const heroScale = interpolate(tick, [0, 1], [1.04, 1]) * interpolate(heroP, [0, 1], [0.9, 1]);
  const glow = interpolate(n, [1, 5], [0.25, 0.6], clamp);

  const hero = (
    <div
      style={{
        opacity: interpolate(heroP, [0, 0.6], [0, 1], clamp),
        filter: `blur(${(1 - heroP) * 12 * u}px) drop-shadow(0 0 ${60 * u}px rgba(47,107,255,${glow}))`,
        transform: `scale(${heroScale})`,
        fontFamily: fonts.display,
        fontWeight: weights.heavy,
        fontSize: (isVertical ? 380 : 420) * u,
        lineHeight: 0.9,
        letterSpacing: "-0.06em",
        backgroundImage: gradients.brandText,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        fontVariantNumeric: "tabular-nums",
        padding: `0 ${20 * u}px`,
      }}
    >
      {n}x
    </div>
  );

  const title = (
    <KineticTitle
      u={u}
      size={(isVertical ? 76 : 84) * u}
      delay={4}
      stagger={4}
      weight={weights.bold}
      align={isVertical ? "center" : "left"}
      lines={[
        [{ text: "Retener" }, { text: "cuesta" }],
        [
          { text: "5x", gradient: true },
          { text: "menos", icon: (s) => <TrendDownIcon size={s} color={colors.blueText} /> },
        ],
      ]}
    />
  );

  const bars = (
    <div style={{ display: "flex", gap: 80 * u, alignItems: "flex-end" }}>
      <Bar
        label="Cliente nuevo"
        value="5x"
        ratio={1}
        maxHeight={(isVertical ? 440 : 420) * u}
        width={190 * u}
        u={u}
        delay={counterStart}
        fill="linear-gradient(180deg, rgba(255,59,48,0.85) 0%, rgba(120,120,130,0.35) 100%)"
      />
      <Bar
        label="Cliente actual"
        value="1x"
        ratio={0.2}
        maxHeight={(isVertical ? 440 : 420) * u}
        width={190 * u}
        u={u}
        delay={counterStart + 8}
        fill={gradients.brand}
        glow={`0 0 ${40 * u}px rgba(47,107,255,0.5)`}
      />
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop glowY={isVertical ? 40 : 50} particles={16} />
      {isVertical ? (
        <AbsoluteFill
          style={{
            padding: `${safe.y}px ${safe.x}px ${H * 0.2}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 56 * u,
          }}
        >
          {title}
          {hero}
          {bars}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            padding: `0 ${safe.x * 1.4}px ${H * 0.1}px`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 * u }}>
            {title}
            {hero}
          </div>
          {bars}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
