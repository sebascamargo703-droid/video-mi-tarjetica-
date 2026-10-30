import React from "react";
import { grid, palette, withAlpha } from "../brand";
import type { Slide } from "../carousels";
import { Arch } from "../components/Arch";
import { WithEmoji } from "../components/Emoji";
import { LockNotification } from "../components/LockNotification";
import { Beans, CoffeeBranch } from "../components/Ornaments";
import { Phone, StatusBar } from "../components/Phone";
import { ChargeHeader, Note, Title } from "../components/SlideFrame";
import { sans } from "../fonts";

/** Calles en latte oscurecido, manzanas en light; sin nombres de calles. */
const STREET = "#D9C7B0";
const MAP = 620;
const PIN = { x: 330, y: 300 };
const RINGS = [125, 215];
/** El cliente llega justo al borde del anillo exterior (abajo a la izquierda). */
const CLIENT = { x: PIN.x + RINGS[1] * Math.cos((140 * Math.PI) / 180), y: PIN.y + RINGS[1] * Math.sin((140 * Math.PI) / 180) };

const Map: React.FC<{ label: string }> = ({ label }) => {
  const cols = [0, 150, 300, 450, 600];
  const rows = [0, 140, 280, 420, 560];
  const st = 30; // ancho de calle
  return (
    <svg width={MAP} height={MAP} viewBox={`0 0 ${MAP} ${MAP}`} style={{ display: "block" }}>
      <rect width={MAP} height={MAP} fill={STREET} />
      {/* manzanas */}
      {rows.map((y, r) =>
        cols.map((x, c) => (
          <rect key={`${r}-${c}`} x={x + st / 2 - 60} y={y + st / 2 - 40} width={150 - st} height={140 - st} rx={12} fill={palette.light} />
        )),
      )}
      {/* avenida diagonal */}
      <path d={`M-40 ${MAP - 40} L${MAP + 40} 60`} stroke={STREET} strokeWidth={38} />
      <path d={`M-40 ${MAP - 40} L${MAP + 40} 60`} stroke={palette.light} strokeWidth={2} strokeDasharray="14 14" opacity={0.9} />
      {/* parque */}
      <rect x={405} y={385} width={120} height={110} rx={12} fill="#E3D7C3" />
      {[
        [430, 410],
        [470, 425],
        [500, 405],
        [445, 460],
        [495, 470],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={11} fill={withAlpha(palette.coffee, 0.22)} />
      ))}

      {/* anillos de proximidad */}
      <circle cx={PIN.x} cy={PIN.y} r={RINGS[1]} fill={withAlpha(palette.brand, 0.1)} stroke={withAlpha(palette.brand, 0.35)} strokeWidth={2} />
      <circle cx={PIN.x} cy={PIN.y} r={RINGS[0]} fill={withAlpha(palette.brand, 0.2)} stroke={withAlpha(palette.brand, 0.45)} strokeWidth={2} />

      {/* estela del cliente que viene caminando */}
      <path
        d={`M${CLIENT.x - 150} ${CLIENT.y + 190} C${CLIENT.x - 120} ${CLIENT.y + 120} ${CLIENT.x - 70} ${CLIENT.y + 90} ${CLIENT.x} ${CLIENT.y}`}
        fill="none"
        stroke={palette.coffee}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="1 15"
        opacity={0.75}
      />
      <circle cx={CLIENT.x} cy={CLIENT.y} r={30} fill={withAlpha(palette.coffee, 0.18)} />
      <circle cx={CLIENT.x} cy={CLIENT.y} r={14} fill={palette.coffee} stroke={palette.light} strokeWidth={4} />

      {/* pin del café */}
      <g transform={`translate(${PIN.x} ${PIN.y})`}>
        <ellipse cx={0} cy={4} rx={16} ry={6} fill={withAlpha(palette.ink, 0.2)} />
        <path d="M0 0 C-6 -14 -24 -26 -24 -44 A24 24 0 0 1 24 -44 C24 -26 6 -14 0 0 Z" fill={palette.brand} />
        <circle cx={0} cy={-44} r={9} fill={palette.light} />
      </g>
      <foreignObject x={PIN.x - 170} y={PIN.y - 132} width={340} height={60}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 24, color: palette.light, background: palette.brand, padding: "9px 18px", borderRadius: 999, boxShadow: "0 8px 18px rgba(43,29,20,0.18)", whiteSpace: "nowrap" }}>
            <WithEmoji text={label} />
          </div>
        </div>
      </foreignObject>
    </svg>
  );
};

/** Lámina 3 · 02 · El aviso al pasar cerca: mapa en arco + celular en pantalla de bloqueo al frente. */
export const NearbySlide: React.FC<{ s: Extract<Slide, { type: "nearby" }>; header: string }> = ({ s, header }) => {
  const archW = 560;
  const archTop = 430;
  const archH = 660;
  const phoneW = 400;
  return (
    <>
      <Beans color={palette.coffee} opacity={0.25} size={100} style={{ position: "absolute", right: 70, top: 46 }} />
      <ChargeHeader bg={s.bg} label={header} number={s.number} />
      <Title bg={s.bg} text={s.title} />

      {/* mapa al fondo */}
      <div style={{ position: "absolute", left: grid.m, top: archTop }}>
        <Arch w={archW} h={archH} border={`2px solid ${palette.caramel}`} shadow={`0 30px 70px ${palette.shadow}`} fill={STREET}>
          <div style={{ position: "absolute", left: (archW - MAP) / 2, top: archH - MAP }}>
            <Map label={s.pinLabel} />
          </div>
        </Arch>
      </div>

      {/* celular al frente, ligeramente inclinado */}
      <div style={{ position: "absolute", left: 1080 - grid.m - phoneW + 6, top: 596, transform: "rotate(5deg)", transformOrigin: "50% 50%" }}>
        <Phone w={phoneW} h={640} screen="linear-gradient(170deg, #7A5539 0%, #4E3423 55%, #2B1D14 100%)">
          <StatusBar color={palette.light} size={16} time="" />
          <div style={{ position: "absolute", left: 0, right: 0, top: 62, textAlign: "center", fontFamily: sans, color: palette.light, fontSize: 92, fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{s.time}</div>
          <div style={{ position: "absolute", left: 12, right: 12, top: 196 }}>
            <LockNotification app={s.app} when={s.when} message={s.message} size={24} />
          </div>
        </Phone>
      </div>

      <div style={{ position: "absolute", left: grid.m, width: 460, top: 1112, fontFamily: sans, fontSize: 30, lineHeight: 1.3, color: palette.ink }}>{s.text}</div>
      <Note bg={s.bg} text={s.note} size={21} top={1206} style={{ right: undefined, width: 520 }} />
      <CoffeeBranch color={palette.coffee} opacity={0.25} size={200} flip style={{ position: "absolute", right: 40, top: 1190 }} />
    </>
  );
};
