import React from "react";
import { Audio, Img, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { SeamlessTransition } from "./SeamlessTransition";
import { Subtitles } from "./Subtitles";

export const Take8CtaCierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA button pop spring at frame 20
  const ctaSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 11, mass: 0.4, stiffness: 170 },
  });

  const pulseScale = 1 + Math.sin(frame * 0.22) * 0.04;

  return (
    <SeamlessTransition durationInFrames={153} cameraType="medium">
      {/* Soft whoosh on cut */}
      <Audio src={staticFile("audio/whoosh.wav")} startFrom={0} volume={0.3} />
      {frame >= 20 && (
        <Audio
          src={staticFile("audio/click_pop.wav")}
          startFrom={0}
          volume={0.85}
        />
      )}

      {/* User on camera closing */}
      <Video
        src={staticFile("user_clips/take8_cta_cierre.mp4")}
        style={{ width: "100%", height: "100%" }}
        volume={1.0}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.68) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Brand Header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            padding: "12px 32px",
            borderRadius: "999px",
            border: "2px solid rgba(0, 230, 118, 0.6)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.8)",
          }}
        >
          <Img
            src={staticFile("brand/mi-tarjetica-icono-verde.png")}
            style={{ width: 40, height: 40, objectFit: "contain" }}
          />
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "26px",
              letterSpacing: "1px",
            }}
          >
            www.mitarjetica.com
          </span>
          <span
            style={{
              backgroundColor: "#00E676",
              color: "#000",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: 900,
            }}
          >
            ✓
          </span>
        </div>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={55}
        words={[
          { text: "DEJA DE PERDER" },
          { text: "CLIENTES TODOS LOS DÍAS 🛑", highlight: true, highlightColor: "red" },
        ]}
        yOffset={440}
      />

      <Subtitles
        startFrame={56}
        endFrame={153}
        words={[
          { text: "COMENTA LA PALABRA" },
          { text: "TARJETICA", highlight: true, highlightColor: "yellow", emoji: "💬" },
          { text: "Y TE ENVIAMOS LA INFORMACIÓN" },
        ]}
        yOffset={440}
      />

      {/* CALL TO ACTION BUTTON */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: "50%",
          transform: `translateX(-50%) scale(${ctaSpring * pulseScale})`,
          zIndex: 50,
          width: "92%",
          maxWidth: "940px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
            borderRadius: "32px",
            padding: "24px 20px",
            textAlign: "center",
            boxShadow:
              "0 20px 60px rgba(0, 230, 118, 0.65), 0 0 50px rgba(0, 230, 118, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)",
            border: "4px solid #FFFFFF",
          }}
        >
          <div
            style={{
              color: "#000000",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "44px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <span>COMENTA</span>
            <span
              style={{
                backgroundColor: "#000000",
                color: "#FFE600",
                padding: "4px 20px",
                borderRadius: "14px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              TARJETICA
            </span>
            <span>👇</span>
          </div>

          <div
            style={{
              color: "#003b14",
              fontSize: "22px",
              fontWeight: 800,
              marginTop: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            ✨ Y te enviamos toda la información al instante
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "24px",
            fontSize: "44px",
            transform: `translateY(${Math.sin(frame * 0.3) * 8}px)`,
          }}
        >
          <span>👇</span>
          <span>👇</span>
          <span>👇</span>
        </div>
      </div>
    </SeamlessTransition>
  );
};
