import React from "react";
import { palette } from "../brand";
import { display, sans } from "../fonts";
import { type Plan, copy, cop } from "../pricing";
import { Check } from "./Icons";

/**
 * Tarjeta de plan: nombre + descripción, precio mensual gigante (o "Gratis"), precio anual con
 * su ahorro, separador fino y lista de lo que incluye. Siempre en `light` sobre verde o latte.
 */
export const PlanCard: React.FC<{ plan: Plan; w: number; highlight?: boolean }> = ({ plan, w, highlight }) => {
  const free = plan.monthly === 0;
  const tabular: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };
  return (
    <div
      style={{
        position: "relative",
        width: w,
        boxSizing: "border-box",
        borderRadius: 48,
        background: palette.light,
        padding: "64px 64px 60px",
        boxShadow: `0 60px 120px ${palette.shadow}, 0 12px 30px rgba(10, 46, 34, 0.18)`,
        border: highlight ? `3px solid ${palette.brand}` : undefined,
        fontFamily: sans,
      }}
    >
      {plan.badge ? (
        <div
          style={{
            position: "absolute",
            right: 56,
            top: -27,
            padding: "12px 26px",
            borderRadius: 999,
            background: palette.brand,
            color: palette.light,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.01em",
            boxShadow: "0 10px 24px rgba(10, 46, 34, 0.25)",
          }}
        >
          {plan.badge}
        </div>
      ) : null}
      <div style={{ ...display, fontWeight: 600, fontSize: 72, lineHeight: 1, color: palette.ink, letterSpacing: "0.003em" }}>{plan.name}</div>
      <div style={{ fontSize: 34, color: palette.inkSecondary, marginTop: 16 }}>{plan.description}</div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 40, color: palette.brand }}>
        <span style={{ fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: "-0.035em", ...tabular }}>{free ? copy.freeWord : cop(plan.monthly)}</span>
        {free ? null : <span style={{ fontSize: 36, fontWeight: 600 }}>{copy.perMonth}</span>}
      </div>
      {plan.yearly ? (
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 22, fontSize: 32, color: palette.ink }}>
          <span style={tabular}>{copy.orYearly(plan)}</span>
          <span style={{ fontSize: 26, fontWeight: 600, background: palette.caramel, color: palette.ink, padding: "8px 18px", borderRadius: 999, ...tabular }}>{copy.saveTag(plan)}</span>
        </div>
      ) : null}

      <div style={{ height: 2, background: palette.latte, margin: "44px 0 40px" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {plan.includes.slice(0, 5).map((line, i) => {
          const inherited = i === 0 && /^Todo lo/.test(line);
          return (
            <div key={line} style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 40, lineHeight: 1.2, color: inherited ? palette.inkSecondary : palette.ink }}>
              {inherited ? <span style={{ width: 48, flexShrink: 0 }} /> : <Check size={48} circle={palette.brand} mark={palette.light} />}
              <span>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
