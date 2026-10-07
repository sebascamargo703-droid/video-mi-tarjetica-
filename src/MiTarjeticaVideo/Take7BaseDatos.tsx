import React from "react";
import { Audio, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { SeamlessTransition } from "./SeamlessTransition";
import { Subtitles } from "./Subtitles";

export const Take7BaseDatos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });

  return (
    <SeamlessTransition durationInFrames={93} cameraType="closeUp">
      {/* Soft whoosh on cut */}
      <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.35} />

      {/* User on camera */}
      <Video
        src={staticFile("user_clips/take7_base_datos.mp4")}
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
          border: "2px solid #00E676",
          borderRadius: "999px",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 10px 40px rgba(0, 230, 118, 0.35)",
          zIndex: 40,
        }}
      >
        <span style={{ fontSize: "28px" }}>📊</span>
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
          BASE DE DATOS REAL • <span style={{ color: "#00E676" }}>NOMBRES Y VISITAS</span>
        </span>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={93}
        words={[
          { text: "Y MANTIENES UNA" },
          { text: "BASE DE DATOS REAL 📊", highlight: true, highlightColor: "green" },
          { text: "ACTUALIZADA DE TU NEGOCIO" },
        ]}
        yOffset={380}
      />
    </SeamlessTransition>
  );
};
