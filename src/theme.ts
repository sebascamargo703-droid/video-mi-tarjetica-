/**
 * SISTEMA DE DISEÑO · MiTarjetica
 * ─────────────────────────────────────────────────────────────────────────────
 * Todas las medidas de diseño están pensadas en "unidades" (u) sobre un lienzo
 * de 1080 px de lado corto. En 4K (2160 px de lado corto) 1u = 2 px, así que
 * el radio de 24u = 48 px en 4K, un titular de 104u = 208 px, etc.
 * Usa `useLayout()` (src/lib/layout.ts) para obtener `u` en cada componente.
 */
import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Inter variable (100–900) servida localmente desde public/fonts: no depende
// de internet al renderizar. Remotion espera a que cargue antes de cada frame.
const inter = "Inter";
loadFont({
  family: inter,
  url: staticFile("fonts/Inter-Variable.woff2"),
  weight: "100 900",
  format: "woff2",
});

export const colors = {
  black: "#000000",
  ink: "#0A0A0F",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.62)",
  textTertiary: "rgba(255,255,255,0.38)",

  /**
   * Verde oficial de MiTarjetica (#0E5244, tomado de los logos de marca).
   * Se usa tal cual en rellenos: botón, tarjeta, barras, ícono de app.
   */
  brand: "#0E5244",
  /** Mismo matiz (168°), más oscuro: sombras y fondos de la tarjeta. */
  brandDeep: "#072C24",
  /** Mismo matiz, más claro: segundo stop de gradientes y brillos. */
  brandBright: "#19947B",
  /** Mismo matiz con más luminancia: SOLO texto acento sobre negro o video. */
  brandText: "#59CFB7",
  red: "#FF3B30",
  /** Check de éxito: verde de marca (no un verde genérico de iOS). */
  success: "#19947B",

  glass: "rgba(255,255,255,0.07)",
  glassStrong: "rgba(22,22,30,0.62)",
  hairline: "rgba(255,255,255,0.12)",
  hairlineStrong: "rgba(255,255,255,0.22)",
} as const;

export const gradients = {
  brand: `linear-gradient(135deg, ${colors.brand} 0%, ${colors.brandBright} 100%)`,
  brandText: `linear-gradient(100deg, #A8E6D9 0%, ${colors.brandText} 45%, ${colors.brandBright} 100%)`,
  card: `linear-gradient(145deg, ${colors.brandDeep} 0%, ${colors.brand} 50%, #13715E 100%)`,
} as const;

export const fonts = {
  // SF Pro Display solo existe en macOS; Inter es el fallback garantizado.
  display: `"SF Pro Display", ${inter}, system-ui, sans-serif`,
  text: `${inter}, system-ui, sans-serif`,
  tracking: "-0.02em",
  trackingTight: "-0.035em",
} as const;

export const weights = { medium: 500, semibold: 600, bold: 700, heavy: 800 } as const;

/** Springs con damping alto: suaves, sin rebote exagerado. */
export const springs = {
  soft: { damping: 200, stiffness: 90, mass: 1 },
  smooth: { damping: 26, stiffness: 120, mass: 0.9 },
  settle: { damping: 18, stiffness: 140, mass: 0.8 },
  slow: { damping: 200, stiffness: 40, mass: 1.4 },
} as const;

/** cubic-bezier(0.22, 1, 0.36, 1) · "ease-out-quint" usado en slides. */
export const easeOutQuint = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Medidas en unidades u (ver arriba). */
export const radii = { sm: 12, md: 18, lg: 24, xl: 36, full: 9999 } as const;

export const shadows = {
  soft: (u: number) =>
    `0 ${12 * u}px ${40 * u}px rgba(0,0,0,0.35), 0 ${2 * u}px ${8 * u}px rgba(0,0,0,0.25)`,
  float: (u: number) =>
    `0 ${40 * u}px ${90 * u}px rgba(0,0,0,0.55), 0 ${10 * u}px ${30 * u}px rgba(0,0,0,0.35)`,
  glowBrand: (u: number, a = 0.45) =>
    `0 0 ${60 * u}px rgba(25,148,123,${a}), 0 0 ${140 * u}px rgba(14,82,68,${a * 0.6})`,
  text: (u: number) =>
    `0 ${2 * u}px ${10 * u}px rgba(0,0,0,0.55), 0 ${1 * u}px ${2 * u}px rgba(0,0,0,0.35)`,
} as const;

/** Márgenes seguros para Reels/TikTok/Shorts (porcentajes del lienzo). */
export const safeArea = { bottom: 0.12, side: 0.08, top: 0.06 } as const;
