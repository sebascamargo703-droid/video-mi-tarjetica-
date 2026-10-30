import React from "react";
import { brand } from "../brand";
import { copy } from "../copy";
import { fonts } from "../fonts";

/** La tarjeta de papel de siempre: cartulina, sellos de tinta a mano. */
export const PaperCard: React.FC<{ width: number; stamped?: number }> = ({
  width: w,
  stamped = 4,
}) => {
  const h = w * 0.58;
  const slot = w * 0.11;
  // Pequeñas variaciones "a mano" (deterministas).
  const jitter = [
    [2, -3, -12],
    [-3, 2, 8],
    [1, 3, -20],
    [3, -1, 14],
    [0, 0, 0],
  ];
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.025,
        background: `linear-gradient(160deg, #FBF8F2 0%, ${brand.colors.cream} 55%, #ECE4D6 100%)`,
        boxShadow:
          "inset 0 0 0 1px rgba(27,22,19,0.08), inset 0 -18px 40px rgba(27,22,19,0.05)",
        position: "relative",
        fontFamily: fonts.body,
        color: brand.colors.ink,
        padding: w * 0.065,
      }}
    >
      <div
        style={{
          fontFamily: fonts.logo,
          fontWeight: 700,
          fontSize: w * 0.065,
          letterSpacing: "-0.01em",
        }}
      >
        {copy.hook.paperCard.business}
      </div>
      <div style={{ fontSize: w * 0.032, opacity: 0.6, marginTop: w * 0.008 }}>
        {copy.hook.paperCard.note}
      </div>
      <div
        style={{
          position: "absolute",
          left: w * 0.065,
          right: w * 0.065,
          bottom: w * 0.07,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          rowGap: w * 0.03,
          justifyItems: "center",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const [dx, dy, rot] = jitter[i % jitter.length];
          return (
            <div
              key={i}
              style={{
                width: slot,
                height: slot,
                borderRadius: "50%",
                border: `${w * 0.004}px solid rgba(27,22,19,0.25)`,
                position: "relative",
              }}
            >
              {i < stamped ? (
                <div
                  style={{
                    position: "absolute",
                    inset: w * 0.008,
                    borderRadius: "50%",
                    border: `${w * 0.008}px solid rgba(120,30,40,0.72)`,
                    transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(120,30,40,0.72)",
                    fontWeight: 800,
                    fontSize: slot * 0.38,
                  }}
                >
                  ★
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
