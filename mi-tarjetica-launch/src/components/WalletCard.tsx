import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { fonts, tracking } from "../fonts";
import { EASE, ease, popSpring } from "../lib/motion";
import { LogoMark } from "./Logo";
import { Stamp } from "./Stamp";

/** Frames de sellos ya puestos: `n` sellos llenos desde antes de empezar. */
export const prefilled = (n: number, total: number = copy.card.total) =>
  Array.from({ length: total }, (_, i) => (i < n ? -9999 : null)) as (
    | number
    | null
  )[];

const Cup: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path
      d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"
      stroke={color}
      strokeWidth={1.8}
    />
    <path
      d="M8 3.5c0 1 1 1.4 1 2.5M12 3.5c0 1 1 1.4 1 2.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
);

/** Brillo diagonal que recorre la tarjeta, como un producto real. */
export const Sheen: React.FC<{ at: number; radius: number }> = ({
  at,
  radius,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = ease(frame, at, Math.round(fps * 1.4), EASE);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        overflow: "hidden",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50%",
          bottom: "-50%",
          width: "45%",
          left: `${-60 + p * 190}%`,
          transform: "rotate(18deg)",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0.10) 65%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
};

/**
 * Pase de fidelización (formato Wallet) construido 100% con código.
 */
export const WalletCard: React.FC<{
  width: number;
  stampTimes: (number | null)[];
  sheenAt?: number;
  rewardAt?: number;
  shadow?: string;
  style?: React.CSSProperties;
}> = ({ width: w, stampTimes, sheenAt, rewardAt, shadow, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = w * 0.64;
  const r = w * brand.radius.card;
  const pad = w * 0.06;
  const c = copy.card;
  const count = stampTimes.filter((t) => t !== null && frame >= t).length;
  const reward = rewardAt !== undefined ? popSpring(frame, fps, rewardAt) : 0;
  const stampSize = w * 0.105;

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(140deg, ${brand.colors.greenMid} 0%, ${brand.colors.green} 42%, ${brand.colors.greenDeep} 100%)`,
        boxShadow: shadow,
        fontFamily: fonts.body,
        color: brand.colors.white,
        ...style,
      }}
    >
      {/* Luz superior y marca de agua del isotipo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 15% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 55%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -w * 0.2,
          bottom: -w * 0.16,
          opacity: 0.035,
        }}
      >
        <LogoMark height={w * 0.42} color={brand.colors.white} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
        }}
      />

      {/* Encabezado */}
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          top: pad,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: w * 0.025 }}>
          <div
            style={{
              width: w * 0.085,
              height: w * 0.085,
              borderRadius: w * 0.022,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cup size={w * 0.055} color={brand.colors.white} />
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: w * 0.045,
              letterSpacing: tracking.body,
            }}
          >
            {c.business}
          </div>
        </div>
        <div style={{ textAlign: "right", position: "relative" }}>
          <div
            style={{
              fontSize: w * 0.022,
              fontWeight: 600,
              letterSpacing: tracking.caps,
              opacity: 0.6,
            }}
          >
            {c.label}
          </div>
          <div
            style={{
              fontSize: w * 0.058,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.05,
              letterSpacing: tracking.title,
            }}
          >
            {count}
            <span style={{ opacity: 0.45 }}>/{stampTimes.length}</span>
          </div>
        </div>
      </div>

      {/* Sellos */}
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          top: h * 0.3,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          rowGap: w * 0.035,
          justifyItems: "center",
        }}
      >
        {stampTimes.map((t, i) => (
          <Stamp
            key={i}
            size={stampSize}
            filledAt={t}
            fill={
              i === stampTimes.length - 1 ? brand.colors.mint : brand.colors.white
            }
          />
        ))}
      </div>

      {/* Pie */}
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          bottom: pad * 0.85,
          display: "flex",
          gap: w * 0.08,
          alignItems: "flex-end",
        }}
      >
        {[
          [c.reward, c.rewardValue],
          [c.customer, c.customerValue],
        ].map(([k, v]) => (
          <div key={k}>
            <div
              style={{
                fontSize: w * 0.022,
                fontWeight: 600,
                letterSpacing: tracking.caps,
                opacity: 0.6,
                textTransform: "uppercase",
              }}
            >
              {k}
            </div>
            <div style={{ fontSize: w * 0.036, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Estado de premio */}
      {reward > 0 ? (
        <div
          style={{
            position: "absolute",
            right: pad,
            bottom: pad * 0.75,
            transform: `scale(${reward})`,
            transformOrigin: "right bottom",
            background: brand.colors.mint,
            color: brand.colors.greenDeep,
            fontWeight: 800,
            fontSize: w * 0.03,
            padding: `${w * 0.014}px ${w * 0.028}px`,
            borderRadius: 999,
            letterSpacing: tracking.body,
          }}
        >
          {copy.stamps.reward}
        </div>
      ) : null}

      {sheenAt !== undefined ? <Sheen at={sheenAt} radius={r} /> : null}
    </div>
  );
};
