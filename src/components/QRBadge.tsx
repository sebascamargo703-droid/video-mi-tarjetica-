import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface QRBadgeProps {
  url?: string;
  buttonText?: string;
  size?: number;
}

export const QRBadge: React.FC<QRBadgeProps> = ({
  url = "https://mitarjetica.com",
  buttonText = "Empieza hoy en el enlace del perfil 🚀",
  size = 560,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const scale = spring({
    frame,
    fps,
    config: theme.springs.smooth,
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle breathing pulse for the CTA button
  const pulse = Math.sin(frame * 0.1) * 0.03 + 1;

  // Generate a clean stylized 25x25 QR matrix pattern in SVG
  const qrGrid = React.useMemo(() => {
    const size = 25;
    const grid: boolean[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => false)
    );

    // Corner positioning squares (7x7)
    const stampCorner = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startY + r][startX + c] = isBorder || isCenter;
        }
      }
    };

    stampCorner(0, 0);
    stampCorner(size - 7, 0);
    stampCorner(0, size - 7);

    // Pseudo-random deterministic filling for the body
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip corner detection zones
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= size - 8;
        const inBottomLeft = r >= size - 8 && c < 8;
        const inCenter = r >= 10 && r <= 14 && c >= 10 && c <= 14; // Leave room for badge logo

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenter) {
          grid[r][c] = random() > 0.48;
        }
      }
    }

    return grid;
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Outer Card with Glassmorphic Border and Glow */}
      <div
        style={{
          position: "relative",
          padding: 36,
          borderRadius: 48,
          background: "rgba(18, 18, 28, 0.85)",
          backdropFilter: "blur(40px)",
          border: "1.5px solid rgba(255, 255, 255, 0.16)",
          boxShadow: `
            0 40px 100px -20px rgba(0, 0, 0, 0.9),
            0 0 80px -10px rgba(47, 107, 255, 0.35),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)
          `,
        }}
      >
        {/* White QR Island */}
        <div
          style={{
            position: "relative",
            width: size,
            height: size,
            background: "#FFFFFF",
            borderRadius: 32,
            padding: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <svg
            viewBox="0 0 25 25"
            style={{
              width: "100%",
              height: "100%",
              shapeRendering: "crispEdges",
            }}
          >
            {qrGrid.map((row, r) =>
              row.map((active, c) =>
                active ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c}
                    y={r}
                    width={1}
                    height={1}
                    fill="#0A0A0F"
                    rx={0.15}
                  />
                ) : null
              )
            )}
          </svg>

          {/* Central Logo in QR */}
          <div
            style={{
              position: "absolute",
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: "28%",
              background: "#0A0A0F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              border: "3px solid #FFFFFF",
            }}
          >
            {/* MiTarjetica Star / Sparkle Icon */}
            <svg
              width={size * 0.12}
              height={size * 0.12}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"
                fill="url(#qrStarGrad)"
              />
              <defs>
                <linearGradient
                  id="qrStarGrad"
                  x1="2"
                  y1="2"
                  x2="22"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2F6BFF" />
                  <stop offset="1" stopColor="#7A5CFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Small Domain Pill under QR */}
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontFamily: theme.typography.fontFamily,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Escanea o visita <span style={{ color: "#2F6BFF" }}>mitarjetica.com</span>
        </div>
      </div>

      {/* Button CTA with Pulse */}
      <div
        style={{
          transform: `scale(${pulse})`,
          padding: "26px 56px",
          borderRadius: 9999,
          background: "linear-gradient(135deg, #2F6BFF 0%, #7A5CFF 100%)",
          boxShadow: `
            0 20px 50px -10px rgba(47, 107, 255, 0.6),
            0 0 30px rgba(122, 92, 255, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.4)
          `,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: theme.typography.fontFamily,
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
        }}
      >
        <span>{buttonText}</span>
      </div>
    </div>
  );
};
