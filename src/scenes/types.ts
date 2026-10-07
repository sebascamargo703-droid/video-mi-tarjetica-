import type { FramingName } from "../data/timeline";

/** Props comunes que MainVideo pasa a cada escena. */
export type SceneProps = {
  /** Frame absoluto en el que arranca el segmento (incluye la media transición). */
  startAbs: number;
  durationInFrames: number;
  framing?: FramingName;
};
