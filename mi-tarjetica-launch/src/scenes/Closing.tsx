import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, tones } from "../brand";
import { copy } from "../copy";
import { fonts, tracking } from "../fonts";
import { ActivityLog } from "../components/ActivityLog";
import { KineticText } from "../components/KineticText";
import { Logo, LogoMark } from "../components/Logo";
import { Marquee } from "../components/Marquee";
import { Backdrop, Camera } from "../components/Stage";
import { useLayout } from "../lib/layout";
import { cues } from "../timeline";
import {
  EXIT_RATIO,
  clamp,
  ease,
  popSpring,
  presence,
  softSpring,
  useS,
} from "../lib/motion";
import { At, Place, SceneProps } from "./common";

const exitFrames = (enterFrames: number) => Math.round(enterFrames * EXIT_RATIO);

/** 7 · Antifraude: cada sello firmado. */
export const FraudScene: React.FC<SceneProps> = ({ dur, out }) => {
  const s = useS();
  const { vertical, u, height } = useLayout();
  const end = dur - out;
  const exitAt = end - exitFrames(s(0.8)) - s(0.08);
  const t = tones.dark;
  return (
    <AbsoluteFill>
      <Backdrop tone="dark" glowAt="50% 65%" />
      <Camera dur={dur}>
        <Place top={vertical ? height * 0.13 : height * 0.1}>
          <KineticText
            text={copy.fraud.title}
            size={vertical ? 104 : 100}
            color={t.fg}
            accent={t.accent}
            delay={s(0.1)}
            exitAt={exitAt}
          />
          <div style={{ height: 26 * u }} />
          <KineticText
            text={copy.fraud.sub}
            size={vertical ? 36 : 34}
            weight={400}
            font="body"
            color={t.sub}
            stagger={2}
            delay={s(0.45)}
            exitAt={exitAt}
            tracking="-0.01em"
          />
        </Place>
        <Place top={vertical ? height * 0.42 : height * 0.43}>
          <ActivityLog
            width={(vertical ? 960 : 1480) * u}
            enterAt={s(cues.fraudRowsAt)}
            exitAt={exitAt}
            compact={vertical}
          />
        </Place>
      </Camera>
    </AbsoluteFill>
  );
};

/** 8 · Negocios: cintas de rubros alrededor del titular. */
export const BusinessScene: React.FC<SceneProps> = ({ dur, out }) => {
  const frame = useCurrentFrame();
  const s = useS();
  const { vertical, u, height } = useLayout();
  const end = dur - out;
  const exitAt = end - exitFrames(s(0.8));
  const t = tones.light;
  const types = copy.business.types;
  const fs = (vertical ? 50 : 44) * u;
  const rowH = fs * 2.3;

  // Posición vertical de cada cinta (fracción de la altura) y su estilo.
  const rows = vertical
    ? [0.1, 0.18, 0.26, 0.66, 0.74, 0.82]
    : [0.1, 0.235, 0.765, 0.9];
  const styleFor = (i: number) => {
    const accentRow = vertical ? i === 1 || i === 4 : i === 1 || i === 2;
    return accentRow
      ? { color: brand.colors.white, pillBg: brand.colors.green }
      : {
          color: brand.colors.black,
          pillBg: brand.colors.grayLight,
        };
  };

  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <Camera dur={dur}>
        {rows.map((r, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const p = presence(frame, s(0.05) + i * 3, s(0.8), exitAt + i * 2);
          const shift = [0, 0.37, 0.61, 0.15, 0.82, 0.48][i] * 1600 * u;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: height * r - rowH / 2,
                left: 0,
                height: rowH,
                display: "flex",
                alignItems: "center",
                opacity: p,
                transform: `translateY(${(1 - p) * 30 * u}px)`,
              }}
            >
              <Marquee
                items={i % 2 ? [...types].reverse() : types}
                speed={dir * (70 + i * 12) * u}
                offset={dir > 0 ? -3200 * u - shift : -shift}
                fontSize={fs}
                {...styleFor(i)}
              />
            </div>
          );
        })}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <KineticText
            text={copy.business.title}
            size={vertical ? 120 : 132}
            color={t.fg}
            accent={t.accent}
            delay={s(0.25)}
            exitAt={exitAt}
          />
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

