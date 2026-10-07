import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface ConfettiProps {
  startFrame: number;
  durationFrames?: number;
  count?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({
  startFrame,
  durationFrames = 60,
  count = 60,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const colors = ["#00E676", "#FFE600", "#FF1744", "#00E5FF", "#FF9100", "#E040FB", "#FFFFFF"];
    return Array.from({ length: count }).map((_, i) => {
      // Deterministic pseudo-randomness based on index
      const angle = (i / count) * 2 * Math.PI + (i % 5) * 0.2;
      const speed = 350 + (i % 10) * 80;
      const size = 12 + (i % 6) * 4;
      const color = colors[i % colors.length];
      const rotationSpeed = ((i % 2 === 0 ? 1 : -1) * (180 + (i % 7) * 90));
      const shape = i % 3 === 0 ? "circle" : i % 3 === 1 ? "rect" : "strip";
      return { angle, speed, size, color, rotationSpeed, shape, id: i };
    });
  }, [count]);

  if (frame < startFrame || frame > startFrame + durationFrames) {
    return null;
  }

  const progress = (frame - startFrame) / durationFrames;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 80,
      }}
    >
      {particles.map((p) => {
        const distance = p.speed * Math.pow(progress, 0.7);
        const x = Math.cos(p.angle) * distance;
        // Gravity effect
        const y = Math.sin(p.angle) * distance + 400 * Math.pow(progress, 1.8);
        const opacity = interpolate(progress, [0, 0.7, 1], [1, 1, 0]);
        const rotate = progress * p.rotationSpeed;
        const scale = interpolate(progress, [0, 0.1, 1], [0.3, 1.2, 0.6]);

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.shape === "strip" ? p.size * 2 : p.size,
              height: p.shape === "strip" ? p.size * 0.4 : p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "3px",
              opacity,
              transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
              boxShadow: `0 0 12px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
};
