import React from "react";
import { Composition } from "remotion";
import { Panel } from "./Panel";
import { DURATION_SEC, FPS } from "./timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Panel" component={Panel} defaultProps={{ format: "vertical" as const }} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="PanelFeed" component={Panel} defaultProps={{ format: "feed" as const }} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1080} height={1350} />
  </>
);
