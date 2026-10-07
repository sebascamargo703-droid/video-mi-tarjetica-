import React from "react";

interface FilmGrainProps {
  opacity?: number;
}

/**
 * High-performance 35mm grain overlay.
 * Uses hardware-accelerated CSS pattern instead of per-frame SVG filter to eliminate playback lag.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({ opacity = 0.04 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 90,
        opacity,
        mixBlendMode: "overlay",
        backgroundImage:
          "radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 0)",
        backgroundSize: "6px 6px",
      }}
    />
  );
};
