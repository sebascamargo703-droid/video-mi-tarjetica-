import React from "react";
import { Still } from "remotion";
import { carousels } from "./carousels";
import { SlideStill } from "./Slide";
import "./fonts";

/** Una `<Still>` de 1080×1350 por lámina: `${carousel.id}-${n}` (n empieza en 1). */
export const RemotionRoot: React.FC = () => (
  <>
    {carousels.flatMap((c) =>
      c.slides.map((_, i) => (
        <Still key={`${c.id}-${i + 1}`} id={`${c.id}-${i + 1}`} component={SlideStill} defaultProps={{ carouselId: c.id, index: i }} width={1080} height={1350} />
      )),
    )}
  </>
);
