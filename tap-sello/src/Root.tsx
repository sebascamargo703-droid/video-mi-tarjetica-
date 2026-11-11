import React from "react";
import { Composition, Folder, Still } from "remotion";
import { TapSello } from "./TapSello";
import { DURATION_SEC, FPS } from "./timeline";
import { carousels } from "./carousels";
import { CarouselSlide, SLIDE_H, SLIDE_W, statSizeFor } from "./carousel/CarouselSlide";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TapSello"
      component={TapSello}
      durationInFrames={DURATION_SEC * FPS}
      fps={FPS}
      width={1080}
      height={1920}
    />
    {/* Un <Still> por lámina: `${carousel.id}-${n}` (n empieza en 1) */}
    {carousels.map((c) => (
      <Folder key={c.id} name={c.id}>
        {c.slides.map((slide, i) => (
          <Still
            key={i}
            id={`${c.id}-${i + 1}`}
            component={CarouselSlide}
            width={SLIDE_W}
            height={SLIDE_H}
            defaultProps={{
              slide,
              tone: c.theme,
              index: i,
              total: c.slides.length,
              statSize: statSizeFor(c.slides),
            }}
          />
        ))}
      </Folder>
    ))}
  </>
);
