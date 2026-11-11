import React from "react";
import { Still } from "remotion";
import { ALL } from "./Slides";
import { A5, Mostrador } from "./Mostrador";
import "./fonts";

/** Una `<Still>` 1080×1350 por lámina (reposteria-sierra-1 … 5) y el cartel de mostrador. */
export const RemotionRoot: React.FC = () => (
  <>
    {ALL.map((C, i) => (
      <Still key={i} id={`reposteria-sierra-${i + 1}`} component={C} width={1080} height={1350} />
    ))}
    {/* Cartel de mostrador A5 a 300 ppp */}
    <Still id="mostrador" component={Mostrador} width={A5.w} height={A5.h} />
  </>
);
