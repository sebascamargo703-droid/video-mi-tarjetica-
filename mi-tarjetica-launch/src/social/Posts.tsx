import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, tones } from "../brand";
import { copy, social } from "../copy";
import { fonts, tracking } from "../fonts";
import { ActivityLog } from "../components/ActivityLog";
import { KineticText } from "../components/KineticText";
import { Logo, LogoMark } from "../components/Logo";
import { PaperCard } from "../components/PaperCard";
import { softShadow } from "../components/Stage";
import { WalletCard, prefilled } from "../components/WalletCard";
import { softSpring, useS } from "../lib/motion";
import { Place } from "../scenes/common";
import { BrandFooter, Fill, Pill, Reveal, inkTone } from "./kit";

/* Publicaciones de feed 1080×1350 (4:5). */

/** P1 · Manifiesto. */
export const PostManifesto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.brand;
  const m = softSpring(frame, fps, 0);
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="20% 30%">
      <div style={{ position: "absolute", right: -260, top: 140, opacity: 0.07 * m }}>
        <LogoMark height={620} color={brand.colors.white} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <KineticText
          text={social.posts.manifesto.title}
          size={150}
          lineHeight={0.98}
          align="left"
          color={t.fg}
          accent={t.accent}
          delay={s(0.1)}
          stagger={3}
        />
      </div>
      <BrandFooter color={brand.colors.white} urlColor={t.accent} at={s(1)} bottom={90} center={false} logoHeight={80} />
    </Fill>
  );
};

/** P2 · Producto. */
export const PostHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useS();
  const t = tones.cream;
  const c = social.posts.hero;
  const enter = softSpring(frame, fps, s(0.3));
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 62%">
      <Place top={130}>
        <KineticText text={c.title} size={80} color={t.fg} accent={t.accent} delay={s(0.05)} />
        <div style={{ height: 22 }} />
        <KineticText text={c.sub} size={32} weight={400} font="body" color={t.sub} stagger={2} delay={s(0.4)} />
      </Place>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: 210 }}>
        <div
          style={{
            transform: `perspective(2400px) translateY(${(1 - enter) * 200}px) rotateX(10deg) rotateY(-12deg) rotate(-3deg)`,
            opacity: enter,
          }}
        >
          <WalletCard width={880} stampTimes={prefilled(7)} sheenAt={s(1.2)} shadow={softShadow(1, 1.4)} />
        </div>
      </AbsoluteFill>
      <BrandFooter color={brand.colors.green} urlColor={t.sub} at={s(0.9)} bottom={70} center={false} logoHeight={64} />
    </Fill>
  );
};

/** P3 · Antes / Ahora. */
export const PostCompare: React.FC = () => {
  const s = useS();
  const c = social.posts.compare;
  const half = 675;
  const Label: React.FC<{ k: string; text: string; color: string; sub: string; at: number }> = ({
    k,
    text,
    color,
    sub,
    at,
  }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Reveal at={at} y={20}>
        <span
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: tracking.caps,
            textTransform: "uppercase",
            color: sub,
          }}
        >
          {k}
        </span>
      </Reveal>
      <KineticText text={text} size={64} color={color} align="left" delay={at + s(0.15)} style={{ maxWidth: 420 }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: fonts.body }}>
      <div style={{ position: "absolute", inset: 0, bottom: half, background: brand.colors.cream }}>
        <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
          <Label k={c.before} text={c.beforeText} color={brand.colors.ink} sub="#857B72" at={s(0.1)} />
        </div>
        <Reveal at={s(0.3)} style={{ position: "absolute", right: -70, top: 170 }}>
          <div style={{ transform: "rotate(8deg)", filter: "grayscale(0.3)", opacity: 0.9 }}>
            <PaperCard width={560} stamped={3} />
          </div>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: half,
          background: `linear-gradient(160deg, ${brand.colors.green}, ${brand.colors.greenDeep})`,
        }}
      >
        <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
          <Label k={c.after} text={c.afterText} color={brand.colors.white} sub={brand.colors.mint} at={s(0.9)} />
        </div>
        <Reveal at={s(1.1)} style={{ position: "absolute", right: -60, top: 150 }}>
          <div style={{ transform: "rotate(-6deg)" }}>
            <WalletCard width={560} stampTimes={prefilled(7)} sheenAt={s(1.8)} shadow={softShadow(1, 1.4, true)} />
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

/** P4 · Antifraude. */
export const PostFraud: React.FC = () => {
  const s = useS();
  const t = tones.dark;
  const c = social.posts.fraud;
  return (
    <Fill bg={t.bg} glow={t.glow} glowAt="50% 70%">
      <Place top={130}>
        <KineticText text={c.title} size={116} color={t.fg} accent={t.accent} delay={s(0.05)} />
        <div style={{ height: 26 }} />
        <KineticText text={c.sub} size={34} weight={400} font="body" color={t.sub} stagger={2} delay={s(0.35)} />
      </Place>
      <Place top={560}>
        <ActivityLog width={920} enterAt={s(0.5)} compact />
      </Place>
    </Fill>
  );
};

/** P5 · Rubros. */
export const PostBusiness: React.FC = () => {
  const s = useS();
  const t = tones.light;
  return (
    <Fill bg={t.bg} glow={t.glow}>
      <Place top={150}>
        <KineticText text={social.posts.business.title} size={96} color={t.fg} accent={t.accent} delay={s(0.05)} />
      </Place>
      <div
        style={{
          position: "absolute",
          top: 610,
          left: 70,
          right: 70,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {copy.business.types.map((b, i) => (
          <Reveal key={b} at={s(0.5) + i * 3} y={24}>
            <Pill
              label={b}
              size={44}
              bg={i % 3 === 0 ? brand.colors.green : brand.colors.grayLight}
              color={i % 3 === 0 ? brand.colors.white : brand.colors.black}
            />
          </Reveal>
        ))}
      </div>
      <BrandFooter color={brand.colors.green} urlColor={t.sub} at={s(1.2)} bottom={80} center={false} logoHeight={64} />
    </Fill>
  );
};

/** P6 · Precio / empieza gratis. */
export const PostPricing: React.FC = () => {
  const s = useS();
  const t = inkTone;
  const c = social.posts.pricing;
  return (
    <Fill bg={t.bg} glow="rgba(14,82,68,0.45)" glowAt="50% 40%">
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34, paddingBottom: 80 }}
      >
        <Reveal at={0}>
          <Logo height={110} color={t.fg} />
        </Reveal>
        <div style={{ height: 10 }} />
        <KineticText text={c.title} size={156} lineHeight={0.98} color={t.fg} accent={t.accent} delay={s(0.2)} />
        <KineticText text={c.sub} size={36} weight={400} font="body" color={t.sub} stagger={2} delay={s(0.55)} />
        <Reveal at={s(0.9)}>
          <Pill label={c.price} bg="rgba(246,242,234,0.08)" color={t.fg} size={34} border="rgba(246,242,234,0.18)" />
        </Reveal>
        <Reveal at={s(1.1)}>
          <Pill label={`${copy.cta.button}  →`} bg={brand.colors.cream} color={brand.colors.green} size={40} weight={800} />
        </Reveal>
      </AbsoluteFill>
      <Place top={1240}>
        <Reveal at={s(1.4)} y={10}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: tracking.caps,
              textTransform: "uppercase",
              color: t.sub,
            }}
          >
            {c.madeIn}
          </span>
        </Reveal>
      </Place>
    </Fill>
  );
};
