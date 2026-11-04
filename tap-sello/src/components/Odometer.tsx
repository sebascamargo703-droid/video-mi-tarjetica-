import React from "react";

/**
 * Contador tipo odómetro: una tira vertical de números que rueda hasta `value`
 * (que puede ser fraccionario mientras anima).
 */
export const Odometer: React.FC<{
  value: number;
  min: number;
  max: number;
  size: number;
  style?: React.CSSProperties;
}> = ({ value, min, max, size, style }) => {
  const h = size * 1.12;
  const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const width = `${String(max).length * 0.62}em`;
  return (
    <span
      style={{
        display: "inline-block",
        height: h,
        overflow: "hidden",
        verticalAlign: "bottom",
        fontVariantNumeric: "tabular-nums",
        width,
        textAlign: "right",
        fontSize: size,
        lineHeight: `${h}px`,
        ...style,
      }}
    >
      <span style={{ display: "block", transform: `translateY(${-(value - min) * h}px)` }}>
        {nums.map((n) => (
          <span key={n} style={{ display: "block", height: h }}>
            {n}
          </span>
        ))}
      </span>
    </span>
  );
};
