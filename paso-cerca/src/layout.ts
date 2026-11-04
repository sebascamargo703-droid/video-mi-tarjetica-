/**
 * Geometría (px del lienzo 1080×1920).
 * Zonas seguras Reels/TikTok: 250 px arriba, 420 px abajo, 120 px a la derecha →
 * el contenido se centra en la franja 0–960 (centro x = 480).
 */
export const SAFE = { top: 250, bottom: 1500, right: 960, centerX: 480 };

/* ---------- Mapa con inclinación 3D ---------- */
export const MAP = {
  w: 1600,
  h: 2000,
  /** Centro del plano en pantalla (también es el perspective-origin). */
  cx: SAFE.centerX,
  cy: 900,
  perspective: 2000,
  tiltDeg: 45,
};
/** Calles (coordenadas del plano). */
export const STREETS = { vertical: [300, 800, 1300], horizontal: [400, 900, 1400], width: 70 };
export const PIN = { x: 872, y: 822 };
export const RING_R = 260;
/** Camino del cliente: sube por la calle x=800 hacia el negocio. */
export const PATH = [
  { x: 800, y: 1990 },
  { x: 800, y: 560 },
];

/** Proyección de un punto del plano a la pantalla (misma matemática que CSS perspective + rotateX). */
export const project = (u: number, v: number) => {
  const a = (MAP.tiltDeg * Math.PI) / 180;
  const x = u - MAP.w / 2;
  const y = v - MAP.h / 2;
  const y2 = y * Math.cos(a);
  const z2 = y * Math.sin(a);
  const k = MAP.perspective / (MAP.perspective - z2);
  return { x: MAP.cx + x * k, y: MAP.cy + y2 * k, k };
};

/** Punto del camino donde el cliente cruza el anillo (primer punto a distancia RING_R del pin). */
export const crossing = (() => {
  const [a, b] = PATH;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  for (let d = 0; d <= len; d += 0.5) {
    const p = { x: a.x + (dx * d) / len, y: a.y + (dy * d) / len };
    if (Math.hypot(p.x - PIN.x, p.y - PIN.y) <= RING_R) return { ...p, dist: d };
  }
  return { ...b, dist: len };
})();

/* ---------- Celular grande (escena de la notificación) ---------- */
export const PHONE_W = 720;
export const PHONE_H = PHONE_W * 2.06;
export const SCREEN_INSET = PHONE_W * 0.012 + PHONE_W * 0.026;
export const SCREEN_W = PHONE_W - SCREEN_INSET * 2;
export const PHONE_POS = { x: SAFE.centerX - PHONE_W / 2, y: 350 };

/** Notificación y tarjeta, en coordenadas de la pantalla del celular. */
export const NOTIF_RECT = { x: 20, y: 372, w: SCREEN_W - 40, h: 292 };
export const CARD_RECT = { x: 24, y: 200, w: SCREEN_W - 48, h: 560 };
