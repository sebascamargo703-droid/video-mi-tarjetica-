import React from "react";
import { Still } from "remotion";
import { ALL } from "./Slides";
import "./fonts";

/** Una `<Still>` 1080×1350 por lámina: reposteria-sierra-1 … 5. */
export const RemotionRoot: React.FC = () => (
  <>
    {ALL.map((C, i) => (
      <Still key={i} id={`reposteria-sierra-${i + 1}`} component={C} width={1080} height={1350} />
    ))}
  </>
);
