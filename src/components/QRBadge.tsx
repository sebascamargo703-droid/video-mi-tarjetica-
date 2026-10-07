import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { colors, fonts, gradients, shadows, weights } from "../theme";

/**
 * QR dentro de un marco redondeado de cristal con borde en gradiente y glow.
 * El QR se escala con `pixelated` para que siga nítido en 4K.
 */
export const QRBadge: React.FC<{
  size: number;
  u: number;
  src?: string;
  label?: string;
}> = ({ size, u, src = "assets/qr_mitarjetica.png", label = "Escanéame" }) => {
  const frame = useCurrentFrame();
  const glow = 0.32 + Math.sin(frame / 14) * 0.08;
  const pad = size * 0.075;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 * u }}>
      <div
        style={{
          padding: 3 * u,
          borderRadius: 24 * u + 3 * u,
          background: gradients.brand,
          boxShadow: `${shadows.glowBlue(u, glow)}, ${shadows.float(u)}`,
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            padding: pad,
            boxSizing: "border-box",
            borderRadius: 24 * u,
            background: "#FFFFFF",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{ width: "100%", height: "100%", imageRendering: "pixelated", display: "block" }}
          />
        </div>
      </div>
      <span
        style={{
          fontFamily: fonts.text,
          fontWeight: weights.semibold,
          fontSize: 26 * u,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: colors.textSecondary,
          textShadow: shadows.text(u),
        }}
      >
        {label}
      </span>
    </div>
  );
};
