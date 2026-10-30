/**
 * Posiciones por formato (no es un recorte).
 * Vertical: tarjeta arriba (bajo la zona segura de 250 px), túnel al centro, textos abajo
 * (sobre la zona segura de 420 px); todo centrado en x = 480 por la franja derecha de 120 px.
 * Feed: tarjeta compacta arriba, túnel en la mitad inferior y textos entre ambos.
 */
export type Format = "vertical" | "feed";

export const getLayout = (format: Format) =>
  format === "vertical"
    ? {
        vertical: true,
        card: { cx: 480, w: 840, top: 262 },
        week: { cx: 480, y: 756, size: 36 },
        // escenario de 1080×560 escalado; el túnel (x = 540) queda centrado en cx
        stage: { cx: 480, top: 752, scale: 1.25 },
        caption: { cx: 480, y: 1418, w: 880, size: 78 },
        hook: { cx: 480, y: 880, w: 880, size: 112 },
        cta: { cx: 480, w: 900, top: 250, bottom: 420, title: 100, logo: 160, url: 58, sub: 40 },
      }
    : {
        vertical: false,
        card: { cx: 540, w: 760, top: 44 },
        week: { cx: 540, y: 690, size: 32 },
        stage: { cx: 540, top: 700, scale: 1.15 },
        caption: { cx: 540, y: 562, w: 1000, size: 64 },
        hook: { cx: 540, y: 675, w: 1000, size: 108 },
        cta: { cx: 540, w: 1000, top: 0, bottom: 0, title: 92, logo: 150, url: 54, sub: 38 },
      };

export type Layout = ReturnType<typeof getLayout>;
