import React from "react";
import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { AUDIO, MOMENTS as M, SCENES, VIDEO } from "./constants";

/**
 * AUDIO — música + efectos + (opcional) voz en off.
 *
 * Los archivos viven en /public:
 *   music.mp3         pista de fondo (22 s o más; se corta sola al final)
 *   notification.mp3  vibración + "ding" del aviso            → MOMENTS.notification
 *   door.mp3          puerta que se abre + campanita           → MOMENTS.doorOpen
 *   stamp.mp3         golpe del sello + brillo                 → MOMENTS.stamp
 *   voz.mp3           tu locución (guion en constants.ts)      → AUDIO.voice.enabled = true
 *
 * El repo trae versiones de relleno sintetizadas (`npm run audio`). Para usar
 * las tuyas, reemplaza el archivo con el mismo nombre. Si quitas un archivo,
 * pon su `enabled` en false en constants.ts: Remotion falla si el archivo no existe.
 */
export const Soundtrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);
  const total = VIDEO.durationSec;
  const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  /** La música baja un poco en el aviso y en el sello, y se desvanece al final. */
  const musicVolume = (f: number) => {
    const t = f / fps;
    const fade = interpolate(t, [0, 0.6, total - 1.2, total], [0, 1, 1, 0], c);
    const duckNotif = interpolate(t, [M.notification - 0.15, M.notification, M.notification + 1.1, M.notification + 1.6], [0, 1, 1, 0], c);
    const duckStamp = interpolate(t, [M.stamp - 0.1, M.stamp, M.stamp + 0.5, M.stamp + 0.9], [0, 1, 1, 0], c);
    const duck = Math.max(duckNotif, duckStamp);
    return fade * (AUDIO.music.volume + (AUDIO.music.duckTo - AUDIO.music.volume) * duck);
  };

  return (
    <>
      {AUDIO.music.enabled ? <Audio src={staticFile(AUDIO.music.file)} volume={musicVolume} /> : null}

      {AUDIO.notification.enabled ? (
        <Sequence from={sec(AUDIO.notification.at)} durationInFrames={sec(2)} name="SFX · notificación">
          <Audio src={staticFile(AUDIO.notification.file)} volume={AUDIO.notification.volume} />
        </Sequence>
      ) : null}

      {AUDIO.door.enabled ? (
        <Sequence from={sec(AUDIO.door.at)} durationInFrames={sec(2)} name="SFX · puerta">
          <Audio src={staticFile(AUDIO.door.file)} volume={AUDIO.door.volume} />
        </Sequence>
      ) : null}

      {AUDIO.stamp.enabled ? (
        <Sequence from={sec(AUDIO.stamp.at)} durationInFrames={sec(1.6)} name="SFX · sello">
          <Audio src={staticFile(AUDIO.stamp.file)} volume={AUDIO.stamp.volume} />
        </Sequence>
      ) : null}

      {AUDIO.voice.enabled ? (
        <Sequence from={sec(SCENES.gancho.from)} name="Voz en off">
          <Audio src={staticFile(AUDIO.voice.file)} volume={AUDIO.voice.volume} />
        </Sequence>
      ) : null}
    </>
  );
};
