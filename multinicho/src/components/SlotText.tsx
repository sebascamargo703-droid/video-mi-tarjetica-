import React from "react";

/**
 * Texto tipo tragamonedas: el anterior sube y se desvanece, el nuevo entra desde abajo.
 * `p` = progreso 0 → 1 (ya con easing). `sizeFor` permite un tamaño distinto por texto.
 */
export const SlotText: React.FC<{
  text: string;
  prev?: string | null;
  p: number;
  align?: "left" | "center" | "right";
  sizeFor?: (t: string) => number;
  /** Desplazamiento en "em" (1 = una línea completa). */
  travel?: number;
  style?: React.CSSProperties;
}> = ({ text, prev, p, align = "left", sizeFor, travel = 1.1, style }) => {
  const changing = prev != null && prev !== text && p < 1;
  const item = (t: string, y: number, o: number, blur: number): React.CSSProperties => ({
    gridArea: "1 / 1",
    transform: `translateY(${y}em)`,
    opacity: o,
    filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
    fontSize: sizeFor?.(t),
    textAlign: align,
  });
  return (
    <div
      style={{
        display: "grid",
        overflow: "hidden",
        // margen para que no se recorten tildes ni descendentes
        padding: "0.12em 0",
        margin: "-0.12em 0",
        justifyItems: align === "center" ? "center" : align === "right" ? "end" : "start",
        alignItems: "center",
        ...style,
      }}
    >
      {changing ? <span style={item(prev, -p * travel, 1 - p, p * 6)}>{prev}</span> : null}
      <span style={changing ? item(text, (1 - p) * travel, p, (1 - p) * 6) : item(text, 0, 1, 0)}>{text}</span>
    </div>
  );
};
