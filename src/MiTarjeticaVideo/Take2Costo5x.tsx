import React from "react";
import { Audio, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { SeamlessTransition } from "./SeamlessTransition";
import { Subtitles } from "./Subtitles";

export const Take2Costo5x: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating metric card spring
  const cardSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });

  return (
    <SeamlessTransition durationInFrames={117} cameraType="closeUp">
      {/* Subtle whoosh on cut */}
      <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.35} />

      {/* User on camera */}
      <Video
        src={staticFile("user_clips/take2_costo5x.mp4")}
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

      {/* Sleek Apple-Style Metric Pill on Top */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${cardSpring})`,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "2px solid #FF5252",
          borderRadius: "999px",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 10px 40px rgba(255, 82, 82, 0.4)",
          zIndex: 40,
        }}
      >
        <span style={{ fontSize: "28px" }}>📉</span>
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
          CONSEGUIR CLIENTE NUEVO: <span style={{ color: "#FF5252" }}>5X MÁS CARO</span>
        </span>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={50}
        words={[
          { text: "CONSEGUIR UN" },
          { text: "CLIENTE NUEVO", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />

      <Subtitles
        startFrame={51}
        endFrame={117}
        words={[
          { text: "CUESTA HASTA" },
          { text: "5 VECES MÁS 📉", highlight: true, highlightColor: "red" },
          { text: "QUE RETENERLO" },
        ]}
        yOffset={380}
      />
    </SeamlessTransition>
  );
};
