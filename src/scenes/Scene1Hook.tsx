import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { KineticTitle, UnderlinedPhrase } from "../components/KineticTitle";
import { StopIcon } from "../components/Icons";
import { PersonShot } from "../components/PersonShot";
import { clamp, enterProgress, enterStyle } from "../lib/anim";
import { rectStyle, useLayout } from "../lib/layout";
import { colors, fonts, shadows, weights } from "../theme";
import type { SceneProps } from "./types";

/**
 * ESCENA 1 · HOOK
 * Persona a cámara + titular "No necesitas más clientes 🛑" palabra por palabra.
 * Cuando dice "los que ya te compraron" la frase se pinta de azul y se dibuja
 * el subrayado de izquierda a derecha.
 *
 * ⚠️ AJUSTE: PHRASE_IN / UNDERLINE_* en frames absolutos según tu locución.
 */
const TITLE_DELAY = 4;
const PHRASE_IN = 58; // "necesitas que…"
const UNDERLINE_START = 66; // "los que ya…"
const UNDERLINE_END = 104; // "…te compraron"

export const Scene1Hook: React.FC<SceneProps> = ({ startAbs, durationInFrames, framing = "wide" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, headline, isVertical } = useLayout();
  const abs = startAbs + frame;
  const align = isVertical ? "center" : "left";
  const titleSize = (isVertical ? 112 : 128) * u;
  const phraseSize = (isVertical ? 54 : 60) * u;

  const phraseP = enterProgress(abs, fps, PHRASE_IN);
  const underline = interpolate(abs, [UNDERLINE_START, UNDERLINE_END], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <PersonShot startAbs={startAbs} durationInFrames={durationInFrames} framing={framing}>
      {/* degradado suave para que el titular lea sobre el cielo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isVertical
            ? "linear-gradient(180deg, rgba(5,8,20,0.55) 0%, rgba(5,8,20,0.25) 22%, rgba(5,8,20,0) 36%)"
            : "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 45%)",
        }}
      />
      <div
        style={{
          ...rectStyle(headline),
          display: "flex",
          flexDirection: "column",
          alignItems: isVertical ? "center" : "flex-start",
          justifyContent: isVertical ? "flex-start" : "center",
          paddingTop: 0,
          textShadow: shadows.text(u),
        }}
      >
        <KineticTitle
          u={u}
          size={titleSize}
          delay={TITLE_DELAY}
          stagger={5}
          align={align}
          lines={[
            [{ text: "No" }, { text: "necesitas" }],
            [
              { text: "más", color: colors.red },
              { text: "clientes", color: colors.red, icon: (s) => <StopIcon size={s} /> },
            ],
          ]}
        />
        <div
          style={{
            ...enterStyle(phraseP, u),
            marginTop: 34 * u,
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: phraseSize,
            letterSpacing: fonts.tracking,
            color: colors.white,
            textAlign: isVertical ? "center" : "left",
            lineHeight: 1.3,
          }}
        >
          <span style={{ opacity: 0.7 }}>Necesitas a </span>
          <UnderlinedPhrase text="los que ya te compraron" size={phraseSize} u={u} progress={underline} />
        </div>
      </div>
    </PersonShot>
  );
};
