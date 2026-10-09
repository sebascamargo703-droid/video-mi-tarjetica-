import React from "react";
import { Composition } from "remotion";
import { MultiNicho } from "./MultiNicho";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MultiNicho" component={MultiNicho} defaultProps={{ format: "vertical" as const }} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="MultiNichoFeed" component={MultiNicho} defaultProps={{ format: "feed" as const }} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1350} />
  </>
);
