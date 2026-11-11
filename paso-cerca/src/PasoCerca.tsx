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
import { CameraMotionBlur } from "@remotion/motion-blur";
import { brand, music, sfxVolume } from "./brand";
import { copy, promo } from "./copy";
import { font } from "./fonts";
import { BusinessPin } from "./components/BusinessPin";
import { GeofenceRing } from "./components/GeofenceRing";
import { KineticText } from "./components/KineticText";
import { LockScreen } from "./components/LockScreen";
import { Logo } from "./components/Logo";
import { Michelada } from "./components/Michelada";
import { Notification, glassStyle } from "./components/Notification";
import { Phone } from "./components/Phone";
import { PromoBadge } from "./components/PromoBadge";
import { StreetMap } from "./components/StreetMap";
import { WalkingDot } from "./components/WalkingDot";
import { WalletCard, cardBackground } from "./components/WalletCard";
import {
  CARD_RECT,
  NOTIF_RECT,
  PATH,
  PHONE_POS,
  PHONE_W,
  PIN,
  RING_R,
  SAFE,
  SCREEN_INSET,
  crossing,
  project,
} from "./layout";
import { EASE, EASE_IN, EASE_INOUT, SPRING_POP, clamp, ease, mix, pop, springIn, useS } from "./motion";
import { T } from "./timeline";

/** Micro-zoom continuo de cámara (1 → 1.03). */
const Camera: React.FC<{ from: number; to: number; originY?: number; children: React.ReactNode }> = ({ from, to, originY = 900, children }) => {
  const frame = useCurrentFrame();
  const z = 1 + 0.03 * interpolate(frame, [from, to], [0, 1], { ...clamp, easing: EASE_INOUT });
  return <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${SAFE.centerX}px ${originY}px` }}>{children}</AbsoluteFill>;
};

/* ---------------- Escena del mapa ---------------- */
const pathLen = Math.hypot(PATH[1].x - PATH[0].x, PATH[1].y - PATH[0].y);
const walkSpeed = crossing.dist / (T.enter - T.walkStart); // unidades del plano por segundo (constante)
const posAt = (d: number) => {
  const c = Math.max(0, Math.min(pathLen, d));
  return { x: PATH[0].x + ((PATH[1].x - PATH[0].x) * c) / pathLen, y: PATH[0].y + ((PATH[1].y - PATH[0].y) * c) / pathLen };
};

/**
 * `frameOffset` permite dibujar la escena dentro de un <Sequence> (para el motion blur)
 * usando siempre el frame absoluto del video.
 */
const MapScene: React.FC<{ frameOffset?: number }> = ({ frameOffset = 0 }) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  const t = frame / fps;

  const appear = ease(frame, s(T.mapIn), s(0.9));
  // Caminata a velocidad constante (lo único lineal del video).
  const walked = walkSpeed * Math.max(0, t - T.walkStart);
  const pos = posAt(walked);
  const dot = project(pos.x, pos.y);
  const pin = project(PIN.x, PIN.y);
  const pinPop = frame >= s(T.mapIn + 0.35) ? spring({ frame: frame - s(T.mapIn + 0.35), fps, config: SPRING_POP }) : 0;

  // Estela punteada sobre el plano
  const trail: { x: number; y: number; o: number }[] = [];
  for (let d = 0; d < walked - 34; d += 30) {
    const p = posAt(d);
    trail.push({ ...p, o: 0.12 + 0.55 * (d / Math.max(1, walked)) });
  }

  // Zoom rápido hacia el punto que se funde con el celular
  const zIn = interpolate(frame, [s(T.zoom), s(T.zoom + T.zoomDur)], [0, 1], { ...clamp, easing: EASE_INOUT });
  const z = 1 + 8 * zIn;
  const center = { x: SAFE.centerX, y: 960 };
  const off = { x: (center.x - dot.x) * zIn, y: (center.y - dot.y) * zIn };
  const micro = 1 + 0.03 * interpolate(frame, [s(T.mapIn), s(T.zoom)], [0, 1], { ...clamp, easing: EASE_INOUT });

  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${off.x}px, ${off.y}px) translate(${dot.x}px, ${dot.y}px) scale(${z * micro}) translate(${-dot.x}px, ${-dot.y}px)`,
      }}
    >
      <StreetMap opacity={appear} lift={(1 - appear) * 80}>
        <GeofenceRing x={PIN.x} y={PIN.y} r={RING_R} appearAt={s(T.mapIn + 0.2)} enterAt={s(T.enter)} frameOffset={frameOffset} />
        {/* sombra del pin en el suelo */}
        <div style={{ position: "absolute", left: PIN.x - 40, top: PIN.y - 14, width: 80, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.55)", filter: "blur(6px)", opacity: appear }} />
        {trail.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x - 7, top: p.y - 7, width: 14, height: 14, borderRadius: "50%", background: brand.colors.white, opacity: p.o * appear }} />
        ))}
      </StreetMap>
      <BusinessPin x={pin.x} y={pin.y} k={pin.k} appear={ease(frame, s(T.mapIn + 0.5), s(0.6))} pop={pinPop} />
      <WalkingDot x={dot.x} y={dot.y} k={dot.k} opacity={ease(frame, s(T.walkStart), s(0.5))} />
    </AbsoluteFill>
  );
};

