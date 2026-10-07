import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Confetti } from "./Confetti";
import { Subtitles } from "./Subtitles";

export const Scene4Step1Motor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 110 },
  });

  // Stamping at frame 50 (~1.6s into scene 4)
  const isStamped = frame >= 50;
  const stampSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 9, mass: 0.3, stiffness: 240 },
  });

  // Pointer tap interaction
  const touchProgress =
    frame < 25 ? 0 : frame < 46 ? (frame - 25) / 21 : frame < 55 ? 1 : Math.max(0, 1 - (frame - 55) / 14);

  // Prize modal entrance at frame 75
  const prizeSpring = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  // Exit transition
  const exitOpacity = interpolate(frame, [212, 225], [1, 0], {
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
        backgroundColor: "#060a12",
        backgroundImage:
          "radial-gradient(circle at 50% 35%, rgba(0, 230, 118, 0.22) 0%, rgba(15, 23, 42, 0.5) 60%, #030712 100%)",
        opacity: exitOpacity,
      }}
    >
      {/* Audio: Locución y SFX */}
      <Audio src={staticFile("audio/vo_scene4.wav")} startFrom={0} volume={1.0} />
      {frame >= 50 && (
        <Audio src={staticFile("audio/stamp_thud.wav")} startFrom={0} volume={0.9} />
      )}
      {frame >= 75 && (
        <Audio src={staticFile("audio/chime_success.wav")} startFrom={0} volume={0.85} />
      )}

      {/* Confetti Explosion on stamp #10 */}
      <Confetti startFrame={50} durationFrames={70} count={80} />

      {/* TOP HEADER */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          width: "100%",
          textAlign: "center",
          transform: `scale(${entrance})`,
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 26px",
            background: "linear-gradient(90deg, rgba(0, 230, 118, 0.25), rgba(255, 230, 0, 0.2))",
            border: "1.5px solid #00E676",
            borderRadius: "999px",
            color: "#00E676",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "14px",
            boxShadow: "0 0 30px rgba(0, 230, 118, 0.4)",
          }}
        >
          <span>🎁</span>
          <span>PASO 1: EL MOTOR DE RETORNO</span>
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
          Sellos, Premios y <br />
          <span
            style={{
              background: "linear-gradient(90deg, #00E676 0%, #FFE600 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Beneficios Exclusivos
          </span>
        </h1>
      </div>

      {/* 3D SMARTPHONE INTERACTION */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${entrance * 1.05}) perspective(1400px) rotateX(6deg) rotateY(-3deg)`,
          width: 580,
          height: 1040,
          zIndex: 20,
        }}
      >
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

            {/* Apple Wallet Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#94a3b8", fontSize: "15px", fontWeight: 700 }}>
              <span>9:41</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Apple Wallet</span>
                <span style={{ color: "#00E676" }}>●</span>
              </div>
            </div>

            {/* Loyalty Card Pass */}
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
                    TARJETA DIGITAL DE CLIENTE
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 900, color: "#FFFFFF" }}>
                    Café & Bistró ☕
                  </div>
                </div>
                <div style={{ backgroundColor: "rgba(0, 230, 118, 0.2)", border: "1px solid #00E676", padding: "6px 14px", borderRadius: "999px", fontSize: "14px", fontWeight: 900, color: "#00E676" }}>
                  {isStamped ? "10 / 10" : "9 / 10"}
                </div>
              </div>

              {/* 10-Stamp Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", backgroundColor: "rgba(0, 0, 0, 0.35)", padding: "16px", borderRadius: "20px" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isLast = num === 10;
                  const active = isLast ? isStamped : true;
                  return (
                    <div
                      key={num}
                      style={{
                        aspectRatio: "1",
                        borderRadius: "50%",
                        backgroundColor: active ? (isLast ? "#FFE600" : "#00E676") : "rgba(255, 255, 255, 0.08)",
                        border: active ? (isLast ? "3px solid #FFF" : "2px solid #6ee7b7") : "2px dashed rgba(255, 255, 255, 0.25)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: active ? "#000" : "#64748b",
                        fontWeight: 900,
                        fontSize: isLast ? "22px" : "18px",
                        boxShadow: active ? (isLast ? "0 0 25px rgba(255, 230, 0, 0.95)" : "0 0 12px rgba(0, 230, 118, 0.6)") : "none",
                        transform: isLast && isStamped ? `scale(${stampSpring}) rotate(${stampSpring * 360}deg)` : "scale(1)",
                      }}
                    >
                      {active ? (isLast ? "🎁" : "✓") : num}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: "14px", color: "#cbd5e1", textAlign: "center", fontWeight: 700 }}>
                {isStamped ? "🎉 ¡Meta completada! Canjea tu premio en caja." : "Falta 1 sello para tu premio especial."}
              </div>
            </div>
          </div>
        </div>

        {/* Touch tap simulation */}
        {frame < 65 && (
          <div
            style={{
              position: "absolute",
              top: "54%",
              left: "82%",
              transform: `translate(-50%, -50%) scale(${1 + (1 - touchProgress) * 0.7})`,
              opacity: touchProgress,
              zIndex: 60,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 65,
                height: 65,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 230, 0, 0.9)",
                boxShadow: "0 0 35px #FFE600",
                border: "4px solid #FFFFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "30px",
              }}
            >
              👆
            </div>
          </div>
        )}

        {/* Prize Unlocked Modal */}
        {frame >= 70 && (
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: "5%",
              width: "90%",
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "3px solid #FFE600",
              borderRadius: "28px",
              padding: "24px 20px",
              boxSizing: "border-box",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 230, 0, 0.6)",
              transform: `scale(${prizeSpring}) translateY(${(1 - prizeSpring) * 60}px)`,
              zIndex: 70,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "4px" }}>🎁 🎉</div>
            <div style={{ color: "#FFE600", fontSize: "16px", fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              ¡PREMIO DESBLOQUEADO!
            </div>
            <div style={{ color: "#FFFFFF", fontSize: "26px", fontWeight: 900, marginTop: "4px", fontFamily: "var(--font-montserrat, sans-serif)" }}>
              20% OFF ó Producto Gratis
            </div>
            <div style={{ marginTop: "12px", backgroundColor: "#00E676", color: "#000", fontWeight: 900, padding: "10px 18px", borderRadius: "14px", fontSize: "16px", textTransform: "uppercase", boxShadow: "0 0 20px rgba(0, 230, 118, 0.8)" }}>
              Motiva a volver una y otra vez ⚡
            </div>
          </div>
        )}
      </div>

      {/* Subtitles */}
      <Subtitles
        startFrame={0}
        endFrame={110}
        words={[
          { text: "1. SELLOS, PREMIOS" },
          { text: "Y DESCUENTOS 🎁", highlight: true, highlightColor: "green" },
        ]}
        yOffset={300}
      />

      <Subtitles
        startFrame={111}
        endFrame={225}
        words={[
          { text: "RECOMPENSAS AUTOMÁTICAS" },
          { text: "QUE LOS HACEN VOLVER", highlight: true, highlightColor: "yellow", emoji: "🔄" },
        ]}
        yOffset={300}
      />
    </div>
  );
};
