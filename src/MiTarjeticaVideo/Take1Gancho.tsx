import React from "react";
import { Audio, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { SeamlessTransition } from "./SeamlessTransition";
import { Subtitles } from "./Subtitles";

export const Take1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 180 },
  });

  return (
    <SeamlessTransition durationInFrames={132} cameraType="medium">
      {/* SFX */}
      <Audio src={staticFile("audio/sub_bass_impact.wav")} startFrom={0} volume={0.85} />
      {frame >= 50 && (
        <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.4} />
      )}

      {/* User Video */}
      <Video
        src={staticFile("user_clips/take1_gancho.mp4")}
        style={{ width: "100%", height: "100%" }}
        volume={1.0}
      />

      {/* Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Hook Badge */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${badgeSpring})`,
          backgroundColor: "rgba(255, 23, 68, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: "999px",
          fontFamily: "var(--font-montserrat, sans-serif)",
          fontWeight: 900,
          fontSize: "26px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: "0 10px 40px rgba(255, 23, 68, 0.6)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 40,
          border: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <span>🛑</span>
        <span>NO NECESITAS CLIENTES NUEVOS</span>
      </div>

      {/* Kinetic Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={50}
        words={[
          { text: "NO", highlight: false },
          { text: "NECESITAS", highlight: false },
          { text: "CLIENTES", highlight: true, highlightColor: "red" },
          { text: "NUEVOS", highlight: true, highlightColor: "red", emoji: "🛑" },
        ]}
        yOffset={380}
      />

      <Subtitles
        startFrame={51}
        endFrame={132}
        words={[
          { text: "NECESITAS QUE" },
          { text: "TE VUELVAN A ELEGIR", highlight: true, highlightColor: "green", emoji: "⚡" },
        ]}
        yOffset={380}
      />
    </SeamlessTransition>
  );
};
