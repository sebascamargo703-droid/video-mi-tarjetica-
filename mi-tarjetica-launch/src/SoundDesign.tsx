import React from "react";
import {
  Html5Audio,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { audio } from "./brand";
import { cues, resolveTimeline, SceneId } from "./timeline";

type Cue = { at: number; file: string; volume: number };

/** Efectos sincronizados con los mismos `cues` que usan las animaciones. */
export const SoundDesign: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const items = resolveTimeline(fps);
  const f = (sec: number) => Math.round(sec * fps);

  const starts = {} as Record<SceneId, number>;
  let cursor = 0;
  const list: Cue[] = [];
  items.forEach((item, i) => {
    starts[item.id] = cursor;
    cursor += item.dur - item.outFrames;
    if (item.out && i < items.length - 1) {
      list.push({ at: cursor - f(0.15), file: "whoosh", volume: 0.28 });
    }
  });

  const logoPops = (start: number, base: number) =>
    [0.45, 0.6, 0.75].forEach((d, i) =>
      list.push({ at: start + f(base + d), file: "stamp", volume: 0.35 + i * 0.1 }),
    );

  logoPops(starts.reveal, cues.revealLogoAt);
  list.push({ at: starts.wallet + f(cues.walletCardAt), file: "whoosh", volume: 0.18 });
  cues.stampsAt.forEach((sec) =>
    list.push({ at: starts.stamps + f(sec), file: "stamp", volume: 0.9 }),
  );
  list.push({ at: starts.stamps + f(cues.rewardAt), file: "reward", volume: 0.45 });
  list.push({ at: starts.nearby + f(cues.notifyAt), file: "chime", volume: 0.5 });
  [0, 1, 2, 3].forEach((i) =>
    list.push({
      at: starts.fraud + f(cues.fraudRowsAt + 0.6 + i * 0.22),
      file: "tap",
      volume: 0.22,
    }),
  );
  logoPops(starts.cta, 0);
  list.push({ at: starts.cta + f(cues.ctaTapAt), file: "tap", volume: 0.6 });

  return (
    <>
      {audio.music ? (
        <Html5Audio
          src={staticFile(audio.music)}
          volume={(fr) =>
            audio.musicVolume *
            interpolate(
              fr,
              [0, f(0.5), durationInFrames - f(1.5), durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
      {list.map((c, i) => (
        <Sequence key={i} from={Math.max(0, c.at)} durationInFrames={f(1.5)} layout="none">
          <Html5Audio
            src={staticFile(`sfx/${c.file}.wav`)}
            volume={c.volume * audio.sfxVolume}
          />
        </Sequence>
      ))}
    </>
  );
};
