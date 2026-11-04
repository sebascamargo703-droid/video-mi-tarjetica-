import { birthday } from "./copy";

/**
 * Geometría (px del lienzo 1080×1920).
 * Zonas seguras Reels/TikTok: 250 px arriba, 420 px abajo, 120 px a la derecha →
 * contenido centrado en la franja 0–960 (centro x = 480).
 */
export const SAFE = { top: 250, bottom: 1500, right: 960, centerX: 480 };

/* ---------- Calendario ---------- */
export const CAL = { x: 60, y: 470, w: 840, header: 120, weekdays: 70, cell: 120 };
/** Columna (0 = lunes) del día 1 y cantidad de días del mes. */
export const firstCol = (new Date(birthday.year, birthday.month - 1, 1).getDay() + 6) % 7;
export const daysInMonth = new Date(birthday.year, birthday.month, 0).getDate();
export const rows = Math.ceil((firstCol + daysInMonth) / 7);
/** Centro de la celda del día `d` en pantalla. */
export const dayCenter = (d: number) => {
  const idx = firstCol + d - 1;
  return {
    x: CAL.x + (idx % 7) * CAL.cell + CAL.cell / 2,
    y: CAL.y + CAL.header + CAL.weekdays + Math.floor(idx / 7) * CAL.cell + CAL.cell / 2,
    row: Math.floor(idx / 7),
  };
};

/* ---------- Celular ---------- */
export const PHONE_W = 720;
export const SCREEN_INSET = PHONE_W * 0.012 + PHONE_W * 0.026;
export const SCREEN_W = PHONE_W - SCREEN_INSET * 2;
export const PHONE_POS = { x: SAFE.centerX - PHONE_W / 2, y: 350 };
export const NOTIF_RECT = { x: 20, y: 372, w: SCREEN_W - 40, h: 282 };
export const CARD_RECT = { x: 24, y: 160, w: SCREEN_W - 48, h: 560 };
