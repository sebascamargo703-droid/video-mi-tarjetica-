import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface PhoneMockupProps {
  /** Mode: "wallet" shows the Apple Wallet pass, "stamps" shows the stamp card with reward unlock */
  mode: "wallet" | "stamps";
  startFrame: number;
  durationFrames: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  mode,
  startFrame,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > durationFrames) return null;

  // Spring entrance & exit
  const entrance = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 110 },
  });

  const exit = interpolate(
    relFrame,
    [durationFrames - 15, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Smooth floating 3D physics
  const floatY = Math.sin(relFrame * 0.08) * 8;
  const floatRotateY = -5 + Math.sin(relFrame * 0.05) * 2;
  const floatRotateX = 4 + Math.cos(relFrame * 0.06) * 1.5;

  // Glass specular sheen sweep
  const sheenX = interpolate(relFrame, [0, durationFrames], [-120, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stamp 10 animation trigger at relFrame 45
  const isStamped = mode === "stamps" && relFrame >= 35;
  const stampSpring = spring({
    frame: Math.max(0, relFrame - 35),
    fps,
    config: { damping: 10, mass: 0.35, stiffness: 220 },
  });

  // Reward banner pop at relFrame 55
  const rewardSpring = spring({
    frame: Math.max(0, relFrame - 55),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - entrance) * 180 + floatY}px) perspective(1200px) rotateY(${floatRotateY}deg) rotateX(${floatRotateX}deg) scale(${entrance * exit * 0.94})`,
        opacity: entrance * exit,
        zIndex: 42,
        width: 480,
        height: 640,
        filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 40px rgba(0, 230, 118, 0.3))",
      }}
    >
      {/* Titanium Outer Frame */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #3f3f46 0%, #18181b 50%, #27272a 100%)",
          borderRadius: "50px",
          padding: "12px",
          boxSizing: "border-box",
          border: "2px solid rgba(255, 255, 255, 0.22)",
          position: "relative",
          boxShadow: "inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Screen Display */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#070b12",
            borderRadius: "40px",
            overflow: "hidden",
            position: "relative",
            padding: "20px 20px 16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 26,
              backgroundColor: "#000",
              borderRadius: "18px",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#1e1e24" }} />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#00E676",
                boxShadow: "0 0 6px #00E676",
              }}
            />
          </div>

          {/* Status Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#94a3b8",
              fontSize: "13px",
              fontWeight: 700,
              marginTop: "20px",
            }}
          >
            <span>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Apple Wallet</span>
              <span style={{ color: "#00E676" }}>●</span>
            </div>
          </div>

          {/* Specular Sheen Sweep */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: `${sheenX}%`,
              width: "50%",
              height: "200%",
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%)",
              transform: "rotate(25deg)",
              pointerEvents: "none",
              zIndex: 45,
            }}
          />

          {mode === "wallet" ? (
            /* =================== PASS DIGITAL DE FIDELIDAD =================== */
            <div
              style={{
                flex: 1,
                background: "linear-gradient(155deg, #064e3b 0%, #022c22 55%, #0f172a 100%)",
                borderRadius: "24px",
                padding: "18px 18px 14px",
                border: "1.5px solid rgba(0, 230, 118, 0.4)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#fff",
                position: "relative",
              }}
            >
              {/* Header */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6ee7b7", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>
                      PROGRAMA DE LEALTAD
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 900, color: "#FFFFFF", marginTop: "2px" }}>
                      Café & Bistró ☕
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(0, 230, 118, 0.2)",
                      border: "1px solid #00E676",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 900,
                      color: "#00E676",
                    }}
                  >
                    NIVEL VIP ⭐️
                  </div>
                </div>

                {/* Cardholder Info */}
                <div
                  style={{
                    marginTop: "14px",
                    padding: "10px 14px",
                    background: "rgba(0, 0, 0, 0.35)",
                    borderRadius: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>TITULAR</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff" }}>Cliente Frecuente</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>SELLOS</div>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: "#FFE600" }}>9 / 10</div>
                  </div>
                </div>
              </div>

              {/* NFC Contactless Wave & QR */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 0",
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "14px",
                }}
              >
                <div style={{ fontSize: "22px" }}>📶</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#6ee7b7" }}>
                  Acerca al datáfono o escanea
                </div>
                {/* Barcode Mock */}
                <div
                  style={{
                    display: "flex",
                    gap: "3px",
                    height: "32px",
                    alignItems: "center",
                    opacity: 0.8,
                  }}
                >
                  {[4, 2, 6, 2, 3, 5, 2, 4, 2, 7, 3, 2, 5, 2, 4, 3, 2, 6, 2, 4, 5, 2, 3].map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${w}px`,
                        height: "100%",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "1px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer Badge */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  color: "#94a3b8",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <span>🔒 100% Nativo en Apple & Google Wallet</span>
              </div>
            </div>
          ) : (
            /* =================== TARJETA DE SELLOS INTERACTIVA =================== */
            <div
              style={{
                flex: 1,
                background: "linear-gradient(155deg, #064e3b 0%, #022c22 55%, #0f172a 100%)",
                borderRadius: "24px",
                padding: "16px 16px 12px",
                border: "1.5px solid rgba(0, 230, 118, 0.4)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#fff",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#6ee7b7", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>
                      TARJETA DE SELLOS
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 900, color: "#FFFFFF" }}>
                      10 Visitas = 1 Premio 🎁
                    </div>
                  </div>
                  <div
                    style={{
                      background: isStamped ? "rgba(0, 230, 118, 0.3)" : "rgba(255, 230, 0, 0.2)",
                      border: `1px solid ${isStamped ? "#00E676" : "#FFE600"}`,
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 900,
                      color: isStamped ? "#00E676" : "#FFE600",
                    }}
                  >
                    {isStamped ? "¡COMPLETO!" : "9 / 10"}
                  </div>
                </div>

                {/* 10 Stamps Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    padding: "14px 10px",
                    borderRadius: "16px",
                    marginTop: "12px",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isTen = num === 10;
                    const stamped = num < 10 || isStamped;
                    const scale = isTen && isStamped ? stampSpring : 1;
                    return (
                      <div
                        key={num}
                        style={{
                          aspectRatio: "1",
                          borderRadius: "50%",
                          backgroundColor: stamped ? "#00E676" : "rgba(255, 255, 255, 0.08)",
                          border: stamped ? "2px solid #a7f3d0" : "2px dashed rgba(255, 255, 255, 0.3)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: stamped ? "#000000" : "#64748b",
                          fontWeight: 900,
                          fontSize: isTen ? "18px" : "16px",
                          boxShadow: stamped ? "0 0 10px rgba(0, 230, 118, 0.6)" : "none",
                          transform: `scale(${scale})`,
                        }}
                      >
                        {stamped ? "✓" : isTen ? "🎁" : num}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reward Unlock Banner */}
              {isStamped && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #FFE600 0%, #FFB300 100%)",
                    borderRadius: "16px",
                    padding: "10px 14px",
                    color: "#000",
                    textAlign: "center",
                    transform: `scale(${rewardSpring})`,
                    boxShadow: "0 10px 25px rgba(255, 230, 0, 0.5)",
                    border: "2px solid #FFFFFF",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase" }}>
                    🎉 ¡Premio Desbloqueado!
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "2px" }}>
                    20% OFF ó Bebida Gratis en caja ✨
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  color: "#cbd5e1",
                  fontWeight: 700,
                }}
              >
                {!isStamped
                  ? "¡Falta solo 1 sello para reclamar tu beneficio!"
                  : "Listo para canjear en tu próxima visita"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
