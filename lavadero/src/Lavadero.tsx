import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { art, music, palette, sfxVolume } from "./brand";
import { BrandBackground } from "./components/BrandBackground";
import { type BubbleState, Bubbles } from "./components/Bubbles";
import { Car } from "./components/Car";
import { FlyingStamp } from "./components/FlyingStamp";
import { KineticText } from "./components/KineticText";
import { Logo } from "./components/Logo";
import { RollNumber } from "./components/RollNumber";
import { Sparkle } from "./components/Sparkle";
import { SpinningBrush } from "./components/SpinningBrush";
import { WalletCard, cardGeom } from "./components/WalletCard";
import { WashTunnel } from "./components/WashTunnel";
import { WaterJets } from "./components/WaterJets";
import { copy } from "./copy";
import { font, tracking } from "./fonts";
import { type Format, type Layout, getLayout } from "./layout";
import { EASE_INOUT, SPRING_IN, clamp, ease, pop } from "./motion";
import { T, montageDurations, passes } from "./timeline";
import {
  CAR,
  STAGE,
  TUNNEL,
  brushTurns,
  carVelocity,
  carX,
  currentPass,
  dirtLevels,
  foamLevel,
  insideTunnel,
  sceneTime,
  suspension,
} from "./track";

const sec = (fps: number) => (x: number) => Math.round(x * fps);

/** Zoom suave hacia el túnel durante la cámara lenta. */
const zoomAt = (t: number) =>
  1 +
  0.12 *
    interpolate(t, [11.3, 12.6], [0, 1], { ...clamp, easing: EASE_INOUT }) -
  0.12 * interpolate(t, [13.5, 14.1], [0, 1], { ...clamp, easing: EASE_INOUT });
// el zoom crece hacia abajo desde el letrero, así no choca con el rótulo "Semana N"
const ZOOM_ORIGIN = { x: TUNNEL.x, y: TUNNEL.top - 60 };

/** Escenario → pantalla (para que la gota salga del túnel aunque la cámara haga zoom). */
const stageLeft = (L: Layout) => L.stage.cx - TUNNEL.x * L.stage.scale;
const stageToScreen = (L: Layout, t: number, x: number, y: number) => {
  const z = zoomAt(t);
  const S = L.stage.scale;
  return {
    x: stageLeft(L) + (ZOOM_ORIGIN.x + (x - ZOOM_ORIGIN.x) * z) * S,
    y: L.stage.top + (ZOOM_ORIGIN.y + (y - ZOOM_ORIGIN.y) * z) * S,
  };
};

/**
 * Escena del túnel: piso, reflejo, túnel, carro, cepillos, agua, burbujas y destellos.
 * Todo sale del frame (más `frameOffset`), así puede dibujarse dentro del motion blur.
 */
