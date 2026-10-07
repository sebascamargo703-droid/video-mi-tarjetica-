import React, { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FRAMINGS, FramingName, PUSH_INS } from "../data/timeline";
import { clamp } from "../lib/anim";
import { rectStyle, useLayout } from "../lib/layout";
import { radii, shadows, springs } from "../theme";
import { CinematicGrade } from "./CinematicGrade";

const VIDEO = staticFile("video-base.mp4");

/** El video SIEMPRE se monta en silencio: la voz sale de <AudioMix/>. */
const Footage: React.FC<{ trimBefore: number; style?: React.CSSProperties }> = ({
  trimBefore,
  style,
}) => (
  <OffthreadVideo
    src={VIDEO}
    trimBefore={trimBefore}
    muted
    pauseWhenBuffering
    style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
  />
);

/**
 * Plano a cámara con cámara virtual:
 *  - zoom lento continuo 1.00 → 1.06 durante todo el plano
 *  - push-in de +3.5% en las frases de PUSH_INS
 *  - encuadre base (1x / 1.15x) para simular segundo ángulo
 *  - falso desenfoque de fondo: capa desenfocada + capa nítida con máscara radial
 *  - color grade cinematográfico
 */
export const PersonShot: React.FC<{
  /** Frame absoluto del video base en el que arranca este segmento. */
  startAbs: number;
  durationInFrames: number;
  framing: FramingName;
  children?: React.ReactNode;
}> = ({ startAbs, durationInFrames, framing, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, isVertical, person, W, H } = useLayout();
  const f = FRAMINGS[framing];
  const blurId = `dof-${useId().replace(/:/g, "")}`;
  const abs = startAbs + frame;

  const drift = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const push = PUSH_INS.filter((p) => p >= startAbs - 10 && p < startAbs + durationInFrames).reduce(
    (acc, p) => acc + 0.035 * spring({ frame: abs - p, fps, config: springs.slow }),
    0,
  );
  const scale = f.scale * drift * (1 + push);

  const mask = `radial-gradient(ellipse ${f.focus.rx}% ${f.focus.ry}% at ${f.focus.x}% ${f.focus.y}%, #000 62%, transparent 100%)`;

  const shot = (
    <CinematicGrade>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${f.originX}% ${f.originY}%`,
        }}
      >
        {/* fondo desenfocado (edgeMode="duplicate" evita el halo en los bordes) */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={blurId} x="0" y="0" width="100%" height="100%">
            <feGaussianBlur stdDeviation={9 * u} edgeMode="duplicate" />
          </filter>
        </svg>
        <AbsoluteFill style={{ filter: `url(#${blurId})` }}>
          <Footage trimBefore={startAbs} />
        </AbsoluteFill>
        {/* sujeto nítido */}
        <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
          <Footage trimBefore={startAbs} />
        </AbsoluteFill>
      </AbsoluteFill>
    </CinematicGrade>
  );

  if (isVertical) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {shot}
        {children}
      </AbsoluteFill>
    );
  }

  // 16:9: relleno ambiental desenfocado + panel 9:16 con la toma.
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter: `blur(${60 * u}px) brightness(0.35) saturate(1.2)`, transform: "scale(1.2)" }}>
        <Footage trimBefore={startAbs} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) ${
            ((person.x / W) * 100).toFixed(0)
          }%, rgba(0,0,0,0.2) 100%)`,
        }}
      />
      <div
        style={{
          ...rectStyle(person),
          borderRadius: radii.lg * u,
          overflow: "hidden",
          boxShadow: shadows.float(u),
          // aísla el panel para que los filtros no se salgan del radio
          isolation: "isolate",
          height: Math.min(person.h, H),
        }}
      >
        {shot}
      </div>
      {children}
    </AbsoluteFill>
  );
};
