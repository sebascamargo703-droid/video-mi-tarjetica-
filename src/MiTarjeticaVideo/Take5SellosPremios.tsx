import React from "react";
import { Audio, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Confetti } from "./Confetti";
import { SeamlessTransition } from "./SeamlessTransition";
import { Subtitles } from "./Subtitles";

export const Take5SellosPremios: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });

  return (
    <SeamlessTransition durationInFrames={198} cameraType="medium">
      {/* Soft whoosh on cut */}
      <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.3} />
      {frame >= 70 && (
        <Audio src={staticFile("audio/stamp_thud.wav")} startFrom={0} volume={0.8} />
      )}
      {frame >= 95 && (
        <Audio src={staticFile("audio/chime_success.wav")} startFrom={0} volume={0.75} />
      )}

      {/* Confetti Burst at reward mention */}
      <Confetti startFrame={95} durationFrames={60} count={60} />

      {/* User on camera */}
      <Video
        src={staticFile("user_clips/take5_sellos_premios.mp4")}
        style={{ width: "100%", height: "100%" }}
        volume={1.0}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating Badge on Top */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${badgeSpring})`,
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "2px solid #FFE600",
          borderRadius: "999px",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 10px 40px rgba(255, 230, 0, 0.4)",
          zIndex: 40,
        }}
      >
        <span style={{ fontSize: "28px" }}>🎁</span>
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "26px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          ACUMULAN SELLOS • <span style={{ color: "#FFE600" }}>DESCUENTOS Y PREMIOS</span>
        </span>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={90}
        words={[
          { text: "PREMIA LA FIDELIDAD" },
          { text: "DE TUS CLIENTES 🎁", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />

      <Subtitles
        startFrame={91}
        endFrame={198}
        words={[
          { text: "ACUMULAN SELLOS Y OBTIENEN" },
          { text: "DESCUENTOS Y RECOMPENSAS ⭐", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />
    </SeamlessTransition>
  );
};
