import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOMENTS as M, SAFE, SCENES, VIDEO } from "../constants";
import { EASE, pop, seg } from "../motion";
import type { CamKey } from "../story";
import { PHONE, PhoneLock } from "../ui/PhoneLock";

const S = SCENES.aviso;

/**
 * 3 · EL AVISO — la cámara se acerca a Andrés y a su celular; el 3D se
 * desenfoca (ver blurAt en story.ts) y el celular sube en primer plano con la
 * notificación de cercanía y la tarjeta 9/10.
 */
export const avisoCam: CamKey[] = [
  { t: S.from + 1.3, pos: [1.3, 1.42, 1.75], target: [0.08, 1.3, 0.05], fov: 32, follow: true, ease: EASE.inOut },
  { t: S.to - 0.3, pos: [1.0, 1.4, 1.5], target: [0.08, 1.3, 0.05], fov: 30, follow: true, ease: EASE.soft },
];

export const Scene3Aviso: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = S.from + useCurrentFrame() / fps;
  const inn = pop(t, M.phoneIn, false);
  const out = seg(t, M.phoneOut, M.phoneOut + 0.4, EASE.in);
  if (inn <= 0 || out >= 1) return null;
  const top = SAFE.top + (VIDEO.height - SAFE.top - SAFE.bottom - PHONE.h) / 2;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (VIDEO.width - PHONE.w) / 2,
          top,
          transformOrigin: "70% 100%",
          transform: `translate(${(1 - inn) * 260 + out * 120}px, ${(1 - inn) * 1500 + out * 1700}px) rotate(${(1 - inn) * 14 + out * 8}deg) scale(${0.7 + 0.3 * inn})`,
        }}
      >
        <PhoneLock t={t} />
      </div>
    </AbsoluteFill>
  );
};
