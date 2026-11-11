import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { music, palette, sfxVolume, withAlpha } from "./brand";
import { BrandBackground } from "./components/BrandBackground";
import { ClientRow } from "./components/ClientRow";
import { ExampleBadge } from "./components/ExampleBadge";
import { KineticText } from "./components/KineticText";
import { KpiCard } from "./components/KpiCard";
import { Logo } from "./components/Logo";
import { PanelFrame, appear } from "./components/PanelFrame";
import { Sparkline } from "./components/Sparkline";
import { copy } from "./copy";
import { font, tracking } from "./fonts";
import { type Format, type Layout, getLayout } from "./layout";
import { EASE_IN, EASE_INOUT, SPRING_IN, clamp, ease, mix } from "./motion";
import { business, clients, dayLabels, kpis, lostClientIndex, returningClientIndex, stampsByDay } from "./panelData";
import { T } from "./timeline";

type Cam = Layout["cam"]["numbers"];
const lerpCam = (a: Cam, b: Cam, k: number): Cam => ({
  fx: mix(a.fx, b.fx, k),
  fy: mix(a.fy, b.fy, k),
  s: mix(a.s, b.s, k),
  rx: mix(a.rx, b.rx, k),
  ry: mix(a.ry, b.ry, k),
});

/** Halo `accent` que ilumina una zona del panel. */
const Halo: React.FC<{ x: number; y: number; w: number; h: number; k: number }> = ({ x, y, w, h, k }) =>
  k <= 0.001 ? null : (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 24,
        border: `4px solid ${palette.accent}`,
        background: withAlpha(palette.accent, 0.16),
        boxShadow: `0 0 40px 8px ${withAlpha(palette.accent, 0.55)}`,
        opacity: k,
        transform: `scale(${0.97 + 0.03 * k})`,
      }}
    />
  );

/** Texto fuera del panel (zona superior), centrado en la zona segura. */
const Caption: React.FC<{ L: Layout; text: string; delay: number; exitAt: number }> = ({ L, text, delay, exitAt }) => (
  <div style={{ position: "absolute", left: L.caption.cx - L.caption.w / 2, width: L.caption.w, top: L.caption.y, transform: "translateY(-50%)" }}>
    <KineticText text={text} size={L.caption.size} color={palette.textPrimary} accent={palette.accent} delay={delay} exitAt={exitAt} />
  </div>
);

