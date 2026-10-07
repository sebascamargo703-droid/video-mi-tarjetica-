import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * iPhone 15 Pro flotando en 3D (titanio, Dynamic Island, sombra de contacto).
 * `width` en px; el alto se deriva de la proporción real (71.6 × 146.6 mm).
 */
export const PhoneMockup: React.FC<{
  width: number;
  u: number;
  children?: React.ReactNode;
  /** Rotación base en grados. */
  rotateX?: number;
  rotateY?: number;
  /** Amplitud de la rotación/flotación continua (0 = estático). */
  float?: number;
  style?: React.CSSProperties;
}> = ({ width, u, children, rotateX = 8, rotateY = -14, float = 1, style }) => {
  const frame = useCurrentFrame();
  const height = width * (146.6 / 71.6);
  const bezel = width * 0.028;
  const outerRadius = width * 0.165;
  const innerRadius = outerRadius - bezel;

  const ry = rotateY + Math.sin(frame / 48) * 5 * float;
  const rx = rotateX + Math.cos(frame / 61) * 2.2 * float;
  const lift = Math.sin(frame / 40) * 12 * u * float;

  return (
    <div style={{ position: "relative", width, height, perspective: 2600 * u, ...style }}>
      {/* sombra de contacto */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: -height * 0.07,
          height: height * 0.06,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.85)",
          filter: `blur(${34 * u}px)`,
          transform: `scale(${1 - lift / (300 * u)})`,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translateY(${lift}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        }}
      >
        {/* marco de titanio */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: outerRadius,
            background:
              "linear-gradient(135deg, #8a8a8f 0%, #3a3a3e 18%, #1d1d20 50%, #3c3c40 82%, #96969b 100%)",
            boxShadow: `0 ${50 * u}px ${110 * u}px rgba(0,0,0,0.6), inset 0 0 ${2 * u}px rgba(255,255,255,0.5)`,
            padding: width * 0.012,
          }}
        >
          {/* bisel negro */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: outerRadius - width * 0.012,
              background: "#050506",
              padding: bezel - width * 0.012,
            }}
          >
            {/* pantalla */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: innerRadius,
                overflow: "hidden",
                background: "#000",
              }}
            >
              {children}
              {/* Dynamic Island */}
              <div
                style={{
                  position: "absolute",
                  top: width * 0.03,
                  left: "50%",
                  width: width * 0.3,
                  height: width * 0.088,
                  transform: "translateX(-50%)",
                  borderRadius: 999,
                  background: "#000",
                }}
              />
              {/* reflejo del cristal */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.04) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
        {/* botones laterales */}
        {[0.2, 0.29, 0.38].map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -width * 0.008,
              top: height * t,
              width: width * 0.01,
              height: i === 0 ? height * 0.035 : height * 0.06,
              borderRadius: 4 * u,
              background: "#444448",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: -width * 0.008,
            top: height * 0.3,
            width: width * 0.01,
            height: height * 0.1,
            borderRadius: 4 * u,
            background: "#444448",
          }}
        />
      </div>
    </div>
  );
};

/** Barra de estado de iOS para usar dentro del mockup. */
export const StatusBar: React.FC<{ width: number; time?: string }> = ({ width, time = "9:41" }) => (
  <div
    style={{
      position: "absolute",
      top: width * 0.045,
      left: width * 0.1,
      right: width * 0.085,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#fff",
      fontWeight: 600,
      fontSize: width * 0.045,
      zIndex: 2,
    }}
  >
    <span>{time}</span>
    <span style={{ display: "flex", gap: width * 0.015, alignItems: "center" }}>
      <svg width={width * 0.06} height={width * 0.04} viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.6} y={9 - i * 3} width={3.2} height={3 + i * 3} rx={1} fill="#fff" />
        ))}
      </svg>
      <svg width={width * 0.085} height={width * 0.04} viewBox="0 0 26 12">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke="rgba(255,255,255,0.5)" fill="none" />
        <rect x="2" y="2" width="16" height="8" rx="2" fill="#fff" />
        <rect x="23.5" y="4" width="1.8" height="4" rx="0.9" fill="rgba(255,255,255,0.5)" />
      </svg>
    </span>
  </div>
);
