import React from "react";

/** Toda escena recibe su duración y cuántos frames se solapa con la siguiente. */
export type SceneProps = { dur: number; out: number };

/** Bloque posicionado por su borde superior y centrado (o a un x dado). */
export const Place: React.FC<{
  top?: number;
  left?: number;
  center?: boolean;
  width?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ top, left, center = true, width, style, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: center ? 0 : left,
      right: center ? 0 : undefined,
      width,
      display: "flex",
      flexDirection: "column",
      alignItems: center ? "center" : "flex-start",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Centra un objeto de tamaño fijo en (cx, cy). */
export const At: React.FC<{
  cx: number;
  cy: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ cx, cy, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: cy,
      transform: "translate(-50%, -50%)",
      ...style,
    }}
  >
    {children}
  </div>
);
