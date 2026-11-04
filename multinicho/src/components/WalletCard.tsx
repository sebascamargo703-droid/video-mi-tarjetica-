import React from "react";
import { fade, palette } from "../brand";
import type { CardState } from "../cardState";
import { copy } from "../copy";
import { font, tracking } from "../fonts";
import { NicheIcon } from "./NicheIcon";
import { Sheen } from "./Sheen";
import { SlotText } from "./SlotText";
import { StampRow } from "./StampRow";

/**
 * Tarjeta de fidelidad tipo wallet. Recibe el estado ya calculado (cardState.ts) y el
 * `frame` absoluto por props, para poder dibujarse dentro del motion blur.
 * Siempre lleva la sombra amplia + un borde claro de 2 px, así los colores oscuros
 * (azul, café, violeta) se separan del fondo verde.
 */
export const WalletCard: React.FC<{ s: CardState; w: number; frame: number }> = ({ s, w, frame }) => {
  const P = w * 0.06;
  const H = w * 0.7;
  const tile = w * 0.13;
  const caps: React.CSSProperties = { fontSize: w * 0.024, fontWeight: 600, letterSpacing: tracking.caps, lineHeight: 1 };
  const prevName = s.prevNiche ? s.from.negocio : null;
  const count = (n: typeof s.cur) => `${n.sellosLlenos}/${n.sellosTotales}`;

  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: H,
        borderRadius: w * 0.06,
        background: s.bg,
        color: s.ink,
        fontFamily: font,
        overflow: "hidden",
        boxShadow: [
          `0 0 0 2px rgba(255,255,255,0.22)`,
          `0 ${w * 0.09}px ${w * 0.18}px ${palette.shadow}`,
          s.haloCard > 0 ? `0 0 ${w * 0.12 * s.haloCard}px ${w * 0.025 * s.haloCard}px ${fade(palette.accent, 0.75 * s.haloCard)}` : null,
        ]
          .filter(Boolean)
          .join(", "),
        padding: P,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* luz suave arriba a la izquierda (volumen) */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.06) 100%)" }} />

      {/* Cabecera: ícono · negocio · sellos */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: w * 0.035 }}>
        <div
          style={{
            position: "relative",
            width: tile,
            height: tile,
            flexShrink: 0,
            borderRadius: w * 0.032,
            background: s.isFinal ? "transparent" : fade(s.ink, 0.14),
            boxShadow: s.haloLogo > 0 ? `0 0 0 ${w * 0.006 * s.haloLogo}px ${palette.accent}, 0 0 ${w * 0.07 * s.haloLogo}px ${w * 0.01 * s.haloLogo}px ${fade(palette.accent, 0.9 * s.haloLogo)}` : undefined,
            transform: `scale(${1 + 0.06 * s.haloLogo})`,
          }}
        >
          {s.prevNiche && s.iconOut < 1 ? (
            <Center>
              <div style={{ transform: `scale(${1 - 0.4 * s.iconOut})`, opacity: 1 - s.iconOut, filter: `blur(${s.iconOut * 6}px)` }}>
                <NicheIcon name={s.from.icono} size={s.from.icono === "logo" ? tile : tile * 0.6} color={s.ink} label={copy.logoPlaceholder} />
              </div>
            </Center>
          ) : null}
          <Center>
            <div style={{ transform: `scale(${0.6 + 0.4 * s.iconIn}) rotate(${(1 - s.iconIn) * -14}deg)`, opacity: s.iconInOpacity }}>
              <NicheIcon name={s.cur.icono} size={s.cur.icono === "logo" ? tile : tile * 0.6} color={s.ink} label={copy.logoPlaceholder} />
            </div>
          </Center>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SlotText text={s.cur.negocio} prev={prevName} p={s.p} style={{ fontSize: w * 0.058, fontWeight: 800, letterSpacing: tracking.title, lineHeight: 1.1, whiteSpace: "nowrap" }} />
          <div style={{ ...caps, marginTop: w * 0.012 }}>TARJETA DE FIDELIDAD</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: w * 0.008 }}>
          <div style={caps}>{copy.labels.stamps}</div>
          <SlotText
            text={count(s.cur)}
            prev={s.prevNiche ? count(s.from) : null}
            p={s.p}
            align="right"
            style={{ fontSize: w * 0.05, fontWeight: 800, letterSpacing: tracking.title, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}
          />
        </div>
      </div>

      {/* Sellos */}
      <div style={{ position: "relative" }}>
        <StampRow
          w={w - 2 * P}
          h={w * 0.27}
          frame={frame}
          at={s.at}
          ink={s.ink}
          bg={s.bg}
          emptyAlpha={s.isFinal ? 0.85 : 0.6}
          {...s.stamps}
        />
      </div>

      {/* Pie: cliente · premio */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: w * 0.04 }}>
        <div style={{ flexShrink: 0 }}>
          <div style={caps}>{copy.labels.customer}</div>
          <div style={{ fontSize: w * 0.04, fontWeight: 600, marginTop: w * 0.012 }}>{copy.customer}</div>
        </div>
        <div
          style={{
            maxWidth: w * 0.5,
            textAlign: "right",
            borderRadius: w * 0.02,
            padding: `${w * 0.01}px ${w * 0.016}px`,
            margin: `-${w * 0.01}px -${w * 0.016}px`,
            background: s.haloReward > 0 ? fade(palette.accent, 0.4 * s.haloReward) : undefined,
            boxShadow: s.haloReward > 0 ? `0 0 ${w * 0.05 * s.haloReward}px ${fade(palette.accent, 0.8 * s.haloReward)}` : undefined,
          }}
        >
          <div style={caps}>{copy.labels.reward}</div>
          <div style={{ marginTop: w * 0.012 }}>
            {s.typing ? (
              <div style={{ fontSize: w * 0.04, fontWeight: 800, lineHeight: 1.15, whiteSpace: "nowrap" }}>
                {s.reward}
                <span style={{ opacity: s.caret ? 1 : 0, marginLeft: 2, fontWeight: 400 }}>|</span>
              </div>
            ) : (
              <SlotText text={s.reward} prev={s.prevNiche ? s.from.premio : null} p={s.p} align="right" style={{ fontSize: w * 0.04, fontWeight: 800, lineHeight: 1.15 }} />
            )}
          </div>
        </div>
      </div>

      <Sheen p={s.sheen} />
    </div>
  );
};

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
);
