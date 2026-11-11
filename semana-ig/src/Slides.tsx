import React from "react";
import { AbsoluteFill } from "remotion";
import { font, logoFont } from "./fonts";
import { Logo } from "./components/Logo";
import { PassCard } from "./components/PassCard";
import { BusinessIcon } from "./components/BusinessPin";

/**
 * Pack de contenido de una semana para Instagram (mismo sistema editorial de las publicaciones 06:
 * fondo blanco, Inter negra, acento verde, puntos de avance y "Desliza →"; portadas en verde).
 */
const G = "#0E5244"; // verde de marca
const GM = "#16705D";
const MINT = "#8FE3C0";
const INK = "#0B0D0C";
const CREAM = "#F6F2EA";
const SOFT = "#5B6B65";

/* ---------------- piezas ---------------- */
/** Texto con acentos: [palabra] → verde (o menta sobre verde). */
const Rich: React.FC<{ text: string; on?: "light" | "dark"; italic?: boolean }> = ({ text, on = "light" }) => (
  <>
    {text.split("\n").map((line, i) => (
      <div key={i}>
        {line.split(/(\[[^\]]+\])/).map((part, k) =>
          part.startsWith("[") ? (
            <span key={k} style={{ color: on === "light" ? G : MINT }}>
              {part.slice(1, -1)}
            </span>
          ) : (
            <span key={k}>{part}</span>
          ),
        )}
      </div>
    ))}
  </>
);

const Dots: React.FC<{ i: number; n: number; dark?: boolean }> = ({ i, n, dark }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 92, display: "flex", justifyContent: "center", gap: 12 }}>
    {Array.from({ length: n }).map((_, k) => (
      <div key={k} style={{ width: k === i ? 40 : 12, height: 12, borderRadius: 99, background: k === i ? (dark ? MINT : G) : dark ? "rgba(246,242,234,0.35)" : "#CFD5D2" }} />
    ))}
  </div>
);

const Frame: React.FC<{ i: number; n: number; dark?: boolean; children: React.ReactNode; swipe?: boolean }> = ({ i, n, dark = false, children, swipe = true }) => (
  <AbsoluteFill style={{ background: dark ? `radial-gradient(ellipse 900px 1100px at 30% 20%, #1B7A5E 0%, ${G} 45%, #062A22 100%)` : "#FFFFFF", fontFamily: font, color: dark ? CREAM : INK }}>
    <div style={{ position: "absolute", left: 96, top: 92, display: "flex", alignItems: "center", gap: 14 }}>
      <Logo height={46} color={dark ? CREAM : G} />
    </div>
    <div style={{ position: "absolute", right: 96, top: 102, fontSize: 28, fontWeight: 700, color: dark ? "rgba(246,242,234,0.6)" : "#9AA5A0" }}>
      {i + 1}/{n}
    </div>
    {children}
    <Dots i={i} n={n} dark={dark} />
    {swipe && i < n - 1 ? <div style={{ position: "absolute", right: 96, bottom: 76, fontSize: 32, fontWeight: 600, color: dark ? "rgba(246,242,234,0.7)" : "#8A9590" }}>Desliza →</div> : null}
  </AbsoluteFill>
);

