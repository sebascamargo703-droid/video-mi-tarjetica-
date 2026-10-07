import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../lib/anim";
import { colors, fonts, gradients, weights } from "../theme";
import { BrandMark, CoffeeIcon } from "./Icons";

/**
 * Tarjeta de fidelización digital (pase de Wallet) con diseño premium:
 * logo, sellos que se van llenando y barra de progreso.
 * Todas las medidas son proporcionales a `width`.
 */
export const WalletCard: React.FC<{
  width: number;
  /** Sellos llenos (acepta decimales para animar el sello que entra). */
  stamps: number;
  total?: number;
  merchant?: string;
  reward?: string;
  style?: React.CSSProperties;
}> = ({
  width,
  stamps,
  total = 10,
  merchant = "Café Aroma",
  reward = "Café gratis",
  style,
}) => {
  const k = width / 100; // 1k = 1% del ancho
  const height = width * 0.63;
  const cols = 5;
  const progress = Math.min(1, stamps / total);
  const remaining = Math.max(0, total - Math.floor(stamps));

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 6 * k,
        background: gradients.card,
        overflow: "hidden",
        fontFamily: fonts.text,
        color: colors.white,
        boxShadow: `0 ${4 * k}px ${10 * k}px rgba(2,20,16,0.5), inset 0 0 0 ${0.25 * k}px rgba(255,255,255,0.18)`,
        padding: `${5.5 * k}px ${6 * k}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* brillo de cristal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(90% 70% at 10% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 60% at 100% 100%, rgba(14,82,68,0.5) 0%, rgba(14,82,68,0) 70%)",
        }}
      />
      {/* cabecera */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2.6 * k }}>
          <div
            style={{
              width: 9 * k,
              height: 9 * k,
              borderRadius: 2.4 * k,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
            }}
          >
            <CoffeeIcon size={5.6 * k} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: weights.bold, fontSize: 4.6 * k, letterSpacing: fonts.tracking }}>
              {merchant}
            </span>
            <span style={{ fontWeight: weights.medium, fontSize: 2.8 * k, opacity: 0.6 }}>Tarjeta de fidelidad</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 2.4 * k, opacity: 0.6, fontWeight: weights.semibold, letterSpacing: "0.08em" }}>
            SELLOS
          </div>
          <div style={{ fontSize: 5 * k, fontWeight: weights.bold, fontVariantNumeric: "tabular-nums" }}>
            {Math.floor(stamps)}/{total}
          </div>
        </div>
      </div>

      {/* sellos */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          alignContent: "center",
          justifyItems: "center",
          rowGap: 3 * k,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const fill = interpolate(stamps - i, [0, 1], [0, 1], clamp);
          const d = 11.5 * k;
          return (
            <div
              key={i}
              style={{
                width: d,
                height: d,
                borderRadius: "50%",
                boxShadow: `inset 0 0 0 ${0.35 * k}px rgba(255,255,255,${0.28 + fill * 0.2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "linear-gradient(160deg, #FFFFFF 0%, #DCF5EE 100%)",
                  transform: `scale(${fill})`,
                  opacity: fill,
                  boxShadow: `0 ${0.8 * k}px ${2 * k}px rgba(0,20,15,0.3)`,
                }}
              />
              <div style={{ position: "relative", opacity: fill, transform: `scale(${0.6 + fill * 0.4})` }}>
                <CoffeeIcon size={6 * k} color={colors.brand} />
              </div>
            </div>
          );
        })}
      </div>

      {/* progreso */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 2.9 * k,
            fontWeight: weights.medium,
            marginBottom: 1.6 * k,
          }}
        >
          <span style={{ opacity: 0.75 }}>
            {remaining > 0 ? `${remaining} visitas para tu ${reward.toLowerCase()}` : `¡${reward} desbloqueado!`}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 1.2 * k, opacity: 0.55 }}>
            <BrandMark size={3.6 * k} /> MiTarjetica
          </span>
        </div>
        <div style={{ height: 1.5 * k, borderRadius: 999, background: "rgba(255,255,255,0.16)" }}>
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #FFFFFF 0%, #A8E6D9 100%)",
              boxShadow: `0 0 ${2 * k}px rgba(255,255,255,0.6)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
