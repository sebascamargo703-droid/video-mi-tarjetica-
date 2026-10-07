import React from "react";
import { Audio, Img, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Subtitles } from "./Subtitles";

export const Scene7ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA button pop spring at frame 25
  const ctaSpring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 11, mass: 0.4, stiffness: 170 },
  });

  // Database card entrance at frame 10
  const dbSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 130 },
  });

  // Continuous glow breathing pulse
  const pulseScale = 1 + Math.sin(frame * 0.22) * 0.04;

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
      {/* Audio: Locución y SFX */}
      <Audio src={staticFile("audio/vo_scene7.wav")} startFrom={0} volume={1.0} />
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
        volume={0.4}
      />

      {/* Vignette Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.94) 100%)",
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

      {/* CUSTOMER DATABASE & QR MINI-CARD */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: "50%",
          transform: `translateX(-50%) scale(${dbSpring})`,
          width: "90%",
          maxWidth: "920px",
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "2px solid rgba(0, 230, 118, 0.4)",
          borderRadius: "28px",
          padding: "20px 26px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(0,230,118,0.25)",
          zIndex: 42,
        }}
      >
        <div>
          <div style={{ color: "#6ee7b7", fontSize: "14px", fontWeight: 800, textTransform: "uppercase" }}>
            📊 BASE DE DATOS REAL & CLIENTES RECURRENTES
          </div>
          <div style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
            1,420 Clientes Fidelizados
          </div>
          <div style={{ color: "#cbd5e1", fontSize: "16px", marginTop: "2px" }}>
            Nombres, visitas, consumo y recompra automática
          </div>
        </div>

        {/* QR Code in Mini Counter Stand */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "8px",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("assets/qr_mitarjetica.png")}
            style={{ width: 70, height: 70, objectFit: "contain" }}
          />
          <span style={{ color: "#000", fontSize: "10px", fontWeight: 900, marginTop: "2px" }}>
            ESCANEA
          </span>
        </div>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={95}
        words={[
          { text: "BASE DE DATOS REAL" },
          { text: "CON NOMBRES Y VISITAS 📈", highlight: true, highlightColor: "green" },
        ]}
        yOffset={440}
      />

      <Subtitles
        startFrame={96}
        endFrame={195}
        words={[
          { text: "EMPIEZA HOY EN EL" },
          { text: "ENLACE DEL PERFIL 🚀", highlight: true, highlightColor: "yellow", emoji: "👇" },
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
            cursor: "pointer",
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
            <span>ENTRA AL</span>
            <span
              style={{
                backgroundColor: "#000000",
                color: "#FFE600",
                padding: "4px 18px",
                borderRadius: "14px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              ENLACE DEL PERFIL
            </span>
            <span>🚀</span>
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
            ✨ O Comenta "TARJETICA" y crea tu tarjeta digital hoy
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
    </div>
  );
};