/* ---------------- Escena del celular ---------------- */
const TapCircle: React.FC<{ at: number; target: { x: number; y: number } }> = ({ at, target }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = ease(frame, at - Math.round(fps * 0.45), Math.round(fps * 0.4), EASE_INOUT);
  const press = interpolate(frame, [at - 6, at, at + 4, at + Math.round(fps * 0.25)], [0, 1, 1, 0], { ...clamp, easing: EASE_INOUT });
  const outP = ease(frame, at + Math.round(fps * 0.3), Math.round(fps * 0.35), EASE_IN);
  if (inP <= 0 || outP >= 1) return null;
  const start = { x: target.x + 180, y: target.y + 420 };
  const x = mix(start.x, target.x, inP) + outP * 120;
  const y = mix(start.y, target.y, inP) + outP * 260;
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
          background: `rgba(255,255,255,${0.3 + 0.25 * press})`,
          border: "3px solid rgba(255,255,255,0.9)",
          boxShadow: `0 ${18 - 12 * press}px ${40 - 24 * press}px rgba(0,0,0,0.45)`,
          transform: `scale(${1 - 0.16 * press})`,
          opacity: inP * (1 - outP),
        }}
      />
    </>
  );
};

const PhoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = frame / fps;

  const appear = ease(frame, s(T.phoneIn), s(0.55));
  // Vibración háptica: ±4 px, 3 ciclos rápidos.
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
  const screenOrigin = { x: PHONE_POS.x + SCREEN_INSET, y: PHONE_POS.y + SCREEN_INSET };
  const notifCenter = { x: screenOrigin.x + NOTIF_RECT.x + NOTIF_RECT.w / 2, y: screenOrigin.y + NOTIF_RECT.y + NOTIF_RECT.h / 2 };

  const drink = (at: number) => (frame >= s(at) ? spring({ frame: frame - s(at), fps, config: SPRING_POP }) : 0);
  const d1 = drink(T.drink1);
  const d2 = drink(T.drink2);
  const badge = pop(frame, fps, s(T.badge));
  const badgeRot = interpolate(frame, [s(T.badge), s(T.badge + 0.8)], [-28, -8], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill style={{ opacity: appear, filter: appear < 1 ? `blur(${(1 - appear) * 14}px)` : undefined, transform: `scale(${1.18 - 0.18 * appear})`, transformOrigin: `${SAFE.centerX}px 960px` }}>
      <div style={{ position: "absolute", left: 0, width: SAFE.right, top: SAFE.top + 16 }}>
        <KineticText text={copy.outside} size={52} color={brand.colors.white} accent={brand.colors.mint} delay={s(T.outsideText)} exitAt={s(T.tap - 0.4)} />
      </div>
      <div style={{ position: "absolute", left: PHONE_POS.x, top: PHONE_POS.y, transform: `translateX(${shake}px)` }}>
        <Phone width={PHONE_W} time={copy.lockTime} shadow="0 60px 140px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)">
          <LockScreen clockOpacity={1 - ease(frame, s(T.expand), s(0.3))}>
            {/* Atenúa el fondo cuando la notificación se vuelve tarjeta */}
            <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.5 * e})` }} />
            {/* Notificación → tarjeta del Wallet */}
            <div
              style={{
                position: "absolute",
                left: rect.x,
                top: rect.y,
                width: rect.w,
                height: rect.h,
                borderRadius: mix(40, 38, e),
                overflow: "hidden",
                ...glassStyle,
                transform: `translateY(${(1 - notifIn) * -460}px) scale(${0.94 + 0.06 * notifIn})`,
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
      <TapCircle at={s(T.tap)} target={notifCenter} />
      {/* Micheladas y badge 2x1 */}
      {promo.showDrinks ? (
        <>
          <div style={{ position: "absolute", left: 150, top: 1490, transformOrigin: "50% 100%", transform: `translateY(-100%) scale(${d1}) rotate(-6deg)` }}>
            <Michelada width={232} seed="m1" />
          </div>
          <div style={{ position: "absolute", left: 560, top: 1490, transformOrigin: "50% 100%", transform: `translateY(-100%) scale(${d2}) rotate(5deg)` }}>
            <Michelada width={232} seed="m2" />
          </div>
        </>
      ) : null}
      <div style={{ position: "absolute", left: 471, top: 1250, transform: `translate(-50%, -50%) scale(${badge}) rotate(${badgeRot}deg)` }}>
        <PromoBadge size={210} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Composición ---------------- */
export const PasoCerca: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = useS();

  const zoomStart = s(T.zoom);
  const zoomEnd = s(T.zoom + T.zoomDur);
  const mapFade = 1 - ease(frame, s(T.phoneIn), s(0.45));
  const phoneOut = ease(frame, s(T.phoneOut), s(0.3));
  const loopFade = interpolate(frame, [durationInFrames - T.loopFadeFrames, durationInFrames - 1], [0, 1], clamp);
  const glow = ease(frame, s(T.mapIn), s(0.8)) * (1 - ease(frame, s(T.phoneOut), s(0.3)));

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.black, fontFamily: font }}>
      <AbsoluteFill style={{ opacity: glow, background: `radial-gradient(ellipse at ${SAFE.centerX}px 1000px, rgba(14,82,68,0.35) 0%, rgba(10,10,10,0) 55%)` }} />

      {/* 0:00–0:02 · Gancho */}
      {frame < s(2.15) ? (
        <Camera from={0} to={s(2)}>
          <div style={{ position: "absolute", left: 40, right: 1080 - SAFE.right + 40, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 80 }}>
            <KineticText text={copy.hook} size={100} color={brand.colors.white} accent={brand.colors.mint} delay={s(0.08)} exitAt={s(T.hookExit)} />
          </div>
        </Camera>
      ) : null}

      {/* 0:02–0:08 · Mapa (con motion blur solo durante el zoom) */}
      {frame >= s(1.95) && mapFade > 0 ? (
        <AbsoluteFill style={{ opacity: mapFade }}>
          {frame >= zoomStart && frame < zoomEnd + 2 ? (
            <Sequence from={zoomStart} layout="none">
              <CameraMotionBlur shutterAngle={160} samples={8}>
                <MapScene frameOffset={zoomStart} />
              </CameraMotionBlur>
            </Sequence>
          ) : (
            <MapScene />
          )}
          {/* Texto superior */}
          <div style={{ position: "absolute", left: 0, width: SAFE.right, top: SAFE.top + 16 }}>
            <KineticText text={copy.mapTop} size={56} color={brand.colors.white} accent={brand.colors.mint} delay={s(T.mapTextIn)} exitAt={s(T.mapTextOut)} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 0:07–0:15 · Celular: notificación → tarjeta + promo */}
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
            <KineticText text={copy.cta.title} size={76} color={brand.colors.white} accent={brand.colors.mint} delay={s(T.cta + 0.1)} lineHeight={1.08} />
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
      <Sequence from={s(T.mapIn)} durationInFrames={s(T.phoneIn + 0.3 - T.mapIn)} layout="none" name="calle">
        <Html5Audio
          src={staticFile("sfx/street.mp3")}
          volume={(f) => sfxVolume.street * interpolate(f, [0, s(0.5), s(T.phoneIn - 0.4 - T.mapIn), s(T.phoneIn + 0.2 - T.mapIn)], [0, 1, 1, 0], clamp)}
        />
      </Sequence>
      <Sequence from={s(T.enter)} durationInFrames={s(2)} layout="none" name="geocerca">
        <Html5Audio src={staticFile("sfx/ring-pulse.mp3")} volume={sfxVolume.ringPulse} />
      </Sequence>
      <Sequence from={zoomStart} durationInFrames={s(1.5)} layout="none" name="zoom">
        <Html5Audio src={staticFile("sfx/whoosh-soft.mp3")} volume={sfxVolume.whoosh} />
      </Sequence>
      <Sequence from={s(T.haptic)} durationInFrames={s(1)} layout="none" name="vibración">
        <Html5Audio src={staticFile("sfx/haptic.mp3")} volume={sfxVolume.haptic} />
      </Sequence>
      <Sequence from={s(T.notif)} durationInFrames={s(1.5)} layout="none" name="notificación">
        <Html5Audio src={staticFile("sfx/notification.mp3")} volume={sfxVolume.notification} />
      </Sequence>
      <Sequence from={s(T.tap)} durationInFrames={s(0.6)} layout="none" name="tap">
        <Html5Audio src={staticFile("sfx/tap.mp3")} volume={sfxVolume.tap} />
      </Sequence>
      {[T.drink1, T.drink2, T.badge].map((at, i) => (
        <Sequence key={i} from={s(at)} durationInFrames={s(0.8)} layout="none" name={`pop ${i + 1}`}>
          <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
