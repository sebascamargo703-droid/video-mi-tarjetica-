import React from "react";
import { Audio, interpolate, staticFile } from "remotion";

export const BackgroundMusic: React.FC = () => {
  return (
    <Audio
      src={staticFile("audio/tech_beat_42s.wav")}
      volume={(f) => {
        // Subtle ambient tech beat under the user's voice
        return interpolate(
          f,
          [0, 20, 1130, 1155],
          [0, 0.05, 0.05, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
      }}
    />
  );
};
