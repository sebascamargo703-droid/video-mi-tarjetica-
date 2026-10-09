/**
 * Todos los textos del video. Edita aquí sin tocar las animaciones.
 * En los titulares, una palabra entre *asteriscos* sale en color de acento.
 */
export const copy = {
  /** Gancho (0–2 s). "\n" = salto de línea. Debe leerse completo antes del segundo 2. */
  hook: "Mira lo que\nle pasa al celular\nde tu *cliente* 👀",

  labels: {
    business: "Tu negocio",
    customer: "El celular de Laura",
  },

  businessApp: {
    title: "Clientes",
    register: "Caja 1",
    search: "300 ••• 4512",
    customerName: "Laura Gómez",
    customerInitials: "LG",
    /** Va después del contador: "7 de 10 sellos". */
    progressSuffix: (total: number) => `de ${total} sellos`,
    rewardPending: (reward: string) => `Premio: ${reward}`,
    rewardReady: "🎉 Premio listo para reclamar",
    button: "+1 sello",
    activityTitle: "Actividad de hoy",
    activityRow: (n: number) => `Sello ${n} · Caja 1 · firmado`,
  },

  card: {
    business: "Barber Shop",
    stampsLabel: "SELLOS",
    leftLabel: "TE FALTAN",
    /** "3 visitas" / "1 visita" */
    left: (n: number) => `${n} ${n === 1 ? "visita" : "visitas"}`,
    rewardLabel: "PREMIO",
    reward: "Un corte gratis",
    unlockedLabel: "¡PREMIO DISPONIBLE!",
    claim: "Reclámalo en tu próxima visita",
    poweredBy: "Mi Tarjetica",
    updated: "Actualizada hace un momento",
    walletTitle: "Wallet",
  },

  /** Texto bajo los celulares durante los taps (cambia en el segundo tap). */
  under: {
    first: "Un toque en tu negocio…",
    second: "Sin que ella *abra nada.*",
  },

  lock: {
    time: "4:12",
    date: "martes 8 de septiembre",
    notifApp: "Barber Shop",
    notifWhen: "ahora",
    notifTitle: "¡Ya tienes tu corte gratis!",
    notifBody: "Pásate cuando quieras y lo reclamas.",
    outside: "Tu negocio le recuerda\nque vuelva. *Solo.*",
  },

  cta: {
    title: "Créala gratis en\n*mitarjetica.com*",
    sub: "Gratis hasta 20 clientes · Sin tarjeta de crédito",
  },
} as const;
