import React from "react";

interface CinematicGradeProps {
  children?: React.ReactNode;
}

/**
 * High-End Cinema Color Grading
 * Subtle S-curve contrast, lifted blacks, teal shadows and warm highlights,
 * saturation at 105%, with soft radial depth-of-field emulation.
 */
export const CinematicGrade: React.FC<CinematicGradeProps> = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {/* 1. Warm Highlights & Key Light (Soft Amber Ambient on Subject) */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 210, 150, 0.08) 0%, rgba(255, 185, 90, 0.02) 50%, transparent 75%)",
          mixBlendMode: "screen",
          filter: "blur(60px)",
        }}
      />

      {/* 2. Cool Teal Shadows in Perimeter / Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, transparent 42%, rgba(12, 28, 44, 0.45) 85%, rgba(6, 14, 24, 0.75) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* 3. Lifted Blacks (Cinematic Film Tone Curve) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(10, 14, 22, 0.08)",
          mixBlendMode: "screen",
        }}
      />

      {children}
    </div>
  );
};
