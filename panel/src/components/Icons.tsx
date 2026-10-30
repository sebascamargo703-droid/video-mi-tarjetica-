import React from "react";

/** Íconos de línea (24×24, trazo 2). Todos dibujados con SVG, sin imágenes. */
export type IconName = "scissors" | "users" | "stamp" | "gift" | "chevron" | "info";

const shapes: Record<IconName, React.ReactNode> = {
  scissors: (
    <>
      <circle cx={6.5} cy={17.5} r={3} />
      <circle cx={17.5} cy={17.5} r={3} />
      <path d="M8.6 15.4 L18 3 M15.4 15.4 L6 3" />
    </>
  ),
  users: (
    <>
      <circle cx={9} cy={8} r={3.5} />
      <path d="M2.5 20 C2.5 15.8 5.4 13.5 9 13.5 C12.6 13.5 15.5 15.8 15.5 20" />
      <path d="M15.5 4.8 C17.3 5.2 18.5 6.5 18.5 8.2 C18.5 9.9 17.3 11.2 15.5 11.6 M18 13.9 C20.3 14.6 21.5 16.6 21.5 20" />
    </>
  ),
  stamp: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8 12.3 L10.8 15 L16 9.3" />
    </>
  ),
  gift: (
    <>
      <rect x={3.5} y={8} width={17} height={4.5} rx={1} />
      <path d="M5 12.5 V20 H19 V12.5 M12 8 V20" />
      <path d="M12 8 C9 8 7 6.8 7 5.2 C7 3.9 8.3 3.2 9.4 3.8 C10.8 4.6 12 8 12 8 C12 8 13.2 4.6 14.6 3.8 C15.7 3.2 17 3.9 17 5.2 C17 6.8 15 8 12 8 Z" />
    </>
  ),
  chevron: <path d="M7 10 L12 15 L17 10" />,
  info: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M12 11 V16.5" />
      <circle cx={12} cy={7.6} r={0.6} />
    </>
  ),
};

export const Icon: React.FC<{ name: IconName; size: number; color: string; strokeWidth?: number }> = ({ name, size, color, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
    <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {shapes[name]}
    </g>
  </svg>
);
