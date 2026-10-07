import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BenefitHeader } from "../components/BenefitHeader";
import { BrandMark, CoffeeIcon, PinIcon } from "../components/Icons";
import { PhoneMockup, StatusBar } from "../components/PhoneMockup";
import { BENEFIT_NUMBER, SCENE_TIMING, USE_WALKING_BROLL } from "../data/timeline";
import { clamp, enterProgress } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { colors, fonts, gradients, springs, weights } from "../theme";
import type { SceneProps } from "./types";

const { notificationDrop } = SCENE_TIMING.proximity;

/** Notificación estilo iOS que cae desde arriba con spring. */
const Notification: React.FC<{ width: number }> = ({ width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = width / 100;
  const drop = spring({ frame: frame - notificationDrop, fps, config: springs.settle });

  return (
    <div
      style={{
        position: "absolute",
        top: 64 * k,
        left: 4 * k,
        right: 4 * k,
        padding: `${3.6 * k}px ${4 * k}px`,
        borderRadius: 5.5 * k,
        background: "rgba(245,245,255,0.2)",
        backdropFilter: `blur(${5 * k}px) saturate(1.6)`,
        WebkitBackdropFilter: `blur(${5 * k}px) saturate(1.6)`,
        boxShadow: `0 ${2 * k}px ${6 * k}px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.18)`,
        display: "flex",
        gap: 3.2 * k,
        alignItems: "center",
        transform: `translateY(${(1 - drop) * -40 * k}px) scale(${interpolate(drop, [0, 1], [0.92, 1])})`,
        opacity: interpolate(drop, [0, 0.35], [0, 1], clamp),
        fontFamily: fonts.text,
        color: colors.white,
        zIndex: 3,
      }}
    >
      <div
        style={{
          width: 10 * k,
          height: 10 * k,
          borderRadius: 2.6 * k,
          background: gradients.brand,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <BrandMark size={6.4 * k} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 3.2 * k, opacity: 0.7 }}>
          <span style={{ fontWeight: weights.semibold, letterSpacing: "0.02em" }}>MITARJETICA</span>
          <span>ahora</span>
        </div>
        <div style={{ fontSize: 4.3 * k, fontWeight: weights.semibold, marginTop: 0.6 * k }}>¡Estás cerca!</div>
        <div style={{ fontSize: 4 * k, opacity: 0.9, display: "flex", alignItems: "center", gap: 1.4 * k }}>
          Tu café te espera <CoffeeIcon size={4.4 * k} />
        </div>
      </div>
    </div>
  );
};

/** Pantalla de bloqueo del iPhone. */
const LockScreen: React.FC<{ width: number }> = ({ width }) => {
  const k = width / 100;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 70% at 20% 10%, #2B3C9E 0%, rgba(43,60,158,0) 60%), radial-gradient(100% 60% at 90% 90%, #5B3FD0 0%, rgba(91,63,208,0) 60%), #0B0B18",
        fontFamily: fonts.display,
        color: colors.white,
      }}
    >
      <StatusBar width={width} time="" />
      <div style={{ position: "absolute", top: 24 * k, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 4.6 * k, fontWeight: weights.semibold, opacity: 0.85 }}>martes, 14 de octubre</div>
        <div
          style={{
            fontSize: 24 * k,
            fontWeight: weights.bold,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginTop: 1 * k,
          }}
        >
          9:41
        </div>
      </div>
      <Notification width={width} />
    </AbsoluteFill>
  );
};

/** Ondas concéntricas que se expanden desde el pin. */
const Ripples: React.FC<{ size: number; u: number }> = ({ size, u }) => {
  const frame = useCurrentFrame();
  const period = 54;
  return (
    <div style={{ position: "relative", width: 0, height: 0 }}>
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame + i * (period / 4)) % period) / period;
        const d = interpolate(t, [0, 1], [size * 0.08, size]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -d / 2,
              top: -d / 2,
              width: d,
              height: d,
              borderRadius: "50%",
              border: `${2 * u}px solid rgba(92,139,255,${(1 - t) * 0.55})`,
              background: `radial-gradient(circle, rgba(47,107,255,0) 55%, rgba(47,107,255,${(1 - t) * 0.12}) 100%)`,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * ESCENA 4 · BENEFICIO · Notificaciones por proximidad 📍
 * Pantalla de bloqueo + notificación iOS con spring y ondas desde un pin.
 * Si USE_WALKING_BROLL = true, mezcla public/broll-caminando.mp4 al 40%.
 */
export const Scene4Benefit1: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, isVertical, safe, W, H } = useLayout();
  const phoneIn = spring({ frame: frame - 6, fps, config: springs.soft });
  const pinIn = enterProgress(frame, fps, 14, springs.smooth);
  const phoneWidth = (isVertical ? 450 : 500) * u;
  const phoneHeight = phoneWidth * (146.6 / 71.6);

  // posiciones (px absolutos)
  const phoneX = isVertical ? W * 0.43 - phoneWidth / 2 : W * 0.66 - phoneWidth / 2;
  const phoneY = isVertical ? H * 0.31 : (H - phoneHeight) / 2;
  const pinX = phoneX + phoneWidth + (isVertical ? 110 : 160) * u;
  const pinY = phoneY + phoneHeight * 0.22;

  return (
    <AbsoluteFill>
      <Backdrop glowX={(pinX / W) * 100} glowY={(pinY / H) * 100} particles={14} />
      {USE_WALKING_BROLL ? (
        <AbsoluteFill style={{ opacity: 0.4, mixBlendMode: "luminosity" }}>
          <OffthreadVideo
            src={staticFile("broll-caminando.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : null}

      {/* ondas + pin (detrás del teléfono) */}
      <div style={{ position: "absolute", left: pinX, top: pinY, opacity: pinIn }}>
        <Ripples size={1100 * u} u={u} />
        <div
          style={{
            position: "absolute",
            left: -48 * u,
            top: -100 * u,
            transform: `translateY(${(1 - pinIn) * -60 * u}px)`,
            filter: `drop-shadow(0 ${14 * u}px ${24 * u}px rgba(47,107,255,0.55))`,
          }}
        >
          <PinIcon size={96 * u} color={colors.blue} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: phoneX,
          top: phoneY,
          opacity: interpolate(phoneIn, [0, 0.5], [0, 1], clamp),
          transform: `translateY(${(1 - phoneIn) * 160 * u}px)`,
        }}
      >
        <PhoneMockup width={phoneWidth} u={u} rotateY={10} rotateX={6} float={0.8}>
          <LockScreen width={phoneWidth} />
        </PhoneMockup>
      </div>

      <div
        style={{
          position: "absolute",
          left: safe.x,
          top: isVertical ? safe.y : H * 0.3,
          width: isVertical ? safe.w : W * 0.4,
        }}
      >
        <BenefitHeader
          number={BENEFIT_NUMBER.proximity}
          title={[
            [{ text: "Notificaciones" }],
            [{ text: "por" }, { text: "proximidad", gradient: true, icon: (s) => <PinIcon size={s} color={colors.blueText} /> }],
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
