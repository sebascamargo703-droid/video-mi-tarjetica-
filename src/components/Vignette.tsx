import React from "react";
import { AbsoluteFill } from "remotion";

/** Viñeta suave: solo oscurece esquinas, el centro queda intacto. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.42 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 78% 70% at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,${
        strength * 0.55
      }) 82%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);
