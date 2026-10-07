import React from "react";
import { colors } from "../theme";

/**
 * Íconos vectoriales limpios que reemplazan a los emojis nativos
 * (🛑 📉 📲 📍 📊 ⚡ 🚀 ☕ ✓). Todos se dimensionan con `size` (px).
 */
type IconProps = { size: number; color?: string; style?: React.CSSProperties };

const base = (size: number, style?: React.CSSProperties): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  style: { display: "inline-block", flexShrink: 0, ...style },
});

/** 🛑 octágono de alto. */
export const StopIcon: React.FC<IconProps> = ({ size, color = colors.red, style }) => (
  <svg {...base(size, style)}>
    <path
      d="M8.1 2h7.8L22 8.1v7.8L15.9 22H8.1L2 15.9V8.1z"
      fill={color}
      stroke={color}
      strokeWidth={1.2}
      strokeLinejoin="round"
    />
    <rect x="6.6" y="10.6" width="10.8" height="2.8" rx="1.4" fill="#fff" />
  </svg>
);

/** 📉 tendencia a la baja. */
export const TrendDownIcon: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6l6.5 6.5 4-4L21 16" />
    <path d="M15 16h6v-6" />
  </svg>
);

/** 📲 celular con flecha entrante. */
export const PhoneIcon: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)} stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2.5" width="11" height="19" rx="2.8" />
    <path d="M12 18.5h3" />
    <path d="M2.5 11h8M7.5 8l3 3-3 3" />
  </svg>
);

/** 📍 pin de ubicación. */
export const PinIcon: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)}>
    <path
      d="M12 22s7-6.2 7-12.2A7 7 0 0 0 5 9.8C5 15.8 12 22 12 22z"
      fill={color}
    />
    <circle cx="12" cy="9.8" r="2.7" fill="#0A0A0F" />
  </svg>
);

/** 📊 gráfico de barras. */
export const ChartIcon: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)} stroke={color} strokeWidth={2} strokeLinecap="round">
    <path d="M4 20h16" />
    <path d="M7 16v-4M12 16V7M17 16v-6" strokeWidth={2.8} />
  </svg>
);

/** ⚡ rayo. */
export const BoltIcon: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)}>
    <path d="M13.2 2L4.5 13.4h6.3L9.8 22l9.7-12.3h-6.6z" fill={color} strokeLinejoin="round" />
  </svg>
);

/** 🚀 cohete. */
export const RocketIcon: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4.2c2.6-1.4 5-1.6 5.6-1.1.5.6.3 3-1.1 5.6l-6.2 6.2-4.7-4.7z" fill={color} fillOpacity={0.15} />
    <path d="M8.1 10.2L5 10l-2.2 2.2 4.2 1.4M13.8 15.9L14 19l-2.2 2.2-1.4-4.2" />
    <circle cx="15.6" cy="8.4" r="1.4" />
    <path d="M6.8 17.2c-1.4.2-2.5 1.3-2.7 2.7l-.1 1.1 1.1-.1c1.4-.2 2.5-1.3 2.7-2.7" />
  </svg>
);

/** ☕ taza de café. */
export const CoffeeIcon: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)} stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h12v5.5A5.5 5.5 0 0 1 10.5 20h-1A5.5 5.5 0 0 1 4 14.5z" />
    <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
    <path d="M8 2.8c-.6.8.6 1.6 0 2.4M12 2.8c-.6.8.6 1.6 0 2.4" />
  </svg>
);

/** ✓ check que se dibuja con `progress` 0→1. */
export const CheckIcon: React.FC<IconProps & { progress?: number }> = ({
  size,
  color = colors.white,
  progress = 1,
  style,
}) => (
  <svg {...base(size, style)} stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

/** Marca MiTarjetica: tarjeta con tres puntos (versión vectorial del isotipo). */
export const BrandMark: React.FC<IconProps> = ({ size, color = colors.white, style }) => (
  <svg {...base(size, style)} viewBox="0 0 32 20">
    <rect x="1.5" y="1.5" width="29" height="17" rx="6.5" stroke={color} strokeWidth={3} />
    <circle cx="10" cy="10" r="2.4" fill={color} />
    <circle cx="16" cy="10" r="2.4" fill={color} />
    <circle cx="22" cy="10" r="2.9" fill={color} />
  </svg>
);

/** Apple Wallet (interpretación genérica: bolsillo negro con tarjetas de color). */
export const AppleWalletIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
    <rect width="64" height="64" rx="14.5" fill="#000" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14" stroke="rgba(255,255,255,0.18)" />
    <rect x="11" y="12" width="42" height="26" rx="4" fill="#2FA8F6" />
    <rect x="11" y="18" width="42" height="26" rx="4" fill="#3BC26B" />
    <rect x="11" y="24" width="42" height="26" rx="4" fill="#FDB52A" />
    <rect x="11" y="30" width="42" height="26" rx="4" fill="#F35A3E" />
    <path d="M8 36h14c2 0 3 4 10 4s8-4 10-4h14v16a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="#1C1C1E" />
  </svg>
);

/** Google Wallet (interpretación genérica: capas de color). */
export const GoogleWalletIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
    <rect width="64" height="64" rx="14.5" fill="#fff" />
    <rect x="12" y="14" width="40" height="14" rx="5" fill="#EA4335" />
    <rect x="12" y="21" width="40" height="14" rx="5" fill="#FBBC04" />
    <rect x="12" y="28" width="40" height="14" rx="5" fill="#34A853" />
    <path d="M12 40c0-3 2-5 5-5h9c4 0 7 6 13 6l13-4v8c0 3-2 5-5 5H17c-3 0-5-2-5-5z" fill="#4285F4" />
  </svg>
);
