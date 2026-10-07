import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface DatabaseHUDProps {
  startFrame: number;
  durationFrames: number;
}

export const DatabaseHUD: React.FC<DatabaseHUDProps> = ({
  startFrame,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > durationFrames) return null;

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

  const floatY = Math.sin(relFrame * 0.08) * 6;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - entrance) * 140 + floatY}px) scale(${entrance * exit})`,
        opacity: entrance * exit,
        zIndex: 42,
        width: "90%",
        maxWidth: "880px",
        backgroundColor: "rgba(10, 16, 28, 0.92)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "2px solid rgba(0, 230, 118, 0.4)",
        borderRadius: "32px",
        padding: "24px 28px",
        boxSizing: "border-box",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 45px rgba(0, 230, 118, 0.3)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>📊</span>
          <div>
            <div style={{ color: "#FFFFFF", fontFamily: "var(--font-montserrat, sans-serif)", fontWeight: 900, fontSize: "20px" }}>
              Panel de Control • Clientes Frecuentes
            </div>
            <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 700 }}>
              Base de datos propia de tu negocio
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0, 230, 118, 0.15)",
            border: "1px solid #00E676",
            padding: "6px 14px",
            borderRadius: "999px",
            color: "#00E676",
            fontSize: "13px",
            fontWeight: 800,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#00E676", boxShadow: "0 0 8px #00E676" }} />
          <span>EN VIVO</span>
        </div>
      </div>

      {/* KPI Counters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "16px 0" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.04)", borderRadius: "18px", padding: "14px 18px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>CLIENTES REGISTRADOS</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
            <span style={{ color: "#FFFFFF", fontSize: "30px", fontWeight: 900 }}>1,420</span>
            <span style={{ color: "#00E676", fontSize: "14px", fontWeight: 800 }}>▲ +28%</span>
          </div>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.04)", borderRadius: "18px", padding: "14px 18px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>TASA DE RETORNO</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
            <span style={{ color: "#FFE600", fontSize: "30px", fontWeight: 900 }}>68.4%</span>
            <span style={{ color: "#00E676", fontSize: "14px", fontWeight: 800 }}>▲ +4.2x</span>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { name: "Camilo R.", action: "Visita #4 registrada por datáfono", time: "Hace 2m", icon: "🟢" },
          { name: "Andrea M.", action: "Canjeó premio: 20% OFF", time: "Hace 8m", icon: "🎁" },
          { name: "Juan P.", action: "Aviso de proximidad recibido", time: "Hace 15m", icon: "📍" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(0, 0, 0, 0.35)",
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>{item.icon}</span>
              <span style={{ color: "#FFFFFF", fontWeight: 800 }}>{item.name}</span>
              <span style={{ color: "#94a3b8", fontWeight: 600 }}>• {item.action}</span>
            </div>
            <span style={{ color: "#64748b", fontWeight: 700 }}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
