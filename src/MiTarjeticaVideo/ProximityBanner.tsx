import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface ProximityBannerProps {
  startFrame: number;
  durationFrames: number;
}

export const ProximityBanner: React.FC<ProximityBannerProps> = ({
  startFrame,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > durationFrames) return null;

  // Elastic entrance from top
  const entrance = spring({
    frame: relFrame,
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 120 },
  });

  const exit = interpolate(
    relFrame,
    [durationFrames - 15, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Radar beacon pulsing waves
  const beaconPhase = (relFrame % 30) / 30;

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - entrance) * -120}px) scale(${entrance * exit})`,
        opacity: entrance * exit,
        width: "92%",
        maxWidth: "960px",
        backgroundColor: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        border: "1.5px solid rgba(255, 255, 255, 0.22)",
        borderRadius: "32px",
        padding: "20px 24px",
        boxSizing: "border-box",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 230, 118, 0.35)",
        zIndex: 50,
        display: "flex",
        gap: "20px",
        alignItems: "center",
      }}
    >
      {/* Wallet Icon with Pulsing Radar Beacon */}
      <div
        style={{
          position: "relative",
          width: 68,
          height: 68,
          borderRadius: "20px",
          backgroundColor: "#030712",
          border: "2px solid #334155",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "34px",
          flexShrink: 0,
          boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
        }}
      >
        <span>📍</span>
        {/* Radar Ring 1 */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "24px",
            border: "2.5px solid #00E676",
            opacity: 1 - beaconPhase,
            transform: `scale(${1 + beaconPhase * 0.45})`,
            pointerEvents: "none",
          }}
        />
        {/* Radar Ring 2 */}
        <div
          style={{
            position: "absolute",
            inset: -12,
            borderRadius: "28px",
            border: "1.5px solid #00E676",
            opacity: Math.max(0, 1 - beaconPhase * 1.3),
            transform: `scale(${1 + beaconPhase * 0.7})`,
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>💳</span>
            <span
              style={{
                color: "#94a3b8",
                fontSize: "16px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Apple Wallet • Aviso de Proximidad
            </span>
          </div>
          <span style={{ color: "#64748b", fontSize: "15px", fontWeight: 700 }}>
            Ahora
          </span>
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "26px",
            lineHeight: "1.25",
            marginTop: "4px",
          }}
        >
          📍 Estás a 50m de <span style={{ color: "#FFE600" }}>[Tu Negocio]</span>
        </div>
        <div
          style={{
            color: "#00E676",
            fontWeight: 800,
            fontSize: "20px",
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>¡Tienes beneficios y premios acumulados esperando! 🎁</span>
        </div>
      </div>
    </div>
  );
};
