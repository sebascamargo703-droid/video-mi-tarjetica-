/**
 * Design Tokens for MiTarjetica Commercial
 * Inspired by Apple, Stripe and Linear design aesthetics.
 */

export const theme = {
  colors: {
    background: "#000000",
    backgroundSubtle: "#0A0A0F",
    surfaceDark: "rgba(18, 18, 26, 0.75)",
    surfaceGlass: "rgba(255, 255, 255, 0.06)",
    surfaceBorder: "rgba(255, 255, 255, 0.14)",
    surfaceBorderActive: "rgba(255, 255, 255, 0.32)",
    
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.65)",
    textTertiary: "rgba(255, 255, 255, 0.40)",

    // Brand Linear / Stripe accents
    accentBlue: "#2F6BFF",
    accentViolet: "#7A5CFF",
    gradientBrand: "linear-gradient(135deg, #2F6BFF 0%, #7A5CFF 100%)",
    gradientBrandGlow: "linear-gradient(135deg, rgba(47, 107, 255, 0.45) 0%, rgba(122, 92, 255, 0.45) 100%)",

    // Functional accents
    alertRed: "#FF3B30",
    successGreen: "#34C759",
    warningYellow: "#FFCC00",
  },

  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif",
    letterSpacing: "-0.02em",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      heavy: 800,
      black: 900,
    },
  },

  radii: {
    sm: "16px",
    md: "28px",
    lg: "40px",
    xl: "48px",
    full: "9999px",
  },

  springs: {
    // Apple-style smooth, high damping, zero harsh bounce
    smooth: { damping: 20, mass: 0.8, stiffness: 100 },
    gentle: { damping: 24, mass: 1.0, stiffness: 85 },
    punchy: { damping: 14, mass: 0.5, stiffness: 160 },
    float: { damping: 30, mass: 1.2, stiffness: 45 },
  },

  safeArea: {
    bottomPercent: 12, // 12% bottom safe margin for TikTok/Reels UI
    horizontalPercent: 8, // 8% lateral margins
  },
};
