import React from "react";
import { Still } from "remotion";
import { stories } from "./pricing";
import { PriceStory } from "./Story";
import { HighlightCover } from "./stories/Stories";
import "./fonts";

/** Una `<Still>` 1080×1920 por historia (`precios-1` … `precios-8`) y la portada de la destacada. */
export const RemotionRoot: React.FC = () => (
  <>
    {stories.map((_, i) => (
      <Still key={i} id={`precios-${i + 1}`} component={PriceStory} defaultProps={{ index: i }} width={1080} height={1920} />
    ))}
    <Still id="precios-portada" component={HighlightCover} width={1080} height={1920} />
  </>
);
