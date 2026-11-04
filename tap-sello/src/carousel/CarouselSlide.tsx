import React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "../brand";
import { Slide, SlideTone, cardCopy, ctaCopy, swipeLabel } from "../carousels";
import { font, logoFont, tracking } from "../fonts";
import { LogoMark } from "../components/Logo";

/*
 * Láminas de carrusel 1080×1350. Grilla fija: márgenes de 96 px, logo arriba a la
 * izquierda, puntos de página abajo al centro. Cada tipo de lámina usa siempre
 * los mismos tamaños de texto (escala `TYPE`).
 */

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
const M = 96;
const CONTENT_TOP = 210;
const CONTENT_BOTTOM = SLIDE_H - M - 70;

const TYPE = {
  coverTitle: 124,
  coverSub: 40,
  pointNumber: 190,
  pointTitle: 88,
  pointText: 44,
  statContext: 64,
  statNote: 32,
  compareLabel: 28,
  compareText: 60,
  cardTitle: 88,
  ctaTitle: 84,
  ctaSub: 34,
} as const;

type Palette = { bg: string; fg: string; sub: string; accent: string; hairline: string; logo: string };
const palettes: Record<SlideTone, Palette> = {
  green: {
    bg: brand.colors.greenBg,
    fg: brand.colors.white,
    sub: brand.colors.subOnGreen,
    accent: brand.colors.mintOnGreen,
    hairline: "rgba(255,255,255,0.2)",
    logo: brand.colors.white,
  },
  dark: {
    bg: brand.colors.black,
    fg: brand.colors.white,
    sub: brand.colors.gray,
    accent: brand.colors.mint,
    hairline: "rgba(255,255,255,0.14)",
    logo: brand.colors.white,
  },
  light: {
    bg: brand.colors.white,
    fg: brand.colors.black,
    sub: brand.colors.grayOnLight,
    accent: brand.colors.green,
    hairline: "rgba(0,0,0,0.1)",
    logo: brand.colors.green,
  },
};

