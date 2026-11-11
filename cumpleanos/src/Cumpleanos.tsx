import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { biz, brand, music, sfxVolume } from "./brand";
import { birthday, business, copy } from "./copy";
import { font } from "./fonts";
import { Calendar } from "./components/Calendar";
import { KineticText } from "./components/KineticText";
import { LockScreen } from "./components/LockScreen";
import { Logo } from "./components/Logo";
import { GiftBox, NailPolish } from "./components/NailPolish";
import { Notification, glassStyle } from "./components/Notification";
import { OfferBadge } from "./components/OfferBadge";
import { Phone } from "./components/Phone";
import { Sparkles } from "./components/Sparkles";
import { WalletCard, cardBackground } from "./components/WalletCard";
import { CARD_RECT, NOTIF_RECT, PHONE_POS, PHONE_W, SAFE, SCREEN_INSET, dayCenter } from "./layout";
import { EASE, EASE_IN, EASE_INOUT, SPRING_POP, clamp, ease, mix, pop, springIn, useS } from "./motion";
import { T } from "./timeline";

/** Micro-zoom continuo de cámara (1 → 1.03). */
const Camera: React.FC<{ from: number; to: number; originY?: number; children: React.ReactNode }> = ({ from, to, originY = 900, children }) => {
  const frame = useCurrentFrame();
  const z = 1 + 0.03 * interpolate(frame, [from, to], [0, 1], { ...clamp, easing: EASE_INOUT });
  return <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${SAFE.centerX}px ${originY}px` }}>{children}</AbsoluteFill>;
};

/** Índice continuo del día resaltado: lento → rápido → lento (in-out sobre el índice). */
const dayProgress = (frame: number, fps: number) =>
  interpolate(frame, [Math.round(T.runStart * fps), Math.round(T.runEnd * fps)], [1, birthday.day], { ...clamp, easing: EASE_INOUT });

/** Frames en que el resaltado llega a un día nuevo (para los ticks) y el intervalo desde el anterior. */
const tickFrames = (fps: number) => {
  const out: { frame: number; gap: number }[] = [];
  let last = 1;
  let lastFrame = Math.round(T.runStart * fps);
  for (let f = Math.round(T.runStart * fps); f <= Math.round(T.runEnd * fps); f++) {
    const d = Math.floor(dayProgress(f, fps) + 1e-6);
    if (d > last) {
      out.push({ frame: f, gap: f - lastFrame });
      last = d;
      lastFrame = f;
    }
  }
  return out;
};

const TapCircle: React.FC<{ at: number; target: { x: number; y: number } }> = ({ at, target }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = ease(frame, at - Math.round(fps * 0.45), Math.round(fps * 0.4), EASE_INOUT);
  const press = interpolate(frame, [at - 6, at, at + 4, at + Math.round(fps * 0.25)], [0, 1, 1, 0], { ...clamp, easing: EASE_INOUT });
  const outP = ease(frame, at + Math.round(fps * 0.3), Math.round(fps * 0.35), EASE_IN);
  if (inP <= 0 || outP >= 1) return null;
  const x = mix(target.x + 180, target.x, inP) + outP * 120;
  const y = mix(target.y + 420, target.y, inP) + outP * 260;
  const ripple = frame >= at ? interpolate(frame - at, [0, fps * 0.6], [0, 1], { ...clamp, easing: EASE }) : 0;
  const size = 110;
  return (
    <>
      {ripple > 0 && ripple < 1 ? (
        <div style={{ position: "absolute", left: target.x - size, top: target.y - size, width: size * 2, height: size * 2, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.9)", transform: `scale(${0.4 + ripple * 1.4})`, opacity: 1 - ripple }} />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `rgba(255,255,255,${0.32 + 0.25 * press})`,
          border: "3px solid rgba(255,255,255,0.9)",
          boxShadow: `0 ${18 - 12 * press}px ${40 - 24 * press}px rgba(0,0,0,0.4)`,
          transform: `scale(${1 - 0.16 * press})`,
          opacity: inP * (1 - outP),
        }}
      />
    </>
  );
};

/* ---------------- Escena del calendario ---------------- */
const CalendarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const appear = springIn(frame, fps, s(T.calendarIn));
  const progress = dayProgress(frame, fps);
  const highlight = ease(frame, s(T.runStart) - 8, s(0.3));
  const target = dayCenter(birthday.day);
  const z = interpolate(frame, [s(T.zoom), s(T.zoom + T.zoomDur)], [0, 1], { ...clamp, easing: EASE_INOUT });
  const scale = 1 + 11 * z;
  const off = { x: (SAFE.centerX - target.x) * z, y: (960 - target.y) * z };
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${off.x}px, ${off.y}px) translate(${target.x}px, ${target.y}px) scale(${scale}) translate(${-target.x}px, ${-target.y}px)`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: appear, transform: `translateY(${(1 - appear) * 60}px)` }}>
        <Calendar progress={progress} highlight={highlight} arriveAt={s(T.runEnd)} emojiOpacity={1 - Math.min(1, z * 4)} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Escena del celular ---------------- */
const PhoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = frame / fps;

  const appear = ease(frame, s(T.phoneIn), s(0.55));
  const hp = (t - T.haptic) / 0.36;
  const shake = hp > 0 && hp < 1 ? 4 * Math.sin(hp * Math.PI * 2 * 3) * (1 - hp * 0.5) : 0;

  const notifIn = springIn(frame, fps, s(T.notif));
  const notifFade = ease(frame, s(T.notif), s(0.3));
  const e = ease(frame, s(T.expand), s(0.75), EASE);
  const notifContent = 1 - ease(frame, s(T.expand), s(0.22));
  const cardContent = ease(frame, s(T.expand) + s(0.35), s(0.4));
  const rect = {
    x: mix(NOTIF_RECT.x, CARD_RECT.x, e),
    y: mix(NOTIF_RECT.y, CARD_RECT.y, e),
    w: mix(NOTIF_RECT.w, CARD_RECT.w, e),
    h: mix(NOTIF_RECT.h, CARD_RECT.h, e),
  };
  const screen = { x: PHONE_POS.x + SCREEN_INSET, y: PHONE_POS.y + SCREEN_INSET };
  const notifGlobal = { x: screen.x + NOTIF_RECT.x, y: screen.y + NOTIF_RECT.y, w: NOTIF_RECT.w, h: NOTIF_RECT.h };
  const notifCenter = { x: notifGlobal.x + notifGlobal.w / 2, y: notifGlobal.y + notifGlobal.h / 2 };

  const product = frame >= s(T.product) ? spring({ frame: frame - s(T.product), fps, config: SPRING_POP }) : 0;
  const badge = pop(frame, fps, s(T.badge));
  const badgeRot = interpolate(frame, [s(T.badge), s(T.badge + 0.8)], [-26, -8], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill style={{ opacity: appear, filter: appear < 1 ? `blur(${(1 - appear) * 14}px)` : undefined, transform: `scale(${1.15 - 0.15 * appear})`, transformOrigin: `${SAFE.centerX}px 960px` }}>
      <div style={{ position: "absolute", left: 0, width: SAFE.right, top: SAFE.top + 16 }}>
        <KineticText text={copy.outside} size={56} color={brand.colors.black} accent={biz.deep} delay={s(T.outsideText)} exitAt={s(T.tap - 0.4)} />
      </div>
      <div style={{ position: "absolute", left: PHONE_POS.x, top: PHONE_POS.y, transform: `translateX(${shake}px)` }}>
        <Phone width={PHONE_W} time={frame >= s(T.clockRoll + 0.3) ? "9:00" : "8:59"} shadow="0 60px 120px rgba(60,20,30,0.28), 0 18px 40px rgba(60,20,30,0.18)">
          <LockScreen clockAt={s(T.clockRoll)} clockOpacity={1 - ease(frame, s(T.expand), s(0.3))}>
            <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.5 * e})` }} />
            <div
              style={{
                position: "absolute",
                left: rect.x,
                top: rect.y,
                width: rect.w,
                height: rect.h,
                borderRadius: 40,
                overflow: "hidden",
                ...glassStyle,
                transform: `translateY(${(1 - notifIn) * -440}px) scale(${0.94 + 0.06 * notifIn})`,
                opacity: notifFade,
                boxShadow: e > 0 ? `0 ${30 * e}px ${80 * e}px rgba(0,0,0,${0.5 * e})` : glassStyle.boxShadow,
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: cardBackground, opacity: e }} />
              <div style={{ position: "absolute", left: 0, top: 0, opacity: notifContent }}>
                <Notification width={NOTIF_RECT.w} />
              </div>
              {cardContent > 0 ? (
                <div style={{ position: "absolute", left: 0, top: 0, opacity: cardContent, transform: `translateY(${(1 - cardContent) * 20}px)` }}>
                  <WalletCard width={CARD_RECT.w} height={CARD_RECT.h} />
                </div>
              ) : null}
            </div>
          </LockScreen>
        </Phone>
      </div>
      {/* Destellos dorados alrededor de la notificación (se apagan antes del toque) */}
      {frame < s(T.tap) ? <Sparkles at={s(T.sparkles)} rect={notifGlobal} count={10} /> : null}
      <TapCircle at={s(T.tap)} target={notifCenter} />
      {/* Ilustración + badge */}
      <div style={{ position: "absolute", left: 130, top: 1492, transformOrigin: "50% 100%", transform: `translateY(-100%) scale(${product}) rotate(-7deg)` }}>
        {business.product === "nail-polish" ? <NailPolish width={250} shineAt={s(T.product + 0.35)} /> : <GiftBox width={260} />}
      </div>
      <div style={{ position: "absolute", left: 690, top: 1300, transform: `translate(-50%, -50%) scale(${badge}) rotate(${badgeRot}deg)` }}>
        <OfferBadge size={220} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Composición ---------------- */
export const Cumpleanos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = useS();

  const creamIn = ease(frame, s(2.85), s(0.35));
  const creamOut = ease(frame, s(T.phoneOut), s(0.3));
  const calFade = 1 - ease(frame, s(T.phoneIn + 0.15), s(0.4));
  const phoneOut = ease(frame, s(T.phoneOut), s(0.3));
  const loopFade = interpolate(frame, [durationInFrames - T.loopFadeFrames, durationInFrames - 1], [0, 1], clamp);
  const ticks = tickFrames(fps);
  const maxGap = Math.max(...ticks.map((t) => t.gap));

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.black, fontFamily: font }}>
      <AbsoluteFill style={{ backgroundColor: brand.colors.cream, opacity: creamIn * (1 - creamOut) }} />

      {/* 0:00–0:03 · Gancho */}
      {frame < s(3.1) ? (
        <Camera from={0} to={s(3)}>
          <div style={{ position: "absolute", left: 40, right: 1080 - SAFE.right + 40, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, paddingBottom: 60 }}>
            <KineticText text={copy.hook} size={76} color={brand.colors.white} accent={brand.colors.mint} delay={s(0.08)} exitAt={s(T.hookExit)} lineHeight={1.08} />
            <KineticText text={copy.hookSub} size={46} weight={600} color={brand.colors.gray} delay={s(T.hookSub)} exitAt={s(T.hookExit)} />
          </div>
        </Camera>
      ) : null}

      {/* 0:03–0:08 · Calendario + zoom al día */}
      {frame >= s(2.85) && calFade > 0 ? (
        <AbsoluteFill style={{ opacity: calFade }}>
          <Camera from={s(T.calendarIn)} to={s(T.zoom)} originY={880}>
            <CalendarScene />
            <div style={{ position: "absolute", left: 0, width: SAFE.right, top: SAFE.top + 30 }}>
              <KineticText text={copy.calendarTop} size={72} color={brand.colors.black} accent={biz.deep} delay={s(T.calendarText)} exitAt={s(T.zoom - 0.25)} />
            </div>
          </Camera>
        </AbsoluteFill>
      ) : null}

      {/* 0:07–0:15 · Celular */}
      {frame >= s(T.phoneIn) && phoneOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - phoneOut, filter: phoneOut > 0 ? `blur(${phoneOut * 12}px)` : undefined }}>
          <Camera from={s(T.phoneIn)} to={s(T.phoneOut)}>
            <PhoneScene />
          </Camera>
        </AbsoluteFill>
      ) : null}

      {/* 0:15–0:18 · CTA */}
      {frame >= s(T.cta) - 2 ? (
        <Camera from={s(T.cta)} to={durationInFrames}>
          <div style={{ position: "absolute", left: 40, right: 1080 - SAFE.right + 40, top: SAFE.top, bottom: 1920 - SAFE.bottom, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 }}>
            <KineticText text={copy.cta.title} size={78} color={brand.colors.white} accent={brand.colors.mint} delay={s(T.cta + 0.1)} lineHeight={1.08} />
            <div style={{ opacity: ease(frame, s(T.cta + 0.55), s(0.5)) }}>
              <Logo height={150} color={brand.colors.white} animateAt={s(T.cta + 0.55)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: ease(frame, s(T.cta + 1.0), s(0.5)), transform: `translateY(${(1 - ease(frame, s(T.cta + 1.0), s(0.5))) * 20}px)` }}>
              <div style={{ fontWeight: 800, fontSize: 56, color: brand.colors.mint, letterSpacing: "-0.02em" }}>{copy.cta.url}</div>
              <div style={{ fontWeight: 400, fontSize: 32, color: brand.colors.gray }}>{copy.cta.sub}</div>
            </div>
          </div>
        </Camera>
      ) : null}

      {/* Últimos 10 frames: fundido a negro idéntico al frame 0 (loop perfecto) */}
      <AbsoluteFill style={{ backgroundColor: brand.colors.black, opacity: loopFade }} />

      {/* ---- Audio ---- */}
      <Html5Audio
        src={staticFile(music.file)}
        volume={(f) => music.volume * interpolate(f, [0, s(0.3), durationInFrames - s(1), durationInFrames - 1], [0, 1, 1, 0], clamp)}
      />
      {/* Un tick por día: más suave cuando el resaltado acelera */}
      {ticks.map((tk, i) => (
        <Sequence key={i} from={tk.frame} durationInFrames={s(0.4)} layout="none" name={`tick ${i + 2}`}>
          <Html5Audio src={staticFile("sfx/tick.mp3")} volume={mix(sfxVolume.tickMin, sfxVolume.tickMax, tk.gap / maxGap)} />
        </Sequence>
      ))}
      <Sequence from={s(T.runEnd)} durationInFrames={s(0.8)} layout="none" name="pop día">
        <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop} />
      </Sequence>
      <Sequence from={s(T.zoom)} durationInFrames={s(1.5)} layout="none" name="zoom">
        <Html5Audio src={staticFile("sfx/whoosh-soft.mp3")} volume={sfxVolume.whoosh} />
      </Sequence>
      <Sequence from={s(T.haptic)} durationInFrames={s(1)} layout="none" name="vibración">
        <Html5Audio src={staticFile("sfx/haptic.mp3")} volume={sfxVolume.haptic} />
      </Sequence>
      <Sequence from={s(T.notif)} durationInFrames={s(1.5)} layout="none" name="notificación">
        <Html5Audio src={staticFile("sfx/notification.mp3")} volume={sfxVolume.notification} />
      </Sequence>
      <Sequence from={s(T.sparkles)} durationInFrames={s(2)} layout="none" name="destellos">
        <Html5Audio src={staticFile("sfx/sparkle.mp3")} volume={sfxVolume.sparkle} />
      </Sequence>
      <Sequence from={s(T.tap)} durationInFrames={s(0.6)} layout="none" name="tap">
        <Html5Audio src={staticFile("sfx/tap.mp3")} volume={sfxVolume.tap} />
      </Sequence>
      {[T.product, T.badge].map((at, i) => (
        <Sequence key={i} from={s(at)} durationInFrames={s(0.8)} layout="none" name={`pop ${i + 1}`}>
          <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
