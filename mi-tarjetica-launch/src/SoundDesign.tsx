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
import voiceover from "./voiceover.json";

type Cue = { at: number; file: string; volume: number };

const useSceneStarts = () => {
  const { fps } = useVideoConfig();
  const starts = {} as Record<SceneId, number>;
  let cursor = 0;
  const items = resolveTimeline(fps);
  items.forEach((item) => {
    starts[item.id as SceneId] = cursor;
    cursor += item.dur - item.outFrames;
  });
  return { starts, items };
};

/** Frases de la locución con su frame de inicio y fin. */
const useVoiceLines = () => {
  const { fps } = useVideoConfig();
  const { starts } = useSceneStarts();
  return voiceover.lines.map((line) => {
    const from = starts[line.scene as SceneId] + Math.round(line.at * fps);
    const dur = Math.ceil(((line as { durationSec?: number }).durationSec ?? 4) * fps);
    return { ...line, from, to: from + dur };
  });
};

/**
 * Banda sonora: locución femenina + cama musical (que baja cuando ella habla)
 * + efectos sincronizados con los mismos `cues` que usan las animaciones.
 */
export const SoundDesign: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const { starts, items } = useSceneStarts();
  const voice = useVoiceLines();
  const f = (sec: number) => Math.round(sec * fps);

  const list: Cue[] = [];
  let cursor = 0;
  items.forEach((item, i) => {
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

  // Atenuación de la música mientras suena la voz (con rampas suaves).
  const duckAt = (fr: number) => {
    if (!audio.voice) return 1;
    const ramp = f(0.25);
    let d = 0;
    for (const v of voice) {
      const k = interpolate(fr, [v.from - ramp, v.from, v.to, v.to + ramp], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      d = Math.max(d, k);
    }
    return 1 - d * (1 - audio.musicDuck);
  };

  return (
    <>
      {audio.music ? (
        <Html5Audio
          src={staticFile(audio.music)}
          volume={(fr) =>
            audio.musicVolume *
            duckAt(fr) *
            interpolate(
              fr,
              [0, f(0.4), durationInFrames - f(1.2), durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
      {audio.voice
        ? voice.map((v) => (
            <Sequence
              key={v.id}
              from={v.from}
              durationInFrames={v.to - v.from + f(0.3)}
              layout="none"
              name={`voz ${v.id}`}
            >
              <Html5Audio src={staticFile(`voz/${v.id}.wav`)} volume={audio.voiceVolume} />
            </Sequence>
          ))
        : null}
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
