import React from "react";
import {
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { theme } from "./theme";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Benefit1 } from "./scenes/Scene4Benefit1";
import { Scene5Benefit2 } from "./scenes/Scene5Benefit2";
import { Scene6Benefit3 } from "./scenes/Scene6Benefit3";
import { Scene7CTA } from "./scenes/Scene7CTA";

export interface MainVideoProps {
  width?: number;
  height?: number;
}

/**
 * Master Video Composition
 * Synced frame-by-frame with speaker's voiceover, dynamic camera zooms,
 * audio design with SFX, and clean UI placements that never obstruct the face.
 */
export const MainVideo: React.FC<MainVideoProps> = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const isVertical = height > width;

  // ─── 1. SMOOTH CAMERA ZOOM (no abrupt jumps) ──────────────────────
  // Keyframes [frame, zoom]. Interpolated with easing so there are no jerks.
  const zoomKeyframes: [number, number][] = [
    [0, 1.0],
    [51, 1.0],
    [66, 1.06],
    [131, 1.06],
    [146, 1.0],
    [186, 1.0],
    [201, 1.06],
    [296, 1.06],
    [311, 1.0],
    [446, 1.0],
    [461, 1.05],
    [651, 1.05],
    [666, 1.0],
    [885, 1.0],
    [900, 1.05],
    [1046, 1.05],
    [1061, 1.08],
    [1200, 1.08],
  ];
  const targetZoom = interpolate(
    frame,
    zoomKeyframes.map((k) => k[0]),
    zoomKeyframes.map((k) => k[1]),
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.background,
        overflow: "hidden",
      }}
    >
      {/* ─── 1. SPEAKER BASE VIDEO LAYER (clean, no filters) ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          transform: `scale(${targetZoom})`,
          transformOrigin: isVertical ? "50% 38%" : "50% 50%",
        }}
      >
        <OffthreadVideo
          src={staticFile("video-base.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* ─── 2. GRAPHIC SCENE OVERLAYS (Carefully Synced, Zero Face Overlap) ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        {/* ESCENA 1: HOOK (0 - 130) -> "No necesitas clientes nuevos" */}
        <Sequence from={0} durationInFrames={130}>
          <Scene1Hook />
        </Sequence>

        {/* ESCENA 2: EL PROBLEMA (130 - 355) -> "Cuesta 5 veces más... dales motivo para volver" */}
        <Sequence from={130} durationInFrames={225}>
          <Scene2Problem />
        </Sequence>

        {/* ESCENA 3: LA SOLUCIÓN (355 - 554) -> "Tarjeta digital en el celular con MiTarjetica" */}
        <Sequence from={355} durationInFrames={199}>
          <Scene3Solution />
        </Sequence>

        {/* ESCENA 4: BENEFICIO 3 CERO DESCARGAS (554 - 749) -> "Acumulan sellos... listo en 2 segundos" */}
        <Sequence from={554} durationInFrames={195}>
          <Scene6Benefit3 />
        </Sequence>

        {/* ESCENA 5: BENEFICIO 1 PROXIMIDAD (749 - 885) -> "Con aviso de proximidad... pasa cerca" */}
        <Sequence from={749} durationInFrames={136}>
          <Scene4Benefit1 />
        </Sequence>

        {/* ESCENA 6: BENEFICIO 2 BASE DE DATOS (885 - 983) -> "Base de datos real, actualizada" */}
        <Sequence from={885} durationInFrames={98}>
          <Scene5Benefit2 />
        </Sequence>

        {/* ESCENA 7: CIERRE / CTA (983 - 1200) -> "Comenta TARJETICA... mitarjetica.com" */}
        <Sequence from={983} durationInFrames={217}>
          <Scene7CTA />
        </Sequence>
      </div>

      {/* ─── 3. BACKGROUND MUSIC (Soft ambient bed, no cut SFX) ─── */}
      <Audio
        src={staticFile("audio/tech_beat_42s.wav")}
        volume={(f) =>
          interpolate(f, [0, 20, 1150, 1200], [0, 0.05, 0.05, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </div>
  );
};
