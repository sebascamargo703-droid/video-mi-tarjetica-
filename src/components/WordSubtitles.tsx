import React from "react";
import { useCurrentFrame } from "remotion";
import { SUBTITLES_DATA, SubtitleItem } from "../data/subtitles";
import { theme } from "../theme";

interface WordSubtitlesProps {
  customItems?: SubtitleItem[];
  bottomSafePercent?: number;
}

/**
 * Apple/Linear-Grade Dynamic Subtitles
 * 3-4 words window, current active word highlighted with scale 1.08x and full opacity,
 * non-active words at 55% opacity, custom keyword accents, positioned safely in lower third.
 */
export const WordSubtitles: React.FC<WordSubtitlesProps> = ({
  customItems = SUBTITLES_DATA,
  bottomSafePercent = theme.safeArea.bottomPercent,
}) => {
  const frame = useCurrentFrame();

  // Find currently active item
  const activeIndex = customItems.findIndex(
    (item) => frame >= item.startFrame && frame <= item.endFrame
  );

  if (activeIndex === -1) {
    return null;
  }

  // Show a rolling window of 3-4 words around activeIndex
  const startIndex = Math.max(0, activeIndex - 1);
  const visibleItems = customItems.slice(startIndex, startIndex + 3);

  return (
    <div
      style={{
        position: "absolute",
        bottom: `${bottomSafePercent + 3}%`,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        boxSizing: "border-box",
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px 22px",
          flexWrap: "wrap",
          padding: "20px 36px",
          backgroundColor: "rgba(10, 10, 15, 0.65)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: theme.radii.lg,
          border: `1px solid ${theme.colors.surfaceBorder}`,
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75)",
          maxWidth: "1300px",
        }}
      >
        {visibleItems.map((item, idx) => {
          const isActive =
            frame >= item.startFrame && frame <= item.endFrame;

          const color = item.isKeyWord && item.accentColor
            ? item.accentColor
            : isActive
            ? theme.colors.textPrimary
            : theme.colors.textSecondary;

          const opacity = isActive ? 1.0 : 0.55;
          const scale = isActive ? 1.08 : 1.0;

          return (
            <span
              key={`${item.startFrame}-${idx}`}
              style={{
                fontFamily: theme.typography.fontFamily,
                fontWeight: isActive
                  ? theme.typography.weights.heavy
                  : theme.typography.weights.bold,
                fontSize: "52px",
                letterSpacing: theme.typography.letterSpacing,
                color,
                opacity,
                transform: `scale(${scale})`,
                transition: "all 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)",
                textShadow:
                  "0 2px 16px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.4)",
                display: "inline-block",
              }}
            >
              {item.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
