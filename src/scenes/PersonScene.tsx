import React from "react";
import { PersonShot } from "../components/PersonShot";
import type { SceneProps } from "./types";

/** Plano a cámara "limpio" (sin gráficos) entre escenas. */
export const PersonScene: React.FC<SceneProps> = ({ startAbs, durationInFrames, framing = "wide" }) => (
  <PersonShot startAbs={startAbs} durationInFrames={durationInFrames} framing={framing} />
);