/** 9 · Mensaje central. */
export const MessageScene: React.FC<SceneProps> = ({ dur, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const { vertical, u, width, height } = useLayout();
  const end = dur - out;
  const t = tones.brand;
  const markIn = softSpring(frame, fps, s(0.1));
  return (
    <AbsoluteFill>
      <Backdrop tone="brand" />
      <At cx={width / 2} cy={height / 2}>
        <div
          style={{
            opacity: 0.05 * markIn,
            transform: `scale(${0.85 + 0.2 * markIn + interpolate(frame, [0, dur], [0, 0.06], clamp)})`,
          }}
        >
          <LogoMark height={(vertical ? 560 : 860) * u} color={brand.colors.white} />
        </div>
      </At>
      <Camera dur={dur} to={1.05}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <KineticText
            text={copy.message.title}
            size={vertical ? 136 : 168}
            lineHeight={0.98}
            color={t.fg}
            accent={t.accent}
            delay={s(0.15)}
            stagger={4}
            enterSec={0.9}
            exitAt={end - exitFrames(s(0.8))}
          />
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

/** 10 · Cierre / llamado a la acción. */
export const CtaScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const { vertical, u, height } = useLayout();
  const t = tones.dark;
  const price = ease(frame, s(1.3), s(0.8));
  const btn = softSpring(frame, fps, s(1.6));
  const tap = s(cues.ctaTapAt);
  const press =
    frame >= tap
      ? 1 - 0.05 * Math.sin(Math.min(1, (frame - tap) / s(0.35)) * Math.PI)
      : 1;
  const tapRing = popSpring(frame, fps, tap);
  const footer = ease(frame, s(2.0), s(0.9));
  const gap = (vertical ? 46 : 34) * u;

  return (
    <AbsoluteFill>
      <Backdrop tone="dark" glowAt="50% 55%" glowSize={60} />
      <Camera dur={dur} to={1.025}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap,
            paddingBottom: (vertical ? 60 : 40) * u,
          }}
        >
          <Logo height={(vertical ? 170 : 140) * u} color={t.fg} animateAt={0} />
          <div style={{ height: (vertical ? 30 : 10) * u }} />
          <KineticText
            text={copy.cta.title}
            size={vertical ? 124 : 132}
            color={t.fg}
            accent={t.accent}
            delay={s(0.55)}
          />
          <KineticText
            text={copy.cta.sub}
            size={vertical ? 38 : 36}
            weight={400}
            font="body"
            color={t.sub}
            stagger={2}
            delay={s(0.9)}
            tracking="-0.01em"
            style={vertical ? { maxWidth: 900 * u } : undefined}
          />
          <div
            style={{
              display: "flex",
              flexDirection: vertical ? "column" : "row",
              alignItems: "center",
              gap: 24 * u,
              marginTop: 14 * u,
            }}
          >
            <div
              style={{
                opacity: price,
                transform: `translateY(${(1 - price) * 24 * u}px)`,
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: (vertical ? 36 : 32) * u,
                color: t.fg,
                padding: `${20 * u}px ${36 * u}px`,
                borderRadius: 999,
                boxShadow: `inset 0 0 0 ${1.5 * u}px rgba(255,255,255,0.18)`,
                letterSpacing: tracking.body,
              }}
            >
              {copy.cta.price}
            </div>
            <div style={{ position: "relative" }}>
              {frame >= tap ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    boxShadow: `0 0 0 ${3 * u}px ${brand.colors.mint}`,
                    transform: `scale(${1 + tapRing * 0.12})`,
                    opacity: (1 - Math.min(1, (frame - tap) / s(0.7))) * 0.8,
                  }}
                />
              ) : null}
              <div
                style={{
                  opacity: btn,
                  transform: `translateY(${(1 - btn) * 40 * u}px) scale(${press})`,
                  fontFamily: fonts.body,
                  fontWeight: 800,
                  fontSize: (vertical ? 40 : 34) * u,
                  color: brand.colors.green,
                  background: brand.colors.white,
                  padding: `${22 * u}px ${46 * u}px`,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  gap: 14 * u,
                  letterSpacing: tracking.body,
                  boxShadow: `0 ${20 * u}px ${60 * u}px rgba(105,211,190,0.18)`,
                }}
              >
                {copy.cta.button}
                <span style={{ fontWeight: 600 }}>→</span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
        <Place top={height - (vertical ? 170 : 100) * u}>
          <div
            style={{
              opacity: footer,
              fontFamily: fonts.body,
              fontSize: (vertical ? 28 : 24) * u,
              color: t.sub,
              letterSpacing: tracking.caps,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {copy.cta.footer}
          </div>
        </Place>
      </Camera>
    </AbsoluteFill>
  );
};
