import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { copy } from "../copy";
import { fonts, tracking } from "../fonts";
import { ease, softSpring } from "../lib/motion";
import { LockScreenNotification } from "./LockScreenNotification";
import { phoneScreenWidth } from "./PhoneMockup";
import { WalletCard } from "./WalletCard";

const filledNow = (times: (number | null)[], frame: number) =>
  times.filter((t) => t !== null && frame >= t).length;

/** Pantalla del Wallet: pases genéricos detrás y la tarjeta que llega al frente. */
export const WalletScreen: React.FC<{
  phoneWidth: number;
  cardEnterAt: number;
  sheenAt?: number;
  stampTimes: (number | null)[];
}> = ({ phoneWidth, cardEnterAt, sheenAt, stampTimes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sw = phoneScreenWidth(phoneWidth);
  const m = sw * 0.055;
  const cw = sw - m * 2;
  const p = softSpring(frame, fps, cardEnterAt);
  const others = copy.wallet.otherPasses;
  const meta = ease(frame, cardEnterAt + Math.round(fps * 0.7), Math.round(fps * 0.6));

  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: fonts.body }}>
      <div
        style={{
          position: "absolute",
          top: sw * 0.25,
          left: m,
          right: m,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: sw * 0.09,
            letterSpacing: tracking.title,
          }}
        >
          {copy.wallet.walletTitle}
        </span>
        <div
          style={{
            width: sw * 0.08,
            height: sw * 0.08,
            borderRadius: "50%",
            background: "#1c1c1e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: sw * 0.06,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          +
        </div>
      </div>

      {others.map((label, i) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: m,
            width: cw,
            top: sw * 0.42 + i * sw * 0.13,
            height: cw * 0.64,
            borderRadius: cw * 0.06,
            background: i === 0 ? "#2c2c2e" : "#3a3a3c",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.4)",
            color: "rgba(255,255,255,0.75)",
            fontWeight: 600,
            fontSize: sw * 0.042,
            padding: `${sw * 0.035}px ${sw * 0.045}px`,
            transform: `translateY(${(1 - p) * 0}px)`,
          }}
        >
          {label}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: m,
          top: sw * 0.42 + others.length * sw * 0.13,
          transform: `translateY(${(1 - p) * sw * 1.9}px) rotateX(${(1 - p) * 25}deg)`,
          transformOrigin: "center top",
        }}
      >
        <WalletCard
          width={cw}
          stampTimes={stampTimes}
          sheenAt={sheenAt}
          shadow={`0 -${sw * 0.02}px ${sw * 0.08}px rgba(0,0,0,0.6)`}
        />
        <div
          style={{
            marginTop: sw * 0.07,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: sw * 0.02,
            color: brand.colors.gray,
            fontSize: sw * 0.037,
            opacity: meta,
          }}
        >
          <div
            style={{
              width: sw * 0.022,
              height: sw * 0.022,
              borderRadius: "50%",
              background: brand.colors.mint,
            }}
          />
          Actualizada hace un momento
        </div>
        <div
          style={{
            marginTop: sw * 0.06,
            width: cw,
            borderRadius: cw * 0.06,
            background: "#1c1c1e",
            padding: sw * 0.055,
            color: "#fff",
            opacity: meta,
            transform: `translateY(${(1 - meta) * sw * 0.05}px)`,
          }}
        >
          <div style={{ fontSize: sw * 0.034, color: brand.colors.gray, fontWeight: 600 }}>
            Próximo premio
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: sw * 0.01,
            }}
          >
            <span style={{ fontSize: sw * 0.058, fontWeight: 800, letterSpacing: tracking.title }}>
              {copy.card.rewardValue}
            </span>
            <span style={{ fontSize: sw * 0.036, color: brand.colors.mint, fontWeight: 600 }}>
              Te faltan {stampTimes.length - filledNow(stampTimes, frame)}
            </span>
          </div>
          <div
            style={{
              marginTop: sw * 0.04,
              height: sw * 0.022,
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(filledNow(stampTimes, frame) / stampTimes.length) * 100 * meta}%`,
                borderRadius: 999,
                background: brand.colors.mint,
              }}
            />
          </div>
          <div
            style={{
              marginTop: sw * 0.045,
              paddingTop: sw * 0.04,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: sw * 0.034,
            }}
          >
            <span style={{ color: brand.colors.gray }}>Último sello</span>
            <span style={{ fontWeight: 600 }}>Hoy, 10:42 a. m.</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Pantalla de bloqueo con reloj grande y la notificación de cercanía. */
export const LockScreen: React.FC<{
  phoneWidth: number;
  notifyAt: number;
  /** false = la notificación se dibuja fuera (más grande, sobre el teléfono). */
  showNotification?: boolean;
}> = ({ phoneWidth, notifyAt, showNotification = true }) => {
  const sw = phoneScreenWidth(phoneWidth);
  const n = copy.nearby;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 15%, ${brand.colors.greenMid} 0%, ${brand.colors.greenDeep} 45%, #020807 100%)`,
        fontFamily: fonts.display,
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: sw * 0.24,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: sw * 0.048,
          opacity: 0.85,
        }}
      >
        {n.date}
      </div>
      <div
        style={{
          position: "absolute",
          top: sw * 0.28,
          width: "100%",
          textAlign: "center",
          fontWeight: 600,
          fontSize: sw * 0.27,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {n.time}
      </div>
      <div
        style={{
          position: "absolute",
          top: sw * 0.78,
          left: sw * 0.04,
          right: sw * 0.04,
        }}
      >
        {showNotification ? (
          <LockScreenNotification width={sw * 0.92} enterAt={notifyAt} />
        ) : null}
      </div>
      {/* Indicador inferior */}
      <div
        style={{
          position: "absolute",
          bottom: sw * 0.035,
          left: "50%",
          transform: "translateX(-50%)",
          width: sw * 0.36,
          height: sw * 0.013,
          borderRadius: 999,
          background: "rgba(255,255,255,0.85)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Distancia vertical desde el centro del teléfono hasta la notificación. */
export const notificationOffsetY = (phoneWidth: number) =>
  -phoneWidth * 1.03 + phoneWidth * 0.038 + phoneScreenWidth(phoneWidth) * 0.78;
