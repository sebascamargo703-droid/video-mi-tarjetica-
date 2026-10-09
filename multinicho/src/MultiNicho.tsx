import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { fade, music, palette, sfxVolume } from "./brand";
import { getCardState } from "./cardState";
import { BrandBackground } from "./components/BrandBackground";
import { CategoryLabel } from "./components/CategoryLabel";
import { KineticText } from "./components/KineticText";
import { Logo } from "./components/Logo";
import { WalletCard } from "./components/WalletCard";
import { copy } from "./copy";
import { font, tracking } from "./fonts";
import { EASE_IN, clamp, ease, useBeat } from "./motion";
import { B, card, colorCycle } from "./timeline";

export type Format = "vertical" | "feed";

/**
 * Diseño por formato (no es un recorte: cada formato reubica y escala los bloques).
 * Vertical 1080×1920 respeta las zonas seguras de Reels/TikTok: 250 arriba, 420 abajo, 120 a la derecha.
 */
const LAYOUT = {
  vertical: {
    cx: 480, // centro del área segura (0 → 960)
    textW: 880,
    cardW: 860,
    cardY: 930,
    labelY: 430,
    labelMax: 128,
    kicker: 36,
    phraseY: 1340,
    phraseSize: 112,
    hookY: 875,
    hookSize: 112,
    cta: { top: 250, bottom: 420, logo: 170, title: 120, url: 56, sub: 40 },
  },
  feed: {
    cx: 540,
    textW: 980,
    cardW: 840,
    cardY: 720,
    labelY: 235,
    labelMax: 120,
    kicker: 32,
    phraseY: 1172,
    phraseSize: 100,
    hookY: 675,
    hookSize: 116,
    cta: { top: 0, bottom: 0, logo: 150, title: 112, url: 52, sub: 38 },
  },
} as const;
type Layout = (typeof LAYOUT)[Format];

