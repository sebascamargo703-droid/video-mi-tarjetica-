/**
 * Diseño del panel y de la cámara por formato. Todo en coordenadas del panel (px), así
 * la cámara, los halos y la atenuación saben dónde está cada zona.
 * No es un recorte: el vertical apila los KPI (2 + 1 ancha con sparkline) y el feed los pone en fila.
 */
import { clients, lostClientIndex } from "./panelData";

export type Format = "vertical" | "feed";

type Cam = { fx: number; fy: number; s: number; rx: number; ry: number };

export const getLayout = (format: Format) => {
  const vertical = format === "vertical";
  const PW = vertical ? 920 : 1000;
  const P = 44;
  const inner = PW - 2 * P;
  const header = { y: P, h: 96 };
  const kpiTop = header.y + header.h + 32;

  // KPI: posiciones de las 3 tarjetas (clientes, sellos, premios)
  const gap = 20;
  const kpi = vertical
    ? (() => {
        const w2 = (inner - gap) / 2;
        return {
          clients: { x: P, y: kpiTop, w: w2, h: 228 },
          rewards: { x: P + w2 + gap, y: kpiTop, w: w2, h: 228 },
          stamps: { x: P, y: kpiTop + 228 + gap, w: inner, h: 380 },
          spark: { w: inner - 56, h: 150 },
          bottom: kpiTop + 228 + gap + 380,
        };
      })()
    : (() => {
        const w3 = (inner - 2 * gap) / 3;
        return {
          clients: { x: P, y: kpiTop, w: w3, h: 372 },
          stamps: { x: P + w3 + gap, y: kpiTop, w: w3, h: 372 },
          rewards: { x: P + 2 * (w3 + gap), y: kpiTop, w: w3, h: 372 },
          spark: { w: w3 - 56, h: 132 },
          bottom: kpiTop + 372,
        };
      })();

  const clientsTop = kpi.bottom + 48;
  const headingsY = clientsTop + 70;
  const rowsTop = clientsTop + 118;
  const rowH = vertical ? 128 : 116;
  const PH = rowsTop + clients.length * rowH + P - 8;

  // Columnas de la tabla (x absolutas en el panel)
  const cols = vertical
    ? { avatar: P, name: P + 84, nameW: 300, visit: P + 400, visitW: 240, stamps: P + 664, stampsW: inner - 664 }
    : { avatar: P, name: P + 88, nameW: 330, visit: P + 440, visitW: 270, stamps: P + 740, stampsW: inner - 740 };

  const rowY = (i: number) => rowsTop + i * rowH;
  const lost = lostClientIndex;

  // Viewport del panel en pantalla (zona segura) y zona de los textos
  const view = vertical ? { cx: 480, cy: 985, top: 470, right: 960 } : { cx: 540, cy: 790, top: 255, right: 1040 };
  const caption = vertical ? { cx: 480, y: 352, w: 880, size: 76 } : { cx: 540, y: 140, w: 1000, size: 66 };
  const hook = vertical ? { cx: 480, y: 875, w: 880, size: 104 } : { cx: 540, y: 675, w: 1000, size: 100 };
  const cta = vertical ? { cx: 480, w: 900, top: 250, bottom: 420, title: 112, logo: 160, url: 58, sub: 40 } : { cx: 540, w: 1000, top: 0, bottom: 0, title: 104, logo: 150, url: 54, sub: 38 };

  // Cámara: encuadres por momento (foco en coordenadas del panel, escala e inclinación)
  const cam: Record<"numbers" | "numbersEnd" | "clients" | "lost" | "full", Cam> = vertical
    ? {
        numbers: { fx: PW / 2, fy: 420, s: 0.98, rx: 0, ry: 0 },
        numbersEnd: { fx: PW / 2, fy: 405, s: 1.03, rx: 0, ry: 0 },
        clients: { fx: PW / 2, fy: (clientsTop + PH) / 2, s: 1, rx: 0, ry: 0 },
        lost: { fx: 466, fy: rowY(lost) + rowH / 2 - 70, s: 1.12, rx: 0, ry: 0 },
        full: { fx: PW / 2, fy: PH / 2 - 44, s: 0.68, rx: 6, ry: -6 },
      }
    : {
        numbers: { fx: PW / 2, fy: 330, s: 1.0, rx: 0, ry: 0 },
        numbersEnd: { fx: PW / 2, fy: 318, s: 1.03, rx: 0, ry: 0 },
        clients: { fx: PW / 2, fy: (clientsTop + PH) / 2, s: 1, rx: 0, ry: 0 },
        lost: { fx: PW / 2, fy: rowY(lost) + rowH / 2 - 84, s: 1.08, rx: 0, ry: 0 },
        full: { fx: PW / 2, fy: PH / 2 - 24, s: 0.86, rx: 6, ry: -6 },
      };

  return { vertical, PW, PH, P, inner, header, kpi, clientsTop, headingsY, rowsTop, rowH, cols, rowY, lost, view, caption, hook, cta, cam };
};

export type Layout = ReturnType<typeof getLayout>;
