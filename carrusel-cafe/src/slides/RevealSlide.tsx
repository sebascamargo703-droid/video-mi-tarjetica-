import React from "react";
import { grid, palette } from "../brand";
import type { Slide } from "../carousels";
import { BrandLogo } from "../components/BrandLogo";
import { Beans, CoffeeBranch, SteamCup } from "../components/Ornaments";
import { Title } from "../components/SlideFrame";
import { sans } from "../fonts";

/** Lámina 8 · revelación + CTA. */
export const RevealSlide: React.FC<{ s: Extract<Slide, { type: "reveal" }> }> = ({ s }) => (
  <>
    <SteamCup color={palette.caramel} opacity={0.6} size={150} style={{ position: "absolute", right: 84, top: 60 }} />
    <CoffeeBranch color={palette.caramel} opacity={0.5} size={250} style={{ position: "absolute", right: 30, top: 1100 }} flip />
    <Beans color={palette.caramel} opacity={0.45} size={100} style={{ position: "absolute", left: 60, top: 1130 }} />

    <Title bg={s.bg} text={s.title} size={80} top={300} style={{ right: 150 }} />
    <div style={{ position: "absolute", left: grid.m, right: 170, top: 540, fontFamily: sans, fontSize: 34, lineHeight: 1.4, color: palette.onGreen }}>{s.text}</div>
    <div style={{ position: "absolute", left: grid.m, top: 706, width: 140, height: 2, background: palette.caramel }} />
    <div
      style={{
        position: "absolute",
        left: grid.m,
        top: 748,
        padding: "26px 40px",
        borderRadius: 999,
        background: palette.onGreenAccent,
        color: palette.greenDeep,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 38,
        letterSpacing: "-0.01em",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
      }}
    >
      {s.cta}
    </div>
    <div style={{ position: "absolute", left: grid.m, top: 910, display: "flex", alignItems: "center", gap: 26 }}>
      <BrandLogo variant="white" height={52} color={palette.onGreen} />
      <span style={{ width: 2, height: 36, background: "rgba(255,255,255,0.35)" }} />
      <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 34, color: palette.onGreen }}>{s.url}</span>
    </div>
    <div style={{ position: "absolute", left: grid.m, top: 994, fontFamily: sans, fontSize: 25, color: palette.onGreenSecondary }}>{s.sub}</div>
  </>
);
