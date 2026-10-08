import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, tones } from "../brand";
import { social } from "../copy";
import { fonts, tracking } from "../fonts";
import { KineticText } from "../components/KineticText";
import { Logo, LogoMark } from "../components/Logo";
import { LockScreenNotification } from "../components/LockScreenNotification";
import { PaperCard } from "../components/PaperCard";
import { PhoneMockup } from "../components/PhoneMockup";
import { LockScreen, notificationOffsetY } from "../components/Screens";
import { softShadow } from "../components/Stage";
import { WalletCard, prefilled } from "../components/WalletCard";
import { clamp, softSpring, useS } from "../lib/motion";
import { Place } from "../scenes/common";
import { BrandFooter, CheckCircle, Fill, Pill, Reveal } from "./kit";

/*
 * Historias 1080×1920. Zona segura: el contenido importante vive entre
 * y≈250 y y≈1620 para no quedar debajo de la interfaz de Instagram/TikTok.
 */

/** H1 · ¿Todavía con tarjeta de papel? */
export const StoryPaper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const c = social.stories.paper;
  const t = tones.cream;
  const paperIn = softSpring(frame, fps, s(0.4));
  const fall = interpolate(frame, [s(2.6), s(3.5)], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const walletIn = softSpring(frame, fps, s(3.2));
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 60%">
      <Place top={270}>
        <Reveal at={0}>
          <Pill label={c.kicker} bg="rgba(27,22,19,0.07)" color={t.fg} size={28} />
        </Reveal>
        <div style={{ height: 36 }} />
        <KineticText text={c.title} size={104} color={t.fg} accent={t.accent} delay={s(0.15)} />
        <div style={{ height: 28 }} />
        <KineticText
          text={c.sub}
          size={36}
          weight={400}
          font="body"
          color={t.sub}
          stagger={2}
          delay={s(0.6)}
          style={{ maxWidth: 860 }}
        />
      </Place>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: 120 }}>
        <div
          style={{
            position: "absolute",
            transform: `translateY(${(1 - paperIn) * 120 + fall * 1700}px) rotate(${-5 + fall * 30}deg)`,
            opacity: paperIn * (1 - fall),
            boxShadow: softShadow(1, 0.9),
            borderRadius: 20,
          }}
        >
          <PaperCard width={780} stamped={4} />
        </div>
        <div
          style={{
            position: "absolute",
            transform: `perspective(2400px) translateY(${(1 - walletIn) * 900}px) rotateX(${(1 - walletIn) * 25}deg) rotate(-2deg)`,
          }}
        >
          <WalletCard width={860} stampTimes={prefilled(4)} sheenAt={s(3.9)} shadow={softShadow(1, 1.3)} />
        </div>
      </AbsoluteFill>
      <Place top={1470}>
        <KineticText text={c.after} size={84} color={t.fg} accent={t.accent} delay={s(3.6)} />
      </Place>
      <BrandFooter color={brand.colors.green} urlColor={t.sub} at={s(4)} bottom={170} logoHeight={64} />
    </Fill>
  );
};

/** H2 · Sin app. Sin papel. Sin trampa. */
export const StoryTrio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const c = social.stories.trio;
  const t = tones.brand;
  const mark = softSpring(frame, fps, 0);
  return (
    <Fill bg={t.bg} glow={t.glow}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: 0.06 * mark, transform: `scale(${0.9 + 0.1 * mark})` }}>
          <LogoMark height={560} color={brand.colors.white} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 8, paddingBottom: 120 }}
      >
        {c.lines.map((line, i) => (
          <KineticText
            key={line}
            text={line}
            size={170}
            color={t.fg}
            accent={t.accent}
            delay={s(0.15 + i * 0.55)}
          />
        ))}
        <div style={{ height: 40 }} />
        <KineticText
          text={c.sub}
          size={38}
          weight={400}
          font="body"
          color={t.sub}
          stagger={2}
          delay={s(2.0)}
          style={{ maxWidth: 820 }}
        />
      </AbsoluteFill>
      <BrandFooter color={brand.colors.white} urlColor={t.sub} at={s(2.4)} bottom={220} logoHeight={70} />
    </Fill>
  );
};

