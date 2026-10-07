import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { SeamlessTransition } from "./SeamlessTransition";
import { Subtitles } from "./Subtitles";

export const Take6Proximidad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Notification slide-in spring from top at frame 15
  const notifSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

  const beaconPulse = Math.sin(frame * 0.25) * 0.5 + 0.5;

  return (
    <SeamlessTransition durationInFrames={141} cameraType="medium">
      {/* Soft whoosh on cut */}
      <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.3} />
      {frame >= 15 && (
        <Audio
          src={staticFile("audio/apple_notification.wav")}
          startFrom={0}
          volume={0.9}
        />
      )}

      {/* User on camera walking */}
      <Video
        src={staticFile("user_clips/take6_proximidad.mp4")}
        style={{ width: "100%", height: "100%" }}
        volume={1.0}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Apple Wallet Native Proximity Push Notification (iOS 18 Glassmorphism) */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - notifSpring) * -120}px) scale(${notifSpring})`,
          opacity: interpolate(notifSpring, [0, 0.25, 1], [0, 1, 1]),
          width: "92%",
          maxWidth: "960px",
          backgroundColor: "rgba(24, 30, 44, 0.9)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "2px solid rgba(255, 255, 255, 0.28)",
          borderRadius: "32px",
          padding: "22px 26px",
          boxSizing: "border-box",
          boxShadow: "0 35px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 230, 118, 0.35)",
          zIndex: 50,
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 68,
            height: 68,
            borderRadius: "18px",
            backgroundColor: "#000",
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
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "24px",
              border: "2.5px solid #00E676",
              opacity: 1 - beaconPulse,
              transform: `scale(${1 + beaconPulse * 0.4})`,
              pointerEvents: "none",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#94a3b8", fontSize: "17px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Apple Wallet • Aviso de Proximidad
            </span>
            <span style={{ color: "#64748b", fontSize: "15px", fontWeight: 700 }}>
              Ahora
            </span>
          </div>
          <div style={{ color: "#FFFFFF", fontFamily: "var(--font-montserrat, sans-serif)", fontWeight: 900, fontSize: "26px", lineHeight: "1.2", marginTop: "4px" }}>
            📍 Estás a 50m de <span style={{ color: "#FFE600" }}>[Tu Negocio]</span>.
          </div>
          <div style={{ color: "#00E676", fontWeight: 800, fontSize: "20px", marginTop: "4px" }}>
            ¡Tienes premios y beneficios esperando! 🎁
          </div>
        </div>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={60}
        words={[
          { text: "CON AVISO DE" },
          { text: "PROXIMIDAD 📍", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />

      <Subtitles
        startFrame={61}
        endFrame={141}
        words={[
          { text: "LE AVISA A TU CLIENTE" },
          { text: "CADA VEZ QUE PASA CERCA 🔔", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />
    </SeamlessTransition>
  );
};
