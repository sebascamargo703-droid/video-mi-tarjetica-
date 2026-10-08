import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, tones } from "../brand";
import { copy } from "../copy";
import { KineticText } from "../components/KineticText";
import { PhoneMockup } from "../components/PhoneMockup";
import { LockScreenNotification } from "../components/LockScreenNotification";
import {
  LockScreen,
  WalletScreen,
  notificationOffsetY,
} from "../components/Screens";
import { Backdrop, Camera, softShadow } from "../components/Stage";
import { WalletCard, prefilled } from "../components/WalletCard";
import { useLayout } from "../lib/layout";
import { cues } from "../timeline";
import { EASE, EXIT_RATIO, clamp, ease, softSpring, useS } from "../lib/motion";
import { At, Place, SceneProps } from "./common";

const exitFrames = (enterFrames: number) => Math.round(enterFrames * EXIT_RATIO);

/** Título + subtítulo que entran/salen juntos. */
const TitleBlock: React.FC<{
  title: string;
  sub?: string;
  at: number;
  exitAt?: number;
  size: number;
  subSize: number;
  tone: keyof typeof tones;
  align: "left" | "center";
}> = ({ title, sub, at, exitAt, size, subSize, tone, align }) => {
  const s = useS();
  const { u } = useLayout();
  const t = tones[tone];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 22 * u,
      }}
    >
      <KineticText
        text={title}
        size={size}
        color={t.fg}
        accent={t.accent}
        align={align}
        delay={at}
        exitAt={exitAt}
      />
      {sub ? (
        <KineticText
          text={sub}
          size={subSize}
          weight={400}
          font="body"
          color={t.sub}
          align={align}
          stagger={2}
          delay={at + s(0.3)}
          exitAt={exitAt}
          tracking="-0.01em"
        />
      ) : null}
    </div>
  );
};

/** 4 · El teléfono: la tarjeta vive en el Wallet. */
export const WalletScene: React.FC<SceneProps> = ({ dur, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const { vertical, u, width, height } = useLayout();
  const end = dur - out;
  const ex = exitFrames(s(0.8));

  const phoneW = (vertical ? 560 : 410) * u;
  const enter = softSpring(frame, fps, s(0.05));
  const sway = Math.sin(frame / (fps * 1.6)) * 2.5;
  const phoneCx = vertical ? width / 2 : width * 0.69;
  const phoneCy = vertical ? height * 0.66 : height / 2;

  const windows = [s(0.3), s(2.7), s(5.0), end];
  const lines = copy.wallet.lines;

  return (
    <AbsoluteFill>
      <Backdrop tone="light" glowAt={vertical ? "50% 70%" : "70% 50%"} />
      <Camera dur={dur}>
        {lines.map((line, i) => {
          const at = windows[i];
          const exitAt =
            i < lines.length - 1 ? windows[i + 1] - ex - s(0.3) : end - ex;
          return vertical ? (
            <Place key={i} top={height * 0.11}>
              <TitleBlock
                title={line.title}
                sub={line.sub}
                at={at}
                exitAt={exitAt}
                size={88}
                subSize={36}
                tone="light"
                align="center"
              />
            </Place>
          ) : (
            <div
              key={i}
              style={{
                position: "absolute",
                left: width * 0.1,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TitleBlock
                title={line.title}
                sub={line.sub}
                at={at}
                exitAt={exitAt}
                size={96}
                subSize={34}
                tone="light"
                align="left"
              />
            </div>
          );
        })}
        <At cx={phoneCx} cy={phoneCy}>
          <div
            style={{
              transform: `perspective(${2400 * u}px) translateY(${(1 - enter) * 700 * u}px) rotateX(${(1 - enter) * 22}deg) rotateY(${vertical ? 0 : -6 + sway}deg)`,
            }}
          >
            <PhoneMockup width={phoneW} shadow={softShadow(u, 1.3)}>
              <WalletScreen
                phoneWidth={phoneW}
                cardEnterAt={s(cues.walletCardAt)}
                sheenAt={s(1.7)}
                stampTimes={prefilled(6)}
              />
            </PhoneMockup>
          </div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

/** 5 · Los sellos: cada visita suma, y llega el premio. */
export const StampsScene: React.FC<SceneProps> = ({ dur, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const { vertical, u, width, height } = useLayout();
  const end = dur - out;
  const ex = exitFrames(s(0.8));

  const cardW = (vertical ? 920 : 880) * u;
  const enter = softSpring(frame, fps, s(0.05));
  const rotY = interpolate(frame, [0, dur], [-12, 8], { ...clamp, easing: EASE });
  const rewardAt = s(cues.rewardAt);
  const stampTimes = [...prefilled(6).slice(0, 6), ...cues.stampsAt.map(s)];
  const glow = ease(frame, rewardAt, s(0.9));
  const cardCy = vertical ? height * 0.53 : height * 0.6;
  const switchAt = s(3.0);

  return (
    <AbsoluteFill>
      <Backdrop tone="dark" glowAt={vertical ? "50% 53%" : "50% 60%"} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% ${(cardCy / height) * 100}%, rgba(105,211,190,${0.22 * glow}) 0%, rgba(0,0,0,0) 45%)`,
        }}
      />
      <Camera dur={dur}>
        <Place top={vertical ? height * 0.12 : height * 0.08}>
          <KineticText
            text={copy.stamps.title1}
            size={vertical ? 100 : 92}
            color={tones.dark.fg}
            accent={tones.dark.accent}
            delay={s(0.25)}
            exitAt={switchAt - ex}
          />
        </Place>
        <Place top={vertical ? height * 0.12 : height * 0.08}>
          <KineticText
            text={copy.stamps.title2}
            size={vertical ? 100 : 92}
            color={tones.dark.fg}
            accent={tones.dark.accent}
            delay={switchAt + s(0.05)}
            exitAt={end - ex}
          />
        </Place>
        <At cx={width / 2} cy={cardCy}>
          <div
            style={{
              transform: `perspective(${2600 * u}px) translateY(${(1 - enter) * 160 * u}px) rotateX(${8 - enter * 2}deg) rotateY(${rotY}deg) scale(${0.9 + 0.1 * enter})`,
              opacity: enter,
              filter: enter < 0.98 ? `blur(${(1 - enter) * 12 * u}px)` : undefined,
            }}
          >
            <WalletCard
              width={cardW}
              stampTimes={stampTimes}
              sheenAt={s(0.35)}
              rewardAt={rewardAt}
              shadow={softShadow(u, 1.2, true)}
            />
          </div>
        </At>
        <Place top={cardCy + cardW * 0.32 + (vertical ? 90 : 55) * u}>
          <KineticText
            text={copy.stamps.sub}
            size={vertical ? 38 : 34}
            weight={400}
            font="body"
            color={tones.dark.sub}
            stagger={2}
            delay={switchAt + s(0.4)}
            exitAt={end - ex}
            tracking="-0.01em"
          />
        </Place>
      </Camera>
    </AbsoluteFill>
  );
};

/** Ondas de geocerca alrededor del teléfono. */
const GeoRings: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const period = fps * 2.4;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {[0, 1, 2].map((i) => {
        const local = (frame + (i * period) / 3) % period;
        const p = EASE(local / period);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid ${color}`,
              transform: `scale(${0.35 + p * 0.9})`,
              opacity: (1 - p) * 0.45,
            }}
          />
        );
      })}
    </div>
  );
};

