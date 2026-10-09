import React from "react";
import { font } from "../fonts";

/** Celular genérico hecho con divs: marco, bisel, isla y reflejo. Sin logos. */
export const Phone: React.FC<{
  width: number;
  screenBg?: string;
  statusColor?: string;
  time?: string;
  shadow?: string;
  children?: React.ReactNode;
}> = ({ width: w, screenBg = "#000", statusColor = "#fff", time = "7:42", shadow, children }) => {
  const h = w * 2.06;
  const frameR = w * 0.165;
  const pad = w * 0.012;
  const bezel = w * 0.026;
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      {(
        [
          ["left", 0.2, 0.045],
          ["left", 0.28, 0.075],
          ["left", 0.37, 0.075],
          ["right", 0.3, 0.11],
        ] as const
      ).map(([side, top, hh], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            [side]: -w * 0.009,
            top: h * top,
            width: w * 0.014,
            height: h * hh,
            borderRadius: w * 0.01,
            background: "linear-gradient(90deg, #2a2a2c, #4a4a4e, #2a2a2c)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: frameR,
          padding: pad,
          background: "linear-gradient(145deg, #5a5a5f 0%, #2a2a2d 22%, #18181a 50%, #333336 78%, #6a6a70 100%)",
          boxShadow: shadow,
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: frameR - pad, background: "#050505", padding: bezel }}>
          <div style={{ width: "100%", height: "100%", borderRadius: frameR - pad - bezel * 0.6, background: screenBg, position: "relative", overflow: "hidden" }}>
            {children}
            <div
              style={{
                position: "absolute",
                top: w * 0.05,
                left: w * 0.1,
                right: w * 0.09,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: statusColor,
                fontFamily: font,
                fontWeight: 600,
                fontSize: w * 0.044,
                zIndex: 5,
              }}
            >
              <span>{time}</span>
              <div style={{ width: w * 0.07, height: w * 0.034, borderRadius: w * 0.01, border: `${w * 0.004}px solid ${statusColor}`, padding: w * 0.004, display: "flex" }}>
                <div style={{ width: "70%", background: statusColor, borderRadius: w * 0.005 }} />
              </div>
            </div>
            <div style={{ position: "absolute", top: w * 0.035, left: "50%", transform: "translateX(-50%)", width: w * 0.29, height: w * 0.085, borderRadius: 999, background: "#000", zIndex: 6 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 28%, rgba(255,255,255,0) 42%)", pointerEvents: "none", zIndex: 7 }} />
          </div>
        </div>
      </div>
    </div>
  );
};
