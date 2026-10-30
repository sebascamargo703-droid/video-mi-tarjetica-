import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, music, sfxVolume } from "./brand";
import { copy } from "./copy";
import { font, tracking } from "./fonts";
import { BusinessApp } from "./components/BusinessApp";
import { Confetti } from "./components/Confetti";
import { FlyingStamp } from "./components/FlyingStamp";
import { KineticText } from "./components/KineticText";
import { LockScreen } from "./components/LockScreen";
import { Logo } from "./components/Logo";
import { Phone } from "./components/Phone";
import { WalletCard } from "./components/WalletCard";
import {
  BUTTON,
  CARD,
  CENTER_PHONE,
  CENTER_SCALE,
  LEFT_PHONE,
  PHONE_H,
  PHONE_W,
  RIGHT_PHONE,
  SAFE,
  stampCenter,
  toAbs,
} from "./layout";
import { EASE_IN, EASE_INOUT, clamp, ease, mix, springIn, useS } from "./motion";
import { T } from "./timeline";

const phoneShadow = "0 50px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)";

/** Micro-zoom continuo de cámara (1 → 1.03) entre `from` y `to`. */
const Camera: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  const z = 1 + 0.03 * interpolate(frame, [from, to], [0, 1], { ...clamp, easing: EASE_INOUT });
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${SAFE.centerX}px 920px` }}>{children}</AbsoluteFill>
  );
};

/** Círculo de toque (dedo) que presiona el botón en cada tap. */
const Finger: React.FC<{ taps: number[]; enterAt: number; exitAt: number; target: { x: number; y: number } }> = ({
  taps,
  enterAt,
  exitAt,
  target,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hover = { x: target.x + 30, y: target.y + 44 };
  const start = { x: 980, y: 1720 };
  const out = { x: 1040, y: 1800 };
  let press = 0;
  for (const t of taps) {
    const down = interpolate(frame, [t - 8, t], [0, 1], { ...clamp, easing: EASE_INOUT });
    const up = interpolate(frame, [t + 3, t + Math.round(fps * 0.28)], [0, 1], { ...clamp, easing: EASE_INOUT });
    press = Math.max(press, down * (1 - up));
  }
  const inP = ease(frame, enterAt, Math.round(fps * 0.7), EASE_INOUT);
  const outP = ease(frame, exitAt, Math.round(fps * 0.5), EASE_IN);
  if (inP <= 0 || outP >= 1) return null;
  const x = mix(mix(start.x, mix(hover.x, target.x, press), inP), out.x, outP);
  const y = mix(mix(start.y, mix(hover.y, target.y, press), inP), out.y, outP);
  const size = 84;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `rgba(255,255,255,${0.28 + 0.2 * press})`,
        border: "3px solid rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
        boxShadow: `0 ${16 - 12 * press}px ${34 - 20 * press}px rgba(0,0,0,0.45)`,
        transform: `scale(${1 - 0.16 * press})`,
        opacity: inP * (1 - outP),
      }}
    />
  );
};

export const TapSello: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = useS();

  const taps = T.taps.map(s);
  const lands = T.lands.map(s);
  const unlock = s(T.unlock);
  const swap = s(T.swap);
  const lock = s(T.lock);
  const notif = s(T.notif);
  const ctaOut = s(T.ctaOut);
  const cta = s(T.cta);

  // ---- Celulares ----
  const leftIn = springIn(frame, fps, s(T.phonesIn));
  const rightIn = springIn(frame, fps, s(T.phonesIn) + 6);
  const straighten = ease(frame, s(T.phonesIn) + 10, s(1.2));
  const leftOut = ease(frame, swap, s(0.7), EASE_IN);
  const move = ease(frame, swap + s(0.15), s(1.0), EASE_INOUT);
  const stageOut = ease(frame, ctaOut, s(0.35));
  const labels = ease(frame, s(T.labelsIn), s(0.6)) * (1 - ease(frame, swap, s(0.4)));
  const toLock = ease(frame, lock, s(0.5));

  const btnAbs = toAbs(LEFT_PHONE, { x: BUTTON.x + BUTTON.w / 2, y: BUTTON.y + BUTTON.h / 2 });
  const rightX = mix(RIGHT_PHONE.x, CENTER_PHONE.x, move);
  const rightY = mix(RIGHT_PHONE.y, CENTER_PHONE.y, move);
  const rightScale = mix(1, CENTER_SCALE, move);

  // Fondo: glow de marca muy sutil mientras están los celulares (el frame 0 y el último son negro puro).
  const glow = ease(frame, s(T.phonesIn), s(0.8)) * (1 - stageOut);
  const loopFade = interpolate(frame, [durationInFrames - T.loopFadeFrames, durationInFrames - 1], [0, 1], clamp);

  const label = (text: string, x: number) => (
    <div
      style={{
        position: "absolute",
        left: x,
        width: PHONE_W,
        top: LEFT_PHONE.y - 56,
        textAlign: "center",
        fontFamily: font,
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: tracking.caps,
        textTransform: "uppercase",
        color: brand.colors.gray,
        opacity: labels,
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.black }}>
      <AbsoluteFill
        style={{
          opacity: glow,
          background: `radial-gradient(ellipse at ${SAFE.centerX}px 1000px, rgba(14,82,68,0.42) 0%, rgba(10,10,10,0) 55%)`,
        }}
      />

      {/* 0:00–0:02 · Gancho */}
      {frame < s(2.2) ? (
        <Camera from={0} to={s(2)}>
          <div style={{ position: "absolute", left: 40, right: 1080 - SAFE.right + 40, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 80 }}>
            <KineticText
              text={copy.hook}
              size={92}
              color={brand.colors.white}
              accent={brand.colors.mint}
              delay={s(0.08)}
              exitAt={s(T.hookExit)}
            />
          </div>
        </Camera>
      ) : null}

      {/* 0:02–0:16 · Celulares */}
      {frame >= s(1.9) && frame < cta + s(0.1) ? (
        <Camera from={s(2)} to={cta}>
          <AbsoluteFill style={{ opacity: 1 - stageOut, filter: stageOut > 0 ? `blur(${stageOut * 10}px)` : undefined }}>
            {label(copy.labels.business, LEFT_PHONE.x)}
            {label(copy.labels.customer, RIGHT_PHONE.x)}

            {leftOut < 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: LEFT_PHONE.x,
                  top: LEFT_PHONE.y,
                  transform: `perspective(2400px) translateX(${-760 * leftOut}px) translateY(${(1 - leftIn) * 1300}px) rotateY(${8 * (1 - straighten)}deg) rotate(${-6 * leftOut}deg)`,
                }}
              >
                <Phone screenBg={brand.colors.appBg} statusColor={brand.colors.ink} shadow={phoneShadow}>
                  <BusinessApp taps={taps} />
                </Phone>
              </div>
            ) : null}

            <div
              style={{
                position: "absolute",
                left: rightX,
                top: rightY,
                transformOrigin: "0 0",
                transform: `perspective(2400px) translateY(${(1 - rightIn) * 1300}px) rotateY(${-8 * (1 - straighten)}deg) scale(${rightScale})`,
              }}
            >
              <Phone time={frame >= lock ? copy.lock.time : "4:10"} shadow={phoneShadow}>
                {toLock < 1 ? (
                  <div style={{ position: "absolute", inset: 0, opacity: 1 - toLock, transform: `scale(${1 - 0.06 * toLock})`, filter: toLock > 0 ? `blur(${toLock * 10}px)` : undefined }}>
                    <WalletCard lands={lands} unlockAt={unlock} />
                  </div>
                ) : null}
                {toLock > 0 ? (
                  <div style={{ position: "absolute", inset: 0, opacity: toLock, transform: `scale(${1.06 - 0.06 * toLock})` }}>
                    <LockScreen notifAt={notif} />
                  </div>
                ) : null}
              </Phone>
            </div>

            {/* Sellos voladores: del botón a cada círculo vacío; aterrizan sobre el beat */}
            {taps.map((t, i) => (
              <FlyingStamp
                key={i}
                from={btnAbs}
                to={toAbs(RIGHT_PHONE, stampCenter(7 + i))}
                start={t + 4}
                dur={lands[i] - t - 4}
                size={54}
              />
            ))}

            <Confetti at={unlock} x={toAbs(RIGHT_PHONE, { x: CARD.x + CARD.w / 2, y: 0 }).x} y={toAbs(RIGHT_PHONE, { x: 0, y: CARD.y + 290 }).y} />

            <Finger taps={taps} enterAt={s(T.fingerIn)} exitAt={taps[2] + s(0.4)} target={btnAbs} />

            {/* Texto bajo los celulares (cambia en el segundo tap) */}
            <div style={{ position: "absolute", left: 0, width: SAFE.right, top: LEFT_PHONE.y + PHONE_H + 26 }}>
              <KineticText
                text={copy.under.first}
                size={46}
                weight={600}
                color={brand.colors.white}
                accent={brand.colors.mint}
                delay={s(T.underFirst)}
                exitAt={taps[1] - s(0.32)}
              />
            </div>
            <div style={{ position: "absolute", left: 0, width: SAFE.right, top: LEFT_PHONE.y + PHONE_H + 26 }}>
              <KineticText
                text={copy.under.second}
                size={46}
                weight={800}
                color={brand.colors.white}
                accent={brand.colors.mint}
                delay={taps[1]}
                exitAt={s(T.underOut)}
              />
            </div>

            {/* Texto fuera del celular durante la notificación */}
            <div style={{ position: "absolute", left: 0, width: SAFE.right, top: SAFE.top + 30 }}>
              <KineticText
                text={copy.lock.outside}
                size={62}
                color={brand.colors.white}
                accent={brand.colors.mint}
                delay={s(T.outsideText)}
                lineHeight={1.08}
              />
            </div>
          </AbsoluteFill>
        </Camera>
      ) : null}

      {/* 0:16–0:18 · CTA */}
      {frame >= cta - 2 ? (
        <Camera from={cta} to={durationInFrames}>
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 1080 - SAFE.right + 40,
              top: SAFE.top,
              bottom: 1920 - SAFE.bottom,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 46,
            }}
          >
            <Logo height={180} color={brand.colors.white} animateAt={cta} />
            <KineticText text={copy.cta.title} size={70} color={brand.colors.white} accent={brand.colors.mint} delay={cta + s(0.35)} lineHeight={1.08} />
            <div
              style={{
                fontFamily: font,
                fontWeight: 400,
                fontSize: 30,
                color: brand.colors.gray,
                textAlign: "center",
                opacity: ease(frame, cta + s(0.75), s(0.5)),
                transform: `translateY(${(1 - ease(frame, cta + s(0.75), s(0.5))) * 20}px)`,
              }}
            >
              {copy.cta.sub}
            </div>
          </div>
        </Camera>
      ) : null}

      {/* Últimos 10 frames: fundido a negro idéntico al frame 0 (loop perfecto) */}
      <AbsoluteFill style={{ backgroundColor: brand.colors.black, opacity: loopFade }} />

      {/* ---- Audio ---- */}
      <Html5Audio
        src={staticFile(music.file)}
        volume={(f) =>
          music.volume * interpolate(f, [0, s(0.3), durationInFrames - s(1), durationInFrames - 1], [0, 1, 1, 0], clamp)
        }
      />
      {taps.map((t, i) => (
        <React.Fragment key={i}>
          <Sequence from={t - 1} durationInFrames={s(0.6)} layout="none" name={`tap ${i + 1}`}>
            <Html5Audio src={staticFile("sfx/tap.mp3")} volume={sfxVolume.tap} />
          </Sequence>
          <Sequence from={t + 4} durationInFrames={s(1)} layout="none" name={`whoosh ${i + 1}`}>
            <Html5Audio src={staticFile("sfx/whoosh-soft.mp3")} volume={sfxVolume.whoosh} />
          </Sequence>
          <Sequence from={lands[i]} durationInFrames={s(0.8)} layout="none" name={`pop ${i + 1}`}>
            <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop} />
          </Sequence>
        </React.Fragment>
      ))}
      <Sequence from={unlock} durationInFrames={s(2)} layout="none" name="unlock">
        <Html5Audio src={staticFile("sfx/unlock.mp3")} volume={sfxVolume.unlock} />
      </Sequence>
      <Sequence from={notif} durationInFrames={s(1.5)} layout="none" name="notification">
        <Html5Audio src={staticFile("sfx/notification.mp3")} volume={sfxVolume.notification} />
      </Sequence>
    </AbsoluteFill>
  );
};
