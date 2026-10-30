import React from "react";
import { font } from "../fonts";
import { RollNumber } from "./RollNumber";

/** Pastilla pequeña "Visita N" con el número rodando tipo odómetro. */
export const VisitCounter: React.FC<{ label: string; value: number; size: number }> = ({ label, value, size }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.3,
      padding: `${size * 0.32}px ${size * 0.6}px`,
      borderRadius: 999,
      background: "rgba(7, 49, 79, 0.45)",
      border: "2px solid rgba(255, 255, 255, 0.35)",
      color: "#FFFFFF",
      fontFamily: font,
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    {label}
    <RollNumber value={value} lineHeight={size * 1.1} style={{ minWidth: "1.25em", textAlign: "left" }} />
  </div>
);
