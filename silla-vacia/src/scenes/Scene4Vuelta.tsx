import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOMENTS as M, SCENES, TEXTS } from "../constants";
import { EASE } from "../motion";
import type { CamKey } from "../story";
import { Caption } from "../ui/Caption";

const S = SCENES.vuelta;

/**
 * 4 · LA VUELTA — la cámara se abre: Andrés mira atrás, gira y camina a la
 * puerta. La puerta se abre y la luz cálida inunda la calle. Termina con un
 * fundido corto a negro (fadeAt en story.ts).
 */
export const vueltaCam: CamKey[] = [
  { t: S.from + 1.3, pos: [6.7, 1.7, 5.4], target: [3.6, 1.2, 0.9], fov: 40, ease: EASE.inOut },
  { t: S.to - 0.1, pos: [5.5, 1.6, 6.0], target: [2.4, 1.25, 0], fov: 38, ease: EASE.inOut },
];

export const Scene4Vuelta: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = S.from + useCurrentFrame() / fps;
  return (
    <AbsoluteFill>
      <Caption text={TEXTS.vuelta} t={t} from={M.turn + 0.2} to={M.fadeOut} />
    </AbsoluteFill>
  );
};
