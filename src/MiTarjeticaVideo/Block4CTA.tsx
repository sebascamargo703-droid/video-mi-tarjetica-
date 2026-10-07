import React from "react";
import { Audio, Img, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Subtitles } from "./Subtitles";

export const Block4CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA button pop spring at frame 25
  const ctaSpring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 11, mass: 0.4, stiffness: 170 },
  });

  // Continuous glow breathing pulse
  const pulseScale = 1 + Math.sin(frame * 0.22) * 0.04;

  // Logo spring entrance
  const logoSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

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
      {/* SFX Audio on CTA pop */}
      {frame >= 25 && (
        <Audio
          src={staticFile("audio/click_pop.wav")}
          startFrom={0}
          volume={0.85}
        />
      )}

      {/* Main Video */}
      <Video
        src={staticFile("clips/clip3_cta_clean.mp4")}
        style={{
          width: "100%",
          height: "100%",
        }}
        volume={1.0}
      />

      {/* Vignette Gradient for High Contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 25%, transparent 52%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* TOP BRAND HEADER (Apple-Grade Glassmorphism Pill) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${logoSpring})`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            padding: "14px 34px",
            borderRadius: "999px",
            border: "2px solid rgba(0, 230, 118, 0.6)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.8)",
          }}
        >
          <Img
            src={staticFile("brand/mi-tarjetica-icono-verde.png")}
            style={{ width: 44, height: 44, objectFit: "contain" }}
          />
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "28px",
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
              width: "22px",
              height: "22px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: 900,
            }}
          >
            ✓
          </span>
        </div>
      </div>

      {/* Hormozi Subtitles for Block 4 */}
      <Subtitles
        startFrame={0}
        endFrame={75}
        words={[
          { text: "DEJA DE PERDER" },
          { text: "CLIENTES TODOS LOS DÍAS 📉", highlight: true, highlightColor: "red" },
        ]}
        yOffset={440}
      />

      <Subtitles
        startFrame={76}
        endFrame={160}
        words={[
          { text: "COMENTA LA PALABRA" },
          { text: '"TARJETICA"', highlight: true, highlightColor: "yellow", emoji: "👇" },
        ]}
        yOffset={440}
      />

      {/* MAIN CALL TO ACTION PULSING BUTTON */}
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
            cursor: "pointer",
          }}
        >
          <div
            style={{
              color: "#000000",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "46px",
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
                padding: "4px 18px",
                borderRadius: "14px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              "TARJETICA"
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
            📩 Y te enviamos la demo y toda la información por DM
          </div>
        </div>

        {/* Animated Bouncing Indicator */}
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
    </div>
  );
};
