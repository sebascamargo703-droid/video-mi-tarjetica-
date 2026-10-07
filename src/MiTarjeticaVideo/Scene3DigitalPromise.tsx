import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Subtitles } from "./Subtitles";

export const Scene3DigitalPromise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.7, stiffness: 100 },
  });

  const floatY = Math.sin(frame * 0.08) * 12;
  const floatRotate = Math.sin(frame * 0.06) * 2.5;

  // Specular reflection sheen across screen
  const sheenTranslate = interpolate(frame, [0, 150], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit transition
  const exitOpacity = interpolate(frame, [140, 150], [1, 0], {
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
        backgroundColor: "#060910",
        backgroundImage:
          "radial-gradient(circle at 50% 35%, rgba(0, 230, 118, 0.2) 0%, rgba(15, 23, 42, 0.5) 60%, #030712 100%)",
        opacity: exitOpacity,
      }}
    >
      {/* Voiceover */}
      <Audio src={staticFile("audio/vo_scene3.wav")} startFrom={0} volume={1.0} />

      {/* Volumetric Studio Lighting */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 230, 118, 0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADLINE */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          width: "100%",
          textAlign: "center",
          transform: `scale(${phoneEntrance})`,
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 24px",
            background: "rgba(0, 230, 118, 0.15)",
            border: "1px solid rgba(0, 230, 118, 0.4)",
            borderRadius: "999px",
            color: "#00E676",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 800,
            fontSize: "22px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          <span>📲</span>
          <span>PROGRAMA DE FIDELIZACIÓN NATIVO</span>
        </div>
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "56px",
            lineHeight: "1.12",
            textTransform: "uppercase",
            textShadow: "0 10px 40px rgba(0,0,0,0.9)",
          }}
        >
          Tu Tarjetica Digital <br />
          <span
            style={{
              background: "linear-gradient(90deg, #00E676 0%, #00F5D4 50%, #FFE600 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Directo en su Móvil
          </span>
        </h1>
      </div>

      {/* 3D FLOATING SMARTPHONE MOCKUP */}
      <div
        style={{
          position: "absolute",
          top: "47%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${floatY}px) rotate(${floatRotate}deg) scale(${phoneEntrance * 1.05}) perspective(1400px) rotateX(6deg) rotateY(-4deg)`,
          width: 580,
          height: 1040,
          zIndex: 20,
        }}
      >
        {/* Phone Titanium Outer Bezel */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #27272a 0%, #09090b 50%, #27272a 100%)",
            borderRadius: "56px",
            padding: "16px",
            boxSizing: "border-box",
            border: "3px solid #52525b",
            boxShadow:
              "0 45px 120px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 230, 118, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.4)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Screen Display */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#070b12",
              borderRadius: "44px",
              overflow: "hidden",
              position: "relative",
              padding: "50px 24px 24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* Dynamic Specular Sheen */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: `${sheenTranslate}%`,
                width: "60%",
                height: "200%",
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%)",
                transform: "rotate(25deg)",
                pointerEvents: "none",
                zIndex: 45,
              }}
            />

            {/* Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                width: 140,
                height: 32,
                backgroundColor: "#000",
                borderRadius: "20px",
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#1e1e24" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#00E676", boxShadow: "0 0 8px #00E676" }} />
            </div>

            {/* Status bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#94a3b8",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              <span>9:41</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Apple Wallet</span>
                <span style={{ color: "#00E676" }}>●</span>
              </div>
            </div>

            {/* Loyalty Card UI */}
            <div
              style={{
                background: "linear-gradient(150deg, #064e3b 0%, #022c22 60%, #0f172a 100%)",
                borderRadius: "28px",
                padding: "24px",
                border: "2px solid rgba(0, 230, 118, 0.4)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7)",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    PROGRAMA DE LEALTAD
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 900, color: "#FFFFFF" }}>
                    Café & Bistró ☕
                  </div>
                </div>
                <div style={{ backgroundColor: "rgba(0, 230, 118, 0.2)", border: "1px solid #00E676", padding: "6px 14px", borderRadius: "999px", fontSize: "14px", fontWeight: 900, color: "#00E676" }}>
                  9 / 10
                </div>
              </div>

              {/* 10 Stamp Circles */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", backgroundColor: "rgba(0, 0, 0, 0.35)", padding: "16px", borderRadius: "20px" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isLast = num === 10;
                  const active = num <= 9;
                  return (
                    <div
                      key={num}
                      style={{
                        aspectRatio: "1",
                        borderRadius: "50%",
                        backgroundColor: active ? "#00E676" : "rgba(255, 255, 255, 0.08)",
                        border: active ? "2px solid #6ee7b7" : "2px dashed rgba(255, 255, 255, 0.25)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: active ? "#000" : "#64748b",
                        fontWeight: 900,
                        fontSize: isLast ? "22px" : "18px",
                      }}
                    >
                      {active ? "✓" : isLast ? "🎁" : num}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: "14px", color: "#cbd5e1", textAlign: "center", fontWeight: 700 }}>
                Falta 1 sello para tu premio exclusivo 🎁
              </div>
            </div>

            {/* Apple & Google Wallet badge */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", color: "#94a3b8", fontSize: "14px", fontWeight: 700 }}>
              <span>🔒 100% Nativo en Apple & Google Wallet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={150}
        words={[
          { text: "FIDELIZACIÓN", highlight: false },
          { text: "DIGITAL", highlight: true, highlightColor: "green" },
          { text: "EN SU CELULAR 📲", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={320}
      />
    </div>
  );
};
