import React from "react";
import { BUSINESS, COLORS, TEXTS } from "../constants";
import { FONT } from "../fonts";
import { EASE, pop, rand, seg } from "../motion";

/** Ícono del sello (SVG, sin imágenes externas). */
const StampIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const p = { fill: "none", stroke: color, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {BUSINESS.stampIcon === "scissors" ? (
        <>
          <circle cx={6.5} cy={17.5} r={3} {...p} />
          <circle cx={17.5} cy={17.5} r={3} {...p} />
          <path d="M8.4 15.2 L18.5 3.5 M15.6 15.2 L5.5 3.5" {...p} />
        </>
      ) : BUSINESS.stampIcon === "cup" ? (
        <path d="M5 9 H16 V14 a5 5 0 0 1 -5 5 H10 a5 5 0 0 1 -5 -5 Z M16 10.5 h1.5 a2.5 2.5 0 0 1 0 5 H16 M8 3 v2.5 M12 3 v2.5" {...p} />
      ) : BUSINESS.stampIcon === "drop" ? (
        <path d="M12 3 C12 3 5.5 10.5 5.5 14.8 a6.5 6.5 0 0 0 13 0 C18.5 10.5 12 3 12 3 Z" {...p} />
      ) : (
        <path d="M12 3 l2.7 5.6 6.1 0.8 -4.5 4.2 1.2 6.1 -5.5 -3 -5.5 3 1.2 -6.1 -4.5 -4.2 6.1 -0.8 Z" {...p} />
      )}
    </svg>
  );
};

/** Mini poste de barbero para el encabezado de la tarjeta. */
const PoleBadge: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: COLORS.leather, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.56, lineHeight: 1 }}>{BUSINESS.emoji}</div>
);

/**
 * Tarjeta de sellos. `filled` sellos llenos; el siguiente vacío pulsa.
 * Con `stampAt` (segundo absoluto) el último sello cae con rebote, anillo y
 * partículas doradas.
 */
export const StampCard: React.FC<{ width: number; t: number; filled: number; stampAt?: number }> = ({ width, t, filled, stampAt }) => {
  const total = BUSINESS.stampsTotal;
  const cols = 5;
  const pad = width * 0.045;
  const gap = width * 0.03;
  const cell = (width - pad * 2 - gap * (cols - 1)) / cols;
  const stamped = stampAt !== undefined && t >= stampAt;
  const count = filled + (stamped ? 1 : 0);
  const landing = stampAt !== undefined ? pop(t, stampAt) : 0; // 0 → 1 con rebote
  const since = stampAt !== undefined ? t - stampAt : -1;
  const shake = since >= 0 && since < 0.45 ? Math.sin(since * 60) * 7 * Math.exp(-since * 9) : 0;

  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        padding: pad,
        borderRadius: width * 0.055,
        background: `linear-gradient(150deg, #1A2A58 0%, ${COLORS.card} 55%, #0A1024 100%)`,
        border: `2px solid ${COLORS.cardEdge}`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        fontFamily: FONT.text,
        transform: `translate(${shake}px, ${Math.abs(shake) * 0.4}px)`,
      }}
    >
      {/* encabezado */}
      <div style={{ display: "flex", alignItems: "center", gap: width * 0.03 }}>
        <PoleBadge size={width * 0.115} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: width * 0.052, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.02em", lineHeight: 1.1, whiteSpace: "nowrap" }}>{BUSINESS.name}</div>
          <div style={{ fontSize: width * 0.036, fontWeight: 600, color: COLORS.textSoft, marginTop: width * 0.006 }}>{TEXTS.cardSubtitle}</div>
        </div>
        <div style={{ fontSize: width * 0.066, fontWeight: 800, color: COLORS.gold, letterSpacing: "-0.03em", transform: `scale(${1 + 0.25 * Math.max(0, landing - 1) + (stamped ? 0.0 : 0)})` }}>
          {count}/{total}
        </div>
      </div>

      {/* sellos */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap, marginTop: pad * 0.9, position: "relative" }}>
        {Array.from({ length: total }).map((_, i) => {
          const isFilled = i < filled;
          const isNew = i === filled && stampAt !== undefined;
          const isNext = i === filled && !stamped;
          const pulse = isNext ? 1 + 0.07 * Math.sin(t * 6.2) : 1;
          return (
            <div key={i} style={{ width: cell, height: cell, position: "relative" }}>
              {/* hueco vacío */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `${Math.max(2, cell * 0.035)}px dashed ${isNext ? COLORS.gold : "rgba(255,255,255,0.28)"}`,
                  boxSizing: "border-box",
                  transform: `scale(${pulse})`,
                  boxShadow: isNext ? `0 0 ${cell * 0.35 * (0.6 + 0.4 * Math.sin(t * 6.2))}px rgba(255,194,75,0.55)` : "none",
                  opacity: isFilled || (isNew && stamped) ? 0 : 1,
                }}
              />
              {/* sello lleno */}
              {isFilled || (isNew && stamped) ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, #FFE08A 0%, ${COLORS.gold} 45%, ${COLORS.goldDeep} 100%)`,
                    boxShadow: "inset 0 -4px 8px rgba(120,60,0,0.35), 0 4px 10px rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: isNew ? `scale(${2.6 - 1.6 * landing}) rotate(${(1 - Math.min(1, landing)) * -28}deg)` : undefined,
                    opacity: isNew ? Math.min(1, since * 14) : 1,
                  }}
                >
                  <StampIcon size={cell * 0.56} color="#3A2203" />
                </div>
              ) : null}
              {/* impacto: anillo + partículas doradas */}
              {isNew && since >= 0 && since < 1.3 ? (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: cell,
                      height: cell,
                      marginLeft: -cell / 2,
                      marginTop: -cell / 2,
                      borderRadius: "50%",
                      border: `4px solid ${COLORS.gold}`,
                      boxSizing: "border-box",
                      transform: `scale(${1 + 1.9 * seg(since, 0.04, 0.6, EASE.out)})`,
                      opacity: 1 - seg(since, 0.1, 0.6, EASE.soft),
                    }}
                  />
                  {Array.from({ length: 18 }).map((__, k) => {
                    const a = (k / 18) * Math.PI * 2 + rand(k) * 0.5;
                    const dist = (0.9 + rand(k + 20) * 1.6) * cell * seg(since, 0.03, 0.75, EASE.out);
                    const size = cell * (0.06 + rand(k + 40) * 0.07);
                    const fall = since * since * cell * 1.1;
                    return (
                      <div
                        key={k}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: size,
                          height: size,
                          marginLeft: -size / 2,
                          marginTop: -size / 2,
                          borderRadius: k % 3 === 0 ? 2 : "50%",
                          background: k % 2 ? COLORS.gold : "#FFE9A8",
                          boxShadow: `0 0 ${size}px rgba(255,194,75,0.8)`,
                          transform: `translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist + fall}px) rotate(${since * 400 * (k % 2 ? 1 : -1)}deg)`,
                          opacity: since < 0.03 ? 0 : 1 - seg(since, 0.55, 1.2, EASE.soft),
                        }}
                      />
                    );
                  })}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* pie */}
      <div style={{ marginTop: pad * 0.85, fontSize: width * 0.038, fontWeight: 600, color: stamped ? COLORS.gold : COLORS.textSoft, textAlign: "center" }}>🎁 {stamped ? `¡${BUSINESS.reward}!` : BUSINESS.rewardFooter}</div>
    </div>
  );
};
