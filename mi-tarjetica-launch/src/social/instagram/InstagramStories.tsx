import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, tones } from "../../brand";
import { fonts, tracking } from "../../fonts";
import { ActivityLog } from "../../components/ActivityLog";
import { KineticText } from "../../components/KineticText";
import { Logo } from "../../components/Logo";
import { LockScreenNotification } from "../../components/LockScreenNotification";
import { PhoneMockup } from "../../components/PhoneMockup";
import { LockScreen, notificationOffsetY } from "../../components/Screens";
import { softShadow } from "../../components/Stage";
import { Stamp } from "../../components/Stamp";
import { WalletCard, prefilled } from "../../components/WalletCard";
import { EASE, clamp, ease, popSpring, softSpring, useS } from "../../lib/motion";
import { GeoRings } from "../../scenes/Product";
import { Place } from "../../scenes/common";
import { BrandFooter, CheckCircle, Fill, Pill, Reveal } from "../kit";
import { copyIG } from "./copy";
import { StoryAudio } from "./StoryAudio";

/*
 * Serie de 8 historias para Instagram (1080×1920, con voz).
 * Zonas libres para stickers nativos (encuesta, cuestionario, cuenta
 * regresiva, link): ver historias-y-publicaciones/historias-instagram/GUIA.md
 */

const Person: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="34" r="20" fill={color} />
    <path d="M14 96c0-22 16-36 36-36s36 14 36 36" fill={color} />
  </svg>
);

/** IG01 · Pregunta (con espacio para encuesta). */
export const IG01Pregunta: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useS();
  const t = tones.dark;
  const c = copyIG.pregunta;
  const lostAt = s(3.9);
  const lost = [1, 3, 4, 6, 8, 9];
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 45%">
      <Place top={270}>
        <Reveal at={0}>
          <Pill label={c.kicker} bg="rgba(255,255,255,0.08)" color={t.fg} size={28} />
        </Reveal>
        <div style={{ height: 34 }} />
        <KineticText text={c.title} size={104} color={t.fg} accent={t.accent} delay={s(0.15)} />
      </Place>
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 110,
          right: 110,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          rowGap: 26,
          justifyItems: "center",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const appear = ease(frame, s(0.5) + i * 2, s(0.6));
          const li = lost.indexOf(i);
          const gone = li >= 0 ? ease(frame, lostAt + li * s(0.22), s(0.6)) : 0;
          return (
            <div
              key={i}
              style={{
                opacity: appear * (1 - gone * 0.78),
                transform: `translateY(${(1 - appear) * 30 + gone * 18}px) scale(${1 - gone * 0.12})`,
              }}
            >
              <Person size={150} color={gone > 0.5 ? "#3A3A3C" : brand.colors.mint} />
            </div>
          );
        })}
      </div>
      <Place top={1240}>
        <KineticText
          text={c.sub}
          size={46}
          weight={600}
          font="body"
          color={t.sub}
          accent={t.fg}
          stagger={2}
          delay={s(4.3)}
          tracking="-0.01em"
          style={{ maxWidth: 900 }}
        />
      </Place>
      <StoryAudio id="IG01-Pregunta" musicFromSec={2} sfx={[]} />
    </Fill>
  );
};