/** Aviso tipo pantalla de bloqueo (texto libre). */
const Notif: React.FC<{ app: string; title: string; body: string; width?: number; when?: string; light?: boolean; emoji?: string }> = ({ app, title, body, width = 760, when = "ahora", light = false, emoji }) => {
  const k = width / 640;
  return (
    <div style={{ width, padding: 24 * k, borderRadius: 34 * k, display: "flex", gap: 20 * k, alignItems: "flex-start", fontFamily: font, color: light ? INK : "#fff", background: light ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.16)", backdropFilter: light ? undefined : "blur(30px)", border: light ? "1.5px solid #E3E8E5" : "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
      <div style={{ width: 76 * k, height: 76 * k, flexShrink: 0, borderRadius: 20 * k, background: `linear-gradient(145deg, ${GM}, #083A30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 * k }}>
        {emoji ?? <BusinessIcon size={46 * k} color="#fff" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 * k, letterSpacing: "0.06em" }}>
          <span style={{ fontWeight: 800 }}>{app}</span>
          <span style={{ opacity: 0.6, letterSpacing: 0 }}>{when}</span>
        </div>
        <div style={{ fontSize: 31 * k, fontWeight: 800, lineHeight: 1.2, marginTop: 4 * k }}>{title}</div>
        <div style={{ fontSize: 29 * k, lineHeight: 1.25, marginTop: 2 * k, opacity: 0.92 }}>{body}</div>
      </div>
    </div>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ display: "inline-block", fontSize: 28, fontWeight: 800, letterSpacing: "0.14em", color: dark ? MINT : GM, background: dark ? "rgba(143,227,192,0.12)" : "#E5F4EE", padding: "10px 20px", borderRadius: 999 }}>{children}</div>
);

/* ---------------- Carrusel 1: ¿Por qué tu cliente no volvió? ---------------- */
const N1 = 7;
const Reason: React.FC<{ i: number; num: string; title: string; body: string; visual: React.ReactNode }> = ({ i, num, title, body, visual }) => (
  <Frame i={i} n={N1}>
    <div style={{ position: "absolute", left: 96, right: 96, top: 230 }}>
      <Kicker>RAZÓN {num}</Kicker>
      <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginTop: 30 }}>
        <Rich text={title} />
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.3, color: SOFT, marginTop: 28, maxWidth: 860 }}>{body}</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 440, display: "flex", alignItems: "center", justifyContent: "center" }}>{visual}</div>
  </Frame>
);

const Calendar: React.FC = () => (
  <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
    {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
      <div key={i} style={{ width: 96, height: 120, borderRadius: 20, background: i === 1 ? "#FDECEC" : "#F2F5F4", border: `3px solid ${i === 1 ? "#E25B52" : "#E1E7E4"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
        <span style={{ fontSize: 26, color: "#8A9590" }}>{d}</span>
        <span style={{ fontSize: 40, color: i === 1 ? "#E25B52" : INK }}>{i === 1 ? "?" : 3 + i}</span>
      </div>
    ))}
  </div>
);

export const C1 = [
  () => (
    <Frame i={0} n={N1} dark>
      <div style={{ position: "absolute", left: 96, right: 96, top: 250 }}>
        <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.98 }}>
          <Rich text={"Tu cliente\n[no volvió.]"} on="dark" />
        </div>
        <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 56, lineHeight: 1.15, marginTop: 34, color: "rgba(246,242,234,0.85)" }}>…y casi nunca es por tu producto.</div>
      </div>
      <div style={{ position: "absolute", left: 330, top: 640, transform: "rotate(-8deg)", height: 420, overflow: "hidden", borderRadius: 30 }}>
        <PassCard width={460} stamps={7} showQr={false} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 700, transform: "rotate(6deg)", background: "#E25B52", color: "#fff", fontWeight: 800, fontSize: 34, padding: "14px 26px", borderRadius: 999, boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>Le faltaba 1 sello</div>
    </Frame>
  ),
  () => <Reason i={1} num="1" title={"Se le [olvidó.]"} body="No es falta de cariño. Tiene mil cosas en la cabeza y tu negocio no es una de ellas… hasta que algo se lo recuerda." visual={<Calendar />} />,
  () => (
    <Reason
      i={2}
      num="2"
      title={"No tenía una razón\npara [volver.]"}
      body="Si cada visita es igual, ¿por qué elegirte a ti y no al de la esquina? Un premio que se acerca es una razón."
      visual={
        <div style={{ display: "flex", gap: 34, alignItems: "center", fontWeight: 800 }}>
          {["Tu negocio", "El de la esquina"].map((n, i) => (
            <div key={n} style={{ width: 380, height: 280, borderRadius: 30, background: "#F2F5F4", border: "3px solid #E1E7E4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ fontSize: 80 }}>{i ? "🏪" : "☕"}</div>
              <div style={{ fontSize: 36 }}>{n}</div>
              <div style={{ fontSize: 30, color: "#8A9590" }}>mismo precio</div>
            </div>
          ))}
        </div>
      }
    />
  ),
  () => (
    <Reason
      i={3}
      num="3"
      title={"La tarjeta de papel\nse [perdió.]"}
      body="Se moja, se queda en otra billetera, termina en la lavadora. Y con ella, los sellos que ya llevaba."
      visual={
        <div style={{ position: "relative", width: 560, height: 340 }}>
          <div style={{ position: "absolute", left: 40, top: 20, width: 480, height: 300, borderRadius: 14, background: "#F3EAD6", transform: "rotate(-7deg)", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", padding: 28, boxSizing: "border-box", filter: "saturate(0.7)" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#6B4A2E", letterSpacing: "0.06em" }}>CLIENTE FRECUENTE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 30 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ width: 66, height: 66, borderRadius: "50%", border: "4px solid #C9473F", background: i < 7 ? "rgba(201,71,63,0.8)" : undefined, boxSizing: "border-box" }} />
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", right: -10, top: -20, fontSize: 120, transform: "rotate(12deg)" }}>💧</div>
        </div>
      }
    />
  ),
  () => (
    <Reason
      i={4}
      num="4"
      title={"Nadie le [recordó.]"}
      body="Pasó por tu cuadra, tenía 10 minutos libres… y siguió derecho. Nadie le dijo que le faltaba solo un sello."
      visual={
        <div style={{ position: "relative", width: 760, height: 260, borderRadius: 34, background: "#F2F5F4", border: "3px dashed #C9D1CD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700, color: "#9AA5A0" }}>
          (ningún aviso)
        </div>
      }
    />
  ),
  () => (
    <Frame i={5} n={N1}>
      <div style={{ position: "absolute", left: 96, right: 96, top: 230 }}>
        <Kicker>LA SOLUCIÓN</Kicker>
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginTop: 30 }}>
          <Rich text={"Mi Tarjetica\narregla las [4]"} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 96, right: 96, top: 560, display: "flex", flexDirection: "column", gap: 26 }}>
        {[
          ["Se le olvidó", "Le llega un aviso cuando pasa cerca"],
          ["Sin razón para volver", "Sellos y un premio que tú eliges"],
          ["Tarjeta perdida", "Vive en su celular, no se pierde"],
          ["Nadie le recordó", "Ves en tu panel quién no ha vuelto"],
        ].map(([a, b]) => (
          <div key={a} style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 30px", borderRadius: 28, background: "#F2F7F5", border: "2px solid #DCEBE4" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: GM, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 800, flexShrink: 0 }}>✓</div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#8A9590", textDecoration: "line-through" }}>{a}</div>
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15 }}>{b}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  () => <CtaSlide i={6} n={N1} />,
];

