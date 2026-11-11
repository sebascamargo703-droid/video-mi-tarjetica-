import React from "react";
import { AbsoluteFill } from "remotion";
import { type Bg, lightA, onBg, palette, story } from "../brand";
import { BrandLogo } from "../components/BrandLogo";
import { Arrow, Check, PriceTag } from "../components/Icons";
import { PlanCard } from "../components/PlanCard";
import { Headline } from "../components/StoryFrame";
import { display, sans } from "../fonts";
import { type Plan, copy, cop, paidPlans, plan } from "../pricing";

const tabular: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };
const W = story.w - 2 * story.m;

/** Historia 1 · portada de la serie. */
export const CoverStory: React.FC = () => (
  <>
    <PriceTag size={380} color={palette.onGreenAccent} strokeWidth={5} style={{ position: "absolute", right: -40, top: 360, opacity: 0.16, transform: "rotate(-12deg)" }} />
    <Headline bg="green" text={copy.cover.title} size={106} top={660} />
    <div style={{ position: "absolute", left: story.m, right: story.m, top: 940, fontSize: 62, fontWeight: 600, color: palette.onGreenAccent, letterSpacing: "-0.01em", ...tabular }}>{copy.cover.from}</div>
    <div style={{ position: "absolute", left: story.m, right: story.m, top: 1034, fontSize: 44, color: palette.onGreenSecondary, lineHeight: 1.3 }}>{copy.cover.free}</div>
    <div style={{ position: "absolute", left: story.m, top: 1470, fontSize: 32, fontWeight: 600, color: palette.onGreenSecondary }}>{copy.cover.tap}</div>
  </>
);

/** Historias 2–5 · una tarjeta de plan centrada y una línea debajo. */
export const PlanStory: React.FC<{ bg: Bg; p: Plan; below: string; highlight?: boolean }> = ({ bg, p, below, highlight }) => (
  <div style={{ position: "absolute", left: story.m, right: story.m, top: story.safeTop + 120, bottom: 1920 - story.safeBottom + 20, display: "flex", flexDirection: "column", justifyContent: "center", gap: 60 }}>
    <PlanCard plan={p} w={W} highlight={highlight} />
    <div style={{ fontSize: 36, lineHeight: 1.35, color: onBg(bg).secondary, textAlign: "center", padding: "0 20px", textWrap: "balance", ...tabular }}>{below}</div>
  </div>
);

