import React from "react";

/** Marco en arco: rectángulo con tope semicircular. */
export const Arch: React.FC<{ w: number; h: number; fill?: string; border?: string; shadow?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  w,
  h,
  fill,
  border,
  shadow,
  style,
  children,
}) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: `${w / 2}px ${w / 2}px 36px 36px`,
      background: fill,
      border,
      boxShadow: shadow,
      overflow: "hidden",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);
