import React from "react";
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Confetti } from "./Confetti";

export const Block2Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for Apple Keynote style 3D Phone
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.7, stiffness: 95 },
  });

  // Smooth cinematic 3D floating rotation and breathing
  const floatY = Math.sin(frame * 0.07) * 14;
  const rotateX = 5 + Math.sin(frame * 0.05) * 2;
  const rotateY = -4 + Math.cos(frame * 0.06) * 3;

  // Stamping action at frame 40
  const isStamped = frame >= 40;
  const stampSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 9, mass: 0.3, stiffness: 240 },
  });

  // Touch Pointer interaction (appears at frame 20, taps at frame 38, fades out at 55)
  const touchProgress =
    frame < 18 ? 0 : frame < 36 ? (frame - 18) / 18 : frame < 44 ? 1 : Math.max(0, 1 - (frame - 44) / 12);

  // Dynamic Island Prize Banner expansion at frame 65
  const prizeSpring = spring({
    frame: Math.max(0, frame - 65),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });

  // Glass specular reflection sheen sweep across the screen
  const sheenTranslate = interpolate(frame, [0, 145], [-120, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit transition into Block 3
  const exitOpacity = interpolate(frame, [135, 145], [1, 0], {
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
        backgroundColor: "#05070c",
        opacity: exitOpacity,
      }}
    >
      {/* SFX Audio */}
      {frame >= 40 && (
        <Audio
          src={staticFile("audio/stamp_thud.wav")}
          startFrom={0}
          volume={0.9}
        />
      )}
      {frame >= 65 && (
        <Audio
          src={staticFile("audio/chime_success.wav")}
          startFrom={0}
          volume={0.85}
        />
      )}

      {/* Confetti & Gold Sparkle Explosion */}
      <Confetti startFrame={40} durationFrames={65} count={80} />

      {/* Cinematic Apple Keynote Studio Lighting (Volumetric Gradient Orbs) */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 750,
          height: 750,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 230, 118, 0.22) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 75%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "5%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 230, 0, 0.15) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADLINE - APPLE STYLE TYPOGRAPHY */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          width: "100%",
          textAlign: "center",
          transform: `scale(${entranceSpring})`,
          zIndex: 30,
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 24px",
            background: "rgba(0, 230, 118, 0.15)",
            border: "1px solid rgba(0, 230, 118, 0.4)",
            borderRadius: "999px",
            color: "#00E676",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 800,
            fontSize: "22px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "16px",
            boxShadow: "0 0 25px rgba(0, 230, 118, 0.3)",
          }}
        >
          <span>✨</span>
          <span>FIDELIZACIÓN 100% NATIVA</span>
        </div>
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "58px",
            lineHeight: "1.12",
            textTransform: "uppercase",
            letterSpacing: "-1px",
            textShadow: "0 10px 40px rgba(0,0,0,0.9)",
          }}
        >
          Sellos, Premios y <br />
          <span
            style={{
              background: "linear-gradient(90deg, #00E676 0%, #00F5D4 45%, #FFE600 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Recompensas Reales
          </span>
        </h1>
      </div>

      {/* 3D FLOATING IPHONE PRO MAX (APPLE SPEC) */}
      <div
        style={{
          position: "absolute",
          top: "47%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${floatY}px) scale(${entranceSpring * 1.05}) perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          width: 590,
          height: 1060,
          zIndex: 20,
        }}
      >
        {/* Phone Titanium Outer Frame with Satin Edge */}
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
              "0 45px 120px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 230, 118, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(0, 0, 0, 0.8)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Glass Display */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#070b12",
              borderRadius: "44px",
              overflow: "hidden",
              position: "relative",
              padding: "54px 26px 26px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Dynamic Specular Sheen (Sweeps diagonally) */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: `${sheenTranslate}%`,
                width: "60%",
                height: "200%",
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.12) 45%, rgba(255, 255, 255, 0.22) 50%, rgba(255, 255, 255, 0.12) 55%, transparent 70%)",
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
                width: 145,
                height: 34,
                backgroundColor: "#000",
                borderRadius: "20px",
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
                boxSizing: "border-box",
                boxShadow: "0 4px 15px rgba(0,0,0,0.8)",
              }}
            >
              <div
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#00E676",
                  boxShadow: "0 0 10px #00E676",
                }}
              />
            </div>

            {/* iOS Status Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#cbd5e1",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              <span>9:41</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Apple Wallet</span>
                <span style={{ color: "#00E676", fontSize: "12px" }}>●</span>
              </div>
            </div>

            {/* DIGITAL LOYALTY CARD (Apple Wallet Native Pass) */}
            <div
              style={{
                background: "linear-gradient(150deg, #064e3b 0%, #022c22 55%, #0f172a 100%)",
                borderRadius: "30px",
                padding: "26px",
                border: "2px solid rgba(0, 230, 118, 0.45)",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                color: "#fff",
                position: "relative",
              }}
            >
              {/* Pass Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6ee7b7",
                      fontWeight: 800,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    TARJETA DIGITAL DE CLIENTE
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      color: "#FFFFFF",
                      fontFamily: "var(--font-montserrat, sans-serif)",
                    }}
                  >
                    Café & Bistró ☕
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(0, 230, 118, 0.25)",
                    border: "1.5px solid #00E676",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: "15px",
                    fontWeight: 900,
                    color: "#00E676",
                    boxShadow: "0 0 15px rgba(0, 230, 118, 0.4)",
                  }}
                >
                  {isStamped ? "10 / 10" : "9 / 10"}
                </div>
              </div>

              {/* 10-STAMP GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "12px",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  padding: "18px",
                  borderRadius: "22px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isLast = num === 10;
                  const active = isLast ? isStamped : true;

                  return (
                    <div
                      key={num}
                      style={{
                        aspectRatio: "1",
                        borderRadius: "50%",
                        backgroundColor: active
                          ? isLast
                            ? "#FFE600"
                            : "#00E676"
                          : "rgba(255, 255, 255, 0.08)",
                        border: active
                          ? isLast
                            ? "3px solid #FFF"
                            : "2px solid #6ee7b7"
                          : "2px dashed rgba(255, 255, 255, 0.25)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: active ? "#000" : "#64748b",
                        fontWeight: 900,
                        fontSize: isLast ? "24px" : "19px",
                        boxShadow: active
                          ? isLast
                            ? "0 0 30px rgba(255, 230, 0, 0.95)"
                            : "0 0 14px rgba(0, 230, 118, 0.6)"
                          : "none",
                        transform:
                          isLast && isStamped
                            ? `scale(${stampSpring}) rotate(${stampSpring * 360}deg)`
                            : "scale(1)",
                      }}
                    >
                      {active ? (isLast ? "🎁" : "✓") : num}
                    </div>
                  );
                })}
              </div>

              {/* Status Note */}
              <div
                style={{
                  fontSize: "15px",
                  color: "#e2e8f0",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {isStamped
                  ? "🎉 ¡Meta completada! Canjea tu premio en caja."
                  : "Falta 1 sello para tu premio especial."}
              </div>
            </div>

            {/* Apple & Google Wallet Indicator */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              <span>🔒 Integrado 100% en Apple & Google Wallet</span>
            </div>
          </div>
        </div>

        {/* TOUCH TAP CURSOR (Apple Style Glow Dot) */}
        {frame < 55 && (
          <div
            style={{
              position: "absolute",
              top: "55%",
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
                boxShadow: "0 0 40px #FFE600",
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

        {/* PRIZE UNLOCKED DYNAMIC MODAL (Apple Card Animation) */}
        {frame >= 60 && (
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
              borderRadius: "30px",
              padding: "26px 22px",
              boxSizing: "border-box",
              boxShadow:
                "0 30px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 230, 0, 0.6)",
              transform: `scale(${prizeSpring}) translateY(${(1 - prizeSpring) * 70}px)`,
              zIndex: 70,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "4px" }}>🎁 🎉</div>
            <div
              style={{
                color: "#FFE600",
                fontSize: "17px",
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              ¡PREMIO DESBLOQUEADO!
            </div>
            <div
              style={{
                color: "#FFFFFF",
                fontSize: "28px",
                fontWeight: 900,
                marginTop: "6px",
                fontFamily: "var(--font-montserrat, sans-serif)",
              }}
            >
              20% OFF ó Café Gratis
            </div>
            <div
              style={{
                marginTop: "14px",
                backgroundColor: "#00E676",
                color: "#000",
                fontWeight: 900,
                padding: "12px 20px",
                borderRadius: "16px",
                fontSize: "17px",
                textTransform: "uppercase",
                boxShadow: "0 0 25px rgba(0, 230, 118, 0.8)",
              }}
            >
              Canjear al instante en caja ⚡
            </div>
          </div>
        )}
      </div>

      {/* FLOATING BOTTOM BANNER */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 30,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "2px solid #00E676",
            borderRadius: "999px",
            padding: "16px 40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 10px 45px rgba(0, 230, 118, 0.5)",
          }}
        >
          <span style={{ fontSize: "34px" }}>🚀</span>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "30px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Sin Apps • Directo al Móvil
          </span>
        </div>
      </div>
    </div>
  );
};
