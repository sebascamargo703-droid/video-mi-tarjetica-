import React from "react";
import { Composition } from "remotion";
import { Lavadero } from "./Lavadero";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Lavadero" component={Lavadero} defaultProps={{ format: "vertical" as const }} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="LavaderoFeed" component={Lavadero} defaultProps={{ format: "feed" as const }} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1350} />
  </>
);
