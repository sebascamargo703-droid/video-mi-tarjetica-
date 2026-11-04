/**
 * Plan de 5 días de carruseles para Instagram (1080×1350, 7 diapositivas cada uno).
 * `*palabra*` = color de acento · `\n` = salto de línea.
 * Los datos con cifras llevan su fuente en `source`.
 */
export type CarouselTone = "cream" | "dark" | "brand" | "light" | "ink";
export type Visual =
  | "paperCard"
  | "walletCard"
  | "walletCardFull"
  | "phoneWallet"
  | "phoneLock"
  | "log"
  | "math"
  | "endowed"
  | "addWallet";

export type Slide =
  | { t: "cover"; tone: CarouselTone; kicker: string; title: string; sub?: string; visual?: Visual }
  | { t: "statement"; tone: CarouselTone; kicker?: string; title: string; body?: string; source?: string; visual?: Visual }
  | { t: "stat"; tone: CarouselTone; kicker?: string; big: string; title: string; body?: string; source?: string; visual?: Visual }
  | { t: "step"; tone: CarouselTone; n: number; title: string; body: string; visual?: Visual }
  | { t: "ideas"; tone: CarouselTone; kicker: string; items: { biz: string; reward: string; detail: string }[] }
  | { t: "checklist"; tone: CarouselTone; kicker: string; title: string; items: string[] }
  | { t: "faq"; tone: CarouselTone; kicker: string; items: { q: string; a: string }[] }
  | { t: "cta"; tone: CarouselTone; title: string; body: string; actions: { icon: "save" | "share" | "link" | "comment"; text: string }[] };

export type Carousel = { day: number; slug: string; name: string; slides: Slide[] };

