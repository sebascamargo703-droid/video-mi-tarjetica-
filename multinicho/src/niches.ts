/**
 * Nichos que recorre la tarjeta. Agrega, quita o reordena aquí: la animación se adapta.
 * El color del texto de cada tarjeta se elige solo (blanco u oscuro) para cumplir AA.
 * Íconos disponibles: ver `IconName` en components/NicheIcon.tsx.
 */
import type { IconName } from "./components/NicheIcon";

export type Niche = {
  categoria: string;
  negocio: string;
  color: string;
  icono: IconName;
  sellosTotales: number;
  sellosLlenos: number;
  premio: string;
};

export const niches: Niche[] = [
  { categoria: "Barberías", negocio: "Barber Shop", color: "#1E40AF", icono: "scissors", sellosTotales: 10, sellosLlenos: 7, premio: "Un corte gratis" },
  { categoria: "Spas", negocio: "Spa Serena", color: "#E8A0B4", icono: "lotus", sellosTotales: 8, sellosLlenos: 5, premio: "Un masaje gratis" },
  { categoria: "Lavaderos de autos", negocio: "Lavadero Brillo", color: "#0EA5E9", icono: "car", sellosTotales: 10, sellosLlenos: 8, premio: "Un lavado gratis" },
  { categoria: "Heladerías", negocio: "Helados La Nube", color: "#F5C542", icono: "cone", sellosTotales: 6, sellosLlenos: 4, premio: "Un cono gratis" },
  { categoria: "Gimnasios", negocio: "Gym Fuerza", color: "#EA580C", icono: "dumbbell", sellosTotales: 12, sellosLlenos: 9, premio: "Un batido gratis" },
  { categoria: "Veterinarias", negocio: "Vet Patitas", color: "#F26B5B", icono: "paw", sellosTotales: 8, sellosLlenos: 6, premio: "Un baño gratis para tu mascota" },
  { categoria: "Cafeterías", negocio: "Café Origen", color: "#6B4423", icono: "cup", sellosTotales: 10, sellosLlenos: 6, premio: "Un café gratis" },
  { categoria: "Panaderías", negocio: "Panadería Trigo", color: "#C8963E", icono: "bread", sellosTotales: 10, sellosLlenos: 7, premio: "Un pan de la casa" },
  { categoria: "Salones de uñas", negocio: "Bella Nails", color: "#D98C9A", icono: "polish", sellosTotales: 8, sellosLlenos: 5, premio: "Una manicure gratis" },
  { categoria: "Peluquerías", negocio: "Salón Estilo", color: "#6D28D9", icono: "dryer", sellosTotales: 10, sellosLlenos: 8, premio: "Un cepillado gratis" },
];

/** Tarjeta final en blanco: "Tu negocio". */
export const yourBusiness: Niche = {
  categoria: "Tu negocio",
  negocio: "Tu negocio",
  color: "#FFFFFF",
  icono: "logo",
  sellosTotales: 10,
  sellosLlenos: 0,
  premio: "Tú decides el premio",
};
