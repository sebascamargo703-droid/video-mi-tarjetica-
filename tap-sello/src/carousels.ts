/**
 * Carruseles de Instagram (láminas estáticas 1080×1350).
 *
 * Para agregar un carrusel nuevo, agrega un objeto a `carousels`: Root.tsx registra
 * un <Still> por lámina (`${id}-${n}`) y `node scripts/render-carousels.mjs` lo exporta.
 *
 * Convenciones de texto:
 *  - `*palabra*` → color de marca.   `\n` → salto de línea.
 *  - Máximo 25 palabras por lámina (el script de render avisa si te pasas).
 *
 * Este archivo es solo datos (sin imports) para que el script de render pueda leerlo.
 */

/** "green" = verde de marca #145B44 · "light" = blanco · "dark" = negro #0A0A0A */
export type SlideTone = "green" | "light" | "dark";

export type Slide =
  | { type: "cover"; title: string; subtitle?: string }
  | { type: "point"; number?: string; title: string; text: string }
  | { type: "stat"; value: string; context: string; note?: string }
  | { type: "compare"; before: string; after: string }
  | { type: "card"; title: string }
  | { type: "cta" };

export type Carousel = {
  id: string;
  /** Fondo de todas las láminas del carrusel: "green", "light" o "dark". */
  theme: SlideTone;
  caption: string;
  slides: Slide[];
};

export const carousels: Carousel[] = [
  {
    id: "cuanto-vale-un-cliente",
    theme: "green",
    caption: "Haz la cuenta con tu propio negocio 👇 ¿Cuánto te deja un cliente fiel al año?",
    slides: [
      { type: "cover", title: "¿Cuánto vale\nun cliente\nque *vuelve?*" },
      { type: "stat", value: "$25.000", context: "Lo que paga por un corte.", note: "Ejemplo de una barbería." },
      { type: "stat", value: "17 visitas", context: "Al año, si viene cada 3 semanas." },
      { type: "stat", value: "$425.000", context: "Lo que deja un solo cliente fiel en un año." },
      { type: "stat", value: "$8.500.000", context: "Lo que pierdes al año si 20 clientes dejan de volver." },
      {
        type: "point",
        title: "Fidelizar no es un gasto",
        text: "Es la forma más barata de vender más: el cliente ya te conoce.",
      },
      { type: "cta" },
    ],
  },
  {
    id: "premios-que-funcionan",
    theme: "light",
    caption: "Guárdalo para cuando montes tu tarjeta. ¿Cuál usarías en tu negocio?",
    slides: [
      { type: "cover", title: "5 premios de\nfidelización que\nsí hacen *volver*\na tus clientes" },
      { type: "point", number: "01", title: "El clásico", text: "10 visitas, un corte gratis. Simple de entender, fácil de recordar." },
      { type: "point", number: "02", title: "La meta corta", text: "5 visitas, arreglo de barba gratis. Metas cortas = clientes más constantes." },
      { type: "point", number: "03", title: "El de cumpleaños", text: "Un beneficio el día que cumple. Se siente personal y trae visitas extra." },
      { type: "point", number: "04", title: "El producto", text: "Al completar la tarjeta, un producto de la casa. Cuesta poco y se valora mucho." },
      { type: "point", number: "05", title: "El upgrade", text: "Al premio, súmale un servicio que normalmente no compra. Así lo prueba." },
      { type: "cta" },
    ],
  },
  {
    id: "cartoncito-vs-mitarjetica",
    theme: "green",
    caption: "Tu competencia sigue repartiendo cartoncitos. Tú no tienes por qué.",
    slides: [
      { type: "cover", title: "Cartoncito\nvs. *Mi Tarjetica*" },
      { type: "compare", before: "Se pierde", after: "Vive en el Wallet del celular" },
      { type: "compare", before: "No sabes quién es", after: "Nombre y teléfono de cada cliente" },
      { type: "compare", before: "Cualquiera lo falsifica", after: "Cada sello firmado" },
      { type: "compare", before: "Esperas a que vuelva", after: "Le avisa cuando pasa cerca" },
      { type: "compare", before: "Imprimir cada mes", after: "Lista en 5 minutos" },
      { type: "cta" },
    ],
  },
  {
    id: "como-funciona",
    theme: "light",
    caption: "5 minutos y tu negocio ya tiene tarjeta de fidelización digital. Empieza gratis 👉 mitarjetica.com",
    slides: [
      { type: "cover", title: "Tu tarjeta de\nsellos *digital*\nen 3 pasos" },
      { type: "point", number: "1", title: "Diseña tu tarjeta", text: "Escoges plantilla, subes tu logo, pones tus colores y decides el premio." },
      {
        type: "point",
        number: "2",
        title: "Tu cliente la guarda",
        text: "Escanea el QR del mostrador y la tarjeta queda en su Wallet. No descarga ninguna app.",
      },
      { type: "point", number: "3", title: "Sumas los sellos", text: "Buscas su teléfono y pulsas un botón. El sello le aparece solo." },
      { type: "card", title: "Funciona en iPhone\ny en *Android.*" },
      { type: "cta" },
    ],
  },
];

/** Textos fijos de la lámina CTA (iguales en todos los carruseles). */
export const ctaCopy = {
  title: "Créala gratis en\n*mitarjetica.com*",
  sub: "Gratis hasta 20 clientes · Sin tarjeta de crédito",
};

/** Datos del mockup de la tarjeta (lámina `card`). */
export const cardCopy = {
  business: "Barber Shop",
  customer: "Laura Gómez",
  reward: "Un corte gratis",
  stamps: 7,
  total: 10,
};

export const swipeLabel = "Desliza";
