import React from "react";
import {
  Html5Audio,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { audio } from "../../brand";
import voice from "./voice.json";

export type StoryId = (typeof voice.stories)[number]["id"];
export type SfxCue = { at: number; file: string; volume: number };

export const storyData = (id: string) => {
  const story = voice.stories.find((s) => s.id === id);
  if (!story) throw new Error(`Historia sin voz: ${id}`);
  return story;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Audio de cada historia: voz femenina + un tramo de la cama musical
 * (que baja cuando ella habla) + efectos puntuales (en segundos).
 */
export const StoryAudio: React.FC<{
  id: string;
  musicFromSec: number;
  sfx?: SfxCue[];
}> = ({ id, musicFromSec, sfx = [] }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const story = storyData(id);
  const lines = story.lines.map((l) => {
    const from = f(l.at);
    const dur = Math.ceil(((l as { durationSec?: number }).durationSec ?? 3) * fps);
    return { ...l, from, to: from + dur };
  });

  const duck = (fr: number) => {
    const ramp = f(0.25);
    let d = 0;
    for (const v of lines) {
      d = Math.max(
        d,
        interpolate(fr, [v.from - ramp, v.from, v.to, v.to + ramp], [0, 1, 1, 0], clamp),
      );
    }
    return 1 - d * (1 - audio.musicDuck);
  };

  return (
    <>
      {audio.music ? (
        <Html5Audio
          src={staticFile(audio.music)}
          trimBefore={f(musicFromSec)}
          volume={(fr) =>
            audio.musicVolume *
            1.2 *
            duck(fr) *
            interpolate(
              fr,
              [0, f(0.5), durationInFrames - f(0.8), durationInFrames],
              [0, 1, 1, 0],
              clamp,
            )
          }
        />
      ) : null}
      {audio.voice
        ? lines.map((l) => (
            <Sequence key={l.id} from={l.from} durationInFrames={l.to - l.from + f(0.3)} layout="none">
              <Html5Audio src={staticFile(`voz-ig/${id}-${l.id}.wav`)} volume={audio.voiceVolume} />
            </Sequence>
          ))
        : null}
      {sfx.map((c, i) => (
        <Sequence key={i} from={f(c.at)} durationInFrames={f(1.5)} layout="none">
          <Html5Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.volume * audio.sfxVolume} />
        </Sequence>
      ))}
    </>
  );
};