/** 6 · Cercanía: aviso en la pantalla de bloqueo. */
export const NearbyScene: React.FC<SceneProps> = ({ dur, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const { vertical, u, width, height } = useLayout();
  const end = dur - out;
  const ex = exitFrames(s(0.8));
  const phoneW = (vertical ? 560 : 400) * u;
  const enter = softSpring(frame, fps, s(0.05));
  const phoneCx = vertical ? width / 2 : width * 0.33;
  const phoneCy = vertical ? height * 0.66 : height / 2;
  return (
    <AbsoluteFill>
      <Backdrop
        tone="brand"
        glowAt={vertical ? "50% 66%" : "33% 50%"}
        glowSize={50}
      />
      <Camera dur={dur}>
        <At cx={phoneCx} cy={phoneCy}>
          <GeoRings size={(vertical ? 1500 : 1250) * u} color={brand.colors.mint} />
        </At>
        <At cx={phoneCx} cy={phoneCy}>
          <div
            style={{
              transform: `perspective(${2400 * u}px) translateY(${(1 - enter) * 650 * u}px) rotateX(${(1 - enter) * 20}deg) rotateY(${vertical ? 0 : 5}deg)`,
            }}
          >
            <PhoneMockup width={phoneW} shadow={softShadow(u, 1.2, true)}>
              <LockScreen
                phoneWidth={phoneW}
                notifyAt={s(cues.notifyAt)}
                showNotification={false}
              />
            </PhoneMockup>
          </div>
        </At>
        {/* La notificación "sale" del teléfono, más grande, hacia la cámara */}
        <div
          style={{
            position: "absolute",
            left: phoneCx - (phoneW * 1.4) / 2,
            top: phoneCy + notificationOffsetY(phoneW) - 10 * u,
            transform: `translateY(${(1 - enter) * 650 * u}px)`,
          }}
        >
          <LockScreenNotification width={phoneW * 1.4} enterAt={s(cues.notifyAt)} />
        </div>
        {vertical ? (
          <Place top={height * 0.11}>
            <TitleBlock
              title={copy.nearby.title}
              sub={copy.nearby.sub}
              at={s(0.3)}
              exitAt={end - ex}
              size={96}
              subSize={36}
              tone="brand"
              align="center"
            />
          </Place>
        ) : (
          <div
            style={{
              position: "absolute",
              left: width * 0.56,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <TitleBlock
              title={copy.nearby.title}
              sub={copy.nearby.sub}
              at={s(0.3)}
              exitAt={end - ex}
              size={104}
              subSize={34}
              tone="brand"
              align="left"
            />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};
