import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SCENES, TEXTS } from "../constants";
import { EASE } from "../motion";
import type { CamKey } from "../story";
import { Caption } from "../ui/Caption";

const S = SCENES.calle;

/**
 * 2 · LA CALLE — la cámara retrocede, atraviesa la vidriera y sale al andén.
 * Andrés entra por la izquierda y la cámara lo acompaña (claves `follow`)
 * mientras pasa frente a la barbería sin mirarla.
 */
export const calleCam: CamKey[] = [
  { t: S.from + 1.7, pos: [-0.85, 1.6, 3.9], target: [-0.9, 1.35, 0], fov: 44, ease: EASE.inOut },
  { t: S.from + 3.1, pos: [1.9, 1.5, 3.4], target: [0.3, 1.2, -0.3], fov: 40, follow: true, ease: EASE.inOut },
  { t: S.to, pos: [2.1, 1.5, 3.0], target: [0.2, 1.25, -0.2], fov: 38, follow: true, ease: EASE.soft },
];

export const Scene2Calle: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = S.from + useCurrentFrame() / fps;
  return (
    <AbsoluteFill>
      <Caption text={TEXTS.calle} t={t} from={S.from + 1.9} to={S.to - 0.1} />
    </AbsoluteFill>
  );
};