export const Panel: React.FC<{ format: Format }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  const L = getLayout(format);

  /* ---------- Cámara: paneos y zooms lentos hacia la zona que se explica ---------- */
  const segments: { from: number; dur: number; to: Cam }[] = [
    { from: T.kpis, dur: T.numbersTextOut - T.kpis, to: L.cam.numbersEnd },
    { from: T.toClients, dur: 1.0, to: L.cam.clients },
    { from: T.lostZoom, dur: 1.9, to: L.cam.lost },
    { from: T.pullOut, dur: 0.95, to: L.cam.full },
  ];
  const cam = segments.reduce((c, seg) => lerpCam(c, seg.to, ease(frame, s(seg.from), s(seg.dur), EASE_INOUT)), L.cam.numbers);

  /* ---------- Entrada (3D) y salida del panel ---------- */
  const enter = spring({ frame: frame - s(T.panelIn), fps, config: SPRING_IN, durationInFrames: s(1.3) });
  const exit = ease(frame, s(T.panelOut), s(0.65), EASE_IN);
  const showPanel = frame >= s(T.panelIn) && exit < 1;

  /* ---------- Foco en el cliente que no ha vuelto: el resto baja al 40 % ---------- */
  const focus = ease(frame, s(T.lostZoom), s(0.6)) * (1 - ease(frame, s(T.pullOut), s(0.5)));
  const dim = 1 - 0.6 * focus;

  /* ---------- Halos de "Quién vuelve · Cuándo vino · Cuánto le falta" ---------- */
  const haloK = (i: number) => {
    const from = s(T.control[i]);
    const to = s(T.control[i + 1] ?? T.controlOut);
    return ease(frame, from, s(0.3)) * (1 - ease(frame, to - s(0.3), s(0.3)));
  };

  // Badge "Datos de ejemplo": arriba a la derecha del panel, junto al selector de periodo.
  // Si la cámara deja esa zona fuera de cuadro, se queda pegado al borde superior visible;
  // la contraescala de la cámara lo mantiene legible (≥ 19 px en pantalla) en todo momento.
  const badgeScale = Math.min(1.3, 1 / cam.s);
  const half = 22 / cam.s;
  const visTop = (L.view.top + 34 - (L.view.cy - cam.fy * cam.s)) / cam.s;
  const badgeY = Math.max(L.P / 2 + 4, visTop + half);
  const badgeRight = L.P + 230;

  const rowAt = (i: number) => s(T.rows + i * T.rowGap);
  const c = L.cols;
  const k = L.kpi;
  const numberSize = L.vertical ? 96 : 84;
  const tableTop = L.headingsY - 16;
  const tableH = L.rowsTop - L.headingsY + clients.length * L.rowH + 8;

  const kpiCards = [
    { key: "clients", icon: "users" as const, ...kpis.clients, box: k.clients },
    { key: "stamps", icon: "stamp" as const, ...kpis.stamps, box: k.stamps },
    { key: "rewards", icon: "gift" as const, ...kpis.rewards, box: k.rewards },
  ];

  const loopFade = interpolate(frame, [durationInFrames - T.loopFadeFrames, durationInFrames - 1], [0, 1], clamp);
  const ctaIn = spring({ frame: frame - s(T.ctaUrl), fps, config: SPRING_IN });

  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <BrandBackground />

      {/* 0:00–0:02.5 · Hook */}
      {frame < s(T.panelIn + 0.6) ? (
        <div style={{ position: "absolute", left: L.hook.cx - L.hook.w / 2, width: L.hook.w, top: L.hook.y, transform: "translateY(-50%)" }}>
          <KineticText text={copy.hook} size={L.hook.size} color={palette.textPrimary} accent={palette.accent} delay={s(T.hookIn)} exitAt={s(T.hookOut)} />
        </div>
      ) : null}

      {/* 0:02.5–0:15 · Panel */}
      {showPanel ? (
        <AbsoluteFill
          style={{
            transform: `translateY(${-exit * 1300}px)`,
            filter: exit > 0.01 ? `blur(${exit * 16}px)` : undefined,
            opacity: 1 - exit * 0.6,
            // el panel se desvanece bajo la zona de textos (como un scroll), así nunca tapa una frase
            maskImage: exit > 0 ? undefined : `linear-gradient(to bottom, transparent ${L.view.top - 20}px, black ${L.view.top + 25}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: L.PW,
              height: L.PH,
              transformOrigin: "0 0",
              transform: `translate(${L.view.cx - cam.fx * cam.s}px, ${L.view.cy - cam.fy * cam.s}px) scale(${cam.s})`,
              perspective: 2000,
            }}
          >
            <div
              style={{
                transform: `translateY(${(1 - enter) * 1300}px) rotateX(${12 * (1 - enter) + cam.rx}deg) rotateY(${-8 * (1 - enter) + cam.ry}deg)`,
                opacity: Math.min(1, enter * 2.5),
              }}
            >
              <PanelFrame w={L.PW} h={L.PH} padding={L.P} frame={frame} headerAt={s(T.header)} business={business.name} title={copy.panel.title} period={business.period} headerOpacity={dim}>
                {/* KPI */}
                <div style={{ opacity: dim }}>
                  {kpiCards.map((kc, i) => (
                    <div key={kc.key} style={{ position: "absolute", left: kc.box.x, top: kc.box.y, ...appear(frame, s(T.kpis) + i * 6, -1) }}>
                      <KpiCard icon={kc.icon} label={kc.label} value={kc.value} frame={frame} fps={fps} odometerAt={s(T.odometer) + i * 6} numberSize={numberSize} w={kc.box.w} h={kc.box.h}>
                        {kc.key === "stamps" ? (
                          <Sparkline values={stampsByDay} labels={dayLabels} w={k.spark.w} h={k.spark.h} frame={frame} fps={fps} drawAt={s(T.sparkline)} drawDur={s(1.1)} peakAt={s(T.peak)} />
                        ) : null}
                      </KpiCard>
                    </div>
                  ))}
                </div>

                {/* Clientes: título y encabezados de columna */}
                <div style={{ position: "absolute", left: L.P, top: L.clientsTop, opacity: dim, ...appear(frame, s(T.header) + 15) }}>
                  <div style={{ fontSize: 38, fontWeight: 800, color: palette.panelText, letterSpacing: tracking.title }}>{copy.panel.clientsTitle}</div>
                </div>
                <div style={{ position: "absolute", left: 0, top: L.headingsY, width: L.PW, opacity: dim * ease(frame, s(T.header) + 20, 30), fontSize: 23, fontWeight: 600, color: palette.panelTextSecondary }}>
                  <span style={{ position: "absolute", left: c.avatar }}>{copy.panel.columns.client}</span>
                  <span style={{ position: "absolute", left: c.visit }}>{copy.panel.columns.lastVisit}</span>
                  <span style={{ position: "absolute", left: c.stamps }}>{copy.panel.columns.stamps}</span>
                </div>
                <div style={{ position: "absolute", left: L.P, right: L.P, top: L.rowsTop - 2, height: 2, background: palette.panelBorder, opacity: dim }} />

                {/* halos (detrás de las filas) */}
                <Halo x={L.P - 14} y={L.rowY(returningClientIndex) + 8} w={L.inner + 28} h={L.rowH - 16} k={haloK(0)} />
                <Halo x={c.visit - 18} y={tableTop} w={c.visitW + 36} h={tableH} k={haloK(1)} />
                <Halo x={c.stamps - 18} y={tableTop} w={c.stampsW + 36} h={tableH} k={haloK(2)} />

                {/* tarjeta blanca que eleva la fila de Jhon */}
                {focus > 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: L.P - 18,
                      top: L.rowY(lostClientIndex) + 4,
                      width: L.inner + 36,
                      height: L.rowH - 8,
                      borderRadius: 24,
                      background: palette.panelBg,
                      boxShadow: `0 18px 50px rgba(10, 46, 34, ${0.22 * focus})`,
                      border: `2px solid ${withAlpha("#E2ECE7", focus)}`,
                    }}
                  />
                ) : null}

                {/* filas: esqueleto mientras llegan los datos, luego cada cliente desde la derecha */}
                {clients.map((cl, i) => {
                  const arrived = ease(frame, rowAt(i), 12);
                  const isLost = i === lostClientIndex;
                  return (
                    <React.Fragment key={cl.name}>
                      {arrived < 1 ? (
                        <div style={{ position: "absolute", left: 0, top: L.rowY(i), width: L.PW, height: L.rowH, opacity: (1 - arrived) * ease(frame, s(T.header) + 25, 30) }}>
                          <div style={{ position: "absolute", left: c.avatar, top: L.rowH / 2 - 32, width: 64, height: 64, borderRadius: "50%", background: palette.panelSurface }} />
                          <div style={{ position: "absolute", left: c.name, top: L.rowH / 2 - 11, width: c.nameW * 0.7, height: 22, borderRadius: 11, background: palette.panelSurface }} />
                          <div style={{ position: "absolute", left: c.visit, top: L.rowH / 2 - 11, width: c.visitW * 0.6, height: 22, borderRadius: 11, background: palette.panelSurface }} />
                          <div style={{ position: "absolute", left: c.stamps, top: L.rowH / 2 - 7, width: c.stampsW, height: 14, borderRadius: 7, background: palette.panelSurface }} />
                        </div>
                      ) : null}
                      <div style={{ position: "absolute", left: 0, top: L.rowY(i), transform: isLost ? `scale(${1 + 0.015 * focus})` : undefined, transformOrigin: "center" }}>
                        <ClientRow
                          client={cl}
                          L={L}
                          frame={frame}
                          fps={fps}
                          at={rowAt(i)}
                          tagAt={isLost ? s(T.lostTag) : rowAt(i) + s(0.35)}
                          highlightVisit={isLost ? ease(frame, s(T.lostTag) + 9, 20) : 0}
                          opacity={isLost ? 1 : dim}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}

                {/* Datos de ejemplo: siempre visible */}
                <div style={{ position: "absolute", top: badgeY, right: badgeRight, transformOrigin: "right center", transform: `translateY(-50%) scale(${badgeScale})`, zIndex: 5 }}>
                  <div style={appear(frame, s(T.badge))}>
                    <ExampleBadge text={copy.panel.exampleBadge} />
                  </div>
                </div>
              </PanelFrame>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Textos fuera del panel */}
      <Caption L={L} text={copy.numbers} delay={s(T.numbersText)} exitAt={s(T.numbersTextOut)} />
      <Caption L={L} text={copy.clients} delay={s(T.clientsText)} exitAt={s(T.clientsTextOut)} />
      {copy.control.map((t, i) => (
        <Caption key={i} L={L} text={t} delay={s(T.control[i])} exitAt={i < copy.control.length - 1 ? s(T.control[i + 1]) - 22 : s(T.controlOut) - 8} />
      ))}

      {/* 0:15–0:18 · CTA */}
      {frame >= s(T.cta) - 2 ? (
        <div style={{ position: "absolute", left: L.cta.cx - L.cta.w / 2, width: L.cta.w, top: L.cta.top, bottom: L.cta.bottom, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <KineticText text={copy.cta.title} size={L.cta.title} color={palette.textPrimary} accent={palette.accent} delay={s(T.cta)} />
          <div style={{ height: L.cta.title * 0.5 }} />
          <Logo height={L.cta.logo} color={palette.textPrimary} animateAt={s(T.ctaLogo)} />
          <div style={{ height: L.cta.url * 0.6 }} />
          <div
            style={{
              fontSize: L.cta.url,
              fontWeight: 800,
              letterSpacing: tracking.title,
              color: palette.accent,
              padding: `${L.cta.url * 0.28}px ${L.cta.url * 0.7}px`,
              borderRadius: 999,
              border: `3px solid ${withAlpha(palette.accent, 0.55)}`,
              background: withAlpha(palette.bgDeep, 0.55),
              opacity: ctaIn,
              transform: `translateY(${(1 - ctaIn) * 20}px) scale(${0.98 + 0.02 * ctaIn})`,
            }}
          >
            {copy.cta.url}
          </div>
          <div style={{ height: L.cta.url * 0.6 }} />
          <KineticText text={copy.cta.sub.split(" · ").join("\n")} size={L.cta.sub} weight={600} color={palette.textSecondary} delay={s(T.ctaSub)} lineHeight={1.3} stagger={2} />
        </div>
      ) : null}

      {/* Últimos 10 frames: fundido al fondo verde, idéntico al frame 0 (loop perfecto) */}
      {loopFade > 0 ? <BrandBackground style={{ opacity: loopFade }} /> : null}

      {/* ---------- Audio ---------- */}
      <Html5Audio
        src={staticFile(music.file)}
        volume={(f) => music.volume * interpolate(f, [0, s(music.fadeIn), durationInFrames - s(music.fadeOut), durationInFrames - 1], [0, 1, 1, 0], clamp)}
      />
      <Sequence from={s(T.panelIn) - 4} durationInFrames={s(1.2)} layout="none" name="whoosh entrada">
        <Html5Audio src={staticFile("sfx/whoosh-soft.mp3")} volume={sfxVolume.whoosh} />
      </Sequence>
      <Sequence from={s(T.odometer)} durationInFrames={s(1.7)} layout="none" name="odómetros">
        <Html5Audio src={staticFile("sfx/tick-roll.mp3")} volume={sfxVolume.tickRoll} />
      </Sequence>
      <Sequence from={s(T.sparkline)} durationInFrames={s(1.3)} layout="none" name="sparkline">
        <Html5Audio src={staticFile("sfx/draw.mp3")} volume={sfxVolume.draw} />
      </Sequence>
      <Sequence from={s(T.peak)} durationInFrames={s(0.5)} layout="none" name="pop pico">
        <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop * 0.7} />
      </Sequence>
      {clients.map((cl, i) => (
        <Sequence key={cl.name} from={rowAt(i)} durationInFrames={s(0.5)} layout="none" name={`fila ${i + 1}`}>
          <Html5Audio src={staticFile("sfx/row.mp3")} volume={sfxVolume.row} />
        </Sequence>
      ))}
      {clients.map((cl, i) =>
        cl.tag && i !== lostClientIndex ? (
          <Sequence key={`tag${i}`} from={rowAt(i) + s(0.35)} durationInFrames={s(0.5)} layout="none" name={`pop ${cl.tag.text}`}>
            <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop} />
          </Sequence>
        ) : null,
      )}
      <Sequence from={s(T.lostTag)} durationInFrames={s(1.6)} layout="none" name="no ha vuelto">
        <Html5Audio src={staticFile("sfx/alert-soft.mp3")} volume={sfxVolume.alert} />
      </Sequence>
      <Sequence from={s(T.panelOut)} durationInFrames={s(1.2)} layout="none" name="whoosh salida">
        <Html5Audio src={staticFile("sfx/whoosh-soft.mp3")} volume={sfxVolume.whoosh} />
      </Sequence>
      {[18, 26, 34].map((d, i) => (
        <Sequence key={`logo${i}`} from={s(T.ctaLogo) + d} durationInFrames={s(0.4)} layout="none" name={`pop logo ${i + 1}`}>
          <Html5Audio src={staticFile("sfx/pop.mp3")} volume={sfxVolume.pop * 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
