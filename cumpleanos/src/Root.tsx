import React from "react";
import { Composition } from "remotion";
import { Cumpleanos } from "./Cumpleanos";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <Composition id="Cumpleanos" component={Cumpleanos} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1920} />
);
