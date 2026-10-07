import React from "react";

interface VignetteProps {
  intensity?: number;
}

/**
 * Optical Lens Vignette
 * Darkens peripheral edges softly, drawing gaze toward center subject.
 */
export const Vignette: React.FC<VignetteProps> = ({ intensity = 0.65 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 6,
        background: `radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0, 0, 0, ${intensity * 0.8}) 85%, rgba(0, 0, 0, ${intensity}) 100%)`,
      }}
    >
      {/* Subtle top & bottom editorial gradients for text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.35) 16%, transparent 26%, transparent 72%, rgba(0, 0, 0, 0.85) 100%)",
        }}
      />
    </div>
  );
};
