/** Momentos del video en SEGUNDOS (se convierten con `s(sec)`). */
export const DURATION_SEC = 18;
export const FPS = 60;

export const T = {
  hookIn: 0.08,
  hookOut: 2.2,

  panelIn: 2.35, // sube desde abajo inclinado en 3D y se endereza
  header: 2.75,
  badge: 2.95,

  kpis: 4.0, // las 3 tarjetas caen escalonadas (6 frames)
  odometer: 4.2, // los números ruedan
  sparkline: 4.6, // se dibuja la línea
  peak: 5.75, // brilla el punto más alto
  numbersText: 4.5,
  numbersTextOut: 7.6,

  toClients: 7.9, // la cámara baja a "Clientes"
  rows: 8.3, // primera fila; las demás cada `rowGap`
  rowGap: 0.42,
  lostZoom: 9.75, // zoom lento hacia Jhon + atenuar el resto al 40 %
  lostTag: 10.05, // "No ha vuelto": pop + pulso
  clientsText: 9.85,
  clientsTextOut: 11.75,

  pullOut: 11.95, // la cámara se aleja: panel completo, levemente inclinado
  control: [12.3, 13.2, 14.1], // "Quién vuelve." · "Cuándo vino." · "Cuánto le falta…" (≈ 1 por segundo)
  controlOut: 15.05,

  panelOut: 15.05, // el panel sale hacia arriba con desenfoque
  cta: 15.5,
  ctaLogo: 15.95,
  ctaUrl: 16.3,
  ctaSub: 16.6,
  loopFadeFrames: 10,
};
