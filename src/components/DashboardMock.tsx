import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface CustomerRow {
  name: string;
  phone: string;
  visits: number;
  stamps: string;
  status: string;
  avatar: string;
}

const CUSTOMERS: CustomerRow[] = [
  {
    name: "Valentina Gómez",
    phone: "+57 312 ••• 4821",
    visits: 8,
    stamps: "8/10",
    status: "Cliente Frecuente",
    avatar: "VG",
  },
  {
    name: "Carlos Mendoza",
    phone: "+57 300 ••• 1954",
    visits: 12,
    stamps: "10/10 🎉",
    status: "Premio Canjeado",
    avatar: "CM",
  },
  {
    name: "Mariana Silva",
    phone: "+57 318 ••• 9023",
    visits: 5,
    stamps: "5/10",
    status: "Activo Hoy",
    avatar: "MS",
  },
  {
    name: "Andrés Restrepo",
    phone: "+57 315 ••• 6612",
    visits: 14,
    stamps: "Nivel Oro",
    status: "Proximidad",
    avatar: "AR",
  },
];

interface DashboardMockProps {
  startFrame?: number;
}

/**
 * Stripe/Linear-grade Customer Database Dashboard
 * macOS style dark frame, real-time KPI counters, staggered row entrances.
 */
export const DashboardMock: React.FC<DashboardMockProps> = ({
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // Staggered entrances
  const entrance = spring({
    frame: relFrame,
    fps,
    config: theme.springs.smooth,
  });

  const liveVisits = Math.round(
    interpolate(relFrame, [0, 90], [1280, 1420], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1500px",
        backgroundColor: "rgba(12, 14, 22, 0.94)",
        borderRadius: "44px",
        border: `2px solid ${theme.colors.surfaceBorder}`,
        boxShadow:
          "0 40px 100px rgba(0, 0, 0, 0.95), 0 0 60px rgba(47, 107, 255, 0.25)",
        overflow: "hidden",
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Window Title Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 36px",
          borderBottom: `1px solid ${theme.colors.surfaceBorder}`,
          backgroundColor: "rgba(255, 255, 255, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: "#FF5F56",
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: "#FFBD2E",
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: "#27C93F",
            }}
          />
          <span
            style={{
              marginLeft: "18px",
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.weights.semibold,
              fontSize: "22px",
              color: theme.colors.textSecondary,
            }}
          >
            MiTarjetica Cloud • Base de Datos
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(52, 199, 89, 0.15)",
            border: `1px solid ${theme.colors.successGreen}`,
            padding: "8px 20px",
            borderRadius: theme.radii.full,
            color: theme.colors.successGreen,
            fontSize: "20px",
            fontWeight: theme.typography.weights.bold,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: theme.colors.successGreen,
              boxShadow: `0 0 10px ${theme.colors.successGreen}`,
            }}
          />
          <span>EN TIEMPO REAL</span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
          padding: "32px 36px 20px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: theme.radii.md,
            padding: "20px 24px",
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: theme.colors.textSecondary,
              fontWeight: theme.typography.weights.semibold,
            }}
          >
            CLIENTES REGISTRADOS
          </div>
          <div
            style={{
              fontSize: "44px",
              fontWeight: theme.typography.weights.black,
              color: theme.colors.textPrimary,
              marginTop: "6px",
            }}
          >
            {liveVisits.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: theme.radii.md,
            padding: "20px 24px",
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: theme.colors.textSecondary,
              fontWeight: theme.typography.weights.semibold,
            }}
          >
            TASA DE RETENCIÓN
          </div>
          <div
            style={{
              fontSize: "44px",
              fontWeight: theme.typography.weights.black,
              color: theme.colors.accentBlue,
              marginTop: "6px",
            }}
          >
            71.4%
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: theme.radii.md,
            padding: "20px 24px",
            border: `1px solid ${theme.colors.surfaceBorder}`,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: theme.colors.textSecondary,
              fontWeight: theme.typography.weights.semibold,
            }}
          >
            RECOMPRA GENERADA
          </div>
          <div
            style={{
              fontSize: "44px",
              fontWeight: theme.typography.weights.black,
              color: theme.colors.successGreen,
              marginTop: "6px",
            }}
          >
            +4.8x
          </div>
        </div>
      </div>

      {/* Customer Rows Table */}
      <div style={{ padding: "16px 36px 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {CUSTOMERS.map((c, i) => {
          // Stagger of 6 frames per row
          const rowEntrance = spring({
            frame: Math.max(0, relFrame - i * 6),
            fps,
            config: theme.springs.smooth,
          });

          return (
            <div
              key={c.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 26px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                borderRadius: theme.radii.md,
                border: `1px solid rgba(255, 255, 255, 0.08)`,
                transform: `translateY(${(1 - rowEntrance) * 30}px)`,
                opacity: rowEntrance,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: theme.colors.gradientBrand,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: theme.typography.weights.heavy,
                    fontSize: "20px",
                    color: "#FFFFFF",
                  }}
                >
                  {c.avatar}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: theme.typography.weights.bold,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      color: theme.colors.textSecondary,
                      marginTop: "2px",
                    }}
                  >
                    {c.phone}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: theme.typography.weights.heavy,
                      color: theme.colors.warningYellow,
                    }}
                  >
                    {c.stamps}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {c.visits} visitas
                  </div>
                </div>

                <div
                  style={{
                    padding: "8px 18px",
                    borderRadius: theme.radii.full,
                    backgroundColor: "rgba(47, 107, 255, 0.15)",
                    border: `1px solid ${theme.colors.accentBlue}`,
                    color: theme.colors.accentBlue,
                    fontSize: "18px",
                    fontWeight: theme.typography.weights.bold,
                  }}
                >
                  {c.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
