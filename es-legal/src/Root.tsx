import React from "react";
import { Composition } from "remotion";
import { EsLegal } from "./EsLegal";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <Composition id="EsLegal" component={EsLegal} durationInFrames={Math.round(DURATION_SEC * FPS)} fps={FPS} width={1080} height={1920} />
);