/** IG02 · El recordatorio en la pantalla de bloqueo. */
export const IG02Recordatorio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.brand;
  const c = copyIG.recordatorio;
  const phoneW = 600;
  const cy = 1430;
  const enter = softSpring(frame, fps, s(0.2));
  const notifyAt = s(2.9);
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 75%">
      <div style={{ position: "absolute", left: 540, top: cy, transform: "translate(-50%,-50%)" }}>
        <GeoRings size={1500} color={brand.colors.mint} />
      </div>
      <Place top={270}>
        <KineticText text={c.title} size={108} color={t.fg} accent={t.accent} delay={s(0.15)} />
        <div style={{ height: 26 }} />
        <KineticText
          text={c.sub}
          size={40}
          weight={400}
          font="body"
          color={t.sub}
          stagger={2}
          delay={s(2.4)}
          tracking="-0.01em"
        />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 540 - phoneW / 2,
          top: cy - phoneW * 1.03,
          transform: `translateY(${(1 - enter) * 800}px)`,
        }}
      >
        <PhoneMockup width={phoneW} shadow={softShadow(1, 1.2, true)}>
          <LockScreen phoneWidth={phoneW} notifyAt={notifyAt} showNotification={false} />
        </PhoneMockup>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - (phoneW * 1.45) / 2,
          top: cy + notificationOffsetY(phoneW) - 10,
          transform: `translateY(${(1 - enter) * 800}px)`,
        }}
      >
        <LockScreenNotification width={phoneW * 1.45} enterAt={notifyAt} />
      </div>
      <StoryAudio
        id="IG02-Recordatorio"
        musicFromSec={8}
        sfx={[{ at: 2.9, file: "chime", volume: 0.5 }]}
      />
    </Fill>
  );
};

export const AddToWallet: React.FC = () => (
  <div
    style={{
      background: brand.colors.black,
      color: brand.colors.white,
      borderRadius: 18,
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: 26,
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: 34,
        height: 26,
        borderRadius: 6,
        background: `linear-gradient(180deg, ${brand.colors.mint} 0 33%, ${brand.colors.green} 33% 66%, #F2B33D 66%)`,
      }}
    />
    Agregar a Wallet
  </div>
);

/** IG03 · Cómo funciona en 3 pasos. */
export const IG03ComoFunciona: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.cream;
  const c = copyIG.comoFunciona;
  const stepAt = [s(1.6), s(5.35), s(7.7)];
  const visuals = [
    <AddToWallet key="w" />,
    <Stamp key="s" size={96} filledAt={stepAt[1] + s(0.5)} fill={brand.colors.green} ink={brand.colors.white} ring="rgba(27,22,19,0.3)" />,
    <div key="p" style={{ transform: `scale(${popSpring(frame, fps, stepAt[2] + s(0.6))})` }}>
      <Pill label="¡Premio!" bg={brand.colors.mint} color={brand.colors.greenDeep} size={32} weight={800} />
    </div>,
  ];
  return (
    <Fill bg={t.bg} glow={t.glow}>
      <Place top={290}>
        <Reveal at={0}>
          <Pill label={c.kicker} bg={brand.colors.green} color={brand.colors.white} size={28} />
        </Reveal>
        <div style={{ height: 34 }} />
        <KineticText text={c.title} size={100} color={t.fg} accent={t.accent} delay={s(0.15)} />
      </Place>
      <div style={{ position: "absolute", top: 730, left: 80, right: 80 }}>
        {c.steps.map((step, i) => {
          const p = ease(frame, stepAt[i], s(0.8));
          return (
            <div
              key={step.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 34,
                padding: "58px 0",
                borderTop: i === 0 ? undefined : "2px solid rgba(27,22,19,0.08)",
                opacity: 0.12 + 0.88 * p,
                transform: `translateY(${(1 - p) * 30}px)`,
                filter: p < 0.99 ? `blur(${(1 - p) * 6}px)` : undefined,
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: brand.colors.green,
                  color: brand.colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.display,
                  fontWeight: 800,
                  fontSize: 48,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 800,
                    fontSize: 56,
                    letterSpacing: tracking.title,
                    color: t.fg,
                  }}
                >
                  {step.title}
                </div>
                <div style={{ fontSize: 36, color: t.sub, marginTop: 6 }}>{step.sub}</div>
              </div>
              <div style={{ flexShrink: 0 }}>{visuals[i]}</div>
            </div>
          );
        })}
      </div>
      <BrandFooter color={brand.colors.green} urlColor={t.sub} at={s(8.5)} bottom={260} logoHeight={64} />
      <StoryAudio
        id="IG03-ComoFunciona"
        musicFromSec={14}
        sfx={[
          { at: 5.85, file: "stamp", volume: 0.8 },
          { at: 8.3, file: "reward", volume: 0.4 },
        ]}
      />
    </Fill>
  );
};

