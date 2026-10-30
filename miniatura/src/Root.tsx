import React from "react";
import { Composition } from "remotion";
import { DURATION_SEC, FPS, Miniatura } from "./Miniatura";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Miniatura" component={Miniatura} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
