import React from "react";

/** Gota de agua (sello). Llena = sólida; vacía = solo contorno. */
export const DROP_PATH = "M12 1.5 C12 1.5 3.5 11 3.5 15.6 A8.5 8.5 0 0 0 20.5 15.6 C20.5 11 12 1.5 12 1.5 Z";

export const Drop: React.FC<{ size: number; fill: string; stroke?: string; strokeWidth?: number; highlight?: string; fillScale?: number }> = ({
  size,
  fill,
  stroke,
  strokeWidth = 1.6,
  highlight,
  fillScale = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
    {stroke ? <path d={DROP_PATH} fill="none" stroke={stroke} strokeWidth={strokeWidth} /> : null}
    {fillScale > 0.001 ? (
      <g transform={`translate(12 15) scale(${fillScale}) translate(-12 -15)`}>
        <path d={DROP_PATH} fill={fill} />
        {highlight ? <path d="M8.2 14.5 Q8.4 11.6 10.6 9" fill="none" stroke={highlight} strokeWidth={2} strokeLinecap="round" /> : null}
      </g>
    ) : null}
  </svg>
);
