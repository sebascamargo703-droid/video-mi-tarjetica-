import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./data/timeline";
import { MainVideo, MainVideoProps } from "./MainVideo";

const defaultProps: MainVideoProps = { grain: 0.05, showSubtitles: true };

/**
 * Composiciones. Todo el diseño escala con el lado corto del lienzo, así que
 * puedes cambiar width/height libremente (p. ej. 1080x1920 para pruebas).
 */
export const RemotionRoot: React.FC = () => (
  <>
    {/* Principal · 9:16 · 4K */}
    <Composition
      id="Vertical"
      component={MainVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={2160}
      height={3840}
      defaultProps={defaultProps}
    />
    {/* 16:9 · 4K (persona en panel 9:16 a la derecha, gráficos a la izquierda) */}
    <Composition
      id="Horizontal"
      component={MainVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={3840}
      height={2160}
      defaultProps={defaultProps}
    />
    {/* Previsualización ligera 1080x1920 (mismo diseño, ¼ de píxeles) */}
    <Composition
      id="VerticalPreview"
      component={MainVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
  </>
);