/** Halo de color del nicho + categoría + tarjeta. `frameOffset` = dibujar dentro de un <Sequence> (motion blur). */
const CardScene: React.FC<{ L: Layout; frameOffset?: number }> = ({ L, frameOffset = 0 }) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const beat = useBeat();
  const s = getCardState(frame, fps);
  const H = L.cardW * 0.7;

  // Entrada (sube con spring, aterriza en el beat 4) y salida antes del CTA
  const inAt = beat(B.cardIn) - 10;
  if (frame < inAt) return null;
  const enter = spring({ frame: frame - inAt, fps, config: { damping: 15, stiffness: 140 } });
  const out = ease(frame, beat(B.cardOut), 14, EASE_IN);
  if (out >= 1) return null;

  // Aterrizaje: temblor corto + anillo que se expande
  const dl = frame - beat(B.land);
  const shake = dl >= 0 && dl < 24 ? Math.exp(-dl / 5) : 0;
  const sx = Math.sin(dl * 2.1) * 14 * shake;
  const sy = Math.cos(dl * 1.7) * 10 * shake;
  const ring = dl >= 0 && dl < 26 ? ease(frame, beat(B.land), 26) : -1;

  // Categoría: se apaga en el silencio y vuelve en menta con "Tu negocio"
  const dropDim = frame >= beat(B.drop) && frame < beat(B.land) ? 1 - 0.75 * ease(frame, beat(B.drop) + 4, 12) : 1;
  const labelColor = interpolateColors(frame, [beat(B.land), beat(B.land) + 8], [palette.textPrimary, palette.accent]);
  const labelIn = ease(frame, inAt + 4, 24);
  const float = Math.sin((frame / fps) * 1.5) * 1.6;

  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 10}px)` : undefined }}>
      {/* halo del color del nicho (máx. 25 %) */}
      <div
        style={{
          position: "absolute",
          left: L.cx - L.cardW,
          top: L.cardY - L.cardW,
          width: L.cardW * 2,
          height: L.cardW * 2,
          background: `radial-gradient(circle, ${s.glowColor} 0%, ${fade(s.glowColor, 0)} 62%)`,
          opacity: s.glowOpacity * enter,
        }}
      />
      {/* categoría */}
      <div
        style={{
          position: "absolute",
          left: L.cx - L.textW / 2,
          width: L.textW,
          top: L.labelY,
          transform: `translateY(-50%) translateY(${(1 - labelIn) * 30 - out * 40}px)`,
          opacity: labelIn,
          filter: labelIn < 1 ? `blur(${(1 - labelIn) * 8}px)` : undefined,
        }}
      >
        <CategoryLabel
          kicker={copy.kicker}
          text={s.cur.categoria}
          prev={s.prevNiche ? s.from.categoria : null}
          p={s.p}
          maxWidth={L.textW}
          maxSize={L.labelMax}
          kickerSize={L.kicker}
          color={labelColor}
          opacity={dropDim}
        />
      </div>
      {/* tarjeta */}
      <div style={{ position: "absolute", inset: 0, perspective: 2000, perspectiveOrigin: `${L.cx}px ${L.cardY}px` }}>
        {ring >= 0 ? (
          <div
            style={{
              position: "absolute",
              left: L.cx - L.cardW / 2,
              top: L.cardY - H / 2,
              width: L.cardW,
              height: H,
              borderRadius: L.cardW * 0.06,
              border: `4px solid ${palette.accent}`,
              transform: `scale(${1 + ring * 0.35})`,
              opacity: (1 - ring) * 0.9,
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: L.cx - L.cardW / 2,
            top: L.cardY - H / 2,
            transform: [
              `translate(${sx}px, ${sy + (1 - enter) * 700 - out * 120}px)`,
              `scale(${s.scale * (0.85 + 0.15 * enter) * (1 - 0.15 * out)})`,
              `rotateY(${s.rotY}deg)`,
              `rotateX(${float}deg)`,
            ].join(" "),
            opacity: Math.min(1, enter * 3),
          }}
        >
          <WalletCard s={s} w={L.cardW} frame={frame} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MultiNicho: React.FC<{ format: Format }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const beat = useBeat();
  const L = LAYOUT[format];
  const blurFrom = beat(B.blurFrom);
  const blurTo = beat(B.blurTo);

  const ctaAt = beat(B.cta);
  const urlIn = spring({ frame: frame - beat(B.cta + 1.5), fps, config: { damping: 16, stiffness: 160 } });
  const urlPulse = [32, 33, 34, 35].reduce((acc, b) => (frame >= beat(b) ? 0.035 * Math.exp(-(frame - beat(b)) / 5) : acc), 0);
  const loopFade = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [0, 1], clamp);

  // Efectos: todos colocados con beat(n)
  const swipes = card.slice(1, -1).map((c) => c.beat);
  const pops = [...Array.from({ length: colorCycle.niches.length + 1 }, (_, j) => B.colors + j * colorCycle.step), B.reward];
  const sparkles = [B.cardIn, B.logo, B.cta + 1.5];
  const logoDots = [18, 26, 34].map((d) => ctaAt + 4 + d);

  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <BrandBackground />

      {/* 0–2 s · Gancho */}
      {frame < beat(B.cardIn) ? (
        <div style={{ position: "absolute", left: L.cx - L.textW / 2, width: L.textW, top: L.hookY, transform: "translateY(-50%)" }}>
          <KineticText text={copy.hook} size={L.hookSize} color={palette.textPrimary} accent={palette.accent} delay={4} exitAt={beat(B.hookExit)} />
        </div>
      ) : null}

      {/* 2–15 s · La tarjeta (con motion blur solo en el repaso ultrarrápido) */}
      {frame >= blurFrom && frame < blurTo ? (
        <Sequence from={blurFrom} layout="none">
          <CameraMotionBlur shutterAngle={180} samples={8}>
            <CardScene L={L} frameOffset={blurFrom} />
          </CameraMotionBlur>
        </Sequence>
      ) : (
        <CardScene L={L} />
      )}

      {/* 12–15 s · Tu logo. Tus colores. Tu premio. */}
      {frame >= beat(B.logo) - 2 && frame < ctaAt ? (
        <div style={{ position: "absolute", left: L.cx - L.textW / 2, width: L.textW, top: L.phraseY, transform: "translateY(-50%)", display: "grid" }}>
          {copy.personalize.map((t, k) => {
            const from = [B.logo, B.colors, B.reward][k];
            const to = [B.colors, B.reward, B.cardOut][k];
            return (
              <div key={k} style={{ gridArea: "1 / 1" }}>
                <KineticText text={t} size={L.phraseSize} color={palette.textPrimary} accent={palette.accent} delay={beat(from)} exitAt={k < 2 ? beat(to) - 24 : beat(to)} stagger={4} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 15–18 s · CTA */}
      {frame >= ctaAt - 2 ? (
        <div
          style={{
            position: "absolute",
            left: L.cx - L.textW / 2,
            width: L.textW,
            top: L.cta.top,
            bottom: L.cta.bottom,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Logo height={L.cta.logo} color={palette.textPrimary} animateAt={ctaAt + 4} />
          <div style={{ height: L.cta.title * 0.55 }} />
          <KineticText text={copy.cta.title} size={L.cta.title} color={palette.textPrimary} accent={palette.accent} delay={beat(B.cta + 0.5)} />
          <div style={{ height: L.cta.title * 0.45 }} />
          <div
            style={{
              fontSize: L.cta.url,
              fontWeight: 800,
              letterSpacing: tracking.title,
              color: palette.accent,
              padding: `${L.cta.url * 0.3}px ${L.cta.url * 0.7}px`,
              borderRadius: 999,
              border: `3px solid ${fade(palette.accent, 0.55)}`,
              background: fade(palette.bgDeep, 0.55),
              transform: `scale(${(0.8 + 0.2 * urlIn) * (1 + urlPulse)})`,
              opacity: Math.min(1, urlIn * 2),
            }}
          >
            {copy.cta.url}
          </div>
          <div style={{ height: L.cta.url * 0.7 }} />
          <KineticText text={copy.cta.sub.split(" · ").join("\n")} size={L.cta.sub} weight={600} color={palette.textSecondary} delay={beat(B.cta + 2)} lineHeight={1.3} stagger={2} />
        </div>
      ) : null}

      {/* Últimos 10 frames: fundido al fondo verde, idéntico al frame 0 (loop perfecto) */}
      {loopFade > 0 ? <BrandBackground style={{ opacity: loopFade }} /> : null}

      {/* ---------- Audio ---------- */}
      <Html5Audio
        src={staticFile(music.file)}
        volume={(f) => music.volume * interpolate(f, [0, 4, durationInFrames - Math.round(fps * 0.6), durationInFrames - 1], [0, 1, 1, 0], clamp)}
      />
      {swipes.map((b) => (
        <Sequence key={`sw${b}`} from={beat(b) - 3} durationInFrames={Math.round(fps * 0.5)} layout="none" name={`swipe ${b}`}>
          <Html5Audio src={staticFile("sfx/swipe.mp3")} volume={sfxVolume.swipe} />
        </Sequence>
      ))}
      <Sequence from={beat(B.riserFrom)} durationInFrames={beat(B.drop) - beat(B.riserFrom)} layout="none" name="riser">
        <Html5Audio src={staticFile("sfx/riser.mp3")} volume={sfxVolume.riser} />
      </Sequence>
      <Sequence from={beat(B.land)} durationInFrames={Math.round(fps * 2)} layout="none" name="impacto">
        <Html5Audio src={staticFile("sfx/impact.mp3")} volume={sfxVolume.impact} />
      </Sequence>
      {sparkles.map((b) => (
        <Sequence key={`sp${b}`} from={beat(b)} durationInFrames={Math.round(fps * 1.6)} layout="none" name={`sparkle ${b}`}>
          <Html5Audio src={staticFile("sfx/sparkle.mp3")} volume={sfxVolume.sparkle} />
        </Sequence>
      ))}
      {pops.map((b) => (
        <Sequence key={`po${b}`} from={beat(b)} durationInFrames={Math.round(fps * 0.4)} layout="none" name={`pop ${b}`}>
          <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop * 0.8} />
        </Sequence>
      ))}
      {logoDots.map((f, k) => (
        <Sequence key={`ld${k}`} from={f} durationInFrames={Math.round(fps * 0.4)} layout="none" name={`pop logo ${k + 1}`}>
          <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop * 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
