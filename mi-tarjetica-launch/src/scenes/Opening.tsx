import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { tones } from "../brand";
import { copy } from "../copy";
import { KineticText } from "../components/KineticText";
import { Logo } from "../components/Logo";
import { PaperCard } from "../components/PaperCard";
import { Backdrop, Camera, softShadow } from "../components/Stage";
import { useLayout } from "../lib/layout";
import { cues } from "../timeline";
import { EXIT_RATIO, clamp, ease, softSpring, useS } from "../lib/motion";
import { At, Place, SceneProps } from "./common";

/** 1 · Gancho: la tarjeta de papel se cae del cuadro. */
export const HookScene: React.FC<SceneProps> = ({ dur, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const { vertical, u, width, height } = useLayout();
  const t = tones.dark;
  const end = dur - out;
  const exitAt = end - Math.round(s(0.8) * EXIT_RATIO);

  const enter = softSpring(frame, fps, 0);
  const fallStart = s(1.7);
  const fall = interpolate(frame, [fallStart, fallStart + s(1.1)], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const cardW = (vertical ? 760 : 640) * u;
  const cy = vertical ? height * 0.6 : height * 0.64;
  const y = (1 - enter) * 120 * u + fall * height * 0.75;
  const rot = -4 + enter * 2 + fall * 28;
  const float = Math.sin(frame / 22) * 4 * u * (1 - fall);

  return (
    <AbsoluteFill>
      <Backdrop tone="dark" glowAt="50% 70%" />
      <Camera dur={dur}>
        <Place top={vertical ? height * 0.24 : height * 0.15}>
          <KineticText
            text={copy.hook.title}
            size={vertical ? 96 : 118}
            color={t.fg}
            accent={t.accent}
            delay={s(0.05)}
            exitAt={exitAt}
          />
        </Place>
        <At cx={width / 2} cy={cy}>
          <div
            style={{
              transform: `translateY(${y + float}px) rotate(${rot}deg)`,
              opacity: enter,
              filter: enter < 0.98 ? `blur(${(1 - enter) * 10}px)` : undefined,
              boxShadow: softShadow(u, 1, true),
              borderRadius: cardW * 0.025,
            }}
          >
            <PaperCard width={cardW} stamped={4} />
          </div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

/** 2 · Problema: con la tarjeta se va la próxima visita. */
export const ProblemScene: React.FC<SceneProps> = ({ dur, out }) => {
  const s = useS();
  const { vertical, u, height } = useLayout();
  const t = tones.light;
  const end = dur - out;
  const exitAt = end - Math.round(s(0.8) * EXIT_RATIO) - s(0.1);
  return (
    <AbsoluteFill>
      <Backdrop tone="light" />
      <Camera dur={dur}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 10 * u,
            paddingBottom: vertical ? height * 0.04 : 0,
          }}
        >
          <KineticText
            text={copy.problem.lead}
            size={vertical ? 76 : 88}
            weight={600}
            color={t.sub}
            delay={s(0.05)}
            exitAt={exitAt}
          />
          <KineticText
            text={copy.problem.title}
            size={vertical ? 120 : 156}
            color={t.fg}
            accent={t.accent}
            delay={s(0.45)}
            stagger={4}
            exitAt={exitAt}
          />
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

/** 3 · Revelación: el logo se arma como si le pusieran sellos. */
export const RevealScene: React.FC<SceneProps> = ({ dur, out }) => {
  const frame = useCurrentFrame();
  const s = useS();
  const { vertical, u, width, height } = useLayout();
  const t = tones.dark;
  const end = dur - out;
  const exitAt = end - Math.round(s(0.8) * EXIT_RATIO) - s(0.05);
  const move = ease(frame, s(2.4), s(1.1));
  const logoH = (vertical ? 210 : 250) * u;
  const logoY = interpolate(move, [0, 1], [0, (vertical ? -330 : -200) * u]);
  const logoScale = interpolate(move, [0, 1], [1, vertical ? 0.78 : 0.66]);
  const logoOut = ease(frame, exitAt, s(0.5));
  const kicker = ease(frame, s(0.1), s(0.8)) * (1 - ease(frame, s(2.2), s(0.4)));

  return (
    <AbsoluteFill>
      <Backdrop tone="dark" glowSize={55} />
      <Camera dur={dur} to={1.04}>
        <At cx={width / 2} cy={height / 2 - logoH * 0.7}>
          <div
            style={{
              opacity: kicker,
              transform: `translateY(${(1 - kicker) * 20 * u}px)`,
              color: t.sub,
              fontFamily: "inherit",
            }}
          >
            <KineticText
              text={copy.reveal.kicker}
              size={vertical ? 44 : 40}
              weight={600}
              font="body"
              color={t.sub}
              delay={0}
            />
          </div>
        </At>
        <At cx={width / 2} cy={height / 2 + logoY + logoH * 0.05}>
          <div
            style={{
              transform: `scale(${logoScale}) translateY(${-logoOut * 30 * u}px)`,
              opacity: 1 - logoOut,
            }}
          >
            <Logo height={logoH} color={t.fg} animateAt={s(cues.revealLogoAt)} />
          </div>
        </At>
        <Place top={height / 2 + (vertical ? -40 : 40) * u}>
          <KineticText
            text={copy.reveal.title}
            size={vertical ? 92 : 104}
            color={t.fg}
            accent={t.accent}
            delay={s(2.75)}
            exitAt={exitAt}
          />
        </Place>
      </Camera>
    </AbsoluteFill>
  );
};
