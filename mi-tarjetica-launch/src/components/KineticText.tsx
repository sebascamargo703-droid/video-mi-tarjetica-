import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts, tracking as trackingTokens } from "../fonts";
import { useLayout } from "../lib/layout";
import { EASE_OUT_FAST, EXIT_RATIO, ease, useS } from "../lib/motion";

type Props = {
  text: string;
  /** Tamaño en px a escala 1080 (se multiplica por `u`). */
  size: number;
  color: string;
  accent?: string;
  weight?: 400 | 600 | 800;
  font?: "display" | "body";
  align?: "left" | "center";
  lineHeight?: number;
  tracking?: string;
  /** Frame (relativo a la escena) en que entra la primera palabra. */
  delay?: number;
  /** Frames entre palabra y palabra. */
  stagger?: number;
  /** Duración de entrada por palabra (segundos). */
  enterSec?: number;
  /** Frame en que empieza la salida. */
  exitAt?: number;
  style?: React.CSSProperties;
};

type Word = { text: string; accent: boolean };

const parse = (text: string): Word[][] => {
  let inAccent = false;
  return text.split("\n").map((line) =>
    line
      .split(" ")
      .filter(Boolean)
      .map((raw) => {
        let w = raw;
        if (w.startsWith("*")) {
          inAccent = true;
          w = w.slice(1);
        }
        const accent = inAccent;
        if (w.endsWith("*")) {
          inAccent = false;
          w = w.slice(0, -1);
        }
        return { text: w, accent };
      }),
  );
};

/**
 * Texto cinético: palabra por palabra, con desplazamiento vertical,
 * opacidad y desenfoque 8px → 0. Las salidas duran ~60% de la entrada.
 */
export const KineticText: React.FC<Props> = ({
  text,
  size,
  color,
  accent,
  weight = 800,
  font = "display",
  align = "center",
  lineHeight = 1.02,
  tracking,
  delay = 0,
  stagger = 3,
  enterSec = 0.8,
  exitAt = Infinity,
  style,
}) => {
  const frame = useCurrentFrame();
  const s = useS();
  const { u } = useLayout();
  const lines = parse(text);
  const enterDur = s(enterSec);
  const exitDur = Math.round(enterDur * EXIT_RATIO);
  const letterSpacing =
    tracking ?? (size >= 80 ? trackingTokens.display : trackingTokens.title);

  let index = 0;
  return (
    <div
      style={{
        fontFamily: font === "display" ? fonts.display : fonts.body,
        fontWeight: weight,
        fontSize: size * u,
        lineHeight,
        letterSpacing,
        color,
        textAlign: align,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: align === "center" ? "center" : "flex-start",
            columnGap: "0.24em",
          }}
        >
          {line.map((word, wi) => {
            const i = index++;
            const t = ease(frame, delay + i * stagger, enterDur);
            const out =
              exitAt === Infinity
                ? 0
                : ease(
                    frame,
                    exitAt + Math.round(i * stagger * 0.4),
                    exitDur,
                    EASE_OUT_FAST,
                  );
            const y = (1 - t) * 38 * u - out * 22 * u;
            const blur = (1 - t) * 8 * u + out * 6 * u;
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  transform: `translateY(${y}px)`,
                  opacity: t * (1 - out),
                  filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                  color: word.accent && accent ? accent : undefined,
                  willChange: "transform, opacity, filter",
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
