import React from "react";
import { type Carousel, carousels } from "./carousels";
import { SlideFrame } from "./components/SlideFrame";
import { ClientsSlide, ChatSlide, MathSlide, WalletSlide } from "./slides/LightSlides";
import { CardSlide, NotificationSlide } from "./slides/PhoneSlides";
import { RevealSlide } from "./slides/RevealSlide";
import { WantedSlide } from "./slides/WantedSlide";

/** Dibuja la lámina `index` (0 = primera) del carrusel `carouselId`. */
export const SlideStill: React.FC<{ carouselId: string; index: number }> = ({ carouselId, index }) => {
  const carousel = carousels.find((c) => c.id === carouselId) as Carousel;
  const s = carousel.slides[index];
  const header = carousel.chargeHeader;
  const body = (() => {
    switch (s.type) {
      case "wanted":
        return <WantedSlide s={s} />;
      case "card":
        return <CardSlide s={s} header={header} />;
      case "notification":
        return <NotificationSlide s={s} header={header} />;
      case "clients":
        return <ClientsSlide s={s} header={header} />;
      case "math":
        return <MathSlide s={s} header={header} />;
      case "wallet":
        return <WalletSlide s={s} header={header} />;
      case "chat":
        return <ChatSlide s={s} />;
      case "reveal":
        return <RevealSlide s={s} />;
    }
  })();
  return (
    <SlideFrame bg={s.bg} index={index} total={carousel.slides.length} showLogo={s.type !== "wanted"}>
      {body}
    </SlideFrame>
  );
};