const Stage: React.FC<{ L: Layout; frameOffset?: number }> = ({
  L,
  frameOffset = 0,
}) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const s = sec(fps);
  const t = frame / fps;
  const tau = sceneTime(frame, fps);
  const G = STAGE.ground;

  const build = spring({
    frame: frame - s(T.tunnel),
    fps,
    config: { damping: 13, stiffness: 160 },
  });
  const brushesIn = pop(frame, fps, s(T.brushes));
  const jetsIn = ease(frame, s(T.jets), 20);

  const x = carX(t);
  const susp = suspension(frame, fps);
  const wheelAngle = (x / CAR.wheelR) * (180 / Math.PI);
  const inside = insideTunnel(t);
  const pass = currentPass(t);
  const vel = carVelocity(frame, fps);
  const angle = brushTurns(frame, fps) * 360;
  const bend = (bx: number) =>
    Math.max(0, 1 - Math.abs(x - bx) / 200) *
    Math.sign(vel) *
    Math.min(1, Math.abs(vel) / 6);
  const carVisible = t >= T.carIn && x > -200 && x < STAGE.w + 200;

  // Burbujas del lavado (usan el tiempo de escena: en la cámara lenta flotan lento)
  const wash: BubbleState[] = [];
  for (let i = 0; i < 230; i++) {
    const tb = 3.9 + i * 0.045;
    if (tb > t) break;
    if (insideTunnel(tb) < 0.6 || random(`k${i}`) > 0.8) continue;
    const age = tau - sceneTime(Math.round(tb * fps), fps);
    const life = 0.8 + random(`l${i}`) * 0.7;
    if (age < 0 || age > life + 0.12) continue;
    const x0 = TUNNEL.x + (random(`x${i}`) - 0.5) * 330;
    const y0 = G - 40 - random(`y${i}`) * 140;
    wash.push({
      x: x0 + 14 * Math.sin(age * 7 + i),
      y: y0 - age * (110 + random(`v${i}`) * 80),
      r: 7 + random(`r${i}`) * 16,
      pop: age > life ? (age - life) / 0.12 : -1,
    });
  }
  // Burbujas grandes frente a la cámara durante la cámara lenta
  const big: BubbleState[] = Array.from({ length: 9 }, (_, i) => {
    const t0 = 11.35 + i * 0.2;
    const life = 1.5 + random(`bl${i}`) * 0.5;
    const age = t - t0;
    if (age < 0 || age > life + 0.15) return { x: 0, y: 0, r: 0, pop: 1 };
    return {
      x: 120 + random(`bx${i}`) * 840 + 18 * Math.sin(age * 2 + i),
      y: G + 20 - age * (70 + random(`bv${i}`) * 40),
      r: 34 + random(`br${i}`) * 38,
      pop: age > life ? (age - life) / 0.15 : -1,
    };
  });

  const z = zoomAt(t);
  const shine = (t - pass.shine + 0.05) / 0.5;

  return (
    <div
      style={{
        position: "absolute",
        left: stageLeft(L),
        top: L.stage.top,
        width: STAGE.w,
        height: STAGE.h,
        transformOrigin: "0 0",
        transform: `scale(${L.stage.scale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${ZOOM_ORIGIN.x}px ${ZOOM_ORIGIN.y}px`,
          transform: `scale(${z})`,
        }}
      >
        {/* piso + reflejo del carro */}
        <div
          style={{
            position: "absolute",
            left: -400,
            width: STAGE.w + 800,
            top: G,
            height: 6,
            borderRadius: 3,
            background: art.floor,
          }}
        />
        {carVisible ? (
          <div
            style={{
              position: "absolute",
              left: x - CAR.w / 2,
              top: G + 6,
              width: CAR.w,
              height: 120,
              overflow: "hidden",
              opacity: 0.16,
              maskImage: "linear-gradient(to bottom, black, transparent 80%)",
            }}
          >
            {/* espejo respecto a la línea del piso */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: -152,
                transformOrigin: "150px 146px",
                transform: "scaleY(-1)",
              }}
            >
              <Car
                id="refl"
                wheelAngle={wheelAngle}
                dirt={dirtLevels(t)}
                foam={0}
                shine={-1}
              />
            </div>
          </div>
        ) : null}

        <WashTunnel ground={G} build={build} />

        {/* sombra + carro */}
        {carVisible ? (
          <>
            <div
              style={{
                position: "absolute",
                left: x - 130,
                top: G - 10,
                width: 260,
                height: 20,
                borderRadius: "50%",
                background: "rgba(10, 46, 34, 0.35)",
                filter: "blur(4px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x - CAR.w / 2,
                top: G - 146 + susp.y,
                transformOrigin: "150px 146px",
                transform: `rotate(${susp.rotate}deg)`,
              }}
            >
              <Car
                id="car"
                wheelAngle={wheelAngle}
                dirt={dirtLevels(t)}
                foam={foamLevel(t)}
                shine={shine}
                foamPhase={tau}
              />
            </div>
          </>
        ) : null}

        {/* agua, rodillo y cepillos laterales (delante del carro) */}
        {build > 0.5 ? (
          <>
            <WaterJets
              x={TUNNEL.x - 150}
              y={TUNNEL.top + 46}
              w={300}
              h={G - TUNNEL.top - 70}
              time={tau}
              on={jetsIn * (0.15 + 0.85 * inside)}
            />
            <div
              style={{
                position: "absolute",
                left: TUNNEL.x - 55,
                top: 150 + 30 * inside,
              }}
            >
              <SpinningBrush
                kind="roller"
                angle={angle}
                bend={bend(TUNNEL.x)}
                size={110}
                scale={brushesIn}
              />
            </div>
            {[TUNNEL.x - TUNNEL.half + 46, TUNNEL.x + TUNNEL.half - 46].map(
              (bx) => (
                <div
                  key={bx}
                  style={{
                    position: "absolute",
                    left: bx - 20,
                    top: TUNNEL.top + 58,
                  }}
                >
                  <SpinningBrush
                    kind="side"
                    angle={angle}
                    bend={bend(bx)}
                    size={40}
                    height={G - TUNNEL.top - 72}
                    scale={brushesIn}
                  />
                </div>
              ),
            )}
          </>
        ) : null}

        <Bubbles bubbles={wash} />
        {carVisible
          ? [
              { dx: -95, dy: -118, size: 46 },
              { dx: 45, dy: -136, size: 36 },
              { dx: 118, dy: -74, size: 42 },
              { dx: -20, dy: -58, size: 30 },
            ].map((sp, i) => (
              <Sparkle
                key={i}
                x={x + sp.dx}
                y={G + sp.dy}
                size={sp.size}
                k={(t - pass.shine - i * 0.07) / 0.55}
                color={i % 2 ? "#FFFFFF" : palette.accent}
              />
            ))
          : null}
        <Bubbles bubbles={big} />
      </div>
    </div>
  );
};

