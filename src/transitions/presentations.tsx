import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import {
  linearTiming,
  TransitionPresentation,
  TransitionPresentationComponentProps,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type { TransitionKind } from "../data/timeline";
import { easeInOut, easeOutQuint } from "../theme";

type NoProps = Record<string, never>;

/**
 * "Match cut" por escala: el plano saliente crece y se disuelve mientras el
 * entrante llega desde 106% → 100% (ambos "avanzan"). Sin destellos ni distorsiones.
 */
const ScaleMatch: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const style: React.CSSProperties = entering
    ? {
        opacity: interpolate(p, [0, 0.7], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(p, [0, 1], [1.06, 1])})`,
      }
    : {
        opacity: interpolate(p, [0.3, 1], [1, 0], { extrapolateLeft: "clamp" }),
        transform: `scale(${interpolate(p, [0, 1], [1, 1.1])})`,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const scaleMatch = (): TransitionPresentation<NoProps> => ({ component: ScaleMatch, props: {} });

/**
 * Whip pan suave: desplazamiento lateral rápido con un leve desenfoque de
 * movimiento solo en el centro de la transición.
 */
const WhipPan: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const x = entering ? interpolate(p, [0, 1], [100, 0]) : interpolate(p, [0, 1], [0, -35]);
  const blur = Math.sin(p * Math.PI) * 24;
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}%)`,
        filter: `blur(${blur}px)`,
        opacity: entering ? 1 : interpolate(p, [0, 1], [1, 0.4]),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const whipPan = (): TransitionPresentation<NoProps> => ({ component: WhipPan, props: {} });

/**
 * Devuelve el elemento <TransitionSeries.Transition> para cada tipo de
 * transición del timeline (se llama como función, no como componente, porque
 * TransitionSeries necesita el elemento como hijo directo).
 */
export const renderTransition = (kind: Exclude<TransitionKind, "cut">, frames: number, key: string) => {
  switch (kind) {
    case "dissolve":
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: frames, easing: easeInOut })}
        />
      );
    case "slide":
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: frames, easing: easeOutQuint })}
        />
      );
    case "whip":
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={whipPan()}
          timing={linearTiming({ durationInFrames: frames, easing: easeOutQuint })}
        />
      );
    case "scale":
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={scaleMatch()}
          timing={linearTiming({ durationInFrames: frames, easing: easeInOut })}
        />
      );
  }
};
