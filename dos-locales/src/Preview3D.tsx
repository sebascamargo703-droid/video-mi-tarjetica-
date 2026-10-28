import React from "react";
import { AbsoluteFill } from "remotion";
import { City } from "./three/City";
import { Stage } from "./three/Stage";
import type { Cam } from "./three/camera";

/** Vista de prueba del mundo 3D (solo para ajustar cámaras: `npx remotion still Preview3D --props=…`). */
export const Preview3D: React.FC<{ cam: Cam; ring?: boolean; paths?: boolean }> = ({ cam, ring, paths }) => (
  <AbsoluteFill style={{ background: "#05080b" }}>
    <Stage cam={cam}>
      <City
        valentina={{ pos: [2.9, 0.12, -4.6], rot: 0, phase: 0.6, visible: true }}
        ring={ring ? { on: 1, pulse: 0.4, flash: 0 } : undefined}
        paths={paths ? { origen: 1, esquina: 1, glow: 0.4 } : undefined}
      />
    </Stage>
  </AbsoluteFill>
);
