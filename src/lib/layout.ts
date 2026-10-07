import type React from "react";
import { useVideoConfig } from "remotion";
import { safeArea } from "../theme";

export type Rect = { x: number; y: number; w: number; h: number };

export type Layout = {
  W: number;
  H: number;
  /** 1u = lado corto / 1080. */
  u: number;
  isVertical: boolean;
  /** Zona útil respetando márgenes seguros (8% lateral, 12% inferior). */
  safe: Rect;
  /** Dónde vive la persona en los planos a cámara. */
  person: Rect;
  /** Zona para titulares/overlays sobre los planos a cámara (no tapa la cara). */
  headline: Rect;
  /** Línea base (bottom) de los subtítulos, en px. */
  subtitleBottom: number;
  subtitleCenterX: number;
  subtitleMaxWidth: number;
};

export const useLayout = (): Layout => {
  const { width: W, height: H } = useVideoConfig();
  const isVertical = H >= W;
  const u = Math.min(W, H) / 1080;

  const safe: Rect = {
    x: W * safeArea.side,
    y: H * safeArea.top,
    w: W * (1 - safeArea.side * 2),
    h: H * (1 - safeArea.top - safeArea.bottom),
  };

  if (isVertical) {
    return {
      W,
      H,
      u,
      isVertical,
      safe,
      person: { x: 0, y: 0, w: W, h: H },
      // El cielo/fondo superior de la toma: libre hasta ~27% de alto.
      headline: { x: safe.x, y: safe.y, w: safe.w, h: H * 0.21 },
      subtitleBottom: H * (1 - safeArea.bottom) - 40 * u,
      subtitleCenterX: W / 2,
      subtitleMaxWidth: safe.w,
    };
  }

  // 16:9 → la toma vertical vive en un panel 9:16 a la derecha,
  // los titulares a la izquierda.
  const ph = H * 0.9;
  const pw = (ph * 9) / 16;
  const px = W * 0.68 - pw / 2;
  return {
    W,
    H,
    u,
    isVertical,
    safe,
    person: { x: px, y: (H - ph) / 2, w: pw, h: ph },
    headline: { x: safe.x, y: H * 0.16, w: px - safe.x - 80 * u, h: H * 0.5 },
    // en 16:9 los subtítulos van centrados abajo, sobre todo el cuadro
    subtitleBottom: H * 0.93,
    subtitleCenterX: W / 2,
    subtitleMaxWidth: W * 0.6,
  };
};

export const rectStyle = (r: Rect): React.CSSProperties => ({
  position: "absolute",
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});
