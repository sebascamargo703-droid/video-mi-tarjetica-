import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface SeamlessTransitionProps {
  durationInFrames: number;
  baseScale?: number;
  cameraType?: "medium" | "closeUp";
  children: React.ReactNode;
}

export const SeamlessTransition: React.FC<SeamlessTransitionProps> = ({
  durationInFrames,
  baseScale = 1.0,
  cameraType = "medium",
  children,
}) => {
  const frame = useCurrentFrame();

  // Multi-camera framing scale:
  // "medium": 1.00 -> 1.03
  // "closeUp": 1.14 -> 1.17
  const multiCamOffset = cameraType === "closeUp" ? 0.14 : 0.0;
  const slowPush = interpolate(frame, [0, durationInFrames], [0, 0.03]);

  // Micro whip-in transition on entrance (first 5 frames)
  const enterProgress = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterScaleOffset = (1 - enterProgress) * 0.06;
  const enterBlur = (1 - enterProgress) * 8;
  const enterOpacity = interpolate(frame, [0, 3], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Micro whip-out transition on exit (last 4 frames)
  const exitStart = Math.max(0, durationInFrames - 4);
  const exitProgress = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScaleOffset = exitProgress * 0.05;
  const exitBlur = exitProgress * 8;

  const currentScale = baseScale + multiCamOffset + slowPush + enterScaleOffset + exitScaleOffset;
  const currentBlur = Math.max(enterBlur, exitBlur);

  return (
    <div
      style={{
        position: "absolute",
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${currentScale})`,
          transformOrigin: cameraType === "closeUp" ? "center 38%" : "center 44%",
          filter: currentBlur > 0.5 ? `blur(${currentBlur}px)` : "none",
          opacity: enterOpacity,
        }}
      >
        {children}
      </div>

      {/* Lightning quick 2-frame flash on cut point to mask any seam */}
      {frame <= 2 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            opacity: interpolate(frame, [0, 2], [1, 0]),
            pointerEvents: "none",
            zIndex: 35,
          }}
        />
      )}
    </div>
  );
};
