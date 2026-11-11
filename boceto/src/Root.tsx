import React from "react";
import { Composition, Still } from "remotion";
import { Boceto } from "./Boceto";
import { Portada } from "./Portada";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Still id="Portada" component={Portada} width={1080} height={1920} />
    <Composition id="Boceto" component={Boceto} durationInFrames={Math.round(DURATION_SEC * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
