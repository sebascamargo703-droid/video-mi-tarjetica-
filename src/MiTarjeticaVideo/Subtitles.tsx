import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SubtitleWord {
  text: string;
  highlight?: boolean;
  highlightColor?: "yellow" | "green" | "red" | "cyan";
  emoji?: string;
}

interface SubtitlesProps {
  words: SubtitleWord[];
  startFrame: number;
  endFrame: number;
  yOffset?: number; // Distance from bottom in px
}

export const Subtitles: React.FC<SubtitlesProps> = ({
  words,
  startFrame,
  endFrame,
  yOffset = 380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const relativeFrame = frame - startFrame;
  const popSpring = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 12,
      mass: 0.4,
      stiffness: 180,
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: yOffset,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 40px",
        boxSizing: "border-box",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px 16px",
          transform: `scale(${popSpring})`,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(8px)",
          padding: "16px 28px",
          borderRadius: "24px",
          border: "2px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
          maxWidth: "960px",
        }}
      >
        {words.map((w, index) => {
          let bgStyle: React.CSSProperties = {};
          let textColor = "#FFFFFF";

          if (w.highlight) {
            if (w.highlightColor === "green") {
              bgStyle = {
                backgroundColor: "#00E676",
                color: "#000000",
                boxShadow: "0 0 25px rgba(0, 230, 118, 0.8)",
              };
              textColor = "#000000";
            } else if (w.highlightColor === "red") {
              bgStyle = {
                backgroundColor: "#FF1744",
                color: "#FFFFFF",
                boxShadow: "0 0 25px rgba(255, 23, 68, 0.8)",
              };
              textColor = "#FFFFFF";
            } else if (w.highlightColor === "cyan") {
              bgStyle = {
                backgroundColor: "#00E5FF",
                color: "#000000",
                boxShadow: "0 0 25px rgba(0, 229, 255, 0.8)",
              };
              textColor = "#000000";
            } else {
              // default yellow
              bgStyle = {
                backgroundColor: "#FFE600",
                color: "#000000",
                boxShadow: "0 0 25px rgba(255, 230, 0, 0.8)",
              };
              textColor = "#000000";
            }
          }

          return (
            <span
              key={index}
              style={{
                fontFamily: "var(--font-montserrat, sans-serif)",
                fontWeight: 900,
                fontSize: "52px",
                lineHeight: "1.1",
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
                color: textColor,
                padding: w.highlight ? "6px 16px" : "0 4px",
                borderRadius: w.highlight ? "12px" : "0",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                ...bgStyle,
              }}
            >
              {w.text}
              {w.emoji && <span style={{ fontSize: "52px" }}>{w.emoji}</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
};
