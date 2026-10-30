/**
 * Toda la copy del video y de las piezas para redes.
 * Edita aquí sin tocar las animaciones.
 *
 * Convenciones de KineticText:
 *  - "\n" fuerza un salto de línea.
 *  - Una palabra entre *asteriscos* se pinta con el color de acento.
 */
export const copy = {
  hook: {
    title: "Tu cliente perdió\nla tarjeta de sellos.",
    paperCard: {
      business: "Barbería El Parche",
      note: "10 sellos = corte gratis",
    },
  },
  problem: {
    lead: "Y con ella,",
    title: "su próxima *visita.*",
  },
  reveal: {
    kicker: "Presentamos",
    title: "Tu tarjeta de sellos,\nahora en el *celular.*",
  },
  wallet: {
    lines: [
      {
        title: "Vive en el Wallet\nde tu cliente.",
        sub: "Funciona en iPhone y Android.",
      },
      {
        title: "Sin descargar\nninguna *app.*",
        sub: "Un toque y queda guardada.",
      },
      {
        title: "Y no se pierde.\n*Nunca.*",
        sub: "Siempre a la mano, al lado de sus tarjetas.",
      },
    ],
    walletTitle: "Wallet",
    otherPasses: ["Tarjeta débito", "Pase de abordar"],
  },
  stamps: {
    title1: "Cada visita,\nun *sello.*",
    title2: "Se actualiza\n*sola.*",
    sub: "Pones el sello y le llega al instante.",
    reward: "¡Premio desbloqueado!",
  },
  card: {
    business: "Café La Esquina",
    label: "SELLOS",
    reward: "Premio",
    rewardValue: "Café gratis",
    customer: "Cliente",
    customerValue: "Valentina R.",
    total: 10,
  },
  nearby: {
    title: "Avisa cuando\npasa *cerca.*",
    sub: "Directo en la pantalla de bloqueo.",
    time: "10:24",
    date: "jueves, 8 de octubre",
    notification: {
      app: "WALLET",
      when: "ahora",
      title: "Café La Esquina",
      body: "Estás a una cuadra. Te falta 1 sello para tu café gratis.",
    },
  },
  fraud: {
    title: "Cada sello,\n*firmado.*",
    sub: "Cajero, hora, caja y dispositivo. Cero trampa.",
    header: ["Sello", "Cajero", "Hora", "Caja", "Dispositivo", ""],
    rows: [
      ["#0412", "Laura M.", "10:42 a. m.", "Caja 1", "iPad mostrador", "Firmado"],
      ["#0413", "Andrés P.", "10:51 a. m.", "Caja 2", "Android caja", "Firmado"],
      ["#0414", "Laura M.", "11:03 a. m.", "Caja 1", "iPad mostrador", "Firmado"],
      ["#0415", "Kelly J.", "11:17 a. m.", "Caja 3", "Celular barra", "Firmado"],
    ],
  },
  business: {
    title: "Hecho para\n*tu negocio.*",
    types: [
      "Barberías",
      "Spas",
      "Cafeterías",
      "Lavaderos",
      "Salones de uñas",
      "Panaderías",
      "Gimnasios",
      "Veterinarias",
    ],
  },
  message: {
    title: "Tus clientes\nvuelven\n*más seguido.*",
  },
  cta: {
    title: "Empieza *gratis.*",
    sub: "Hasta 20 clientes. Sin tarjeta de crédito.",
    price: "Desde $29.900 COP al mes",
    button: "mitarjetica.com",
    footer: "Hecho en Barranquilla, Colombia",
  },
} as const;

/** Copy de historias (1080×1920) y publicaciones (1080×1350). */
export const social = {
  linkInBio: "Link en la bio",
  stories: {
    paper: {
      kicker: "Pregunta seria",
      title: "¿Todavía con\ntarjeta de *papel?*",
      sub: "Se moja, se pierde, se queda en la otra billetera.",
      after: "Pásate al *Wallet.*",
    },
    trio: {
      lines: ["Sin *app.*", "Sin *papel.*", "Sin *trampa.*"],
      sub: "La tarjeta de sellos que tus clientes sí cargan.",
    },
    nearby: {
      title: "Esto le llega\na tu cliente\ncuando pasa *cerca.*",
      sub: "Directo en la pantalla de bloqueo. Sin que tú hagas nada.",
    },
    stamps: {
      title: "Cada visita,\nun *sello.*",
      sub: "Y al décimo, premio. Así de fácil vuelven.",
    },
    pricing: {
      kicker: "Plan gratis",
      title: "Gratis hasta\n*20 clientes.*",
      bullets: [
        "Sin tarjeta de crédito",
        "Funciona en iPhone y Android",
        "Listo en minutos",
      ],
      price: "Después, desde $29.900 COP al mes",
    },
    cta: {
      title: "Tus clientes\nvuelven\n*más seguido.*",
      button: "mitarjetica.com",
    },
  },
  posts: {
    manifesto: { title: "Tus clientes\nvuelven\n*más seguido.*" },
    hero: {
      title: "Tu tarjeta de sellos,\nahora en el *celular.*",
      sub: "Vive en el Wallet de tu cliente. No se pierde.",
    },
    compare: {
      before: "Antes",
      beforeText: "Se perdía en un cajón.",
      after: "Ahora",
      afterText: "Vive en su celular.",
    },
    fraud: {
      title: "Cada sello,\n*firmado.*",
      sub: "Cajero, hora, caja y dispositivo. Cero trampa.",
    },
    business: {
      title: "Si tus clientes\nvuelven, esto es\n*para ti.*",
    },
    pricing: {
      title: "Empieza\n*gratis.*",
      sub: "Hasta 20 clientes. Sin tarjeta de crédito.",
      price: "Desde $29.900 COP al mes",
      madeIn: "Hecho en Barranquilla, Colombia",
    },
  },
} as const;
