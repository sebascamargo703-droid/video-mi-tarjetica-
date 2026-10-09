/**
 * Datos de ejemplo del panel. Cambia aquí el negocio, los números o los clientes:
 * la animación se adapta sola (odómetros, sparkline, barras y etiquetas).
 */
export type Tag = { text: string; tone: "success" | "alert" };
export type Client = { name: string; lastVisit: string; stamps: number; total: number; tag?: Tag };

export const business = { name: "Barber Shop", period: "Esta semana" };

export const kpis = {
  clients: { label: "Clientes registrados", value: 312 },
  stamps: { label: "Sellos esta semana", value: 148 },
  rewards: { label: "Premios canjeados", value: 23 },
};

/** Sellos por día, de lunes a domingo. El punto brillante va en el valor más alto. */
export const stampsByDay = [14, 19, 22, 18, 27, 31, 17];
export const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

export const clients: Client[] = [
  { name: "Laura Gómez", lastVisit: "Hoy, 4:12 p. m.", stamps: 7, total: 10 },
  { name: "Andrés Pérez", lastVisit: "Ayer", stamps: 10, total: 10, tag: { text: "Premio canjeado", tone: "success" } },
  { name: "Marcela Díaz", lastVisit: "Hace 5 días", stamps: 3, total: 10 },
  { name: "Jhon Ariza", lastVisit: "Hace 62 días", stamps: 4, total: 10, tag: { text: "No ha vuelto", tone: "alert" } },
];

/** Índice del cliente que "no ha vuelto" (el foco del momento clave). */
export const lostClientIndex = 3;
/** Índice del cliente de "Quién vuelve." */
export const returningClientIndex = 0;
