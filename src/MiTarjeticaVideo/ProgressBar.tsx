import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 12,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(90deg, #00E676 0%, #00F5D4 50%, #FFE600 100%)",
          boxShadow: "0 0 15px rgba(0, 230, 118, 0.8)",
          borderRadius: "0 6px 6px 0",
        }}
      />
    </div>
  );
};