const CtaSlide: React.FC<{ i: number; n: number }> = ({ i, n }) => (
  <Frame i={i} n={n} dark swipe={false}>
    <div style={{ position: "absolute", left: 96, right: 96, top: 300, textAlign: "center" }}>
      <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.04em" }}>Comenta</div>
      <div style={{ display: "inline-block", fontSize: 128, fontWeight: 800, letterSpacing: "-0.04em", background: MINT, color: "#06231B", padding: "0.02em 0.2em 0", borderRadius: "0.12em", marginTop: 16 }}>TARJETICA</div>
      <div style={{ fontSize: 46, fontWeight: 600, marginTop: 40, color: "rgba(246,242,234,0.9)" }}>y te mando el link para crear la tuya 👇</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 70 }}>
        {["Gratis hasta 20 clientes", "Sin tarjeta de crédito"].map((c) => (
          <div key={c} style={{ fontSize: 32, fontWeight: 800, padding: "16px 26px", borderRadius: 999, border: `2px solid ${MINT}`, color: CREAM }}>
            <span style={{ color: MINT }}>✓ </span>
            {c}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, marginTop: 60, color: "rgba(246,242,234,0.6)" }}>mitarjetica.com</div>
    </div>
  </Frame>
);

/* ---------------- Carrusel 2: 3 avisos que hacen volver ---------------- */
const N2 = 6;
const Aviso: React.FC<{ i: number; num: string; title: string; body: string; notif: React.ReactNode; note?: string }> = ({ i, num, title, body, notif, note }) => (
  <Frame i={i} n={N2}>
    <div style={{ position: "absolute", left: 96, right: 96, top: 220 }}>
      <Kicker>AVISO {num}</Kicker>
      <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginTop: 26 }}>
        <Rich text={title} />
      </div>
      <div style={{ fontSize: 38, lineHeight: 1.3, color: SOFT, marginTop: 22 }}>{body}</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 900, height: 420, borderRadius: 40, background: `linear-gradient(160deg, #0D1F1B, #08241E 50%, #16705D)`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 30, fontWeight: 600 }}>martes 4 de noviembre · 5:48</div>
        <div style={{ marginTop: 30 }}>{notif}</div>
      </div>
    </div>
    {note ? <div style={{ position: "absolute", left: 96, right: 96, top: 1140, textAlign: "center", fontSize: 28, color: "#8A9590" }}>{note}</div> : null}
  </Frame>
);

