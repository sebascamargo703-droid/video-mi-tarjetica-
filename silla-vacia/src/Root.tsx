import React from "react";
import { Composition, Still } from "remotion";
import { VIDEO } from "./constants";
import "./fonts";
import { Portada } from "./Portada";
import { SillaVacia } from "./SillaVacia";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Video principal: 1080×1920, 30 fps, 22 s */}
    <Composition id="SillaVacia" component={SillaVacia} durationInFrames={Math.round(VIDEO.durationSec * VIDEO.fps)} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* Portada para la cuadrícula del perfil */}
    <Still id="Portada" component={Portada} width={VIDEO.width} height={VIDEO.height} />
  </>
);
