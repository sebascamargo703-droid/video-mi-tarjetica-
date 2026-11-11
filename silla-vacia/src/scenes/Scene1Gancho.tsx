import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, MOMENTS as M, SAFE, SCENES, TEXTS } from "../constants";
import { FONT } from "../fonts";
import { EASE, seg } from "../motion";
import type { CamKey } from "../story";
import { Typewriter } from "../ui/Typewriter";

const S = SCENES.gancho;

/**
 * 1 · GANCHO — plano cerrado sobre la silla vacía que se abre lento.
 * Cámara: arranca pegada al cuero y el cromo, y retrocede hasta mostrar la
 * silla sola bajo el cono de luz ámbar.
 */
export const ganchoCam: CamKey[] = [
  { t: S.from, pos: [-0.05, 1.12, -1.4], target: [-0.72, 0.9, -3.2], fov: 33 },
  { t: S.to, pos: [0.25, 1.5, -0.55], target: [-0.7, 1.22, -3.2], fov: 46, ease: EASE.soft },
];

/** Cuánto sigue visible el texto después de terminar la escena (se desvanece mientras la cámara sale). */
export const GANCHO_TAIL = 0.9;

export const Scene1Gancho: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = S.from + useCurrentFrame() / fps;
  const out = seg(t, S.to + GANCHO_TAIL - 0.45, S.to + GANCHO_TAIL, EASE.soft);
  const line: React.CSSProperties = {
    fontFamily: FONT.text,
    fontWeight: 800,
    letterSpacing: "-0.035em",
    lineHeight: 1.04,
    textAlign: "center",
    textWrap: "balance" as React.CSSProperties["textWrap"],
    textShadow: "0 6px 30px rgba(0,0,0,0.8), 0 0 80px rgba(5,10,24,0.9)",
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 70 }}>
        <Typewriter text={TEXTS.hook1} t={t} start={M.hookLine1} cps={19} cursorColor={COLORS.amber} showCursor={t < M.hookLine2 - 0.1} style={{ ...line, fontSize: 104, color: COLORS.white }} />
        <Typewriter text={TEXTS.hook2} t={t} start={M.hookLine2} cps={23} cursorColor={COLORS.white} showCursor={t >= M.hookLine2 - 0.1} style={{ ...line, fontSize: 88, color: COLORS.amber, marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};
