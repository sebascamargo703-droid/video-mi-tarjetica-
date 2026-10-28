import React from "react";
import { Composition, Still } from "remotion";
import { CamiloVuelve } from "./CamiloVuelve";
import { Portada } from "./Portada";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CamiloVuelve" component={CamiloVuelve} durationInFrames={Math.round(DURATION_SEC * FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="Portada" component={Portada} width={1080} height={1920} />
  </>
);
