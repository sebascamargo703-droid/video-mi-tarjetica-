import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { enterProgress, enterStyle } from "../lib/anim";
import { colors, fonts, gradients, weights } from "../theme";

export type TitleToken = {
  text: string;
  color?: string;
  /** Pinta la palabra con el gradiente azul → violeta. */
  gradient?: boolean;
  /** Ícono vectorial que reemplaza al emoji; recibe el tamaño en px. */
  icon?: (size: number) => React.ReactNode;
};

/**
 * Titular cinético: entra palabra por palabra con fade + translateY + blur→nítido.
 * `lines` es un arreglo de líneas; cada línea, un arreglo de palabras.
 */
export const KineticTitle: React.FC<{
  lines: TitleToken[][];
  /** Tamaño de fuente en px. */
  size: number;
  u: number;
  delay?: number;
  stagger?: number;
  align?: "left" | "center";
  weight?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({
  lines,
  size,
  u,
  delay = 0,
  stagger = 4,
  align = "center",
  weight = weights.heavy,
  lineHeight = 1.02,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let index = 0;

  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: fonts.trackingTight,
        color: colors.white,
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
            alignItems: "center",
            columnGap: size * 0.26,
          }}
        >
          {line.map((token, ti) => {
            const p = enterProgress(frame, fps, delay + index++ * stagger);
            return (
              <span
                key={ti}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  ...enterStyle(p, u),
                }}
              >
                {token.text ? (
                  <span
                    style={
                      token.gradient
                        ? {
                            backgroundImage: gradients.brandText,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                            paddingBottom: size * 0.08,
                            marginBottom: -size * 0.08,
                          }
                        : { color: token.color ?? colors.white }
                    }
                  >
                    {token.text}
                  </span>
                ) : null}
                {token.icon ? (
                  <span
                    style={{
                      marginLeft: token.text ? size * 0.2 : 0,
                      display: "inline-flex",
                      transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
                    }}
                  >
                    {token.icon(size * 0.78)}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * Frase con subrayado que se dibuja de izquierda a derecha.
 * `progress` 0→1 controla el trazo; el color de la frase sube a azul con él.
 */
export const UnderlinedPhrase: React.FC<{
  text: string;
  size: number;
  u: number;
  progress: number;
  color?: string;
}> = ({ text, size, u, progress, color = colors.blueText }) => (
  <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
    <span style={{ color: interpolateColors(progress, [0, 0.5], [colors.white, color]) }}>
      {text}
    </span>
    <span
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -size * 0.1,
        height: Math.max(3, size * 0.075),
        borderRadius: 999,
        background: gradients.brand,
        transformOrigin: "left center",
        transform: `scaleX(${progress})`,
        boxShadow: `0 0 ${18 * u}px rgba(47,107,255,0.6)`,
      }}
    />
  </span>
);
