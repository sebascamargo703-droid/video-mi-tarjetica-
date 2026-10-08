import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type Empty = Record<string, never>;

/**
 * Revelado circular: la escena nueva se abre como un iris desde el centro
 * mientras la anterior retrocede un poco y se oscurece.
 */
const CircleReveal: React.FC<TransitionPresentationComponentProps<Empty>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{ transform: `scale(${1 - 0.06 * p})`, filter: `brightness(${1 - 0.35 * p})` }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ clipPath: `circle(${p * 75}% at 50% 50%)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const circleReveal = (): TransitionPresentation<Empty> => ({
  component: CircleReveal,
  props: {} as Empty,
});
