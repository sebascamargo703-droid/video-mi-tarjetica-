import React from "react";
import { fonts } from "../fonts";

const StatusBar: React.FC<{ w: number; color: string; time: string }> = ({
  w,
  color,
  time,
}) => (
  <div
    style={{
      position: "absolute",
      top: w * 0.05,
      left: w * 0.1,
      right: w * 0.09,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color,
      fontFamily: fonts.body,
      fontWeight: 600,
      fontSize: w * 0.044,
      zIndex: 5,
    }}
  >
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
    <div style={{ display: "flex", alignItems: "center", gap: w * 0.016 }}>
      {/* señal */}
      <svg width={w * 0.05} height={w * 0.034} viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={i * 4.6}
            y={9 - i * 3}
            width={3.2}
            height={3 + i * 3}
            rx={1}
            fill={color}
          />
        ))}
      </svg>
      {/* wifi */}
      <svg width={w * 0.046} height={w * 0.034} viewBox="0 0 16 12">
        <path
          d="M8 11.2l2.2-2.6a3.3 3.3 0 0 0-4.4 0L8 11.2ZM3.4 5.8a7 7 0 0 1 9.2 0l-1.4 1.6a5 5 0 0 0-6.4 0L3.4 5.8ZM.9 3a10.6 10.6 0 0 1 14.2 0l-1.4 1.6a8.5 8.5 0 0 0-11.4 0L.9 3Z"
          fill={color}
        />
      </svg>
      {/* batería */}
      <div
        style={{
          width: w * 0.07,
          height: w * 0.034,
          borderRadius: w * 0.01,
          border: `${w * 0.004}px solid ${color}`,
          opacity: 0.95,
          padding: w * 0.004,
          display: "flex",
        }}
      >
        <div
          style={{ width: "78%", background: color, borderRadius: w * 0.005 }}
        />
      </div>
    </div>
  </div>
);

/**
 * Teléfono genérico construido con divs: marco metálico, bisel negro,
 * isla superior y un reflejo sutil. Sin logos de ninguna marca.
 */
export const PhoneMockup: React.FC<{
  width: number;
  screenBg?: string;
  statusColor?: string;
  time?: string;
  shadow?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  width: w,
  screenBg = "#000",
  statusColor = "#fff",
  time = "10:24",
  shadow,
  style,
  children,
}) => {
  const h = w * 2.06;
  const frameR = w * 0.165;
  const framePad = w * 0.012;
  const bezel = w * 0.026;
  const screenR = frameR - framePad - bezel * 0.6;

  const button = (
    side: "left" | "right",
    top: number,
    height: number,
  ): React.CSSProperties => ({
    position: "absolute",
    [side]: -w * 0.009,
    top: h * top,
    width: w * 0.014,
    height: h * height,
    borderRadius: w * 0.01,
    background: "linear-gradient(90deg, #2a2a2c, #4a4a4e, #2a2a2c)",
  });

  return (
    <div style={{ width: w, height: h, position: "relative", ...style }}>
      <div style={button("left", 0.2, 0.045)} />
      <div style={button("left", 0.28, 0.075)} />
      <div style={button("left", 0.37, 0.075)} />
      <div style={button("right", 0.3, 0.11)} />
      {/* Marco */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: frameR,
          padding: framePad,
          background:
            "linear-gradient(145deg, #5a5a5f 0%, #2a2a2d 22%, #18181a 50%, #333336 78%, #6a6a70 100%)",
          boxShadow: shadow,
        }}
      >
        {/* Bisel */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: frameR - framePad,
            background: "#050505",
            padding: bezel,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Pantalla */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: screenR,
              background: screenBg,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {children}
            <StatusBar w={w} color={statusColor} time={time} />
            {/* Isla */}
            <div
              style={{
                position: "absolute",
                top: w * 0.035,
                left: "50%",
                transform: "translateX(-50%)",
                width: w * 0.29,
                height: w * 0.085,
                borderRadius: 999,
                background: "#000",
                zIndex: 6,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: w * 0.035,
                  top: "50%",
                  width: w * 0.026,
                  height: w * 0.026,
                  transform: "translateY(-50%)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 35%, #2b3a55 0%, #0b0f18 70%)",
                }}
              />
            </div>
            {/* Reflejo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 28%, rgba(255,255,255,0) 42%)",
                pointerEvents: "none",
                zIndex: 7,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Ancho útil de la pantalla para colocar contenido dentro del teléfono. */
export const phoneScreenWidth = (w: number) => w - w * 0.012 * 2 - w * 0.026 * 2;
