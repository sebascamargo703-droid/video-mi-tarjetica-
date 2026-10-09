import React from "react";
import { Composition } from "remotion";
import { TapSello } from "./TapSello";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TapSello"
    component={TapSello}
    durationInFrames={DURATION_SEC * FPS}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
