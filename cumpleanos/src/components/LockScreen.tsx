import React from "react";
import { biz, brand } from "../brand";
import { clock, copy } from "../copy";
import { font } from "../fonts";
import { RollingClock } from "./RollingClock";

/** Pantalla de bloqueo cálida (con manchas de color para que el vidrio se note), fecha y reloj que rueda. */
export const LockScreen: React.FC<{ clockAt: number; clockOpacity?: number; children?: React.ReactNode }> = ({ clockAt, clockOpacity = 1, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      fontFamily: font,
      color: brand.colors.white,
      background: `radial-gradient(circle at 22% 66%, ${biz.primary}AA 0%, rgba(232,180,184,0) 36%),
        radial-gradient(circle at 85% 42%, ${biz.accent}88 0%, rgba(201,164,106,0) 34%),
        radial-gradient(circle at 55% 92%, ${biz.deep} 0%, rgba(122,46,58,0) 45%),
        linear-gradient(170deg, #2A141B 0%, ${biz.wallpaperBase} 50%, #0B0507 100%)`,
    }}
  >
    <div style={{ opacity: clockOpacity }}>
      <div style={{ position: "absolute", top: 118, width: "100%", textAlign: "center", fontSize: 34, fontWeight: 600, opacity: 0.92 }}>{copy.lockDate}</div>
      <div style={{ position: "absolute", top: 150, width: "100%", fontWeight: 600, letterSpacing: "-0.03em" }}>
        <RollingClock from={clock.before} to={clock.at} at={clockAt} size={176} color={brand.colors.white} />
      </div>
    </div>
    {children}
    <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", width: 230, height: 9, borderRadius: 99, background: "rgba(255,255,255,0.85)" }} />
  </div>
);
