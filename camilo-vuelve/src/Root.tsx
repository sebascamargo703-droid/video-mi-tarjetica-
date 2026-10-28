import React from "react";
import { Composition } from "remotion";
import { CamiloVuelve } from "./CamiloVuelve";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CamiloVuelve" component={CamiloVuelve} durationInFrames={Math.round(DURATION_SEC * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