export const C2 = [
  () => (
    <Frame i={0} n={N2} dark>
      <div style={{ position: "absolute", left: 96, right: 96, top: 250 }}>
        <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.98 }}>
          <Rich text={"[3 avisos]\nque hacen volver\na tus clientes"} on="dark" />
        </div>
        <div style={{ fontFamily: logoFont, fontStyle: "italic", fontWeight: 600, fontSize: 52, marginTop: 30, color: "rgba(246,242,234,0.85)" }}>(sin que tú hagas nada)</div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 720, transform: "rotate(-4deg)" }}>
        <Notif app="CAFÉ ORIGEN" title="Estás a media cuadra ☕" body="Te falta 1 sello para tu café gratis." width={780} />
      </div>
      <div style={{ position: "absolute", left: 240, top: 930, transform: "rotate(3deg)", opacity: 0.9 }}>
        <Notif app="CAFÉ ORIGEN" title="¡Feliz cumpleaños, Laura! 🎂" body="Tu postre va por nuestra cuenta." width={700} />
      </div>
    </Frame>
  ),
  () => (
    <Aviso
      i={1}
      num="1"
      title={"Cuando pasa\n[cerca]"}
      body="Tu cliente camina por tu cuadra y su celular le recuerda que le falta poco para su premio."
      notif={<Notif app="CAFÉ ORIGEN" title="Estás a media cuadra ☕" body="Te falta 1 sello para tu café gratis." />}
      note="Solo llega a clientes que guardaron tu tarjeta; el aviso lo puede apagar cuando quiera."
    />
  ),
  () => (
    <Aviso
      i={2}
      num="2"
      title={"En su\n[cumpleaños]"}
      body="El día que más ganas tiene de darse un gusto, tu negocio es el primero en saludarlo."
      notif={<Notif app="CAFÉ ORIGEN" title="¡Feliz cumpleaños, Laura! 🎂" body="Tu postre va por nuestra cuenta esta semana." />}
    />
  ),
  () => (
    <Aviso
      i={3}
      num="3"
      title={"Cuando le falta\n[poquito]"}
      body="A nadie le gusta dejar un premio a medias. Recordárselo es la forma más fácil de que vuelva."
      notif={<Notif app="CAFÉ ORIGEN" title="¡Te falta 1 sello! ⭐" body="Tu café gratis te espera en la próxima visita." />}
    />
  ),
  () => (
    <Frame i={4} n={N2}>
      <div style={{ position: "absolute", left: 96, right: 96, top: 220 }}>
        <Kicker>Y TÚ…</Kicker>
        <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginTop: 26 }}>
          <Rich text={"Ves quién volvió\ny quién [no]"} />
        </div>
        <div style={{ fontSize: 38, lineHeight: 1.3, color: SOFT, marginTop: 22 }}>En tu panel sabes quién lleva días sin venir, para mandarle una promo en un clic.</div>
      </div>
      <div style={{ position: "absolute", left: 96, right: 96, top: 680, borderRadius: 34, background: "#0A1110", padding: "30px 34px", color: "#fff" }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.16em", color: "#A7C9BD", marginBottom: 6 }}>CLIENTES</div>
        {[
          ["Laura M.", "Volvió hoy", true],
          ["Andrés P.", "21 días sin venir", false],
          ["Sofía R.", "34 días sin venir", false],
        ].map(([n, d, ok]) => (
          <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 22px", marginTop: 14, borderRadius: 24, background: ok ? "rgba(143,227,192,0.15)" : "rgba(255,255,255,0.05)", border: `2px solid ${ok ? MINT : "rgba(255,255,255,0.08)"}` }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: ok ? MINT : "#FFB866", color: "#06231B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 }}>{(n as string)[0]}</div>
            <div style={{ flex: 1, fontSize: 36, fontWeight: 800 }}>{n}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: ok ? MINT : "#FFB866" }}>{d}</div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  () => <CtaSlide i={5} n={N2} />,
];

/* ---------------- Post suelto ---------------- */
export const Post = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 30% 20%, #1B7A5E 0%, ${G} 45%, #062A22 100%)`, fontFamily: font, color: CREAM }}>
    <div style={{ position: "absolute", left: 96, top: 92 }}>
      <Logo height={46} color={CREAM} />
    </div>
    <div style={{ position: "absolute", left: 96, right: 96, top: 330 }}>
      <div style={{ fontFamily: logoFont, fontSize: 220, lineHeight: 0.6, color: MINT }}>“</div>
      <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, marginTop: 10 }}>
        <Rich text={"Tu cliente sí quiere\nvolver. Solo necesita\nuna [razón]… y un\n[recordatorio.]"} on="dark" />
      </div>
      <div style={{ width: 120, height: 8, borderRadius: 8, background: MINT, marginTop: 60 }} />
      <div style={{ fontSize: 38, fontWeight: 600, marginTop: 30, color: "rgba(246,242,234,0.8)" }}>Sellos + premio + aviso. Eso es Mi Tarjetica.</div>
    </div>
    <div style={{ position: "absolute", left: 96, bottom: 96, fontSize: 32, fontWeight: 700, color: "rgba(246,242,234,0.6)" }}>mitarjetica.com</div>
  </AbsoluteFill>
);

