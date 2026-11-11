import React from "react";
import { Composition, Folder } from "remotion";
import { MiTarjeticaVideo } from "./MiTarjeticaVideo";
import { TOTAL_SEC } from "./timeline";
import { SocialCompositions } from "./social/SocialCompositions";

const FPS = 60;

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Lanzamiento">
      <Composition
        id="MiTarjeticaHero"
        component={MiTarjeticaVideo}
        durationInFrames={TOTAL_SEC * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="MiTarjeticaVertical"
        component={MiTarjeticaVideo}
        durationInFrames={TOTAL_SEC * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </Folder>
    <SocialCompositions />
  </>
);
