import React from "react";
import { Composition, Still } from "remotion";
import { DosLocales } from "./DosLocales";
import { Preview3D } from "./Preview3D";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DosLocales" component={DosLocales} durationInFrames={Math.round(DURATION_SEC * FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="Preview3D" component={Preview3D} width={1080} height={1920} defaultProps={{ cam: { pos: [6, 22, 22], target: [0, 0, -1], fov: 38 } }} />
  </>
);
