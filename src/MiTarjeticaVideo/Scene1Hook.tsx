import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Subtitles } from "./Subtitles";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const impactSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 180 },
  });

  // Punch-in zoom around frame 60 ("vuelvan a elegir")
  const zoomSpring = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 110 },
  });

  const baseScale = interpolate(frame, [0, 135], [1.0, 1.04]);
  const punchScale = interpolate(zoomSpring, [0, 1], [0, 0.07]);
  const totalScale = baseScale + punchScale;

  // Smooth exit transition
  const exitOpacity = interpolate(frame, [122, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: "#000",
        opacity: exitOpacity,
      }}
    >
      {/* SFX Audio */}
      <Audio src={staticFile("audio/sub_bass_impact.wav")} startFrom={0} volume={0.9} />
      {frame >= 55 && (
        <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.6} />
      )}

      {/* Main Video with Dynamic Punch-in */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${totalScale})`,
          transformOrigin: "center 42%",
        }}
      >
        <Video
          src={staticFile("clips/clip1_hook_clean.mp4")}
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
            "radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Hook Badge at Top */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${impactSpring})`,
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
        <span>NO NECESITAS MÁS CLIENTES NUEVOS</span>
      </div>

      {/* Hormozi Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={55}
        words={[
          { text: "NO", highlight: false },
          { text: "NECESITAS", highlight: false },
          { text: "CLIENTES", highlight: true, highlightColor: "red" },
          { text: "NUEVOS", highlight: true, highlightColor: "red", emoji: "🛑" },
        ]}
        yOffset={360}
      />

      <Subtitles
        startFrame={56}
        endFrame={135}
        words={[
          { text: "NECESITAS QUE" },
          { text: "TE VUELVAN A ELEGIR", highlight: true, highlightColor: "green", emoji: "⚡" },
        ]}
        yOffset={360}
      />
    </div>
  );
};
