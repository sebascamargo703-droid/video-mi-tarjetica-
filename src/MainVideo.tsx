import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { AudioMix } from "./components/AudioMix";
import { FilmGrain } from "./components/FilmGrain";
import { Vignette } from "./components/Vignette";
import { WordSubtitles } from "./components/WordSubtitles";
import { SceneKind, SEGMENTS, segmentDuration, segmentStart } from "./data/timeline";
import { PersonScene } from "./scenes/PersonScene";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Benefit1 } from "./scenes/Scene4Benefit1";
import { Scene5Benefit2 } from "./scenes/Scene5Benefit2";
import { Scene6Benefit3 } from "./scenes/Scene6Benefit3";
import { EndCard, Scene7CTA } from "./scenes/Scene7CTA";
import type { SceneProps } from "./scenes/types";
import { renderTransition } from "./transitions/presentations";
import { colors } from "./theme";

export type MainVideoProps = {
  /** Opacidad del grano (0.04–0.06). */
  grain?: number;
  showSubtitles?: boolean;
};

const SCENES: Record<SceneKind, React.FC<SceneProps>> = {
  hook: Scene1Hook,
  person: PersonScene,
  problem: Scene2Problem,
  solution: Scene3Solution,
  proximity: Scene4Benefit1,
  database: Scene5Benefit2,
  wallet: Scene6Benefit3,
  cta: Scene7CTA,
  endcard: EndCard,
};

/**
 * Montaje maestro. La pista de imagen es una única TransitionSeries generada
 * desde src/data/timeline.ts; encima van subtítulos, viñeta y grano, y debajo
 * la mezcla de audio (voz original + música con ducking + SFX).
 */
export const MainVideo: React.FC<MainVideoProps> = ({ grain = 0.05, showSubtitles = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <TransitionSeries>
        {SEGMENTS.flatMap((seg, i) => {
          const Scene = SCENES[seg.scene];
          const duration = segmentDuration(i);
          const nodes: React.ReactNode[] = [];
          if (i > 0 && seg.entry !== "cut") {
            nodes.push(renderTransition(seg.entry, seg.entryFrames, `t${i}`));
          }
          nodes.push(
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={duration} premountFor={30}>
              <Scene startAbs={segmentStart(i)} durationInFrames={duration} framing={seg.framing} />
            </TransitionSeries.Sequence>,
          );
          return nodes;
        })}
      </TransitionSeries>

      <Vignette />
      {showSubtitles ? <WordSubtitles /> : null}
      <FilmGrain opacity={grain} />
      <AudioMix />
    </AbsoluteFill>
  );
};
