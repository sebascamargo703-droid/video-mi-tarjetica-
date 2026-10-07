import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RocketIcon } from "../components/Icons";
import { PersonShot } from "../components/PersonShot";
import { QRBadge } from "../components/QRBadge";
import { clamp, enterProgress, enterStyle } from "../lib/anim";
import { rectStyle, useLayout } from "../lib/layout";
import { colors, fonts, gradients, shadows, springs, weights } from "../theme";
import type { SceneProps } from "./types";

/** ⚠️ AJUSTE: frames absolutos de entrada del QR y del botón. */
const QR_IN = 990;
const BUTTON_IN = 1040; // "comenta la palabra TARJETICA"

const CTAButton: React.FC<{ u: number; size: number }> = ({ u, size }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 11) * 0.018;
  const halo = 0.3 + Math.sin(frame / 11) * 0.12;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18 * u,
        padding: `${26 * u}px ${44 * u}px`,
        borderRadius: 999,
        background: gradients.brand,
        boxShadow: `${shadows.glowBlue(u, halo)}, inset 0 ${1.5 * u}px 0 rgba(255,255,255,0.3)`,
        transform: `scale(${pulse})`,
        fontFamily: fonts.display,
        fontWeight: weights.bold,
        fontSize: size,
        letterSpacing: fonts.tracking,
        color: colors.white,
        whiteSpace: "nowrap",
      }}
    >
      Empieza hoy en el enlace del perfil
      <RocketIcon size={size * 1.05} />
    </div>
  );
};

/**
 * ESCENA 7 · CIERRE / CTA
 * Persona a cámara con push-in, QR con marco redondeado y glow, y
 * botón "Empieza hoy en el enlace del perfil 🚀" con pulso sutil.
 */
export const Scene7CTA: React.FC<SceneProps> = ({ startAbs, durationInFrames, framing = "wide" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, isVertical, headline, H, W, safe } = useLayout();
  const abs = startAbs + frame;
  const qrP = enterProgress(abs, fps, QR_IN, springs.smooth);
  const btnP = enterProgress(abs, fps, BUTTON_IN, springs.smooth);

  return (
    <PersonShot startAbs={startAbs} durationInFrames={durationInFrames} framing={framing}>
      {isVertical ? (
        <>
          <div style={{ ...rectStyle(headline), display: "flex", justifyContent: "center" }}>
            <div style={{ ...enterStyle(qrP, u), transform: `${enterStyle(qrP, u).transform} scale(${interpolate(qrP, [0, 1], [0.92, 1])})` }}>
              <QRBadge size={270 * u} u={u} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: H * 0.64,
              display: "flex",
              justifyContent: "center",
              ...enterStyle(btnP, u),
            }}
          >
            <CTAButton u={u} size={38 * u} />
          </div>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            left: safe.x,
            top: 0,
            bottom: 0,
            width: W * 0.42,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 60 * u,
          }}
        >
          <div style={enterStyle(qrP, u)}>
            <QRBadge size={320 * u} u={u} />
          </div>
          <div style={enterStyle(btnP, u)}>
            <CTAButton u={u} size={40 * u} />
          </div>
        </div>
      )}
    </PersonShot>
  );
};

/**
 * Último segundo: negro, logo de MiTarjetica centrado y la URL en blanco.
 */
export const EndCard: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const logo = enterProgress(frame, fps, 6, springs.soft);
  const url = enterProgress(frame, fps, 16, springs.soft);
  const glow = interpolate(frame, [0, 40], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 28% at 50% 50%, rgba(47,107,255,${0.16 * glow}) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 * u }}>
        <Img
          src={staticFile("brand/mi-tarjetica-logo-blanco.png")}
          style={{
            width: 560 * u,
            ...enterStyle(logo, u, 24),
            transform: `${enterStyle(logo, u, 24).transform} scale(${interpolate(logo, [0, 1], [0.96, 1])})`,
          }}
        />
        <div
          style={{
            ...enterStyle(url, u, 16),
            fontFamily: fonts.text,
            fontWeight: weights.medium,
            fontSize: 40 * u,
            letterSpacing: "0.02em",
            color: colors.white,
          }}
        >
          mitarjetica.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