/* ---------------- Historias interactivas (1080×1920) ---------------- */
const StoryBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 1000px 1400px at 30% 25%, #1B7A5E 0%, ${G} 45%, #062A22 100%)`, fontFamily: font, color: CREAM }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
      <Logo height={56} color={CREAM} />
    </div>
    {children}
  </AbsoluteFill>
);
/** Indicador sobre el espacio libre donde va el sticker nativo de Instagram. */
const StickerHint: React.FC<{ top: number; text: string }> = ({ top, text }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontSize: 40, fontWeight: 800, color: MINT }}>{text}</div>
);

export const Stories = [
  () => (
    <StoryBg>
      <div style={{ position: "absolute", left: 90, right: 90, top: 480, textAlign: "center" }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: MINT, letterSpacing: "0.1em" }}>PREGUNTA RÁPIDA</div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.02, marginTop: 30 }}>
          <Rich text={"De tus clientes\nnuevos de este mes,\n¿cuántos [volvieron?]"} on="dark" />
        </div>
      </div>
      <StickerHint top={1020} text="Vota 👇" />
    </StoryBg>
  ),
  () => (
    <StoryBg>
      <div style={{ position: "absolute", left: 90, right: 90, top: 460, textAlign: "center" }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: MINT, letterSpacing: "0.1em" }}>¿SABÍAS QUE…?</div>
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 30 }}>
          <Rich text={"¿Cuántas veces más\ncuesta [conseguir]\nun cliente nuevo\nque [mantener] uno?"} on="dark" />
        </div>
      </div>
      <StickerHint top={1060} text="Adivina 👇" />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1560, textAlign: "center", fontSize: 26, color: "rgba(246,242,234,0.55)" }}>Fuente: Harvard Business Review, 2014</div>
    </StoryBg>
  ),
  () => (
    <StoryBg>
      <div style={{ position: "absolute", left: 90, right: 90, top: 460, textAlign: "center" }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: MINT, letterSpacing: "0.1em" }}>CUÉNTANOS</div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.02, marginTop: 30 }}>
          <Rich text={"¿Qué [premio]\ndarías en tu\nnegocio?"} on="dark" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 46 }}>
          {["☕ Café gratis", "✂️ Corte gratis", "🍰 Postre", "🏷️ 10% off"].map((c) => (
            <div key={c} style={{ fontSize: 36, fontWeight: 800, padding: "14px 26px", borderRadius: 999, background: "rgba(143,227,192,0.14)", border: `2px solid ${MINT}` }}>{c}</div>
          ))}
        </div>
      </div>
      <StickerHint top={1110} text="Escríbenos 👇" />
    </StoryBg>
  ),
];
