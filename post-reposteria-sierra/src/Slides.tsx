import React from "react";
import { AbsoluteFill } from "remotion";
import { M, lightA, palette } from "./brand";
import { Arch } from "./components/Arch";
import { BrandLogo } from "./components/BrandLogo";
import { Dots } from "./components/Dots";
import { Phone, StatusBar } from "./components/Phone";
import { Photo } from "./components/Photo";
import { SierraCard } from "./components/SierraCard";
import { SierraLogo } from "./components/SierraLogo";
import { display, sans } from "./fonts";
import { TOTAL, business, slides } from "./post";

const W = 1080;
const H = 1350;
const greenBg = `radial-gradient(ellipse 85% 70% at 50% 45%, ${palette.brand} 0%, ${palette.brand} 30%, ${palette.greenDeep} 100%)`;

const Title: React.FC<{ text: string; color: string; size?: number; top: number; style?: React.CSSProperties }> = ({ text, color, size = 68, top, style }) => (
  <div style={{ position: "absolute", left: M, right: M, top, ...display, fontWeight: 400, fontSize: size, lineHeight: 1.08, color, textWrap: "balance", ...style }}>{text}</div>
);

/** Fila superior: logo de Mi Tarjetica a la izquierda y la cuenta del negocio a la derecha. */
const TopBar: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", left: M, right: M, top: 84, height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <BrandLogo variant={dark ? "light" : "color"} height={40} color={dark ? palette.light : palette.brand} />
    <span style={{ fontFamily: sans, fontSize: 26, fontWeight: 600, color: dark ? palette.onGreenSecondary : palette.inkSecondary }}>{business.handle}</span>
  </div>
);

/** 1 · Portada: foto del red velvet a sangre, etiqueta de Sierra y titular. */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: palette.cocoa }}>
    <Photo src="red-velvet.jpg" w={W} h={H} position="50% 100%" zoom={1.12} vignette={0.2} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,35,26,0.55) 0%, rgba(11,35,26,0) 22%, rgba(11,35,26,0) 52%, rgba(11,35,26,0.88) 76%, rgba(11,35,26,0.96) 100%)" }} />
    <div style={{ position: "absolute", left: M, top: 84 }}>
      <SierraLogo size={190} />
    </div>
    <div style={{ position: "absolute", right: M, top: 150 }}>
      <BrandLogo variant="light" height={42} color={palette.light} />
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 930, fontFamily: sans, fontSize: 26, fontWeight: 600, letterSpacing: "0.16em", color: palette.onGreenAccent }}>{slides.cover.eyebrow}</div>
    <Title text={slides.cover.title} color={palette.light} size={78} top={980} />
    <div style={{ position: "absolute", right: M, bottom: 96, fontFamily: sans, fontSize: 28, fontWeight: 600, color: palette.light }}>{slides.cover.swipe}</div>
    <Dots total={TOTAL} active={0} color={palette.light} y={H - 102} />
  </AbsoluteFill>
);

/** 2 · Los brownies en dos arcos. */
export const Brownies: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: palette.latte, fontFamily: sans }}>
    <TopBar dark={false} />
    <Title text={slides.brownies.title} color={palette.brand} size={80} top={190} />
    {[
      { src: "oreo.jpg", x: M, pos: "50% 62%", zoom: 1.25 },
      { src: "galleta.jpg", x: W - M - 430, pos: "45% 66%", zoom: 1.15 },
    ].map((p, i) => (
      <div key={p.src} style={{ position: "absolute", left: p.x, top: 330 + (i ? 70 : 0) }}>
        <Arch w={430} h={640} border={`2px solid ${palette.caramel}`} shadow={`0 30px 70px ${palette.shadow}`}>
          <Photo src={p.src} w={430} h={640} position={p.pos} zoom={p.zoom} />
        </Arch>
      </div>
    ))}
    <div style={{ position: "absolute", left: M, right: M, top: 1078, fontSize: 34, lineHeight: 1.35, color: palette.ink, textWrap: "balance" }}>{slides.brownies.text}</div>
    <Dots total={TOTAL} active={1} color={palette.brand} y={H - 92} />
  </AbsoluteFill>
);