/** IG04 · Sellos que se llenan (satisfactorio). */
export const IG04Sellos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.dark;
  const c = copyIG.sellos;
  const times = Array.from({ length: 10 }, (_, i) => s(0.7) + Math.round(i * s(0.27)));
  const rewardAt = times[9] + s(0.25);
  const enter = softSpring(frame, fps, s(0.05));
  const rot = interpolate(frame, [0, s(7)], [-9, 7], { ...clamp, easing: EASE });
  const glow = ease(frame, rewardAt, s(0.8));
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 50%">
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(105,211,190,${0.25 * glow}) 0%, rgba(0,0,0,0) 45%)`,
        }}
      />
      <Place top={280}>
        <KineticText text={c.title} size={116} color={t.fg} accent={t.accent} delay={s(0.1)} />
      </Place>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: 30 }}>
        <div
          style={{
            transform: `perspective(2600px) translateY(${(1 - enter) * 150}px) rotateX(7deg) rotateY(${rot}deg) scale(${0.9 + 0.1 * enter})`,
            opacity: enter,
          }}
        >
          <WalletCard width={960} stampTimes={times} sheenAt={rewardAt} rewardAt={rewardAt} shadow={softShadow(1, 1.2, true)} />
        </div>
      </AbsoluteFill>
      <Place top={1330}>
        <KineticText
          text={c.sub}
          size={46}
          weight={600}
          font="body"
          color={t.sub}
          accent={t.fg}
          stagger={2}
          delay={s(3.0)}
          tracking="-0.01em"
        />
      </Place>
      <BrandFooter color={brand.colors.white} urlColor={t.sub} at={s(4)} bottom={260} logoHeight={60} />
      <StoryAudio
        id="IG04-Sellos"
        musicFromSec={20}
        sfx={[
          ...times.map((tt, i) => ({ at: tt / fps, file: "stamp", volume: 0.35 + i * 0.04 })),
          { at: rewardAt / fps, file: "reward", volume: 0.45 },
        ]}
      />
    </Fill>
  );
};

/** IG05 · Control y antifraude. */
export const IG05Control: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.dark;
  const c = copyIG.control;
  const pill = popSpring(frame, fps, s(5.0));
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 60%">
      <Place top={280}>
        <KineticText text={c.title} size={108} color={t.fg} accent={t.accent} delay={s(0.1)} />
        <div style={{ height: 24 }} />
        <KineticText
          text={c.sub}
          size={40}
          weight={400}
          font="body"
          color={t.sub}
          stagger={2}
          delay={s(2.3)}
          tracking="-0.01em"
        />
      </Place>
      <Place top={720}>
        <ActivityLog width={960} enterAt={s(2.4)} compact />
      </Place>
      <Place top={1430}>
        <div style={{ transform: `scale(${pill})` }}>
          <Pill label={c.badge} bg={brand.colors.mint} color={brand.colors.greenDeep} size={44} weight={800} />
        </div>
      </Place>
      <StoryAudio
        id="IG05-Control"
        musicFromSec={26}
        sfx={[0, 1, 2, 3].map((i) => ({ at: 3.0 + i * 0.22, file: "tap", volume: 0.3 }))}
      />
    </Fill>
  );
};

/** IG06 · Mito vs. realidad. */
export const IG06Mito: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.light;
  const c = copyIG.mito;
  const strike = ease(frame, s(3.3), s(0.6));
  const cardIn = softSpring(frame, fps, s(4.4));
  return (
    <Fill bg={t.bg} glow={t.glow}>
      <Place top={290}>
        <Reveal at={0}>
          <Pill label={c.mythLabel} bg={brand.colors.ink} color={brand.colors.cream} size={30} weight={800} />
        </Reveal>
        <div style={{ height: 30 }} />
        <div style={{ position: "relative", opacity: 1 - strike * 0.55 }}>
          <KineticText
            text={c.myth}
            size={70}
            weight={600}
            color={brand.colors.ink}
            delay={s(0.2)}
            style={{ maxWidth: 900 }}
          />
          <div
            style={{
              position: "absolute",
              left: "4%",
              top: "50%",
              height: 12,
              width: `${92 * strike}%`,
              borderRadius: 6,
              background: brand.colors.green,
              transform: "rotate(-4deg)",
            }}
          />
        </div>
      </Place>
      <Place top={790}>
        <Reveal at={s(3.6)}>
          <Pill label={c.realityLabel} bg={brand.colors.green} color={brand.colors.white} size={30} weight={800} />
        </Reveal>
        <div style={{ height: 26 }} />
        <KineticText text={c.reality} size={96} color={t.fg} accent={t.accent} delay={s(3.7)} />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1380,
          transform: `translate(-50%, -50%) perspective(2400px) translateY(${(1 - cardIn) * 600}px) rotateX(${(1 - cardIn) * 20 + 6}deg) rotate(-3deg)`,
          opacity: cardIn,
        }}
      >
        <WalletCard width={720} stampTimes={prefilled(5)} sheenAt={s(5.2)} shadow={softShadow(1, 1.3)} />
      </div>
      <StoryAudio id="IG06-Mito" musicFromSec={32} sfx={[{ at: 3.3, file: "whoosh", volume: 0.3 }]} />
    </Fill>
  );
};

/** IG07 · Plan gratis (con espacio para cuenta regresiva). */
export const IG07Gratis: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useS();
  const t = tones.brand;
  const c = copyIG.gratis;
  const n = Math.round(interpolate(frame, [s(0.4), s(1.8)], [0, 20], { ...clamp, easing: EASE }));
  const num = ease(frame, s(0.3), s(0.8));
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 35%">
      <Place top={280}>
        <Reveal at={0}>
          <Pill label={c.kicker} bg={brand.colors.cream} color={brand.colors.green} size={30} weight={800} />
        </Reveal>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 440,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: brand.colors.mint,
            fontVariantNumeric: "tabular-nums",
            marginTop: 30,
            opacity: num,
            transform: `translateY(${(1 - num) * 40}px)`,
          }}
        >
          {n}
        </div>
        <KineticText text={c.title} size={92} color={t.fg} accent={t.accent} delay={s(0.9)} />
      </Place>
      <div
        style={{
          position: "absolute",
          top: 1130,
          left: 150,
          right: 150,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {c.bullets.map((b, i) => (
          <Reveal key={b} at={s(3.0 + i * 0.9)} y={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <CheckCircle size={58} bg={brand.colors.mint} color={brand.colors.greenDeep} />
              <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 42, color: t.fg, letterSpacing: tracking.title }}>
                {b}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <StoryAudio id="IG07-Gratis" musicFromSec={6} />
    </Fill>
  );
};

/** IG08 · Cierre con espacio para el sticker de link. */
export const IG08Link: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.cream;
  const c = copyIG.link;
  const arrowIn = ease(frame, s(2.6), s(0.6));
  const bounce = Math.sin((frame / fps) * Math.PI * 2 * 1.1) * 14 * arrowIn;
  return (
    <Fill bg={t.bg} glow={t.glow}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Logo height={170} color={brand.colors.green} animateAt={0} />
        <div style={{ height: 70 }} />
        <KineticText text={c.title} size={112} color={t.fg} accent={t.accent} delay={s(0.6)} />
        <div style={{ height: 30 }} />
        <KineticText
          text={c.sub}
          size={42}
          weight={400}
          font="body"
          color={t.sub}
          stagger={2}
          delay={s(3.1)}
          tracking="-0.01em"
        />
      </AbsoluteFill>
      <Place top={1150}>
        <div style={{ opacity: arrowIn, transform: `translateY(${bounce}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 32, color: brand.colors.green, letterSpacing: tracking.caps, textTransform: "uppercase" }}>
            {c.tap}
          </span>
          <svg width="70" height="70" viewBox="0 0 24 24">
            <path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke={brand.colors.green} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Place>
      <StoryAudio id="IG08-Link" musicFromSec={36} sfx={[{ at: 0.45, file: "stamp", volume: 0.3 }, { at: 0.6, file: "stamp", volume: 0.35 }, { at: 0.75, file: "stamp", volume: 0.4 }]} />
    </Fill>
  );
};
