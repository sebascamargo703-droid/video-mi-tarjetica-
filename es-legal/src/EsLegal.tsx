import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { audio, brand } from "./brand";
import { business, captions, copy, fan } from "./copy";
import { font, tracking } from "./fonts";
import { BusinessPin } from "./components/BusinessPin";
import { Caption } from "./components/Caption";
import { GeofenceRing } from "./components/GeofenceRing";
import { LockScreen } from "./components/LockScreen";
import { Logo } from "./components/Logo";
import { Notification } from "./components/Notification";
import { MiniCard, PassCard } from "./components/PassCard";
import { Phone } from "./components/Phone";
import { QrCode } from "./components/QrCode";
import { Storefront, SIDEWALK_Y, Walker } from "./components/Storefront";
import { StreetMap } from "./components/StreetMap";
import { WalkingDot } from "./components/WalkingDot";
import { PATH, PIN, RING_R, SAFE, crossing, project } from "./layout";
import { EASE_IN, EASE_INOUT, clamp, ease, pop } from "./motion";
import { SCENES, type SceneId, V, VOICE } from "./timeline";

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  return { frame, fps, s, t: frame / fps };
};

/* ------------------------------------------------------------------ */
/* Cortes entre escenas: la nueva entra encima con zoom + desenfoque. */
const OVER = 7;
const Scene: React.FC<{ id: SceneId; bg?: string; children: React.ReactNode }> = ({ id, bg = brand.colors.bg, children }) => {
  const { frame, s } = useT();
  const a = s(SCENES[id].from);
  const b = s(SCENES[id].to);
  if (frame < a || frame > b + OVER) return null;
  const tin = a === 0 ? 1 : ease(frame, a, OVER);
  return (
    <AbsoluteFill style={{ background: bg, opacity: tin, transform: `scale(${1.05 - 0.05 * tin})`, filter: tin < 1 ? `blur(${(1 - tin) * 12}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

const nightBg = `radial-gradient(ellipse 900px 700px at 480px 1050px, ${brand.colors.bgMid} 0%, ${brand.colors.bg} 70%)`;

/* Celular grande con una pantalla; `y` = borde superior. Escala sobre un celular de 720 px. */
const BigPhone: React.FC<{ y: number; w?: number; tilt?: number; shake?: number; screenBg?: string; statusColor?: string; children: React.ReactNode }> = ({
  y,
  w = 600,
  tilt = 0,
  shake = 0,
  screenBg = "#000",
  statusColor = "#fff",
  children,
}) => (
  <div style={{ position: "absolute", left: SAFE.centerX - 360, top: y, width: 720, transformOrigin: "50% 0", transform: `scale(${w / 720}) translateX(${shake}px) rotate(${tilt}deg)` }}>
    <Phone width={720} screenBg={screenBg} statusColor={statusColor} time={copy.lockTime} shadow="0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)">
      {children}
    </Phone>
  </div>
);
const SCREEN = 720 - 2 * (720 * 0.012 + 720 * 0.026); // ancho útil de la pantalla

/* ------------------------------------------------------------------ */
/* 1 · Gancho: la persona pasa frente al café y le llega la notificación. */
const HookScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const walkX = interpolate(t, [0, 1.6, 4.5], [-80, 330, 430], { ...clamp, easing: EASE_INOUT });
  const phase = t * Math.PI * 2 * 1.1 * interpolate(t, [0, 1.6, 2.2], [1, 1, 0.25], clamp);
  const nAt = s(V.q1.at + 0.75);
  const n = pop(frame, fps, nAt);
  const zoom = interpolate(frame, [s(V.q2.at - 0.1), s(V.q2.at + 0.7)], [0, 1], { ...clamp, easing: EASE_INOUT });
  const bigAt = s(V.q2.at + 0.95);
  const big = frame >= bigAt ? spring({ frame: frame - bigAt, fps, config: { damping: 14, stiffness: 180 } }) : 0;
  const push = interpolate(t, [0, 4.5], [1, 1.06], clamp);
  return (
    <Scene id="hook" bg={brand.colors.bg}>
      <AbsoluteFill style={{ transform: `scale(${push * (1 + 0.25 * zoom)})`, transformOrigin: "480px 760px", filter: zoom > 0 ? `blur(${zoom * 7}px) brightness(${1 - 0.45 * zoom})` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 640 }}>
          <Storefront />
        </div>
        <Walker x={walkX} y={640 + SIDEWALK_Y} phase={phase} />
      </AbsoluteFill>
      {/* notificación sobre la persona */}
      <div
        style={{
          position: "absolute",
          left: SAFE.centerX - 320,
          top: interpolate(zoom, [0, 1], [600, 560]),
          transformOrigin: "50% 100%",
          transform: `scale(${(0.6 + 0.4 * n) * (1 + 0.12 * zoom)})`,
          opacity: Math.min(1, n * 1.4),
        }}
      >
        <Notification width={640} />
        <div style={{ position: "absolute", left: 300, bottom: -18, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "20px solid rgba(255,255,255,0.16)" }} />
      </div>
      {/* ¿ESTO ES LEGAL? */}
      {big > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 960, top: 980, transform: `scale(${1.5 - 0.5 * big})`, opacity: Math.min(1, big * 1.5), transformOrigin: "480px 100px" }}>
          <Caption text={copy.big} at={bigAt} speak={4} size={150} style={{ lineHeight: 1.0 }} />
        </div>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Mapa: posición del cliente sobre la calle a lo largo del camino. */
const pathLen = Math.hypot(PATH[1].x - PATH[0].x, PATH[1].y - PATH[0].y);
const posAt = (d: number) => {
  const c = Math.max(0, Math.min(pathLen, d));
  return { x: PATH[0].x + ((PATH[1].x - PATH[0].x) * c) / pathLen, y: PATH[0].y + ((PATH[1].y - PATH[0].y) * c) / pathLen };
};
const Trail: React.FC<{ to: number; color: string; erase?: number; opacity?: number }> = ({ to, color, erase = 0, opacity = 1 }) => {
  const dots: React.ReactNode[] = [];
  for (let d = 0; d < to - 30; d += 26) {
    const o = (0.25 + 0.75 * (d / Math.max(1, to))) * (d / to < erase ? 0 : 1);
    dots.push(<div key={d} style={{ position: "absolute", left: posAt(d).x - 8, top: posAt(d).y - 8, width: 16, height: 16, borderRadius: "50%", background: color, opacity: o * opacity, boxShadow: `0 0 12px ${color}` }} />);
  }
  return <>{dots}</>;
};
const YouChip: React.FC<{ x: number; y: number; k: number; opacity: number }> = ({ x, y, k, opacity }) => (
  <div style={{ position: "absolute", left: x + 26 * k, top: y - 64 * k, opacity, padding: `${6 * k}px ${16 * k}px`, borderRadius: 999, background: "#2F7BF6", color: "#fff", fontFamily: font, fontWeight: 800, fontSize: 28 * k }}>Tú</div>
);

/* 2 · "Tranquilo. Nadie te está siguiendo." */
const Map1Scene: React.FC = () => {
  const { frame, s, t } = useT();
  const t0 = SCENES.map1.from;
  const walked = 260 + 300 * Math.max(0, t - t0);
  const dot = project(posAt(walked).x, posAt(walked).y);
  const offAt = V.calm.at + 0.8;
  const off = ease(frame, s(offAt), s(0.7));
  const appear = ease(frame, s(t0), s(0.6));
  const blink = (Math.sin(t * Math.PI * 4) + 1) / 2;
  return (
    <Scene id="map1" bg={brand.colors.bg}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * ease(frame, s(t0), s(2.4), EASE_INOUT)})`, transformOrigin: "480px 1100px" }}>
        <StreetMap opacity={appear} lift={(1 - appear) * 60}>
          <Trail to={walked} color={brand.colors.red} erase={off} opacity={1 - 0.3 * off} />
        </StreetMap>
        {/* localizador rojo que desaparece */}
        <div style={{ position: "absolute", left: dot.x - 60, top: dot.y - 60, width: 120, height: 120, borderRadius: "50%", border: `4px solid ${brand.colors.red}`, opacity: (1 - off) * (0.4 + 0.6 * blink), transform: `scale(${0.8 + 0.3 * blink})` }} />
        <WalkingDot x={dot.x} y={dot.y} k={dot.k} opacity={appear} />
        <YouChip x={dot.x} y={dot.y} k={dot.k} opacity={appear} />
      </AbsoluteFill>
      {/* etiqueta de estado */}
      <div style={{ position: "absolute", left: 0, width: 960, top: 1400, display: "flex", justifyContent: "center", fontFamily: font, fontWeight: 800, fontSize: 32, letterSpacing: "0.18em" }}>
        <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 16, color: brand.colors.red, opacity: (1 - off) * appear }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: brand.colors.red, opacity: 0.4 + 0.6 * blink }} />
          {copy.tracking}
        </div>
        <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 14, color: brand.colors.mint, opacity: off, transform: `scale(${0.9 + 0.1 * off})` }}>
          <svg width={34} height={34} viewBox="0 0 24 24">
            <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={brand.colors.mint} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {copy.noTracking}
        </div>
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · La tarjeta en el Wallet y cómo la guardaste (escaneando el QR). */
const WalletStack: React.FC = () => (
  <div style={{ position: "absolute", left: 22, right: 22, top: 1075, display: "flex", flexDirection: "column", gap: 0 }}>
    {["#C2410C", "#1D4ED8", "#6D28D9"].map((c, i) => (
      <div key={c} style={{ height: 90, borderRadius: "26px 26px 0 0", background: c, marginTop: i ? -30 : 0, boxShadow: "0 -6px 18px rgba(0,0,0,0.35)" }} />
    ))}
  </div>
);

const CardScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const t0 = SCENES.card.from;
  const rise = spring({ frame: frame - s(t0), fps, config: { damping: 200 } });
  const camAt = s(V.scan.at - 0.15);
  const cam = ease(frame, camAt, s(0.45), EASE_INOUT);
  const foundAt = s(V.scan.at + 1.25);
  const found = ease(frame, foundAt, s(0.25));
  const addAt = s(V.scan.at + 1.65);
  const add = spring({ frame: frame - addAt, fps, config: { damping: 20, stiffness: 120 } });
  const scanLine = ((t - (V.scan.at - 0.15)) * 0.9) % 1;
  const sway = Math.sin(t * 1.3) * 1.2;
  const passW = SCREEN - 64;
  return (
    <Scene id="card" bg={nightBg}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, transform: `translateY(${(1 - rise) * 900}px)` }}>
        <BigPhone y={580} w={600} tilt={sway}>
          {/* Wallet */}
          <AbsoluteFill style={{ background: "#050505", opacity: 1 - cam }}>
            <div style={{ position: "absolute", top: 140, left: 32, right: 32, display: "flex", justifyContent: "space-between", fontFamily: font, fontWeight: 600, fontSize: 32, color: "#fff" }}>
              <span>Listo</span>
              <span style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>···</span>
            </div>
            <div style={{ position: "absolute", left: 32, top: 210 }}>
              <PassCard width={passW} />
            </div>
            <WalletStack />
          </AbsoluteFill>
          {/* cámara escaneando el adhesivo del mostrador */}
          {cam > 0 ? (
            <AbsoluteFill style={{ opacity: cam, background: "radial-gradient(circle at 50% 40%, #7A4A28 0%, #3A2213 60%, #1A0F08 100%)" }}>
              <div style={{ position: "absolute", left: SCREEN / 2 - 190, top: 330, width: 380, padding: 26, borderRadius: 26, background: brand.colors.cream, transform: `rotate(-4deg) scale(${1 + 0.03 * Math.sin(t * 2)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, fontFamily: font, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 600, fontSize: 40, color: brand.colors.ink }}>{business.name}</div>
                <QrCode size={250} color={brand.colors.ink} background={brand.colors.cream} quiet={0} />
                <div style={{ fontWeight: 800, fontSize: 24, color: brand.colors.green, textAlign: "center" }}>{copy.scanHint}</div>
              </div>
              {/* visor */}
              {[
                [0, 0],
                [1, 0],
                [0, 1],
                [1, 1],
              ].map(([cx, cy], i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: SCREEN / 2 - 230 + cx * 400 - (found * 30 * (cx ? -1 : 1)),
                    top: 300 + cy * 520 - (found * 30 * (cy ? -1 : 1)),
                    width: 60,
                    height: 60,
                    borderColor: found > 0.5 ? brand.colors.mint : "#F2B35A",
                    borderStyle: "solid",
                    borderWidth: `${cy ? 0 : 9}px ${cx ? 9 : 0}px ${cy ? 9 : 0}px ${cx ? 0 : 9}px`,
                    borderRadius: 12,
                  }}
                />
              ))}
              {found < 1 ? <div style={{ position: "absolute", left: SCREEN / 2 - 200, width: 400, top: 320 + 500 * scanLine, height: 4, background: "#F2B35A", boxShadow: "0 0 20px #F2B35A", opacity: 1 - found }} /> : null}
              {/* la tarjeta queda guardada */}
              {frame >= addAt ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: `rgba(5,5,5,${0.85 * Math.min(1, add)})` }}>
                  <div style={{ position: "absolute", left: 32, top: 210 + (1 - add) * 900 }}>
                    <PassCard width={passW} />
                  </div>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 128, display: "flex", justifyContent: "center", opacity: ease(frame, addAt + s(0.3), s(0.3)) }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 999, background: brand.colors.mint, color: brand.colors.ink, fontFamily: font, fontWeight: 800, fontSize: 30 }}>✓ {copy.added}</div>
                  </div>
                </div>
              ) : null}
            </AbsoluteFill>
          ) : null}
        </BigPhone>
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · La ubicación va en la tarjeta; tu celular decide; el negocio no ve nada. */
const enterAt2 = V.near.at + 0.55;
const startAt2 = V.loc.at + 0.2;
const speed2 = crossing.dist / (enterAt2 - startAt2);

const Map2Scene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const t0 = SCENES.map2.from;
  const appear = ease(frame, s(t0), s(0.6));
  const store = ease(frame, s(V.loc.at + 0.9), s(0.6));
  const pinPop = pop(frame, fps, s(V.loc.at + 1.1));
  const chip = ease(frame, s(V.loc.at + 1.6), s(0.5));
  const walked = speed2 * Math.max(0, t - startAt2);
  const p = posAt(walked);
  const dot = project(p.x, p.y);
  const pin = project(PIN.x, PIN.y);
  // celular con la notificación
  const phoneAt = s(V.near.at + 1.0);
  const phoneIn = spring({ frame: frame - phoneAt, fps, config: { damping: 200 } });
  const phoneOut = ease(frame, s(V.nosabe.at - 0.15), s(0.45), EASE_IN);
  const notifAt = s(V.near.at + 1.45);
  const n = pop(frame, fps, notifAt);
  const shake = frame >= notifAt && frame < notifAt + s(0.35) ? Math.sin((frame - notifAt) * 2.4) * 7 : 0;
  // panel "lo que ve el negocio"
  const panel = spring({ frame: frame - s(V.nosabe.at + 0.25), fps, config: { damping: 18, stiffness: 140 } });
  const cam = ease(frame, s(t0), s(5), EASE_INOUT);
  return (
    <Scene id="map2" bg={brand.colors.bg}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.1 * cam})`, transformOrigin: `${pin.x}px ${pin.y}px`, filter: phoneIn > 0.01 && phoneOut < 1 ? `brightness(${1 - 0.35 * phoneIn * (1 - phoneOut)})` : undefined }}>
        <StreetMap opacity={appear} lift={(1 - appear) * 60} store={store}>
          <GeofenceRing x={PIN.x} y={PIN.y} r={RING_R} appearAt={s(V.loc.at + 1.3)} enterAt={s(enterAt2)} />
          <Trail to={walked} color="#7FB2FF" opacity={0.6} />
        </StreetMap>
        <BusinessPin x={pin.x} y={pin.y} k={pin.k} appear={ease(frame, s(V.loc.at + 1.3), s(0.5))} pop={pinPop} />
        <WalkingDot x={dot.x} y={dot.y} k={dot.k} opacity={ease(frame, s(startAt2), s(0.4))} />
        <YouChip x={dot.x} y={dot.y} k={dot.k} opacity={ease(frame, s(startAt2), s(0.4))} />
      </AbsoluteFill>
      {/* chip: la ubicación vive en la tarjeta */}
      <div style={{ position: "absolute", left: 0, width: 960, top: 1395, display: "flex", justifyContent: "center", opacity: chip * (1 - ease(frame, s(V.near.at + 0.8), s(0.3))), transform: `translateY(${(1 - chip) * 20}px)` }}>
        <div style={{ padding: "14px 28px", borderRadius: 999, background: "rgba(8,58,48,0.9)", border: `2px solid ${brand.colors.mint}`, color: brand.colors.white, fontFamily: font, fontWeight: 800, fontSize: 32 }}>{copy.savedLocation}</div>
      </div>
      {/* tu propio celular te la muestra */}
      {phoneIn > 0.001 && phoneOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - phoneIn) * 1100 + phoneOut * 1100}px)` }}>
          <BigPhone y={660} w={560} shake={shake}>
            <LockScreen>
              <div style={{ position: "absolute", left: 20, top: 400, transformOrigin: "50% 0", transform: `scale(${0.85 + 0.15 * n}) translateY(${(1 - n) * -30}px)`, opacity: Math.min(1, n * 1.5) }}>
                <Notification width={SCREEN - 40} />
              </div>
            </LockScreen>
          </BigPhone>
        </div>
      ) : null}
      {/* el negocio no ve nada */}
      {panel > 0.001 ? (
        <div style={{ position: "absolute", left: SAFE.centerX - 380, width: 760, top: 1080, transform: `translateY(${(1 - panel) * 60}px) scale(${0.92 + 0.08 * panel})`, opacity: Math.min(1, panel * 1.4) }}>
          <div style={{ borderRadius: 32, padding: "30px 34px", background: "rgba(10,22,18,0.92)", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 70px rgba(0,0,0,0.6)", fontFamily: font, color: brand.colors.white }}>
            <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 999, background: "rgba(255,90,82,0.16)", color: brand.colors.red, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em" }}>{copy.bizSees}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 24 }}>
              <svg width={70} height={70} viewBox="0 0 24 24">
                <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" fill="none" stroke={brand.colors.soft} strokeWidth={1.8} />
                <circle cx={12} cy={10} r={2.2} fill={brand.colors.soft} />
                <path d="M4 4l16 16" stroke={brand.colors.red} strokeWidth={2.2} strokeLinecap="round" />
              </svg>
              <div>
                <div style={{ fontSize: 30, fontWeight: 600, color: brand.colors.soft }}>{copy.bizSeesValue}</div>
                <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: tracking.title }}>{copy.bizSeesNone}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · "Y la puedes apagar cuando quieras." */
const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 96, height: 58, borderRadius: 999, background: on > 0.5 ? brand.colors.greenMid : "#C9C9C6", position: "relative", transition: "none" }}>
    <div style={{ position: "absolute", top: 5, left: 5 + 38 * on, width: 48, height: 48, borderRadius: "50%", background: "#FBFBF9", boxShadow: "0 3px 8px rgba(0,0,0,0.25)" }} />
  </div>
);

const SettingsScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const t0 = SCENES.settings.from;
  const rise = spring({ frame: frame - s(t0), fps, config: { damping: 200 } });
  const tapAt = s(V.off.at + 0.7);
  const off = ease(frame, tapAt, s(0.25), EASE_INOUT);
  const press = interpolate(frame, [tapAt - 8, tapAt, tapAt + 6, tapAt + 14], [0, 1, 1, 0], clamp);
  const fingerIn = ease(frame, tapAt - s(0.5), s(0.45), EASE_INOUT);
  const fingerOut = ease(frame, tapAt + s(0.3), s(0.3), EASE_IN);
  return (
    <Scene id="settings" bg={nightBg}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - rise) * 900}px)` }}>
        <BigPhone y={580} w={600} screenBg="#F2F1EE" statusColor="#111">
          <div style={{ position: "absolute", left: 36, right: 36, top: 150, fontFamily: font, color: "#111" }}>
            <div style={{ fontSize: 44, fontWeight: 800, textAlign: "center", letterSpacing: tracking.title }}>{copy.settingsTitle}</div>
            <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 18, padding: 20, borderRadius: 24, background: "#FBFBF9" }}>
              <div style={{ width: 70, height: 70, borderRadius: 16, background: brand.colors.green }} />
              <div>
                <div style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 600, fontSize: 34 }}>{business.name}</div>
                <div style={{ fontSize: 24, color: "#666" }}>Tarjeta de sellos</div>
              </div>
            </div>
            <div style={{ marginTop: 30, borderRadius: 24, background: "#FBFBF9", overflow: "hidden" }}>
              {copy.settings.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px", borderTop: i ? "1.5px solid #E6E5E1" : undefined, background: i === 1 ? `rgba(105,211,190,${0.25 * press})` : undefined }}>
                  <span style={{ fontSize: 30, fontWeight: 600, maxWidth: 400, lineHeight: 1.2 }}>{label}</span>
                  <Toggle on={i === 1 ? 1 - off : 1} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, fontSize: 24, lineHeight: 1.35, color: "#55524C", padding: "0 8px" }}>{copy.settingsNote}</div>
          </div>
          {/* dedo */}
          {fingerIn > 0 && fingerOut < 1 ? (
            <div style={{ position: "absolute", left: 512 + (1 - fingerIn) * 120, top: 500 + (1 - fingerIn) * 260 + fingerOut * 200, width: 90, height: 90, borderRadius: "50%", background: "rgba(40,40,40,0.28)", border: "3px solid rgba(255,255,255,0.8)", transform: `scale(${1 - 0.18 * press})`, opacity: 1 - fingerOut }} />
          ) : null}
        </BigPhone>
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 6 · Para el negocio: aparece en el celular de su cliente frente a su puerta. */
const StoreScene: React.FC = () => {
  const { frame, fps, s, t } = useT();
  const t0 = SCENES.store.from;
  const phoneAt = s(V.door.at - 0.1);
  const phoneIn = spring({ frame: frame - phoneAt, fps, config: { damping: 200 } });
  const notifAt = s(V.door.at + 0.5);
  const n = pop(frame, fps, notifAt);
  const shake = frame >= notifAt && frame < notifAt + s(0.35) ? Math.sin((frame - notifAt) * 2.4) * 7 : 0;
  const cardAt = s(V.stamp.at - 0.1);
  const cardIn = spring({ frame: frame - cardAt, fps, config: { damping: 20, stiffness: 120 } });
  const pulse = frame > cardAt + s(0.6) ? (Math.sin((t - V.stamp.at) * Math.PI * 3) + 1) / 2 : 0;
  const badge = pop(frame, fps, s(V.stamp.at + 0.55));
  const blur = ease(frame, phoneAt, s(0.6));
  return (
    <Scene id="store" bg={brand.colors.bg}>
      <AbsoluteFill style={{ transform: `scale(${1.12 + 0.06 * ease(frame, s(t0), s(6), EASE_INOUT)})`, transformOrigin: "540px 1150px", filter: `blur(${blur * 9}px) brightness(${1 - 0.4 * blur})` }}>
        <div style={{ position: "absolute", left: 0, top: 640 }}>
          <Storefront />
        </div>
      </AbsoluteFill>
      {phoneIn > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - phoneIn) * 1100}px)` }}>
          <BigPhone y={640} w={580} shake={shake} tilt={Math.sin(t * 1.1) * 1}>
            <LockScreen clockOpacity={1 - ease(frame, cardAt, s(0.3))}>
              <div style={{ position: "absolute", left: 20, top: 400, transformOrigin: "50% 0", transform: `scale(${0.85 + 0.15 * n})`, opacity: Math.min(1, n * 1.5) * (1 - ease(frame, cardAt, s(0.25))) }}>
                <Notification width={SCREEN - 40} />
              </div>
            </LockScreen>
            {frame >= cardAt ? (
              <AbsoluteFill style={{ background: `rgba(5,5,5,${0.9 * Math.min(1, cardIn)})` }}>
                <div style={{ position: "absolute", left: 32, top: 200 + (1 - cardIn) * 900 }}>
                  <PassCard width={SCREEN - 64} pulse={pulse} />
                </div>
              </AbsoluteFill>
            ) : null}
          </BigPhone>
          {/* ¡Te falta 1! */}
          {badge > 0 ? (
            <div style={{ position: "absolute", left: 620, top: 1070, transform: `scale(${badge}) rotate(8deg)`, padding: "16px 26px", borderRadius: 24, background: brand.colors.highlight, color: brand.colors.ink, fontFamily: font, fontWeight: 800, fontSize: 40, boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
              ¡Te falta 1!
            </div>
          ) : null}
        </div>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · "¿Quieres una así para tu negocio?" — abanico de tarjetas de otros negocios. */
const FanScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const t0 = SCENES.fan.from;
  const order = [0, 4, 1, 3, 2]; // la del café queda encima
  return (
    <Scene id="fan" bg={nightBg}>
      {order.map((i) => {
        const c = fan[i];
        const o = i - 2;
        const p = spring({ frame: frame - s(t0 + 0.15) - Math.abs(o) * 3, fps, config: { damping: 16, stiffness: 110 } });
        const float = Math.sin((frame / fps) * 1.4 + i) * 6;
        return (
          <div
            key={c.name}
            style={{
              position: "absolute",
              left: SAFE.centerX - 220,
              top: 900,
              transformOrigin: "50% 160%",
              transform: `translate(${o * 92 * p}px, ${Math.abs(o) * 34 * p + (1 - p) * 500 + float}px) rotate(${o * 9 * p}deg) scale(${o === 0 ? 1.05 : 0.95})`,
              opacity: Math.min(1, p * 2),
            }}
          >
            <MiniCard {...c} />
          </div>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 8 · CTA: "Comenta TARJETA" + logo. */
const CtaScene: React.FC = () => {
  const { frame, fps, s } = useT();
  const at = s(V.cta.at);
  const title = spring({ frame: frame - at + 2, fps, config: { damping: 14, stiffness: 170 } });
  const word = spring({ frame: frame - at - s(0.3), fps, config: { damping: 12, stiffness: 190 } });
  const sub = ease(frame, at + s(0.7), s(0.5));
  const bar = ease(frame, at + s(0.5), s(0.5));
  const typeStart = at + s(0.95);
  const typed = copy.cta.word.slice(0, Math.max(0, Math.min(copy.cta.word.length, Math.floor((frame - typeStart) / 3))));
  const sentAt = typeStart + copy.cta.word.length * 3 + s(0.25);
  const sent = ease(frame, sentAt, s(0.4));
  const logoAt = at + s(1.9);
  const caret = Math.floor(frame / 15) % 2 === 0;
  const arrow = Math.sin((frame / fps) * Math.PI * 2 * 1.2) * 10;
  return (
    <Scene id="cta" bg={nightBg}>
      <div style={{ position: "absolute", left: 0, width: 960, top: 330, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: font, color: brand.colors.white }}>
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: tracking.headline, lineHeight: 1, transform: `scale(${0.7 + 0.3 * title})`, opacity: Math.min(1, title * 1.5) }}>{copy.cta.top}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18, transform: `scale(${0.6 + 0.4 * word})`, opacity: Math.min(1, word * 1.5) }}>
          <span style={{ fontSize: 132, fontWeight: 800, letterSpacing: tracking.headline, lineHeight: 1.05, background: brand.colors.highlight, color: brand.colors.ink, padding: "0 22px", borderRadius: 18 }}>{copy.cta.word}</span>
          <span style={{ fontSize: 110, fontWeight: 800, transform: `translateY(${arrow}px)` }}>↓</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 44, fontWeight: 600, color: brand.colors.soft, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>{copy.cta.sub}</div>
      </div>
      {/* barra de comentario */}
      <div style={{ position: "absolute", left: SAFE.centerX - 420, width: 840, top: 1010, opacity: bar, transform: `translateY(${(1 - bar) * 40}px)` }}>
        <div style={{ height: 112, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", padding: "0 20px", gap: 20, fontFamily: font }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(145deg, ${brand.colors.mint}, ${brand.colors.greenMid})` }} />
          <div style={{ flex: 1, fontSize: 40, fontWeight: typed ? 800 : 400, color: typed ? brand.colors.white : "rgba(255,255,255,0.45)" }}>
            {sent > 0 ? copy.cta.comment : typed || copy.cta.comment}
            {typed && sent === 0 && caret ? <span style={{ fontWeight: 400 }}>|</span> : null}
          </div>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: typed.length === copy.cta.word.length ? "#2F7BF6" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 44, fontWeight: 800, transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, sent) * Math.PI)})` }}>↑</div>
        </div>
        {/* comentario publicado */}
        {sent > 0 ? (
          <div style={{ position: "absolute", right: 30, top: -96 - 30 * sent, opacity: Math.min(1, sent * 2), padding: "14px 28px", borderRadius: 26, background: "#2F7BF6", color: "#fff", fontFamily: font, fontWeight: 800, fontSize: 40 }}>{copy.cta.word}</div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 0, width: 960, top: 1250, display: "flex", justifyContent: "center", opacity: ease(frame, logoAt, s(0.3)) }}>
        <Logo height={150} color={brand.colors.white} animateAt={logoAt} />
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Subtítulos sincronizados con la voz. */
const SCENE_OF: Record<string, SceneId> = {
  q1: "hook",
  q2: "hook",
  calm: "map1",
  card: "card",
  scan: "card",
  loc: "map2",
  near: "map2",
  nosabe: "map2",
  off: "settings",
  biz: "store",
  door: "store",
  stamp: "store",
  want: "fan",
};
const Captions: React.FC = () => {
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  const ids = VOICE.map((v) => v.id).filter((id) => captions[id]);
  return (
    <>
      {ids.map((id, i) => {
        const next = ids[i + 1];
        const sameScene = next && SCENE_OF[next] === SCENE_OF[id];
        const exitAt = sameScene ? s(V[next].at) - 5 : s(SCENES[SCENE_OF[id]].to) - 2;
        return (
          <div key={id} style={{ position: "absolute", left: 0, width: 960, top: 262 }}>
            <Caption text={captions[id]} at={s(V[id].at) - 2} speak={s(V[id].dur)} exitAt={exitAt} size={id === "q2" ? 60 : 66} />
          </div>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Audio: voz por frase, música que baja cuando hay voz, efectos. */
const musicVolume = (f: number, fps: number, total: number) => {
  const t = f / fps;
  const speaking = VOICE.some((v) => t > V[v.id].at - 0.15 && t < V[v.id].end + 0.15);
  const near = VOICE.reduce((m, v) => Math.min(m, Math.abs(t - V[v.id].at), Math.abs(t - V[v.id].end)), 9);
  const base = speaking ? audio.music.duckTo : audio.music.duckTo + (audio.music.volume - audio.music.duckTo) * Math.min(1, near / 0.3);
  const fadeIn = Math.min(1, t / 0.4);
  const fadeOut = Math.min(1, (total / fps - t) / 1.2);
  return base * fadeIn * fadeOut;
};

const Sfx: React.FC<{ at: number; file: string; vol: number }> = ({ at, file, vol }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} layout="none">
      <Html5Audio src={staticFile(`sfx/${file}.mp3`)} volume={vol} />
    </Sequence>
  );
};

export const EsLegal: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const fx = audio.sfx;
  return (
    <AbsoluteFill style={{ background: brand.colors.bg }}>
      <HookScene />
      <Map1Scene />
      <CardScene />
      <Map2Scene />
      <SettingsScene />
      <StoreScene />
      <FanScene />
      <CtaScene />
      <Captions />

      <Html5Audio src={staticFile(audio.music.file)} volume={(f) => musicVolume(f, fps, durationInFrames)} />
      {VOICE.map((v) => (
        <Sequence key={v.id} from={Math.round(V[v.id].at * fps)} layout="none">
          <Html5Audio src={staticFile(`voz/${v.id}.wav`)} volume={audio.voice.volume} />
        </Sequence>
      ))}
      <Sfx at={V.q1.at + 0.7} file="haptic" vol={fx.haptic} />
      <Sfx at={V.q1.at + 0.75} file="notification" vol={fx.notification} />
      <Sfx at={V.q2.at + 0.9} file="pop" vol={fx.pop} />
      {(["map1", "card", "map2", "settings", "store", "fan", "cta"] as const).map((id) => (
        <Sfx key={id} at={SCENES[id].from - 0.05} file="whoosh-soft" vol={fx.whoosh} />
      ))}
      <Sfx at={V.scan.at + 1.25} file="tap" vol={fx.scan} />
      <Sfx at={V.scan.at + 1.65} file="pop" vol={fx.pop} />
      <Sfx at={enterAt2} file="ring-pulse" vol={fx.ringPulse} />
      <Sfx at={V.near.at + 1.4} file="haptic" vol={fx.haptic} />
      <Sfx at={V.near.at + 1.45} file="notification" vol={fx.notification} />
      <Sfx at={V.off.at + 0.7} file="tap" vol={fx.tap} />
      <Sfx at={V.door.at + 0.45} file="haptic" vol={fx.haptic} />
      <Sfx at={V.door.at + 0.5} file="notification" vol={fx.notification} />
      <Sfx at={V.stamp.at + 0.55} file="pop" vol={fx.pop} />
      <Sfx at={SCENES.fan.from + 0.2} file="pop" vol={fx.pop * 0.8} />
      <Sfx at={V.cta.at + 0.95 + (copy.cta.word.length * 3) / 30 + 0.25} file="tap" vol={fx.tap} />
    </AbsoluteFill>
  );
};