/** Historia 6 · mensual vs. anual. */
export const YearlyStory: React.FC = () => {
  const colX = [0, 400];
  return (
    <>
      <Headline bg="light" text={copy.yearly.title} size={86} top={420} weight={400} style={{ right: 140 }} />
      <div style={{ position: "absolute", left: story.m, right: story.m, top: 690, fontFamily: sans }}>
        <div style={{ position: "relative", height: 40, marginBottom: 18 }}>
          {[copy.yearly.monthly, copy.yearly.annual].map((h, i) => (
            <span key={h} style={{ position: "absolute", left: 40 + colX[i], fontSize: 28, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: palette.inkSecondary }}>
              {h}
            </span>
          ))}
        </div>
        {paidPlans.map((pl) => (
          <div key={pl.id} style={{ position: "relative", borderRadius: 36, background: palette.latte, padding: "34px 40px 38px", marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ ...display, fontWeight: 600, fontSize: 50, color: palette.ink, lineHeight: 1 }}>{pl.name}</span>
              <span style={{ fontSize: 26, fontWeight: 600, background: palette.caramel, color: palette.ink, padding: "9px 18px", borderRadius: 999, ...tabular }}>{copy.yearly.save(pl)}</span>
            </div>
            <div style={{ position: "relative", height: 70, marginTop: 22, color: palette.brand }}>
              {[
                [cop(pl.monthly), copy.perMonth],
                [cop(pl.yearly ?? 0), copy.perYear],
              ].map(([v, unit], i) => (
                <span key={unit} style={{ position: "absolute", left: colX[i], bottom: 0, display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 58, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, ...tabular }}>{v}</span>
                  <span style={{ fontSize: 28, fontWeight: 600 }}>{unit}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/** Historia 7 · plan a la medida. */
export const CustomStory: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: story.m, top: 420, width: 190, height: 190, borderRadius: 95, background: palette.light, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 30px 60px rgba(10, 46, 34, 0.18)` }}>
      {/* piezas que encajan: el plan a la medida */}
      <svg width={104} height={104} viewBox="0 0 48 48">
        <g fill="none" stroke={palette.brand} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round">
          <path d="M8 8 H20 V12 A4 4 0 1 0 28 12 V8 H40 V20 H36 A4 4 0 1 0 36 28 H40 V40 H28 V36 A4 4 0 1 0 20 36 V40 H8 V28 H12 A4 4 0 1 0 12 20 H8 Z" />
        </g>
      </svg>
    </div>
    <Headline bg="latte" text={copy.custom.title} size={104} top={680} />
    <div style={{ position: "absolute", left: story.m, right: story.m + 20, top: 940, fontSize: 46, lineHeight: 1.38, color: palette.ink }}>{copy.custom.text}</div>
    <div
      style={{
        position: "absolute",
        left: story.m,
        top: 1260,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "30px 56px",
        borderRadius: 999,
        background: palette.brand,
        color: palette.light,
        fontSize: 48,
        fontWeight: 600,
        boxShadow: `0 24px 50px ${palette.shadow}`,
      }}
    >
      {copy.custom.button}
      <Arrow size={44} color={palette.light} />
    </div>
  </>
);

/** Historia 8 · garantías + CTA, con espacio libre para el sticker de enlace. */
export const CloseStory: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: story.m, right: story.m, top: 500, display: "flex", flexDirection: "column", gap: 44 }}>
      {copy.close.guarantees.map((g) => (
        <div key={g} style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 62, fontWeight: 600, color: palette.onGreen, letterSpacing: "-0.015em", lineHeight: 1.1 }}>
          <Check size={78} circle={palette.onGreenAccent} mark={palette.greenDeep} />
          {g}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: story.m, right: story.m, top: 950, height: 2, background: palette.caramel, width: 140 }} />
    <div style={{ position: "absolute", left: story.m, right: story.m, top: 994, fontSize: 48, fontWeight: 600, color: palette.onGreenAccent, lineHeight: 1.25 }}>{copy.close.cta}</div>
    <div style={{ position: "absolute", left: story.m, top: 1120, display: "flex", alignItems: "center", gap: 26 }}>
      <BrandLogo variant="light" height={58} color={palette.onGreen} />
      <span style={{ width: 2, height: 40, background: lightA(0.35) }} />
      <span style={{ fontSize: 40, fontWeight: 600, color: palette.onGreen }}>{copy.close.url}</span>
    </div>
    {/* 1250–1500 px: libre para el sticker de enlace de Instagram (900×220) */}
  </>
);

/** Portada de la destacada: verde plano y una etiqueta de precio al centro (cabe en un círculo de 600 px). */
export const HighlightCover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: palette.green, alignItems: "center", justifyContent: "center" }}>
    <PriceTag size={400} color={palette.light} strokeWidth={7.5} style={{ transform: "translate(6px, 6px)" }} />
  </AbsoluteFill>
);

export const planStories = {
  gratis: () => <PlanStory bg="latte" p={plan("gratis")} below={copy.below.gratis} />,
  emprendedor: () => <PlanStory bg="green" p={plan("emprendedor")} below={copy.below.emprendedor} />,
  profesional: () => <PlanStory bg="latte" p={plan("profesional")} below={copy.below.profesional} highlight />,
  empresa: () => <PlanStory bg="green" p={plan("empresa")} below={copy.below.empresa} />,
};

