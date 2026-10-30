import { useVideoConfig } from "remotion";

/**
 * Layout responsivo: todo se diseña en una base de 1080 px (lado corto)
 * y se recompone según la orientación — no es un recorte.
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const square = Math.abs(width - height) / Math.max(width, height) < 0.25;
  const u = Math.min(width, height) / 1080;
  return { width, height, vertical, square, u };
};