export const carousels: Carousel[] = [
  {
    day: 1,
    slug: "la-cuenta",
    name: "La cuenta que casi nadie hace",
    slides: [
      {
        t: "cover",
        tone: "cream",
        kicker: "Para dueños de negocio",
        title: "Tu cliente\nmás rentable\n*ya te conoce.*",
        sub: "La cuenta que casi nadie hace (y que cambia tu mes).",
        visual: "walletCard",
      },
      {
        t: "stat",
        tone: "dark",
        kicker: "Dato 1",
        big: "5–25x",
        title: "más caro puede salir\nconseguir un cliente nuevo\nque *mantener uno.*",
        body: "Depende del estudio y del sector, pero la conclusión es la misma.",
        source: "Fuente: Harvard Business Review, “The Value of Keeping the Right Customers” (2014).",
      },
      {
        t: "stat",
        tone: "brand",
        kicker: "Dato 2",
        big: "+5%",
        title: "de clientes que vuelven\npuede subir las utilidades\nentre *25% y 95%.*",
        source: "Fuente: Frederick Reichheld, Bain & Company (Loyalty Rules!, 2001).",
      },
      {
        t: "statement",
        tone: "light",
        kicker: "Haz la cuenta",
        title: "Si tu cliente viene\n*cada 4 semanas*\nen vez de cada 5…",
        body: "…son 13 visitas al año en vez de 10. Casi 3 visitas más por cliente.",
        visual: "math",
      },
      {
        t: "stat",
        tone: "cream",
        kicker: "Ejemplo: barbería con 100 clientes fijos",
        big: "+$6,5 M",
        title: "al año, con un corte\nde *$25.000.*",
        body: "100 clientes × 2,6 visitas extra × $25.000.",
        source: "Ejemplo ilustrativo: haz la cuenta con los números de tu negocio.",
      },
      {
        t: "statement",
        tone: "dark",
        kicker: "¿Cómo se logra?",
        title: "Recuérdales volver\ny dales *una razón.*",
        body: "Un premio claro y un recordatorio en el momento justo.",
        visual: "phoneLock",
      },
      {
        t: "cta",
        tone: "brand",
        title: "Guárdalo y haz\n*tu cuenta.*",
        body: "Mi Tarjetica: la tarjeta de sellos que vive en el celular de tu cliente.",
        actions: [
          { icon: "save", text: "Guárdalo para hacer tu cuenta" },
          { icon: "share", text: "Envíaselo a otro dueño de negocio" },
          { icon: "link", text: "Empieza gratis: link en la bio" },
        ],
      },
    ],
  },
  {
    day: 2,
    slug: "tarjeta-de-papel",
    name: "5 problemas de la tarjeta de papel",
    slides: [
      {
        t: "cover",
        tone: "dark",
        kicker: "Tarjeta de sellos de papel",
        title: "5 razones por las\nque *no te está\nfuncionando.*",
        visual: "paperCard",
      },
      {
        t: "step",
        tone: "cream",
        n: 1,
        title: "Se *pierde.*",
        body: "Se moja, se queda en otra billetera o termina en la lavadora. Y con ella, el motivo para volver.",
        visual: "paperCard",
      },
      {
        t: "step",
        tone: "cream",
        n: 2,
        title: "Nadie la *carga.*",
        body: "Justo cuando el cliente está frente a tu negocio, la tarjeta se quedó en la casa.",
      },
      {
        t: "step",
        tone: "dark",
        n: 3,
        title: "Sellos *“regalados”.*",
        body: "Un sello de más aquí, otro allá. En papel no sabes quién lo puso ni cuándo.",
      },
      {
        t: "step",
        tone: "dark",
        n: 4,
        title: "No sabes\nquién *vuelve.*",
        body: "Sin datos, no hay forma de ver qué clientes se te están perdiendo.",
      },
      {
        t: "step",
        tone: "brand",
        n: 5,
        title: "No le recuerda\n*volver.*",
        body: "El papel no avisa. Tu cliente pasa por tu calle y sigue de largo.",
      },
      {
        t: "cta",
        tone: "cream",
        title: "La solución:\ntu tarjeta de sellos\n*en el celular.*",
        body: "Vive en el Wallet, no se pierde, avisa cuando pasa cerca y cada sello queda firmado.",
        actions: [
          { icon: "comment", text: "Escríbenos “SELLOS” por DM" },
          { icon: "share", text: "Etiqueta a un negocio que lo necesita" },
          { icon: "link", text: "Pruébala gratis: link en la bio" },
        ],
      },
    ],
  },
  {
    day: 3,
    slug: "como-funciona",
    name: "Así funciona, paso a paso",
    slides: [
      {
        t: "cover",
        tone: "brand",
        kicker: "Paso a paso",
        title: "Así funciona\n*Mi Tarjetica.*",
        sub: "4 pasos. Sin apps, sin papel.",
        visual: "phoneWallet",
      },
      {
        t: "step",
        tone: "light",
        n: 1,
        title: "La guarda en\nsu *Wallet.*",
        body: "Funciona en iPhone y Android. Tu cliente no tiene que descargar ninguna app.",
        visual: "addWallet",
      },
      {
        t: "step",
        tone: "dark",
        n: 2,
        title: "Cada visita,\n*un sello.*",
        body: "Lo pones tú y la tarjeta se actualiza sola en su celular.",
        visual: "walletCard",
      },
      {
        t: "step",
        tone: "brand",
        n: 3,
        title: "Le avisa cuando\npasa *cerca.*",
        body: "Una notificación en su pantalla de bloqueo le recuerda que le falta poco.",
        visual: "phoneLock",
      },
      {
        t: "step",
        tone: "cream",
        n: 4,
        title: "Completa y\ngana su *premio.*",
        body: "Y vuelve a empezar. Así se crea la costumbre de volver.",
        visual: "walletCardFull",
      },
      {
        t: "statement",
        tone: "dark",
        kicker: "Y tú, tranquilo",
        title: "Cada sello queda\n*firmado.*",
        body: "Cajero, hora, caja y dispositivo. Cero trampa.",
        visual: "log",
      },
      {
        t: "cta",
        tone: "brand",
        title: "¿Lo probamos en\n*tu negocio?*",
        body: "Gratis hasta 20 clientes. Sin tarjeta de crédito.",
        actions: [
          { icon: "save", text: "Guárdalo para mostrárselo a tu equipo" },
          { icon: "comment", text: "¿Dudas? Pregúntanos en los comentarios" },
          { icon: "link", text: "Empieza gratis: link en la bio" },
        ],
      },
    ],
  },
  {
    day: 4,
    slug: "ideas-de-premios",
    name: "8 ideas de premios por negocio",
    slides: [
      {
        t: "cover",
        tone: "cream",
        kicker: "Guárdalo para después",
        title: "¿Qué premio poner\nen tu *tarjeta\nde sellos?*",
        sub: "8 ideas listas para copiar, por tipo de negocio.",
        visual: "walletCardFull",
      },
      {
        t: "ideas",
        tone: "light",
        kicker: "Ideas 1 y 2",
        items: [
          { biz: "Barbería", reward: "10 cortes = 1 gratis", detail: "El clásico: fácil de entender y de recordar." },
          { biz: "Cafetería", reward: "8 cafés = 1 gratis", detail: "Premio pequeño, pocos sellos: se completa rápido." },
        ],
      },
      {
        t: "ideas",
        tone: "dark",
        kicker: "Ideas 3 y 4",
        items: [
          { biz: "Spa", reward: "6 visitas = masaje de 30 min", detail: "Un premio que se siente como un regalo." },
          { biz: "Salón de uñas", reward: "8 citas = diseño gratis", detail: "Premia con algo que le encanta mostrar." },
        ],
      },
      {
        t: "ideas",
        tone: "cream",
        kicker: "Ideas 5 y 6",
        items: [
          { biz: "Lavadero", reward: "10 lavadas = 1 lavada full", detail: "Sube de nivel el servicio en vez de regalarlo igual." },
          { biz: "Panadería", reward: "10 compras = 1 postre gratis", detail: "Ideal para el cliente de todos los días." },
        ],
      },
      {
        t: "ideas",
        tone: "light",
        kicker: "Ideas 7 y 8",
        items: [
          { biz: "Gimnasio", reward: "12 clases = 1 semana gratis", detail: "Premia la constancia, que es lo que más cuesta." },
          { biz: "Veterinaria", reward: "5 baños = 1 baño gratis", detail: "Pocos sellos para un servicio frecuente." },
        ],
      },
      {
        t: "stat",
        tone: "brand",
        kicker: "Tip con ciencia · estudio en un lavadero",
        big: "34% vs 19%",
        title: "*2 sellos de regalo* casi\nduplicaron a quienes\ncompletaron la tarjeta.",
        source: "Fuente: Nunes & Drèze (2006), “The Endowed Progress Effect”, Journal of Consumer Research.",
        visual: "endowed",
      },
      {
        t: "cta",
        tone: "dark",
        title: "¿Cuál vas a\n*usar tú?*",
        body: "Cuéntanos tu negocio en los comentarios y te ayudamos a armar tu premio.",
        actions: [
          { icon: "comment", text: "Comenta tu tipo de negocio" },
          { icon: "save", text: "Guárdalo para cuando armes tu tarjeta" },
          { icon: "link", text: "Créala gratis: link en la bio" },
        ],
      },
    ],
  },
  {
    day: 5,
    slug: "empieza-gratis",
    name: "Empieza gratis",
    slides: [
      {
        t: "cover",
        tone: "brand",
        kicker: "Plan gratis",
        title: "Empieza *gratis*\neste fin de semana.",
        sub: "Hasta 20 clientes. Sin tarjeta de crédito.",
        visual: "walletCard",
      },
      {
        t: "checklist",
        tone: "light",
        kicker: "Lo que tienes desde el día 1",
        title: "Todo\n*Mi Tarjetica.*",
        items: [
          "Vive en el Wallet (iPhone y Android)",
          "Tu cliente no descarga ninguna app",
          "Se actualiza sola en cada visita",
          "Aviso cuando pasa cerca de tu negocio",
          "Cada sello firmado: cero trampa",
        ],
      },
      {
        t: "stat",
        tone: "dark",
        kicker: "Cuando crezcas",
        big: "$29.900",
        title: "COP al mes, desde.",
        body: "Tus primeros 20 clientes van gratis. Después, planes desde $29.900 COP al mes.",
      },
      {
        t: "faq",
        tone: "cream",
        kicker: "Preguntas frecuentes",
        items: [
          { q: "¿Mis clientes tienen que descargar algo?", a: "No. La tarjeta se guarda en el Wallet de su celular." },
          { q: "¿Funciona en iPhone y Android?", a: "Sí, en los dos." },
          { q: "¿Necesito tarjeta de crédito?", a: "No. El plan gratis no la pide." },
        ],
      },
      {
        t: "faq",
        tone: "light",
        kicker: "Preguntas frecuentes",
        items: [
          { q: "¿Y si alguien pone sellos de más?", a: "Cada sello queda firmado con cajero, hora, caja y dispositivo." },
          { q: "¿Para qué negocios sirve?", a: "Barberías, spas, cafeterías, lavaderos, uñas, panaderías, gimnasios, veterinarias…" },
        ],
      },
      {
        t: "statement",
        tone: "dark",
        kicker: "Hecho en Barranquilla",
        title: "Hecho en Colombia,\npara negocios\n*como el tuyo.*",
        body: "Pensado para el negocio de barrio que quiere que sus clientes vuelvan.",
      },
      {
        t: "cta",
        tone: "brand",
        title: "Crea tu tarjeta\n*hoy.*",
        body: "mitarjetica.com",
        actions: [
          { icon: "link", text: "Toca el link en la bio" },
          { icon: "share", text: "Envíaselo a tu socio" },
          { icon: "save", text: "Guárdalo para el lunes" },
        ],
      },
    ],
  },
];
