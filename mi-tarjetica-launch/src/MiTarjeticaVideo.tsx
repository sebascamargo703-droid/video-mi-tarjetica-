import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import {
  TransitionPresentation,
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { brand } from "./brand";
import { fonts } from "./fonts";
import { EASE } from "./lib/motion";
import { circleReveal } from "./lib/transitions";
import { SceneId, TransitionKind, resolveTimeline } from "./timeline";
import { SceneProps } from "./scenes/common";
import { SoundDesign } from "./SoundDesign";
import { HookScene, ProblemScene, RevealScene } from "./scenes/Opening";
import { NearbyScene, StampsScene, WalletScene } from "./scenes/Product";
import {
  BusinessScene,
  CtaScene,
  FraudScene,
  MessageScene,
} from "./scenes/Closing";

const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: HookScene,
  problem: ProblemScene,
  reveal: RevealScene,
  wallet: WalletScene,
  stamps: StampsScene,
  nearby: NearbyScene,
  fraud: FraudScene,
  business: BusinessScene,
  message: MessageScene,
  cta: CtaScene,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presentation = (kind: TransitionKind): TransitionPresentation<any> => {
  switch (kind) {
    case "circle":
      return circleReveal();
    case "slideUp":
      return slide({ direction: "from-bottom" });
    case "slideLeft":
      return slide({ direction: "from-right" });
    case "fade":
    default:
      return fade();
  }
};

/**
 * Video de lanzamiento. La misma narrativa sirve para 16:9 y 9:16:
 * cada escena recompone su layout según la orientación.
 */
export const MiTarjeticaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const items = resolveTimeline(fps);

  return (
    <AbsoluteFill
      style={{ backgroundColor: brand.colors.black, fontFamily: fonts.body }}
    >
      <TransitionSeries>
        {items.flatMap((item) => {
          const Scene = SCENES[item.id];
          const nodes = [
            <TransitionSeries.Sequence
              key={item.id}
              durationInFrames={item.dur}
              name={item.id}
            >
              <Scene dur={item.dur} out={item.outFrames} />
            </TransitionSeries.Sequence>,
          ];
          if (item.out) {
            nodes.push(
              <TransitionSeries.Transition
                key={`${item.id}-out`}
                presentation={presentation(item.out.kind)}
                timing={linearTiming({
                  durationInFrames: item.outFrames,
                  easing: EASE,
                })}
              />,
            );
          }
          return nodes;
        })}
      </TransitionSeries>
      <SoundDesign />
    </AbsoluteFill>
  );
};
