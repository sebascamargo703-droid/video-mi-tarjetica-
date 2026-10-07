import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Subtitles } from "./Subtitles";

export const Block3Proximity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Notification slide-in spring from top at frame 30
  const notifSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

  // Badge entrance spring
  const badgeSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

  // Gentle camera push-in for depth
  const cameraScale = interpolate(frame, [0, 165], [1.0, 1.05]);

  // Location beacon pulse
  const beaconPulse = Math.sin(frame * 0.25) * 0.5 + 0.5;

  return (
    <div
      style={{
        position: "absolute",
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* SFX Audio */}
      {frame >= 30 && (
        <Audio
          src={staticFile("audio/apple_notification.wav")}
          startFrom={0}
          volume={0.95}
        />
      )}
      {frame >= 25 && (
        <Audio
          src={staticFile("audio/whoosh.wav")}
          startFrom={0}
          volume={0.5}
        />
      )}

      {/* Main Video with Subtle Push-in */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${cameraScale})`,
          transformOrigin: "center 45%",
        }}
      >
        <Video
          src={staticFile("clips/clip2_proximity_clean.mp4")}
          style={{
            width: "100%",
            height: "100%",
          }}
          volume={1.0}
        />
      </div>

      {/* Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 28%, transparent 58%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* TOP FLOATING BADGE */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 40,
          transform: `scale(${badgeSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(0, 230, 118, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#000",
            padding: "12px 28px",
            borderRadius: "999px",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "24px",
            boxShadow: "0 0 35px rgba(0, 230, 118, 0.7)",
            textTransform: "uppercase",
            border: "2px solid #FFFFFF",
          }}
        >
          <span>📡</span>
          <span>GEOLOCALIZACIÓN Y PROXIMIDAD</span>
        </div>
      </div>

      {/* APPLE WALLET NATIVE NOTIFICATION (iOS 18 Glassmorphism) */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - notifSpring) * -140}px) scale(${notifSpring})`,
          opacity: interpolate(notifSpring, [0, 0.25, 1], [0, 1, 1]),
          width: "92%",
          maxWidth: "980px",
          backgroundColor: "rgba(24, 30, 44, 0.88)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "2px solid rgba(255, 255, 255, 0.28)",
          borderRadius: "32px",
          padding: "24px 28px",
          boxSizing: "border-box",
          boxShadow:
            "0 35px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 230, 118, 0.35)",
          zIndex: 50,
          display: "flex",
          gap: "22px",
          alignItems: "flex-start",
        }}
      >
        {/* Apple Wallet Icon with Live Radar Beacon */}
        <div
          style={{
            position: "relative",
            width: 76,
            height: 76,
            borderRadius: "20px",
            backgroundColor: "#000",
            border: "2px solid #334155",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "38px",
            flexShrink: 0,
            boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
          }}
        >
          <span>📍</span>
          {/* Radar Ripple Effect */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "28px",
              border: "3px solid #00E676",
              opacity: 1 - beaconPulse,
              transform: `scale(${1 + beaconPulse * 0.4})`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Notification Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: "19px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Apple Wallet • Aviso de Proximidad
            </span>
            <span
              style={{
                color: "#64748b",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              Ahora
            </span>
          </div>

          <div
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "30px",
              lineHeight: "1.22",
              marginTop: "4px",
            }}
          >
            📍 Estás a 50 metros de <span style={{ color: "#FFE600" }}>[Tu Local]</span>.
          </div>
          <div
            style={{
              color: "#00E676",
              fontWeight: 800,
              fontSize: "23px",
              marginTop: "6px",
            }}
          >
            ¡Pasa ahora y canjea tu premio acumulado! 🎁
          </div>
        </div>
      </div>

      {/* WALLET COMPATIBILITY BADGE AT MID-BOTTOM */}
      <div
        style={{
          position: "absolute",
          bottom: 560,
          right: 40,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "2px solid #00E676",
          padding: "14px 26px",
          borderRadius: "22px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "#fff",
          fontWeight: 800,
          fontSize: "23px",
          zIndex: 45,
          boxShadow: "0 10px 35px rgba(0,0,0,0.7)",
        }}
      >
        <span>⚡ 100% Nativo en Apple & Google Wallet</span>
      </div>

      {/* Hormozi Subtitles for Block 3 */}
      <Subtitles
        startFrame={0}
        endFrame={75}
        words={[
          { text: "CON AVISO DE" },
          { text: "PROXIMIDAD 📍", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={360}
      />

      <Subtitles
        startFrame={76}
        endFrame={165}
        words={[
          { text: "LE AVISA A TU CLIENTE" },
          { text: "CUANDO PASA CERCA", highlight: true, highlightColor: "green", emoji: "🔔" },
        ]}
        yOffset={360}
      />
    </div>
  );
};
