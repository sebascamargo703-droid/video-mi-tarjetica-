import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { PhoneMockup } from "../components/PhoneMockup";
import { WalletCard } from "../components/WalletCard";

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: theme.springs.smooth,
  });

  const titleTranslateY = interpolate(entrance, [0, 1], [40, 0]);
  const titleOpacity = interpolate(entrance, [0, 0.4, 1], [0, 0.9, 1]);

  // Subtle continuous 3D float physics
  const floatY = Math.sin(frame * 0.05) * 12;
  const rotateY = -5 + Math.sin(frame * 0.04) * 3;
  const rotateX = 4 + Math.cos(frame * 0.04) * 2;

  // Staggered stamps reveal
  const stampsCount = Math.min(
    10,
    Math.floor(interpolate(frame, [15, 60], [6, 9], { extrapolateRight: "clamp" }))
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* ─── 1. TOP HEADER (STRICTLY IN SKY, Y: 4% - 18%) ─── */}
      <div
        style={{
          position: "absolute",
          top: "4.5%",
          left: "50%",
          transform: `translateX(-50%) translateY(${titleTranslateY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "8px 28px",
            borderRadius: 9999,
            background: "rgba(6, 78, 59, 0.92)",
            border: "2px solid #00E676",
            color: "#FFFFFF",
            fontFamily: theme.typography.fontFamily,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
            boxShadow: "0 10px 30px rgba(0, 230, 118, 0.4)",
          }}
        >
          MI TARJETICA: <span style={{ color: "#00E676" }}>DIGITAL EN SU CELULAR 📲</span>
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: theme.typography.fontFamily,
            fontSize: 68,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1.1,
            textShadow: "0 4px 24px rgba(0,0,0,0.9)",
          }}
        >
          Fidelización nativa en Apple & Google Wallet
        </h2>
      </div>

      {/* ─── 2. 3D IPHONE MOCKUP (PLACED IN LOWER TORSO, Y: 54% - 80%) ─── */}
      {/* His face (Y: 28% - 48%) remains completely uncovered and prominent! */}
      <div
        style={{
          position: "absolute",
          top: "54%",
          left: "50%",
          transform: `translateX(-50%) translateY(${floatY}px) scale(${entrance * 0.48})`,
          transformOrigin: "center top",
        }}
      >
        <PhoneMockup
          width={840}
          height={1640}
          rotateY={rotateY}
          rotateX={rotateX}
          floatY={0}
          scale={1.0}
        >
          <WalletCard
            businessName="Mi Cafetería Favorita"
            stampsCount={stampsCount}
            totalStamps={10}
            activeStampIndex={stampsCount}
          />
        </PhoneMockup>
      </div>
    </div>
  );
};
