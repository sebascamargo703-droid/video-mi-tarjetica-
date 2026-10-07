import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { MainVideo, MainVideoProps } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vertical 9:16 at native source resolution (1080x1920, 30 fps, 40s).
          For a 4K file use: --scale=2 (scales video + graphics uniformly) */}
      <Composition
        id="Vertical"
        component={MainVideo}
        durationInFrames={1200}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          width: 1080,
          height: 1920,
        } as MainVideoProps}
      />

      {/* Zero-Lag Fast Studio Preview (1080x1920, 30 fps, 40s) */}
      <Composition
        id="VerticalPreview"
        component={MainVideo}
        durationInFrames={1200}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          width: 1080,
          height: 1920,
        } as MainVideoProps}
      />

      {/* Landscape Horizontal Composition (3840x2160, 30 fps, 40s) */}
      <Composition
        id="Horizontal"
        component={MainVideo}
        durationInFrames={1200}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          width: 3840,
          height: 2160,
        } as MainVideoProps}
      />

      {/* Compatibility Alias */}
      <Composition
        id="MiTarjeticaPromo"
        component={MainVideo}
        durationInFrames={1200}
        fps={30}
        width={2160}
        height={3840}
        defaultProps={{
          width: 2160,
          height: 3840,
        } as MainVideoProps}
      />
    </>
  );
};
