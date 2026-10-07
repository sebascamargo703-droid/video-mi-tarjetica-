import React from "react";
import { theme } from "../theme";

interface WalletCardProps {
  businessName?: string;
  stampsCount?: number;
  totalStamps?: number;
  activeStampIndex?: number;
}

/**
 * Premium Apple Wallet / Google Wallet Digital Pass
 * Titanium borders, glassmorphic dark emerald backdrop, contactless waves and stamps grid.
 */
export const WalletCard: React.FC<WalletCardProps> = ({
  businessName = "Café & Bistró",
  stampsCount = 9,
  totalStamps = 10,
  activeStampIndex = 9,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(155deg, #093325 0%, #031c14 50%, #0d121f 100%)",
        borderRadius: "44px",
        padding: "36px 36px 30px",
        boxSizing: "border-box",
        border: `2px solid rgba(52, 199, 89, 0.45)`,
        boxShadow:
          "0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 3px rgba(255, 255, 255, 0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "20px",
                color: "#6ee7b7",
                fontWeight: theme.typography.weights.heavy,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              PROGRAMA DE LEALTAD
            </div>
            <div
              style={{
                fontSize: "44px",
                fontWeight: theme.typography.weights.black,
                color: theme.colors.textPrimary,
                letterSpacing: theme.typography.letterSpacing,
                marginTop: "4px",
              }}
            >
              {businessName} ☕
            </div>
          </div>

          <div
            style={{
              background: "rgba(52, 199, 89, 0.2)",
              border: `1.5px solid ${theme.colors.successGreen}`,
              padding: "8px 20px",
              borderRadius: theme.radii.full,
              fontSize: "22px",
              fontWeight: theme.typography.weights.black,
              color: theme.colors.successGreen,
            }}
          >
            NIVEL VIP ⭐️
          </div>
        </div>

        {/* Cardholder Info */}
        <div
          style={{
            marginTop: "24px",
            padding: "16px 24px",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: theme.radii.md,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "18px",
                color: theme.colors.textSecondary,
                fontWeight: theme.typography.weights.bold,
              }}
            >
              TITULAR
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: theme.typography.weights.heavy,
                color: theme.colors.textPrimary,
              }}
            >
              Cliente Frecuente
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "18px",
                color: theme.colors.textSecondary,
                fontWeight: theme.typography.weights.bold,
              }}
            >
              SELLOS
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: theme.typography.weights.black,
                color: theme.colors.warningYellow,
              }}
            >
              {stampsCount} / {totalStamps}
            </div>
          </div>
        </div>
      </div>

      {/* 10 Stamps Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          padding: "24px 20px",
          borderRadius: theme.radii.lg,
        }}
      >
        {Array.from({ length: totalStamps }).map((_, i) => {
          const num = i + 1;
          const isTen = num === 10;
          const stamped = num <= activeStampIndex;

          return (
            <div
              key={num}
              style={{
                aspectRatio: "1",
                borderRadius: "50%",
                backgroundColor: stamped
                  ? theme.colors.successGreen
                  : "rgba(255, 255, 255, 0.08)",
                border: stamped
                  ? "3px solid #a7f3d0"
                  : "3px dashed rgba(255, 255, 255, 0.25)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: stamped ? "#000000" : "#64748b",
                fontWeight: theme.typography.weights.black,
                fontSize: isTen ? "36px" : "30px",
                boxShadow: stamped
                  ? "0 0 20px rgba(52, 199, 89, 0.65)"
                  : "none",
              }}
            >
              {stamped ? "✓" : isTen ? "🎁" : num}
            </div>
          );
        })}
      </div>

      {/* NFC Contactless Wave & Barcode */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          padding: "20px 0",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: theme.radii.md,
        }}
      >
        <div style={{ fontSize: "40px" }}>📶</div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: theme.typography.weights.heavy,
            color: "#6ee7b7",
          }}
        >
          Acerca al datáfono o escanea
        </div>

        {/* Crisp vector barcode lines */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            height: "56px",
            alignItems: "center",
            opacity: 0.9,
          }}
        >
          {[6, 3, 8, 3, 4, 7, 3, 5, 3, 9, 4, 3, 7, 3, 5, 4, 3, 8, 3, 5, 7, 3, 4].map(
            (w, idx) => (
              <div
                key={idx}
                style={{
                  width: `${w * 1.5}px`,
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "2px",
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Footer Apple & Google Wallet badge */}
      <div
        style={{
          textAlign: "center",
          fontSize: "20px",
          color: theme.colors.textSecondary,
          fontWeight: theme.typography.weights.bold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <span>🔒 100% Nativo en Apple Wallet y Google Wallet</span>
      </div>
    </div>
  );
};