/** 3 · La tarjeta de Sierra en el celular. */
export const CardSlide: React.FC = () => (
  <AbsoluteFill style={{ background: greenBg, fontFamily: sans }}>
    <TopBar dark />
    <Title text={slides.card.title} color={palette.light} top={180} />
    <div style={{ position: "absolute", left: (W - 740) / 2, top: 390 }}>
      <Arch w={740} h={730} fill={lightA(0.07)} border="2px solid rgba(200, 150, 62, 0.75)">
        <div style={{ position: "absolute", left: 125, top: 80 }}>
          <Phone w={490} h={980} screen={palette.latte}>
            <StatusBar color={palette.ink} size={21} />
            <div style={{ position: "absolute", left: 30, top: 96, fontWeight: 600, fontSize: 36, color: palette.ink }}>Tarjetas</div>
            <div style={{ position: "absolute", left: 20, top: 158 }}>
              <SierraCard w={414} />
            </div>
          </Phone>
        </div>
      </Arch>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 1150, fontSize: 28, color: palette.onGreenSecondary, textAlign: "center" }}>{slides.card.note}</div>
    <Dots total={TOTAL} active={2} color={palette.light} y={H - 92} />
  </AbsoluteFill>
);

/** 4 · La mesa llena de brownies + el premio. */
export const Table: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: palette.cocoa, fontFamily: sans }}>
    <Photo src="mesa.jpg" w={W} h={H} position="50% 70%" zoom={1.05} vignette={0.3} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,35,26,0.82) 0%, rgba(11,35,26,0.45) 14%, rgba(11,35,26,0) 28%, rgba(11,35,26,0) 78%, rgba(11,35,26,0.7) 100%)" }} />
    <TopBar dark />
    <div style={{ position: "absolute", left: M - 36, right: M - 36, bottom: 150, borderRadius: 40, background: palette.light, padding: "52px 56px 56px", boxShadow: "0 40px 90px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <svg key={i} width={46} height={46} viewBox="0 0 40 40">
            <rect x={4} y={6} width={32} height={28} rx={7} fill={palette.cocoa} />
            <path d="M9 14 C14 11 19 16 24 12 C27 10 30 12 31 13" fill="none" stroke={palette.butter} strokeWidth={2.2} strokeLinecap="round" />
          </svg>
        ))}
      </div>
      <div style={{ ...display, fontSize: 64, lineHeight: 1.08, color: palette.brand, textWrap: "balance" }}>{slides.table.title}</div>
      <div style={{ fontSize: 32, lineHeight: 1.35, color: palette.ink, marginTop: 18 }}>{slides.table.text}</div>
    </div>
    <Dots total={TOTAL} active={3} color={palette.light} y={H - 92} />
  </AbsoluteFill>
);

/** 5 · CTA para otros negocios. */
export const Cta: React.FC = () => (
  <AbsoluteFill style={{ background: greenBg, fontFamily: sans }}>
    <TopBar dark />
    <div style={{ position: "absolute", left: M, top: 190 }}>
      <Arch w={360} h={440} border={`2px solid ${palette.caramel}`} shadow="0 30px 70px rgba(0,0,0,0.35)">
        <Photo src="empacados.jpg" w={360} h={440} position="50% 45%" zoom={1.1} />
      </Arch>
    </div>
    <div style={{ position: "absolute", left: M + 300, top: 520 }}>
      <SierraLogo size={150} />
    </div>
    <Title text={slides.cta.title} color={palette.light} size={78} top={700} />
    <div style={{ position: "absolute", left: M, top: 912, width: 140, height: 2, background: palette.caramel }} />
    <div style={{ position: "absolute", left: M, right: M, top: 950, fontSize: 44, fontWeight: 600, color: palette.onGreenAccent }}>{slides.cta.cta}</div>
    <div style={{ position: "absolute", left: M, top: 1048, display: "flex", alignItems: "center", gap: 24 }}>
      <BrandLogo variant="light" height={50} color={palette.light} />
      <span style={{ width: 2, height: 34, background: lightA(0.35) }} />
      <span style={{ fontSize: 34, fontWeight: 600, color: palette.light }}>{slides.cta.url}</span>
    </div>
    <div style={{ position: "absolute", left: M, top: 1128, fontSize: 25, color: palette.onGreenSecondary }}>{slides.cta.sub}</div>
    <Dots total={TOTAL} active={4} color={palette.light} y={H - 92} />
  </AbsoluteFill>
);

export const ALL = [Cover, Brownies, CardSlide, Table, Cta];