/** Burbujas que estallan alrededor de la tarjeta cuando se completa. */
const cardBurst = (
  t: number,
  cx: number,
  cy: number,
  w: number,
  h: number,
): BubbleState[] =>
  Array.from({ length: 18 }, (_, i) => {
    const t0 = T.prize + 0.04 + random(`ct${i}`) * 0.25;
    const life = 0.7 + random(`cl${i}`) * 0.6;
    const age = t - t0;
    if (age < 0 || age > life + 0.14) return { x: 0, y: 0, r: 0, pop: 1 };
    const a = (i / 18) * Math.PI * 2 + random(`ca${i}`) * 0.3;
    const out = 1 + 0.12 * Math.min(1, age * 4);
    return {
      x: cx + Math.cos(a) * (w / 2) * out + 10 * Math.sin(age * 6 + i),
      y: cy + Math.sin(a) * (h / 2) * out - age * (90 + random(`cv${i}`) * 70),
      r: 10 + random(`cr${i}`) * 18,
      pop: age > life ? (age - life) / 0.14 : -1,
    };
  });

export const Lavadero: React.FC<{ format: Format }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = sec(fps);
  const t = frame / fps;
  const L = getLayout(format);

  /* ---------- Tarjeta ---------- */
  const g = cardGeom(L.card.w);
  const cardLeft = L.card.cx - L.card.w / 2;
  const enter = spring({
    frame: frame - s(T.cardIn),
    fps,
    config: SPRING_IN,
    durationInFrames: s(1),
  });
  const arrivals = passes.map((p) => s(p.dropTo));
  const fill = arrivals.map((a) => pop(frame, fps, a));
  const ring = arrivals.map((a) => (frame - a) / s(0.45));
  const stamps = arrivals.reduce((acc, a) => acc + ease(frame, a, 10), 0);
  const prizeK = pop(frame, fps, s(T.prize) + 5);
  const punch =
    frame >= s(T.prize)
      ? 0.07 *
        (1 -
          spring({
            frame: frame - s(T.prize),
            fps,
            config: { damping: 12, stiffness: 220 },
          }))
      : 0;
  const introSheen = (t - (T.cardIn + 0.45)) / 0.7;
  const prizeSheen = (t - T.prize) / 0.6;
  const sheen = prizeSheen > 0 ? prizeSheen : introSheen;

  /* ---------- Rótulo "Semana N" ---------- */
  const weekV =
    1 + passes.slice(1).reduce((acc, p) => acc + ease(frame, s(p.start), 9), 0);
  const weekK =
    ease(frame, s(T.montage - 0.15), 14) * (1 - ease(frame, s(T.weekOut), 14));

  /* ---------- Salida de la escena y loop ---------- */
  const sceneOut = ease(frame, s(T.sceneOut), s(0.45));
  const loopFade = interpolate(
    frame,
    [durationInFrames - T.loopFadeFrames, durationInFrames - 1],
    [0, 1],
    clamp,
  );
  const urlIn = spring({ frame: frame - s(T.ctaUrl), fps, config: SPRING_IN });

  const montageEnd = T.montage + montageDurations.reduce((a, b) => a + b, 0);
  const blurFrom = s(T.montage);
  const blurTo = s(montageEnd);

  const caption = (text: string, from: number, to: number) => (
    <div
      style={{
        position: "absolute",
        left: L.caption.cx - L.caption.w / 2,
        width: L.caption.w,
        top: L.caption.y,
        transform: "translateY(-50%)",
      }}
    >
      <KineticText
        text={text}
        size={L.caption.size}
        color={palette.textPrimary}
        accent={palette.accent}
        delay={s(from)}
        exitAt={s(to)}
      />
    </div>
  );

  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <BrandBackground />

      {/* 0:00–0:02 · Hook */}
      {frame < s(T.hookOut + 0.6) ? (
        <div
          style={{
            position: "absolute",
            left: L.hook.cx - L.hook.w / 2,
            width: L.hook.w,
            top: L.hook.y,
            transform: "translateY(-50%)",
          }}
        >
          <KineticText
            text={copy.hook}
            size={L.hook.size}
            color={palette.textPrimary}
            accent={palette.accent}
            delay={s(T.hookIn)}
            exitAt={s(T.hookOut)}
          />
        </div>
      ) : null}

      {/* Escena + tarjeta (se desvanecen hacia el CTA) */}
      {frame >= s(T.cardIn) - 2 && sceneOut < 1 ? (
        <AbsoluteFill
          style={{
            opacity: 1 - sceneOut,
            filter: sceneOut > 0.01 ? `blur(${sceneOut * 10}px)` : undefined,
          }}
        >
          {frame >= blurFrom && frame < blurTo ? (
            <Sequence from={blurFrom} layout="none">
              <CameraMotionBlur shutterAngle={160} samples={6}>
                <Stage L={L} frameOffset={blurFrom} />
              </CameraMotionBlur>
            </Sequence>
          ) : (
            <Stage L={L} />
          )}

          {/* Tarjeta del Wallet */}
          <div
            style={{
              position: "absolute",
              left: cardLeft,
              top: L.card.top,
              transform: `translateY(${-(L.card.top + g.H + 80) * (1 - enter)}px) scale(${1 + punch})`,
            }}
          >
            <WalletCard
              w={L.card.w}
              stamps={stamps}
              fill={fill}
              ring={ring}
              visit={stamps}
              prize={prizeK}
              sheen={sheen}
              sheenStrength={prizeSheen > 0 ? 0.75 : 0.4}
            />
          </div>
          <Bubbles
            bubbles={cardBurst(
              t,
              L.card.cx,
              L.card.top + g.H / 2,
              L.card.w,
              g.H,
            )}
          />

          {/* Semana N */}
          {weekK > 0 ? (
            <div
              style={{
                position: "absolute",
                left: L.week.cx,
                top: L.week.y,
                transform: `translate(-50%, -50%) translateY(${(1 - weekK) * 14}px)`,
                opacity: weekK,
                display: "flex",
                alignItems: "center",
                gap: L.week.size * 0.3,
                padding: `${L.week.size * 0.3}px ${L.week.size * 0.7}px`,
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.14)",
                color: palette.textPrimary,
                fontSize: L.week.size,
                fontWeight: 800,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {copy.labels.week}
              <RollNumber
                value={weekV}
                lineHeight={L.week.size * 1.1}
                style={{ color: palette.accent, minWidth: "1.2em" }}
              />
            </div>
          ) : null}

          {/* Gotas que vuelan del túnel a la tarjeta */}
          {passes.map((p, k) => {
            if (t < p.dropFrom || t >= p.dropTo) return null;
            const from = stageToScreen(
              L,
              t,
              TUNNEL.x + TUNNEL.half - 30,
              TUNNEL.top + 70,
            );
            const c = g.centers[k];
            return (
              <FlyingStamp
                key={p.n}
                from={from}
                to={{ x: cardLeft + c.x, y: L.card.top + c.y }}
                p={interpolate(t, [p.dropFrom, p.dropTo], [0, 1], {
                  ...clamp,
                  easing: EASE_INOUT,
                })}
                size={L.vertical ? 70 : 62}
                endSize={g.d}
                lift={p.n === 10 ? 260 : 160}
              />
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* Textos */}
      {caption(copy.firstPass, T.text1, T.text1Out)}
      {caption(copy.montage, T.text2, T.text2Out)}
      {caption(copy.comeback, T.text3, T.text3Out)}

      {/* 0:15.5–0:18 · CTA */}
      {frame >= s(T.cta) - 2 ? (
        <div
          style={{
            position: "absolute",
            left: L.cta.cx - L.cta.w / 2,
            width: L.cta.w,
            top: L.cta.top,
            bottom: L.cta.bottom,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KineticText
            text={copy.cta.title}
            size={L.cta.title}
            color={palette.textPrimary}
            accent={palette.accent}
            delay={s(T.cta)}
          />
          <div style={{ height: L.cta.title * 0.5 }} />
          <Logo
            height={L.cta.logo}
            color={palette.textPrimary}
            animateAt={s(T.ctaLogo)}
          />
          <div style={{ height: L.cta.url * 0.6 }} />
          <div
            style={{
              fontSize: L.cta.url,
              fontWeight: 800,
              letterSpacing: tracking.title,
              color: palette.accent,
              padding: `${L.cta.url * 0.28}px ${L.cta.url * 0.7}px`,
              borderRadius: 999,
              border: `3px solid rgba(143, 227, 192, 0.55)`,
              background: "rgba(14, 68, 51, 0.55)",
              opacity: urlIn,
              transform: `translateY(${(1 - urlIn) * 20}px) scale(${0.98 + 0.02 * urlIn})`,
            }}
          >
            {copy.cta.url}
          </div>
          <div style={{ height: L.cta.url * 0.6 }} />
          <KineticText
            text={copy.cta.sub.split(" · ").join("\n")}
            size={L.cta.sub}
            weight={600}
            color={palette.textSecondary}
            delay={s(T.ctaSub)}
            lineHeight={1.3}
            stagger={2}
          />
        </div>
      ) : null}

      {/* Últimos 10 frames: fundido al fondo verde idéntico al frame 0 (loop perfecto) */}
      {loopFade > 0 ? <BrandBackground style={{ opacity: loopFade }} /> : null}

      {/* ---------- Audio ---------- */}
      <Html5Audio
        src={staticFile(music.file)}
        volume={(f) =>
          music.volume *
          interpolate(
            f,
            [
              0,
              s(music.fadeIn),
              durationInFrames - s(music.fadeOut),
              durationInFrames - 1,
            ],
            [0, 1, 1, 0],
            clamp,
          )
        }
      />
      <Sfx
        file="engine"
        at={s(T.carIn)}
        dur={s(1.6)}
        volume={sfxVolume.engine}
      />
      {passes.map((p) => {
        const isMontage = p.dur !== undefined;
        const from = isMontage ? p.start + p.dur! * 0.3 : p.washFrom - 0.2;
        const len = isMontage
          ? Math.max(0.16, p.dur! * 0.45)
          : p.washTo - p.washFrom + 0.45;
        return (
          <React.Fragment key={p.n}>
            <Sfx
              file="water"
              at={s(from)}
              dur={s(len)}
              volume={isMontage ? sfxVolume.waterMontage : sfxVolume.water}
              fadeOut={isMontage ? 4 : 12}
            />
            {!isMontage ? (
              <Sfx
                file="brush"
                at={s(from + 0.05)}
                dur={s(len)}
                volume={sfxVolume.brush}
                fadeOut={12}
              />
            ) : null}
            {!isMontage ? (
              <Sfx
                file="sparkle"
                at={s(p.shine)}
                dur={s(1.4)}
                volume={sfxVolume.sparkle}
              />
            ) : null}
            <Sfx
              file="drop"
              at={s(p.dropTo)}
              dur={s(0.6)}
              volume={sfxVolume.drop}
            />
          </React.Fragment>
        );
      })}
      {[5.25, 5.5, 12.45, 12.75, 13.62, 13.74, 13.9].map((at) => (
        <Sfx
          key={at}
          file="bubble-pop"
          at={s(at)}
          dur={s(0.4)}
          volume={sfxVolume.bubblePop}
        />
      ))}
      <Sfx
        file="unlock"
        at={s(T.prize)}
        dur={s(1.6)}
        volume={sfxVolume.unlock}
      />
      <Sfx
        file="reverse-beep"
        at={s(T.reverse)}
        dur={s(1.2)}
        volume={sfxVolume.reverseBeep}
      />
    </AbsoluteFill>
  );
};

/** Efecto en su <Sequence> al frame exacto, con fundido de salida opcional (en frames). */
const Sfx: React.FC<{
  file: string;
  at: number;
  dur: number;
  volume: number;
  fadeOut?: number;
}> = ({ file, at, dur, volume, fadeOut = 0 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none" name={file}>
    <Html5Audio
      src={staticFile(`sfx/${file}.mp3`)}
      volume={
        fadeOut
          ? (f) => volume * interpolate(f, [dur - fadeOut, dur], [1, 0], clamp)
          : volume
      }
    />
  </Sequence>
);
