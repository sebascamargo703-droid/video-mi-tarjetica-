import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SCENES } from "./constants";
import { Soundtrack } from "./Soundtrack";
import { andresAt, blurAt, cameraAt, dimAt, doorAt, fadeAt, fogAt, interiorAt, lampAt, type CamKey } from "./story";
import { Stage } from "./three/Stage";
import { GANCHO_TAIL, Scene1Gancho, ganchoCam } from "./scenes/Scene1Gancho";
import { Scene2Calle, calleCam } from "./scenes/Scene2Calle";
import { Scene3Aviso, avisoCam } from "./scenes/Scene3Aviso";
import { Scene4Vuelta, vueltaCam } from "./scenes/Scene4Vuelta";
import { Scene5Silla, sillaCam } from "./scenes/Scene5Silla";
import { Scene6Cierre, cierreCam } from "./scenes/Scene6Cierre";

/** Recorrido completo de la cámara: cada escena aporta sus claves. */
const CAMERA: CamKey[] = [...ganchoCam, ...calleCam, ...avisoCam, ...vueltaCam, ...sillaCam, ...cierreCam];

/**
 * Composición principal. Un solo mundo 3D que vive todo el video (así la
 * cámara pasa de una escena a otra sin cortes) y, encima, la capa 2D de cada
 * escena en su <Sequence>.
 */
export const SillaVacia: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;
  const f = (s: number) => Math.round(s * fps);
  const blur = blurAt(T);
  const seq = (s: { from: number; to: number }, tail = 0) => ({ from: f(s.from), durationInFrames: f(s.to + tail) - f(s.from) });

  return (
    <AbsoluteFill style={{ background: COLORS.night }}>
      {/* mundo 3D (se desenfoca cuando la interfaz toma el protagonismo) */}
      <AbsoluteFill style={blur > 0.05 ? { filter: `blur(${blur.toFixed(2)}px)`, transform: `scale(${1 + blur * 0.004})` } : undefined}>
        <Stage T={T} cam={cameraAt(CAMERA, T)} andres={andresAt(T)} lamp={lampAt(T)} interior={interiorAt(T)} door={doorAt(T)} fog={fogAt(T)} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: COLORS.night, opacity: dimAt(T) }} />
      {/* viñeta cinematográfica */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 48%, transparent 55%, rgba(2,4,10,0.6) 100%)" }} />

      {/* capa 2D de cada escena */}
      <Sequence {...seq(SCENES.gancho, GANCHO_TAIL)} name="1 · Gancho">
        <Scene1Gancho />
      </Sequence>
      <Sequence {...seq(SCENES.calle)} name="2 · La calle">
        <Scene2Calle />
      </Sequence>
      <Sequence {...seq(SCENES.aviso)} name="3 · El aviso">
        <Scene3Aviso />
      </Sequence>
      <Sequence {...seq(SCENES.vuelta)} name="4 · La vuelta">
        <Scene4Vuelta />
      </Sequence>
      <Sequence {...seq(SCENES.silla)} name="5 · La silla se llena">
        <Scene5Silla />
      </Sequence>
      <Sequence {...seq(SCENES.cierre)} name="6 · Cierre / CTA">
        <Scene6Cierre />
      </Sequence>

      {/* fundidos a negro */}
      <AbsoluteFill style={{ background: "#000", opacity: fadeAt(T) }} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
