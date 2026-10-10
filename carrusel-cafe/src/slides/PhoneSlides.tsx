import React from "react";
import { grid, palette } from "../brand";
import type { Slide } from "../carousels";
import { Arch } from "../components/Arch";
import { CoffeeCard } from "../components/CoffeeCard";
import { Beans, CoffeeBranch } from "../components/Ornaments";
import { Phone, StatusBar } from "../components/Phone";
import { QrCode } from "../components/QrCode";
import { ChargeHeader, Note, Title } from "../components/SlideFrame";
import { sans } from "../fonts";
import { LockNotification } from "../components/LockNotification";

/** Arco translúcido sobre verde con el celular asomando desde abajo. */
const PhoneInArch: React.FC<{ screen: string; children: React.ReactNode }> = ({ screen, children }) => {
  const archW = 640;
  const archH = grid.visualBottom - grid.visualTop - 20;
  const phoneW = 400;
  return (
    <div style={{ position: "absolute", left: (1080 - archW) / 2, top: grid.visualTop }}>
      <Arch w={archW} h={archH} fill="rgba(246, 244, 235, 0.07)" border={`2px solid rgba(200, 150, 62, 0.75)`}>
        <div style={{ position: "absolute", left: (archW - phoneW) / 2 - 2, top: 96 }}>
          <Phone w={phoneW} h={820} screen={screen}>
            {children}
          </Phone>
        </div>
      </Arch>
    </div>
  );
};

const GreenOrnaments: React.FC = () => (
  <>
    <Beans color={palette.caramel} opacity={0.5} size={110} style={{ position: "absolute", right: 70, top: 600 }} />
    <CoffeeBranch color={palette.caramel} opacity={0.5} size={240} flip style={{ position: "absolute", left: 40, top: 880 }} />
  </>
);

/** Lámina 2 · 01 · La tarjeta. */
export const CardSlide: React.FC<{ s: Extract<Slide, { type: "card" }>; header: string }> = ({ s, header }) => (
  <>
    <GreenOrnaments />
    <ChargeHeader bg={s.bg} label={header} number={s.number} />
    <Title bg={s.bg} text={s.title} />
    <PhoneInArch screen={palette.latte}>
      <StatusBar color={palette.ink} size={18} />
      <div style={{ position: "absolute", left: 26, top: 82, fontFamily: sans, fontWeight: 600, fontSize: 30, color: palette.ink, letterSpacing: "-0.01em" }}>Tarjetas</div>
      <div style={{ position: "absolute", left: 18, top: 134 }}>
        <CoffeeCard w={336} />
      </div>
      {/* código QR genérico */}
      <div style={{ position: "absolute", left: 136, top: 520, width: 100, height: 100, padding: 8, borderRadius: 14, background: palette.light, boxShadow: "0 6px 16px rgba(43,29,20,0.12)" }}>
        <QrCode size={84} color={palette.ink} />
      </div>
    </PhoneInArch>
    <Note bg={s.bg} text={s.note} />
  </>
);

/** Lámina 4 · 03 · Los mensajes de cumpleaños (pantalla de bloqueo con notificación). */
export const NotificationSlide: React.FC<{ s: Extract<Slide, { type: "notification" }>; header: string }> = ({ s, header }) => (
  <>
    <GreenOrnaments />
    <ChargeHeader bg={s.bg} label={header} number={s.number} />
    <Title bg={s.bg} text={s.title} />
    <PhoneInArch screen="linear-gradient(170deg, #7A5539 0%, #4E3423 55%, #2B1D14 100%)">
      <StatusBar color={palette.light} size={18} time="" />
      {/* granos de fondo, muy sutiles */}
      <Beans color="#F3E7D7" opacity={0.12} size={220} style={{ position: "absolute", right: -40, top: 360 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 78, textAlign: "center", fontFamily: sans, color: palette.light }}>
        <div style={{ fontSize: 21, fontWeight: 600 }}>{s.date}</div>
        <div style={{ fontSize: 112, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em" }}>{s.time}</div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, top: 280 }}>
        <LockNotification app={s.app} when={s.when} message={s.message} size={23} />
      </div>
    </PhoneInArch>
    <Note bg={s.bg} text={s.note} size={24} />
  </>
);
