import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, MOMENTS as M, SAFE, SCENES, TEXTS } from "../constants";
import { FONT } from "../fonts";
import { EASE, pop, seg } from "../motion";
import type { CamKey } from "../story";
import { LogoMark } from "../ui/LogoMark";

const S = SCENES.cierre;

/**
 * 6 · CIERRE / CTA — la silla ocupada queda desenfocada y oscura al fondo
 * (blurAt / dimAt) mientras la cámara sigue retrocediendo muy lento.
 */
export const cierreCam: CamKey[] = [{ t: S.to, pos: [-0.3, 1.5, -0.42], target: [-0.7, 0.85, -3.2], fov: 46, ease: EASE.soft }];

/** Parte el texto en palabras; lo que va entre [corchetes] se marca como resaltado. */
const parse = (text: string) => {
  const words: { w: string; hi: boolean }[] = [];
  let hi = false;
  for (const part of text.split(/(\[|\])/)) {
    if (part === "[") hi = true;
    else if (part === "]") hi = false;
    else for (const w of part.split(/\s+/).filter(Boolean)) words.push({ w, hi });
  }
  return words;
};

export const Scene6Cierre: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = S.from + useCurrentFrame() / fps;
  const words = parse(TEXTS.cta);
  const url = pop(t, M.ctaUrl);
  const mark = pop(t, M.ctaUrl - 0.15, false);
  const line = seg(t, M.ctaUrl + 0.15, M.ctaUrl + 0.75, EASE.out);
  const tag = seg(t, M.ctaTagline, M.ctaTagline + 0.55, EASE.out);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top, bottom: SAFE.bottom, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* texto principal, palabra por palabra */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 20px", maxWidth: 900, fontFamily: FONT.text, fontWeight: 800, fontSize: 82, lineHeight: 1.06, letterSpacing: "-0.035em", textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
          {words.map((w, i) => {
            const k = seg(t, M.ctaText + i * 0.065, M.ctaText + i * 0.065 + 0.5, EASE.out);
            return (
              <span key={i} style={{ display: "inline-block", color: w.hi ? COLORS.amber : COLORS.white, opacity: k, transform: `translateY(${(1 - k) * 34}px)` }}>
                {w.w}
              </span>
            );
          })}
        </div>

        {/* marca */}
        <div style={{ marginTop: 110, opacity: mark, transform: `scale(${0.6 + 0.4 * mark})` }}>
          <LogoMark height={64} color={COLORS.brandMint} />
        </div>
        <div style={{ marginTop: 22, fontFamily: FONT.brand, fontWeight: 700, fontSize: 112, letterSpacing: "-0.02em", color: COLORS.white, transform: `scale(${url})`, textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>{TEXTS.url}</div>
        <div style={{ width: 620 * line, height: 8, borderRadius: 4, background: COLORS.amber, marginTop: 6, boxShadow: "0 0 30px rgba(255,178,90,0.7)" }} />
        <div style={{ marginTop: 34, fontFamily: FONT.text, fontWeight: 600, fontSize: 42, letterSpacing: "-0.01em", color: COLORS.textSoft, textAlign: "center", opacity: tag, transform: `translateY(${(1 - tag) * 20}px)` }}>{TEXTS.tagline}</div>
      </div>
    </AbsoluteFill>
  );
};
