import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BUSINESS, COLORS, MOMENTS as M, SAFE, SCENES, TEXTS, VIDEO } from "../constants";
import { FONT } from "../fonts";
import { EASE, pop, seg } from "../motion";
import type { CamKey } from "../story";
import { StampCard } from "../ui/StampCard";

const S = SCENES.silla;
const CARD_W = 780;

/**
 * 5 · LA SILLA SE LLENA — adentro otra vez: Andrés ya está sentado, la luz
 * pasa de ámbar tenue a cálida plena (lampAt / interiorAt en story.ts) y en la
 * tarjeta se estampa el sello 10 con rebote y partículas doradas.
 */
export const sillaCam: CamKey[] = [
  { t: S.from, pos: [1.25, 1.55, -0.55], target: [-0.7, 0.75, -3.2], fov: 46, cut: true },
  { t: S.to, pos: [0.45, 1.5, -0.45], target: [-0.7, 0.78, -3.2], fov: 46, ease: EASE.soft },
];

export const Scene5Silla: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = S.from + useCurrentFrame() / fps;
  const inn = pop(t, M.cardIn, false);
  const out = seg(t, S.to - 0.35, S.to, EASE.in);
  const badge = pop(t, M.rewardBadge);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (VIDEO.width - CARD_W) / 2,
          bottom: SAFE.bottom + 40,
          transform: `translateY(${(1 - inn) * 900 + out * 900}px) rotate(${(1 - inn) * 5}deg)`,
          opacity: 1 - out,
        }}
      >
        <StampCard width={CARD_W} t={t} filled={BUSINESS.stampsFilled} stampAt={M.stamp} />
        {/* insignia del premio */}
        <div
          style={{
            position: "absolute",
            right: -10,
            top: -96,
            padding: "16px 30px",
            borderRadius: 999,
            background: `linear-gradient(180deg, #FFE08A, ${COLORS.gold})`,
            color: "#2B1A02",
            fontFamily: FONT.text,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: "-0.02em",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 50px rgba(255,194,75,0.55)",
            transform: `scale(${badge}) rotate(${-5 + (1 - Math.min(1, badge)) * 12}deg)`,
            transformOrigin: "80% 100%",
          }}
        >
          {TEXTS.rewardBadge}
        </div>
      </div>
    </AbsoluteFill>
  );
};
