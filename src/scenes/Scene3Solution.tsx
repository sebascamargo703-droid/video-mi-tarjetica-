import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { PhoneIcon } from "../components/Icons";
import { KineticTitle } from "../components/KineticTitle";
import { PhoneMockup, StatusBar } from "../components/PhoneMockup";
import { WalletCard } from "../components/WalletCard";
import { clamp, enterProgress, enterStyle } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { colors, fonts, springs, weights } from "../theme";
import type { SceneProps } from "./types";

/** Pantalla del teléfono: la tarjeta digital se "abre" y suma sellos. */
const WalletScreen: React.FC<{ width: number; u: number }> = ({ width, u }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = width / 100;
  const open = spring({ frame: frame - 22, fps, config: springs.smooth });
  const stamps = interpolate(frame, [48, 64, 80], [6, 7, 8], clamp);
  const details = enterProgress(frame, fps, 40);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0B0C14 0%, #06060A 100%)",
        fontFamily: fonts.text,
        color: colors.white,
      }}
    >
      <StatusBar width={width} />
      <div style={{ position: "absolute", top: 19 * k, left: 7 * k, right: 7 * k }}>
        <div style={{ fontSize: 8.5 * k, fontWeight: weights.bold, letterSpacing: fonts.tracking }}>Wallet</div>
        <div
          style={{
            marginTop: 6 * k,
            opacity: interpolate(open, [0, 0.5], [0, 1], clamp),
            transform: `translateY(${(1 - open) * 30 * k}px) scale(${interpolate(open, [0, 1], [0.86, 1])})`,
            transformOrigin: "50% 0%",
          }}
        >
          <WalletCard width={86 * k} stamps={stamps} />
        </div>
        <div style={{ ...enterStyle(details, u, 30), marginTop: 7 * k }}>
          {[
            ["Próxima recompensa", "Café gratis"],
            ["Miembro desde", "Mar 2025"],
          ].map(([a, b]) => (
            <div
              key={a}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 3.9 * k,
                padding: `${3.2 * k}px 0`,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ opacity: 0.5 }}>{a}</span>
              <span style={{ fontWeight: weights.semibold }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * ESCENA 3 · LA SOLUCIÓN
 * iPhone 15 Pro flotando en 3D con la tarjeta digital abriéndose en pantalla.
 * Texto: "Fidelización directa en el celular 📲".
 */
export const Scene3Solution: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, isVertical, safe, W, H } = useLayout();
  const phoneIn = spring({ frame: frame - 2, fps, config: springs.soft });
  const phoneWidth = (isVertical ? 560 : 400) * u;

  const title = (
    <KineticTitle
      u={u}
      size={(isVertical ? 80 : 96) * u}
      delay={8}
      stagger={4}
      weight={weights.bold}
      align={isVertical ? "center" : "left"}
      lines={[
        [{ text: "Fidelización" }, { text: "directa" }],
        [{ text: "en" }, { text: "el" }, { text: "celular", gradient: true, icon: (s) => <PhoneIcon size={s} color={colors.blueText} /> }],
      ]}
    />
  );

  const phone = (
    <div
      style={{
        opacity: interpolate(phoneIn, [0, 0.5], [0, 1], clamp),
        transform: `translateY(${(1 - phoneIn) * 220 * u}px)`,
        filter: `blur(${(1 - phoneIn) * 12 * u}px)`,
      }}
    >
      <PhoneMockup
        width={phoneWidth}
        u={u}
        rotateY={interpolate(phoneIn, [0, 1], [-38, isVertical ? -12 : -18])}
        rotateX={interpolate(phoneIn, [0, 1], [18, 7])}
      >
        <WalletScreen width={phoneWidth} u={u} />
      </PhoneMockup>
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop glowY={isVertical ? 56 : 50} glowX={isVertical ? 50 : 66} />
      {isVertical ? (
        <AbsoluteFill
          style={{
            paddingTop: safe.y + 30 * u,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 64 * u,
          }}
        >
          {title}
          {phone}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            padding: `0 ${W * 0.14}px ${H * 0.06}px ${safe.x}px`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {title}
          {phone}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
