import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

interface PhoneMockupProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  rotateY?: number;
  rotateX?: number;
  floatY?: number;
  scale?: number;
}

/**
 * Apple Keynote 3D iPhone 15/16 Pro Chassis
 * Titanium edge gradients, Dynamic Island, glass reflection sweep, perspective transforms.
 */
export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  width = 920,
  height = 1860,
  rotateY = -6,
  rotateX = 5,
  floatY = 0,
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();

  const sheenTranslate = interpolate(frame % 150, [0, 150], [-120, 240]);

  return (
    <div
      style={{
        width,
        height,
        transform: `perspective(1600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(${floatY}px) scale(${scale})`,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Titanium Outer Rim */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #44444e 0%, #1c1c21 50%, #2e2e36 100%)",
          borderRadius: "80px",
          padding: "24px",
          boxSizing: "border-box",
          border: "4px solid rgba(255, 255, 255, 0.22)",
          position: "relative",
          boxShadow:
            "inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 6px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Screen Bezel & Display */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#05070D",
            borderRadius: "62px",
            overflow: "hidden",
            position: "relative",
            padding: "36px 32px 32px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 48,
              backgroundColor: "#000000",
              borderRadius: "28px",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "#1e1e24",
              }}
            />
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: theme.colors.successGreen,
                boxShadow: `0 0 10px ${theme.colors.successGreen}`,
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
              fontSize: "22px",
              fontWeight: theme.typography.weights.bold,
              marginBottom: "20px",
              marginTop: "24px",
            }}
          >
            <span>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>Apple Wallet</span>
              <span style={{ color: theme.colors.successGreen }}>●</span>
            </div>
          </div>

          {/* Glass Specular Sheen Sweep */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: `${sheenTranslate}%`,
              width: "55%",
              height: "200%",
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%)",
              transform: "rotate(25deg)",
              pointerEvents: "none",
              zIndex: 45,
            }}
          />

          {/* Inner Content */}
          <div style={{ flex: 1, position: "relative" }}>{children}</div>
        </div>
      </div>
    </div>
  );
};
