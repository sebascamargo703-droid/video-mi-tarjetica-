import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, enterProgress, enterStyle } from "../lib/anim";
import { colors, fonts, gradients, shadows, springs, weights } from "../theme";
import { BrandMark } from "./Icons";
import { Counter } from "./Counter";

type Customer = { name: string; phone: string; stamps: number; hue: number };

const CUSTOMERS: Customer[] = [
  { name: "Valentina Ríos", phone: "+57 310 482 1903", stamps: 9, hue: 168 },
  { name: "Andrés Molina", phone: "+57 300 915 2274", stamps: 6, hue: 158 },
  { name: "Camila Herrera", phone: "+57 315 337 0841", stamps: 8, hue: 178 },
  { name: "Santiago Pérez", phone: "+57 321 604 7712", stamps: 3, hue: 150 },
  { name: "Laura Gómez", phone: "+57 318 270 5596", stamps: 5, hue: 186 },
];

/** Marco de ventana tipo macOS con cristal (glassmorphism). */
const WindowFrame: React.FC<{ width: number; u: number; children: React.ReactNode; title: string }> = ({
  width,
  u,
  children,
  title,
}) => (
  <div
    style={{
      width,
      borderRadius: 24 * u,
      background: "rgba(20,20,28,0.72)",
      backdropFilter: `blur(${30 * u}px)`,
      WebkitBackdropFilter: `blur(${30 * u}px)`,
      boxShadow: `${shadows.float(u)}, inset 0 0 0 ${1.5 * u}px ${colors.hairline}`,
      overflow: "hidden",
      fontFamily: fonts.text,
      color: colors.white,
    }}
  >
    <div
      style={{
        height: 64 * u,
        display: "flex",
        alignItems: "center",
        padding: `0 ${26 * u}px`,
        gap: 12 * u,
        borderBottom: `${1.5 * u}px solid ${colors.hairline}`,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 16 * u, height: 16 * u, borderRadius: "50%", background: c, opacity: 0.9 }} />
      ))}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: 22 * u,
          fontWeight: weights.medium,
          color: colors.textTertiary,
          marginRight: 64 * u,
        }}
      >
        {title}
      </div>
    </div>
    {children}
  </div>
);

/**
 * Dashboard animado: métricas + lista de clientes (avatar, nombre, teléfono,
 * sellos). Las filas entran en cascada (stagger 6 frames) y "Visitas hoy"
 * sube en tiempo real. Si `screenshot` es true usa public/dashboard.png.
 */
export const DashboardMock: React.FC<{
  width: number;
  u: number;
  delay?: number;
  visitsStart: number;
  visitsStep: number;
  screenshot?: boolean;
}> = ({ width, u, delay = 0, visitsStart, visitsStep, screenshot = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (screenshot) {
    const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08], {
      ...clamp,
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    });
    return (
      <WindowFrame width={width} u={u} title="app.mitarjetica.com">
        <div style={{ overflow: "hidden" }}>
          <Img
            src={staticFile("dashboard.png")}
            style={{ width: "100%", display: "block", transform: `scale(${zoom})`, transformOrigin: "30% 20%" }}
          />
        </div>
      </WindowFrame>
    );
  }

  const pad = 30 * u;
  const stats = [
    { label: "Clientes", node: <Counter from={1180} to={1248} start={delay + 6} duration={40} /> },
    {
      label: "Visitas hoy",
      node: <Counter from={36} to={39} start={visitsStart} duration={visitsStep * 3} stepped />,
      live: true,
    },
    { label: "Premios", node: <span>86</span> },
  ];

  return (
    <WindowFrame width={width} u={u} title="Panel · MiTarjetica">
      <div style={{ padding: pad }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 * u, marginBottom: 26 * u }}>
          <BrandMark size={34 * u} color={colors.brandText} />
          <span style={{ fontSize: 30 * u, fontWeight: weights.bold, letterSpacing: fonts.tracking }}>
            Mis clientes
          </span>
        </div>
        {/* métricas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 * u, marginBottom: 26 * u }}>
          {stats.map((s, i) => {
            const p = enterProgress(frame, fps, delay + i * 4, springs.smooth);
            return (
              <div
                key={s.label}
                style={{
                  ...enterStyle(p, u, 24),
                  borderRadius: 18 * u,
                  padding: `${18 * u}px ${20 * u}px`,
                  background: s.live ? "rgba(25,148,123,0.14)" : colors.glass,
                  boxShadow: `inset 0 0 0 ${1.5 * u}px ${s.live ? "rgba(25,148,123,0.45)" : colors.hairline}`,
                }}
              >
                <div
                  style={{
                    fontSize: 19 * u,
                    color: colors.textSecondary,
                    fontWeight: weights.medium,
                    display: "flex",
                    alignItems: "center",
                    gap: 8 * u,
                  }}
                >
                  {s.live ? (
                    <span
                      style={{
                        width: 9 * u,
                        height: 9 * u,
                        borderRadius: "50%",
                        background: colors.success,
                        opacity: 0.55 + 0.45 * Math.sin(frame / 5),
                      }}
                    />
                  ) : null}
                  {s.label}
                </div>
                <div style={{ fontSize: 44 * u, fontWeight: weights.bold, letterSpacing: fonts.tracking, marginTop: 4 * u }}>
                  {s.node}
                </div>
              </div>
            );
          })}
        </div>
        {/* filas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 * u }}>
          {CUSTOMERS.map((c, i) => {
            const p = enterProgress(frame, fps, delay + 10 + i * 6, springs.smooth);
            const initials = c.name
              .split(" ")
              .map((n) => n[0])
              .join("");
            return (
              <div
                key={c.name}
                style={{
                  ...enterStyle(p, u, 28),
                  display: "flex",
                  alignItems: "center",
                  gap: 18 * u,
                  padding: `${14 * u}px ${12 * u}px`,
                  borderRadius: 16 * u,
                  background: i === 0 ? "rgba(255,255,255,0.05)" : "transparent",
                  borderBottom: i < CUSTOMERS.length - 1 ? `${1 * u}px solid rgba(255,255,255,0.06)` : "none",
                }}
              >
                <div
                  style={{
                    width: 58 * u,
                    height: 58 * u,
                    borderRadius: "50%",
                    background: `linear-gradient(140deg, hsl(${c.hue} 55% 42%) 0%, hsl(${c.hue} 72% 19%) 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22 * u,
                    fontWeight: weights.bold,
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 25 * u, fontWeight: weights.semibold, letterSpacing: fonts.tracking }}>
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: 19 * u,
                      color: colors.textTertiary,
                      fontVariantNumeric: "tabular-nums",
                      marginTop: 2 * u,
                    }}
                  >
                    {c.phone}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5 * u }}>
                  {Array.from({ length: 10 }).map((_, s) => (
                    <div
                      key={s}
                      style={{
                        width: 11 * u,
                        height: 11 * u,
                        borderRadius: "50%",
                        background: s < c.stamps ? gradients.brand : "rgba(255,255,255,0.12)",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WindowFrame>
  );
};
