/**
 * Textos del TikTok "La oficina dentro del celular" (negocio de ejemplo: Café Origen).
 * Titulares: `[palabra]` → resaltador · `\n` → salto. Cada titular: [texto, palabra con la que entra].
 */
export type Icon = "beer" | "coffee" | "scissors" | "star" | "paw";
export const business = { name: "Café Origen", short: "Origen", emoji: "☕", icon: "coffee" as Icon };
export const card = { stamps: 7, total: 8, customer: "Laura", reward: "Un café gratis" };
export const notification = { app: "CAFÉ ORIGEN", when: "ahora", title: "¡Laura volvió! ☕", body: "Canjeó su café gratis. Lleva 3 tarjetas completas." };
export const copy = { lockTime: "10:24", lockDate: "lunes 3 de noviembre" };

export const headlines: Record<string, [string, string][]> = {
  h1: [["LE PEDÍ A MI TARJETICA\nQUE ME AYUDARA…", "pedí"]],
  h2: [["Y ME MONTÓ UNA\n[OFICINA ENTERA]", "montó"]],
  t1: [["¿Y ESTOS\n[QUIÉNES SON?]", "estos"]],
  t2: [["TU [EQUIPO.]", "equipo"]],
  w1: [["EL DE LOS\n[SELLOS]", "este"]],
  w2: [["EL DE LOS\n[CUMPLEAÑOS]", "este"]],
  w3: [["EL QUE VIGILA\n[LA CUADRA]", "este"]],
  w4: [["EL DE LOS\n[PREMIOS]", "este"]],
  w5: [["EL DE LOS\n[DATOS]", "ese"]],
  q1: [["¿CUÁNTOS\n[CLIENTES?]", "cuántos"]],
  q3: [["¿CUÁNTOS\n[VOLVIERON?]", "cuántos"]],
  q5: [["¿CUÁNDO\n[DESCANSAN?]", "cuándo"]],
  q6: [["[NUNCA.]", "nunca"]],
  y1: [["¿Y YO\n[QUÉ HAGO?]", "yo"]],
  y2: [["ATENDER A TUS\n[CLIENTES]", "atender"]],
  k1: [["ENVÍASELO A\n[ESE AMIGO]", "envíaselo"]],
};
