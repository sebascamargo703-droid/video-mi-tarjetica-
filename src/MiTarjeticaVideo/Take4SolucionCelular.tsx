import React from "react";
import { Audio, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { SeamlessTransition } from "./SeamlessTransition";
import { Subtitles } from "./Subtitles";

export const Take4SolucionCelular: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 120 },
  });

  return (
    <SeamlessTransition durationInFrames={204} cameraType="closeUp">
      {/* Soft whoosh on cut */}
      <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.35} />

      {/* User on camera */}
      <Video
        src={staticFile("user_clips/take4_solucion_celular.mp4")}
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

      {/* Floating Apple-Grade Digital Card Badge */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${cardSpring})`,
          backgroundColor: "rgba(6, 78, 59, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "2px solid #00E676",
          borderRadius: "999px",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 10px 40px rgba(0, 230, 118, 0.4)",
          zIndex: 40,
        }}
      >
        <span style={{ fontSize: "28px" }}>📲</span>
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
          MI TARJETICA: <span style={{ color: "#00E676" }}>TARJETA DIGITAL EN SU CELULAR</span>
        </span>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={75}
        words={[
          { text: "CADA COMPRA DE HOY = " },
          { text: "VISITA ASEGURADA MAÑANA 🗓️", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />

      <Subtitles
        startFrame={76}
        endFrame={140}
        words={[
          { text: "CON" },
          { text: "MI TARJETICA 📲", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />

      <Subtitles
        startFrame={141}
        endFrame={204}
        words={[
          { text: "UNA TARJETA DIGITAL" },
          { text: "EN EL CELULAR DE TUS CLIENTES", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />
    </SeamlessTransition>
  );
};
