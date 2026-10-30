import React from "react";
import type { Bg } from "./brand";
import { StoryFrame } from "./components/StoryFrame";
import { type StoryKind, copy, stories } from "./pricing";
import { CloseStory, CoverStory, CustomStory, YearlyStory, planStories } from "./stories/Stories";

const BG: Record<StoryKind, Bg> = {
  cover: "green",
  gratis: "latte",
  emprendedor: "green",
  profesional: "latte",
  empresa: "green",
  yearly: "light",
  custom: "latte",
  close: "green",
};

/** Historia `index` (0 = primera) de la serie "Precios". */
export const PriceStory: React.FC<{ index: number }> = ({ index }) => {
  const kind = stories[index];
  const body = (() => {
    switch (kind) {
      case "cover":
        return <CoverStory />;
      case "yearly":
        return <YearlyStory />;
      case "custom":
        return <CustomStory />;
      case "close":
        return <CloseStory />;
      default:
        return planStories[kind]();
    }
  })();
  return (
    <StoryFrame bg={BG[kind]} indicator={copy.indicator(index + 1, stories.length)}>
      {body}
    </StoryFrame>
  );
};
