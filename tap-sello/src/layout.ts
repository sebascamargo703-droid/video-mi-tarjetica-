/**
 * Geometría fija (px del lienzo 1080×1920). Los sellos voladores viajan entre
 * coordenadas absolutas calculadas aquí, así que el layout vive en un solo lugar.
 *
 * Zonas seguras Reels/TikTok: 250 px arriba, 420 px abajo, 120 px a la derecha.
 * El contenido se centra en la franja horizontal 0–960 → centro x = 480.
 */
export const SAFE = { top: 250, bottom: 1920 - 420, right: 1080 - 120, centerX: 480 };

export const PHONE_W = 420;
export const PHONE_H = PHONE_W * 2.06;
/** Marco + bisel → borde de la pantalla. */
export const SCREEN_INSET = PHONE_W * 0.012 + PHONE_W * 0.026;
export const SCREEN_W = PHONE_W - SCREEN_INSET * 2;
export const SCREEN_H = PHONE_H - SCREEN_INSET * 2;

export const LEFT_PHONE = { x: 50, y: 440 };
export const RIGHT_PHONE = { x: 510, y: 440 };

/** Botón "+1 sello" dentro de la pantalla del negocio. */
export const BUTTON = { x: 18, y: 436, w: SCREEN_W - 36, h: 104 };

/** Tarjeta dentro de la pantalla del Wallet. */
export const CARD = { x: 14, y: 116, w: SCREEN_W - 28, h: 436 };
export const STAMP_D = 46;
const gridPad = 22;
const stepX = (CARD.w - gridPad * 2 - STAMP_D) / 4;
/** Centro del círculo i (0–9) en coordenadas de la pantalla. */
export const stampCenter = (i: number) => ({
  x: CARD.x + gridPad + STAMP_D / 2 + (i % 5) * stepX,
  y: CARD.y + (i < 5 ? 108 : 168) + STAMP_D / 2,
});

export const toAbs = (phone: { x: number; y: number }, p: { x: number; y: number }) => ({
  x: phone.x + SCREEN_INSET + p.x,
  y: phone.y + SCREEN_INSET + p.y,
});

/** Posición final del celular de Laura, centrado y más grande. */
export const CENTER_SCALE = 1.15;
export const CENTER_PHONE = {
  x: SAFE.centerX - (PHONE_W * CENTER_SCALE) / 2,
  y: 960 - (PHONE_H * CENTER_SCALE) / 2 + 40,
};
