import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../lib/anim";

export type CounterProps = {
  from: number;
  to: number;
  /** Frame local donde arranca la cuenta. */
  start: number;
  duration: number;
  decimals?: number;
  /** Cuenta en saltos enteros (1x, 2x, 3x…) en vez de continua. */
  stepped?: boolean;
  prefix?: string;
  suffix?: string;
  /** Separador de miles (es-CO usa punto). */
  locale?: string;
  style?: React.CSSProperties;
};

export const useCounterValue = ({
  from,
  to,
  start,
  duration,
  stepped,
}: Pick<CounterProps, "from" | "to" | "start" | "duration" | "stepped">) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: stepped ? (x) => x : Easing.bezier(0.16, 1, 0.3, 1),
  });
  const v = from + (to - from) * t;
  return stepped ? Math.min(to, Math.floor(v + 1e-6)) : v;
};

/** Contador numérico animado con cifras tabulares (no "baila" el ancho). */
export const Counter: React.FC<CounterProps> = ({
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "es-CO",
  style,
  ...rest
}) => {
  const value = useCounterValue(rest);
  const text = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
};
