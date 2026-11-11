import React from "react";

/** Número que rueda tipo odómetro entre enteros. `value` continuo (ej. 2.4 = rodando de 2 a 3). */
export const RollNumber: React.FC<{ value: number; format?: (n: number) => string; lineHeight: number; style?: React.CSSProperties }> = ({
  value,
  format = String,
  lineHeight,
  style,
}) => {
  const base = Math.floor(value + 1e-6);
  const frac = Math.max(0, value - base);
  return (
    <span style={{ position: "relative", display: "inline-block", height: lineHeight, overflow: "hidden", verticalAlign: "bottom", fontVariantNumeric: "tabular-nums", ...style }}>
      <span style={{ display: "block", transform: `translateY(${-frac * lineHeight}px)`, filter: frac > 0.05 && frac < 0.95 ? "blur(1px)" : undefined }}>
        <span style={{ display: "block", height: lineHeight, lineHeight: `${lineHeight}px` }}>{format(base)}</span>
        {frac > 0.001 ? <span style={{ display: "block", height: lineHeight, lineHeight: `${lineHeight}px` }}>{format(base + 1)}</span> : null}
      </span>
    </span>
  );
};
