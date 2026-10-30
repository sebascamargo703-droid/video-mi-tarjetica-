import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { biz, brand } from "../brand";
import { birthday, copy } from "../copy";
import { font, tracking } from "../fonts";
import { CAL, dayCenter, daysInMonth, rows } from "../layout";
import { EASE, clamp, pop } from "../motion";

const WEEK_INITIALS = ["L", "M", "M", "J", "V", "S", "D"];

/** Paso del resaltado: día de origen, destino, avance del salto (0–1) y día que queda debajo del círculo. */
export const highlightStep = (progress: number) => {
  const d0 = Math.floor(progress);
  const d1 = Math.min(birthday.day, d0 + 1);
  // Cada salto ocupa el primer 45 % del intervalo del día (paso, pausa, paso…).
  const step = interpolate(progress - d0, [0, 0.45], [0, 1], { ...clamp, easing: EASE });
  return { d0, d1, step, under: step < 0.5 ? d0 : d1 };
};

/**
 * Resaltado circular que avanza día por día. `progress` es el índice continuo del día
 * (1 → cumpleaños); dentro de la misma fila se desliza, al cambiar de fila se funde.
 */
export const DayHighlight: React.FC<{ progress: number; visible: number }> = ({ progress, visible }) => {
  const { d0, d1, step } = highlightStep(progress);
  const a = dayCenter(d0);
  const b = dayCenter(d1);
  const size = CAL.cell * 0.78;
  const sameRow = a.row === b.row;
  const circle = (x: number, y: number, o: number, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: brand.colors.black,
        opacity: o * visible,
        boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
      }}
    />
  );
  if (sameRow || d0 === d1) {
    return circle(a.x + (b.x - a.x) * step, a.y + (b.y - a.y) * step, 1, "h");
  }
  return (
    <>
      {circle(a.x, a.y, 1 - step, "a")}
      {circle(b.x, b.y, step, "b")}
    </>
  );
};

/** Calendario mensual minimalista. El cumpleaños lleva 🎂 desde el inicio y hace pop al llegar. */
export const Calendar: React.FC<{ progress: number; highlight: number; arriveAt: number; emojiOpacity?: number }> = ({
  progress,
  highlight,
  arriveAt,
  emojiOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrived = pop(frame, fps, arriveAt);
  const current = highlightStep(progress).under;
  const bd = dayCenter(birthday.day);
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: font }}>
      {/* Título del mes */}
      <div style={{ position: "absolute", left: CAL.x + 24, top: CAL.y, height: CAL.header, display: "flex", alignItems: "center", fontWeight: 800, fontSize: 64, letterSpacing: tracking.headline, color: brand.colors.black }}>
        {copy.calendarTitle}
      </div>
      {/* Iniciales de la semana */}
      {WEEK_INITIALS.map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: CAL.x + i * CAL.cell,
            width: CAL.cell,
            top: CAL.y + CAL.header,
            height: CAL.weekdays,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: tracking.caps,
            color: brand.colors.grayOnCream,
          }}
        >
          {w}
        </div>
      ))}
      {/* Línea fina bajo los días de la semana */}
      <div style={{ position: "absolute", left: CAL.x + 24, width: CAL.w - 48, top: CAL.y + CAL.header + CAL.weekdays - 14, height: 2, background: "rgba(10,10,10,0.08)" }} />
      <DayHighlight progress={progress} visible={highlight * (1 - Math.min(1, arrived))} />
      {/* Relleno rosa del cumpleaños al llegar */}
      <div
        style={{
          position: "absolute",
          left: bd.x - CAL.cell * 0.42,
          top: bd.y - CAL.cell * 0.42,
          width: CAL.cell * 0.84,
          height: CAL.cell * 0.84,
          borderRadius: "50%",
          background: biz.primary,
          transform: `scale(${arrived})`,
          boxShadow: arrived > 0 ? "0 14px 30px rgba(122,46,58,0.25)" : undefined,
        }}
      />
      {/* Días */}
      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
        const c = dayCenter(d);
        const isBday = d === birthday.day;
        const onHighlight = highlight > 0.5 && d === current && arrived <= 0;
        const color = isBday && arrived > 0.3 ? biz.deep : onHighlight ? brand.colors.white : brand.colors.black;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: c.x - CAL.cell / 2,
              top: c.y - CAL.cell / 2,
              width: CAL.cell,
              height: CAL.cell,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: isBday ? 800 : 600,
              fontSize: 40,
              fontVariantNumeric: "tabular-nums",
              color,
              transform: isBday ? `scale(${1 + 0.12 * Math.sin(Math.min(1, arrived) * Math.PI)})` : undefined,
            }}
          >
            {d}
            {isBday ? (
              <span style={{ position: "absolute", right: 6, top: 2, fontSize: 30, opacity: emojiOpacity, transform: `rotate(12deg) scale(${1 + 0.3 * Math.sin(Math.min(1, arrived) * Math.PI)})` }}>🎂</span>
            ) : null}
          </div>
        );
      })}
      {/* Leyenda */}
      <div
        style={{
          position: "absolute",
          left: CAL.x + 24,
          top: CAL.y + CAL.header + CAL.weekdays + rows * CAL.cell + 22,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 32,
          fontWeight: 600,
          color: brand.colors.grayOnCream,
        }}
      >
        <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: "50%", background: biz.primary, boxShadow: `inset 0 0 0 2px ${biz.deep}` }} />
        {birthday.day} · {copy.calendarLegend} 🎂
      </div>
    </div>
  );
};
