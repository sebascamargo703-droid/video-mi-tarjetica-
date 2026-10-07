import React, { useMemo } from "react";
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { useAudioData } from "@remotion/media-utils";
import { SEGMENTS, SFX, USE_NORMALIZED_VOICE } from "../data/timeline";
import { clamp } from "../lib/anim";

const VOICE_SRC = staticFile(USE_NORMALIZED_VOICE ? "voz-normalizada.wav" : "video-base.mp4");
const MUSIC_SRC = staticFile("musica.mp3");

/** Volúmenes de la música (lineal, 0–1). */
const MUSIC_BED = 0.1; // sin voz
const MUSIC_DUCKED = 0.06; // mientras se habla
const MUSIC_TRANSITION_LIFT = 0.025; // leve subida en transiciones

/**
 * Envolvente de voz por frame (0 = silencio, 1 = hablando), calculada a partir
 * de la forma de onda real de la locución. Ataque rápido (con look-ahead de
 * 4 frames para que la música baje ANTES de la palabra) y release lento.
 */
const useVoiceEnvelope = (durationInFrames: number, fps: number) => {
  const audio = useAudioData(VOICE_SRC);
  return useMemo(() => {
    if (!audio) return null;
    const data = audio.channelWaveforms[0];
    const perFrame = audio.sampleRate / fps;
    const raw = new Float32Array(durationInFrames);
    for (let f = 0; f < durationInFrames; f++) {
      const from = Math.floor(f * perFrame);
      const to = Math.min(data.length, Math.floor((f + 1) * perFrame));
      let sum = 0;
      for (let i = from; i < to; i++) sum += data[i] * data[i];
      const rms = to > from ? Math.sqrt(sum / (to - from)) : 0;
      const db = 20 * Math.log10(rms + 1e-9);
      raw[f] = interpolate(db, [-42, -30], [0, 1], clamp);
    }
    const env = new Float32Array(durationInFrames);
    let level = 0;
    for (let f = 0; f < durationInFrames; f++) {
      let target = 0;
      for (let k = 0; k <= 4 && f + k < durationInFrames; k++) target = Math.max(target, raw[f + k]);
      level = target > level ? level + (target - level) * 0.6 : level + (target - level) * 0.08;
      env[f] = level;
    }
    return env;
  }, [audio, durationInFrames, fps]);
};

/**
 * Mezcla final:
 *  - Voz original (normalizada a -14 LUFS) a volumen 1.
 *  - Música al 10% con ducking automático a 6% mientras se habla y leve subida
 *    en transiciones. Fade in 0.5 s · fade out 1 s.
 *  - SFX sutiles (whoosh / pop / tick / chime) en public/sfx/.
 */
export const AudioMix: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const env = useVoiceEnvelope(durationInFrames, fps);
  const entryFrames = SEGMENTS.filter((s) => s.entry !== "cut").map((s) => s.at);

  const fadeIn = (f: number) => interpolate(f, [0, fps * 0.5], [0, 1], clamp);
  const fadeOut = (f: number) => interpolate(f, [durationInFrames - fps, durationInFrames], [1, 0], clamp);

  const musicVolume = (f: number) => {
    const speech = env ? env[Math.min(f, env.length - 1)] : 1;
    const lift = entryFrames.reduce(
      (acc, t) => Math.max(acc, interpolate(Math.abs(f - t), [0, 12], [1, 0], clamp)),
      0,
    );
    const base = MUSIC_BED + (MUSIC_DUCKED - MUSIC_BED) * speech + MUSIC_TRANSITION_LIFT * lift;
    return base * fadeIn(f) * fadeOut(f);
  };

  return (
    <>
      <Audio
        src={VOICE_SRC}
        volume={(f) => interpolate(f, [0, 3], [0, 1], clamp) * fadeOut(f)}
      />
      <Audio src={MUSIC_SRC} volume={musicVolume} />
      {SFX.map((cue, i) => (
        <Sequence key={`${cue.file}-${i}`} from={Math.max(0, Math.round(cue.at))} durationInFrames={fps * 2} layout="none">
          <Audio src={staticFile(`sfx/${cue.file}`)} volume={cue.volume} />
        </Sequence>
      ))}
    </>
  );
};
