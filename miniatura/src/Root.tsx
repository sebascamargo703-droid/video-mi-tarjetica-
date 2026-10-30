import React from "react";
import { Composition } from "remotion";
import { DURATION_SEC, FPS, Miniatura } from "./Miniatura";
import { BMW_SEC, MiniaturaBMW } from "./MiniaturaBMW";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MiniaturaBMW" component={MiniaturaBMW} durationInFrames={BMW_SEC * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="Miniatura" component={Miniatura} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