/** H3 · La notificación de cercanía. */
export const StoryNearby: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const c = social.stories.nearby;
  const t = tones.dark;
  const phoneW = 620;
  const enter = softSpring(frame, fps, s(0.2));
  const cy = 1420;
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 75%">
      <Place top={250}>
        <KineticText text={c.title} size={92} color={t.fg} accent={t.accent} delay={s(0.1)} />
        <div style={{ height: 28 }} />
        <KineticText
          text={c.sub}
          size={36}
          weight={400}
          font="body"
          color={t.sub}
          stagger={2}
          delay={s(0.6)}
          style={{ maxWidth: 820 }}
        />
      </Place>
      <div
        style={{
          position: "absolute",
          left: 540 - phoneW / 2,
          top: cy - phoneW * 1.03,
          transform: `translateY(${(1 - enter) * 700}px)`,
        }}
      >
        <PhoneMockup width={phoneW} shadow={softShadow(1, 1.2, true)}>
          <LockScreen phoneWidth={phoneW} notifyAt={s(1.3)} showNotification={false} />
        </PhoneMockup>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - (phoneW * 1.4) / 2,
          top: cy + notificationOffsetY(phoneW) - 10,
          transform: `translateY(${(1 - enter) * 700}px)`,
        }}
      >
        <LockScreenNotification width={phoneW * 1.4} enterAt={s(1.3)} />
      </div>
    </Fill>
  );
};

/** H4 · Cada visita, un sello. */
export const StoryStamps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const c = social.stories.stamps;
  const t = tones.dark;
  const enter = softSpring(frame, fps, s(0.1));
  const rot = interpolate(frame, [0, s(7)], [-10, 6], clamp);
  const stampTimes = [...prefilled(6).slice(0, 6), s(1.2), s(1.6), s(2.0), s(2.9)];
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 52%">
      <Place top={300}>
        <KineticText text={c.title} size={120} color={t.fg} accent={t.accent} delay={s(0.1)} />
      </Place>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: 40 }}>
        <div
          style={{
            transform: `perspective(2600px) translateY(${(1 - enter) * 160}px) rotateX(7deg) rotateY(${rot}deg) scale(${0.9 + 0.1 * enter})`,
            opacity: enter,
          }}
        >
          <WalletCard
            width={940}
            stampTimes={stampTimes}
            sheenAt={s(0.5)}
            rewardAt={s(3.15)}
            shadow={softShadow(1, 1.2, true)}
          />
        </div>
      </AbsoluteFill>
      <Place top={1340}>
        <KineticText
          text={c.sub}
          size={38}
          weight={400}
          font="body"
          color={t.sub}
          stagger={2}
          delay={s(3.3)}
          style={{ maxWidth: 820 }}
        />
      </Place>
      <BrandFooter color={brand.colors.white} urlColor={t.sub} at={s(3.6)} bottom={220} logoHeight={70} />
    </Fill>
  );
};

/** H5 · Plan gratis. */
export const StoryPricing: React.FC = () => {
  const s = useS();
  const c = social.stories.pricing;
  const t = tones.cream;
  return (
    <Fill bg={t.bg} glow={t.glow}>
      <Place top={330}>
        <Reveal at={0}>
          <Pill label={c.kicker} bg={brand.colors.green} color={brand.colors.white} size={30} />
        </Reveal>
        <div style={{ height: 44 }} />
        <KineticText text={c.title} size={130} color={t.fg} accent={t.accent} delay={s(0.15)} />
      </Place>
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 130,
          right: 130,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        {c.bullets.map((b, i) => (
          <Reveal key={b} at={s(0.9 + i * 0.25)} y={24}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <CheckCircle size={64} bg={brand.colors.green} color={brand.colors.white} />
              <span
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: 46,
                  color: t.fg,
                  letterSpacing: tracking.title,
                }}
              >
                {b}
              </span>
            </div>
          </Reveal>
        ))}
        <Reveal at={s(1.9)} y={24}>
          <div
            style={{
              marginTop: 30,
              paddingTop: 40,
              borderTop: `2px solid rgba(27,22,19,0.1)`,
              fontSize: 34,
              color: t.sub,
              fontWeight: 400,
            }}
          >
            {c.price}
          </div>
        </Reveal>
      </div>
      <Place top={1520}>
        <Reveal at={s(2.3)}>
          <Pill label={`${social.linkInBio}  ↑`} bg={brand.colors.ink} color={brand.colors.cream} size={34} />
        </Reveal>
      </Place>
    </Fill>
  );
};

/** H6 · Cierre con CTA. */
export const StoryCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const c = social.stories.cta;
  const t = tones.brand;
  const btn = softSpring(frame, fps, s(1.8));
  return (
    <Fill bg={t.bg} glow={t.glow}>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 70, paddingBottom: 60 }}
      >
        <Logo height={190} color={brand.colors.white} animateAt={0} />
        <KineticText text={c.title} size={128} lineHeight={0.98} color={t.fg} accent={t.accent} delay={s(0.8)} />
        <div
          style={{
            opacity: btn,
            transform: `translateY(${(1 - btn) * 50}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
          }}
        >
          <Pill label={`${c.button}  →`} bg={brand.colors.white} color={brand.colors.green} size={44} weight={800} />
          <div style={{ fontSize: 30, color: t.sub, fontWeight: 600, letterSpacing: tracking.body }}>
            {social.linkInBio}
          </div>
        </div>
      </AbsoluteFill>
    </Fill>
  );
};
