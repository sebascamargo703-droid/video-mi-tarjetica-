import React from "react";
import { Composition } from "remotion";
import { PasoCerca } from "./PasoCerca";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <Composition id="PasoCerca" component={PasoCerca} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1920} />
);