/** Texto estático con `*acento*` y saltos de línea. */
const Rich: React.FC<{
  text: string;
  size: number;
  color: string;
  accent: string;
  weight?: number;
  lineHeight?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ text, size, color, accent, weight = 800, lineHeight = 1.02, align = "left", style }) => {
  let on = false;
  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: size >= 56 ? tracking.headline : tracking.body,
        color,
        textAlign: align,
        ...style,
      }}
    >
      {text.split("\n").map((line, i) => (
        <div key={i}>
          {line.split(" ").map((raw, j, arr) => {
            let w = raw;
            if (w.startsWith("*")) {
              on = true;
              w = w.slice(1);
            }
            const isAccent = on;
            if (w.endsWith("*")) {
              on = false;
              w = w.slice(0, -1);
            }
            return (
              <span key={j} style={{ color: isAccent ? accent : undefined }}>
                {w}
                {j < arr.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Header: React.FC<{ p: Palette }> = ({ p }) => (
  <div style={{ position: "absolute", top: M, left: M, display: "flex", alignItems: "center", gap: 14 }}>
    <LogoMark height={30} color={p.logo} />
    <span style={{ fontFamily: logoFont, fontWeight: 700, fontSize: 32, color: p.logo, letterSpacing: "-0.01em" }}>Mi Tarjetica</span>
  </div>
);

const Dots: React.FC<{ p: Palette; index: number; total: number }> = ({ p, index, total }) => (
  <div
    style={{
      position: "absolute",
      bottom: M,
      left: 0,
      right: 0,
      height: 14,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 14,
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === index ? 40 : 12,
          height: 12,
          borderRadius: 99,
          background: i === index ? p.accent : p.fg,
          opacity: i === index ? 1 : 0.22,
        }}
      />
    ))}
  </div>
);

const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cross: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7 7l10 10M17 7L7 17" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
  </svg>
);

/** Mockup estático del pase de Wallet. */
const PassCard: React.FC<{ width: number }> = ({ width: w }) => {
  const h = w * 0.64;
  const pad = w * 0.06;
  const d = w * 0.1;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.055,
        position: "relative",
        overflow: "hidden",
        fontFamily: font,
        color: brand.colors.white,
        background: `linear-gradient(145deg, ${brand.colors.greenMid} 0%, ${brand.colors.green} 45%, ${brand.colors.greenDeep} 100%)`,
        boxShadow: "0 60px 120px rgba(0,0,0,0.35), 0 18px 40px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.12)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 10% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)" }} />
      <div style={{ position: "absolute", top: pad, left: pad, right: pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: w * 0.025 }}>
          <div style={{ width: w * 0.085, height: w * 0.085, borderRadius: w * 0.022, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={w * 0.05} height={w * 0.05} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round">
              <circle cx="6" cy="7" r="3" />
              <circle cx="6" cy="17" r="3" />
              <path d="M8.5 8.5L20 18M8.5 15.5L20 6" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: w * 0.048, letterSpacing: tracking.title }}>{cardCopy.business}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: w * 0.022, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.7 }}>SELLOS</div>
          <div style={{ fontSize: w * 0.058, fontWeight: 800 }}>
            {cardCopy.stamps}
            <span style={{ opacity: 0.55 }}>/{cardCopy.total}</span>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: h * 0.3,
          left: pad,
          right: pad,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          rowGap: w * 0.035,
          justifyItems: "center",
        }}
      >
        {Array.from({ length: cardCopy.total }).map((_, i) =>
          i < cardCopy.stamps ? (
            <div key={i} style={{ width: d, height: d, borderRadius: "50%", background: brand.colors.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              <Check size={d * 0.52} color={brand.colors.green} />
            </div>
          ) : (
            <div key={i} style={{ width: d, height: d, borderRadius: "50%", border: `${w * 0.004}px dashed rgba(255,255,255,0.4)` }} />
          ),
        )}
      </div>
      <div style={{ position: "absolute", left: pad, right: pad, bottom: pad * 0.85, display: "flex", gap: w * 0.08 }}>
        {[
          ["CLIENTE", cardCopy.customer],
          ["PREMIO", cardCopy.reward],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: w * 0.022, fontWeight: 600, letterSpacing: tracking.caps, opacity: 0.7 }}>{k}</div>
            <div style={{ fontSize: w * 0.04, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export type CarouselSlideProps = {
  slide: Slide;
  tone: SlideTone;
  index: number;
  total: number;
  /** Tamaño común de las cifras `stat` en este carrusel (para que todas midan igual). */
  statSize: number;
};

export const CarouselSlide: React.FC<CarouselSlideProps> = ({ slide, tone, index, total, statSize }) => {
  const p = palettes[tone];
  const rich = { color: p.fg, accent: p.accent };
  let content: React.ReactNode = null;
  let justify: "center" | "flex-start" = "center";
  let align: "flex-start" | "center" = "flex-start";

  switch (slide.type) {
    case "cover":
      content = (
        <>
          <Rich text={slide.title} size={coverSize(slide.title)} {...rich} lineHeight={1.0} />
          {slide.subtitle ? (
            <Rich text={slide.subtitle} size={TYPE.coverSub} weight={400} color={p.sub} accent={p.fg} lineHeight={1.3} style={{ marginTop: 40, maxWidth: 760 }} />
          ) : null}
        </>
      );
      break;
    case "point":
      content = (
        <>
          {slide.number ? (
            <div style={{ fontFamily: font, fontWeight: 800, fontSize: TYPE.pointNumber, lineHeight: 0.9, letterSpacing: "-0.05em", color: p.accent, marginBottom: 56, fontVariantNumeric: "tabular-nums" }}>
              {slide.number}
            </div>
          ) : null}
          <Rich text={slide.title} size={TYPE.pointTitle} {...rich} lineHeight={1.04} />
          <Rich text={slide.text} size={TYPE.pointText} weight={400} color={p.sub} accent={p.fg} lineHeight={1.35} style={{ marginTop: 36, maxWidth: 840 }} />
        </>
      );
      break;
    case "stat":
      content = (
        <>
          <div style={{ fontFamily: font, fontWeight: 800, fontSize: statSize, lineHeight: 0.92, letterSpacing: "-0.05em", color: p.accent, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            {slide.value}
          </div>
          <Rich text={slide.context} size={TYPE.statContext} {...rich} lineHeight={1.08} style={{ marginTop: 44, maxWidth: 860 }} />
          {slide.note ? (
            <div style={{ fontFamily: font, fontSize: TYPE.statNote, color: p.sub, marginTop: 32 }}>{slide.note}</div>
          ) : null}
        </>
      );
      break;
    case "compare": {
      const colW = (SLIDE_W - M * 2 - 64) / 2;
      const col = (kind: "before" | "after") => {
        const before = kind === "before";
        return (
          <div style={{ width: colW }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: before ? "transparent" : p.accent,
                border: before ? `3px solid ${p.hairline}` : undefined,
                marginBottom: 36,
              }}
            >
              {before ? <Cross size={36} color={p.sub} /> : <Check size={40} color={p.bg} />}
            </div>
            <div style={{ fontFamily: font, fontSize: TYPE.compareLabel, fontWeight: 600, letterSpacing: tracking.caps, textTransform: "uppercase", color: before ? p.sub : p.accent, marginBottom: 20 }}>
              {before ? "Antes" : "Con Mi Tarjetica"}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: TYPE.compareText,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: tracking.headline,
                color: before ? p.sub : p.accent,
                textDecoration: before ? "line-through" : undefined,
                textDecorationThickness: before ? 4 : undefined,
                textDecorationColor: before ? (tone === "light" ? "rgba(110,110,115,0.7)" : tone === "green" ? "rgba(201,233,225,0.6)" : "rgba(134,134,139,0.7)") : undefined,
              }}
            >
              {before ? slide.before : slide.after}
            </div>
          </div>
        );
      };
      content = (
        <div style={{ display: "flex", gap: 64, alignItems: "stretch" }}>
          {col("before")}
          <div style={{ width: 2, background: p.hairline, margin: "0 -33px" }} />
          {col("after")}
        </div>
      );
      break;
    }
    case "card":
      justify = "flex-start";
      content = (
        <>
          <Rich text={slide.title} size={TYPE.cardTitle} {...rich} lineHeight={1.04} />
          <div style={{ marginTop: 110, alignSelf: "center", transform: "perspective(2400px) rotateX(10deg) rotateY(-12deg) rotate(-4deg)" }}>
            <PassCard width={780} />
          </div>
        </>
      );
      break;
    case "cta":
      align = "center";
      content = (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 80 }}>
            <LogoMark height={84} color={p.logo} />
            <div style={{ fontFamily: logoFont, color: p.logo, display: "flex", flexDirection: "column" }}>
              <span style={{ fontStyle: "italic", fontWeight: 600, fontSize: 42, lineHeight: 1, marginBottom: -4 }}>Mi</span>
              <span style={{ fontWeight: 700, fontSize: 90, lineHeight: 1, letterSpacing: "-0.01em" }}>Tarjetica</span>
            </div>
          </div>
          <Rich text={ctaCopy.title} size={TYPE.ctaTitle} {...rich} lineHeight={1.08} align="center" />
          <div style={{ fontFamily: font, fontSize: TYPE.ctaSub, color: p.sub, marginTop: 40, textAlign: "center" }}>{ctaCopy.sub}</div>
        </>
      );
      break;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: p.bg }}>
      <Header p={p} />
      <div
        style={{
          position: "absolute",
          left: M,
          right: M,
          top: CONTENT_TOP,
          bottom: SLIDE_H - CONTENT_BOTTOM,
          display: "flex",
          flexDirection: "column",
          justifyContent: justify,
          alignItems: align,
        }}
      >
        {content}
      </div>
      <Dots p={p} index={index} total={total} />
      {slide.type === "cover" ? (
        <div
          style={{
            position: "absolute",
            right: M,
            bottom: M - 10,
            fontFamily: font,
            fontWeight: 600,
            fontSize: 28,
            color: p.sub,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {swipeLabel}
          <span style={{ fontSize: 32 }}>→</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * Titular de portada: 124 px como máximo, y más pequeño si la línea más larga
 * no cabe en 888 px (así nunca pasa de las líneas que escribiste).
 */
const coverSize = (title: string) => {
  const longest = Math.max(...title.split("\n").map((l) => l.replace(/\*/g, "").length));
  return Math.min(TYPE.coverTitle, Math.floor((SLIDE_W - M * 2) / (longest * 0.6)));
};

/** Tamaño de cifra común para todas las láminas `stat` de un carrusel (cabe en 888 px). */
export const statSizeFor = (slides: Slide[]) => {
  const longest = Math.max(1, ...slides.map((s) => (s.type === "stat" ? s.value.length : 0)));
  return Math.min(240, Math.floor((SLIDE_W - M * 2) / (longest * 0.6)));
};
