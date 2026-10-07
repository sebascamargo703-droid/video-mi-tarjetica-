export interface SubtitleItem {
  text: string;
  startFrame: number;
  endFrame: number;
  isKeyWord?: boolean;
  accentColor?: string;
}

/**
 * Word-level subtitles 100% synchronized with the speaker's actual voice in video-base.mp4
 */
export const SUBTITLES_DATA: SubtitleItem[] = [
  // 0 - 50: "No necesitas clientes nuevos"
  { text: "No", startFrame: 0, endFrame: 12 },
  { text: "necesitas", startFrame: 13, endFrame: 26 },
  { text: "clientes", startFrame: 27, endFrame: 38, isKeyWord: true, accentColor: "#FF3B30" },
  { text: "nuevos 🛑", startFrame: 39, endFrame: 50, isKeyWord: true, accentColor: "#FF3B30" },

  // 51 - 130: "Necesitas que te vuelvan a elegir"
  { text: "Necesitas", startFrame: 51, endFrame: 72 },
  { text: "que te vuelvan", startFrame: 73, endFrame: 98, isKeyWord: true, accentColor: "#2F6BFF" },
  { text: "a elegir ⚡", startFrame: 99, endFrame: 130, isKeyWord: true, accentColor: "#34C759" },

  // 131 - 185: "Conseguir un cliente nuevo"
  { text: "Conseguir", startFrame: 131, endFrame: 154 },
  { text: "un cliente", startFrame: 155, endFrame: 170 },
  { text: "nuevo", startFrame: 171, endFrame: 185, isKeyWord: true, accentColor: "#FFCC00" },

  // 186 - 241: "Cuesta hasta 5 veces más que retenerlo"
  { text: "cuesta hasta", startFrame: 186, endFrame: 202 },
  { text: "5 veces más 📉", startFrame: 203, endFrame: 224, isKeyWord: true, accentColor: "#FF3B30" },
  { text: "que retenerlo", startFrame: 225, endFrame: 241, isKeyWord: true, accentColor: "#2F6BFF" },

  // 242 - 295: "Si no regresan, no es tu servicio"
  { text: "Si no regresan,", startFrame: 242, endFrame: 268 },
  { text: "no es", startFrame: 269, endFrame: 280 },
  { text: "tu servicio ❌", startFrame: 281, endFrame: 295, isKeyWord: true, accentColor: "#FF3B30" },

  // 296 - 355: "No les estás dando un motivo para volver"
  { text: "no les estás dando", startFrame: 296, endFrame: 322 },
  { text: "un motivo", startFrame: 323, endFrame: 338, isKeyWord: true, accentColor: "#2F6BFF" },
  { text: "para volver 🔄", startFrame: 339, endFrame: 355, isKeyWord: true, accentColor: "#34C759" },

  // 356 - 445: "Cada compra de hoy es visita asegurada mañana"
  { text: "Cada compra de hoy", startFrame: 356, endFrame: 395 },
  { text: "es visita asegurada", startFrame: 396, endFrame: 424, isKeyWord: true, accentColor: "#34C759" },
  { text: "mañana 🗓️", startFrame: 425, endFrame: 445, isKeyWord: true, accentColor: "#34C759" },

  // 446 - 500: "Con MiTarjetica"
  { text: "con", startFrame: 446, endFrame: 462 },
  { text: "MiTarjetica 📲", startFrame: 463, endFrame: 500, isKeyWord: true, accentColor: "#2F6BFF" },

  // 501 - 554: "Una tarjeta digital en el celular de tus clientes"
  { text: "una tarjeta digital", startFrame: 501, endFrame: 526, isKeyWord: true, accentColor: "#2F6BFF" },
  { text: "en el celular", startFrame: 527, endFrame: 540 },
  { text: "de tus clientes", startFrame: 541, endFrame: 554 },

  // 555 - 650: "Premia la fidelidad de tus clientes"
  { text: "premia la fidelidad", startFrame: 555, endFrame: 605, isKeyWord: true, accentColor: "#34C759" },
  { text: "de tus clientes 🎁", startFrame: 606, endFrame: 650, isKeyWord: true, accentColor: "#34C759" },

  // 651 - 748: "Acumulan sellos y obtienen descuentos y recompensas"
  { text: "acumulan sellos", startFrame: 651, endFrame: 692, isKeyWord: true, accentColor: "#FFCC00" },
  { text: "y obtienen", startFrame: 693, endFrame: 715 },
  { text: "descuentos y recompensas ⭐", startFrame: 716, endFrame: 748, isKeyWord: true, accentColor: "#FFCC00" },

  // 749 - 815: "Con aviso de proximidad"
  { text: "con aviso de", startFrame: 749, endFrame: 778 },
  { text: "proximidad 📍", startFrame: 779, endFrame: 815, isKeyWord: true, accentColor: "#2F6BFF" },

  // 816 - 884: "Le avisa a tu cliente cada vez que pasa cerca"
  { text: "le avisa a tu cliente", startFrame: 816, endFrame: 848 },
  { text: "cada vez que", startFrame: 849, endFrame: 864 },
  { text: "pasa cerca 🔔", startFrame: 865, endFrame: 884, isKeyWord: true, accentColor: "#34C759" },

  // 885 - 982: "Y mantienes una base de datos real, actualizada de tu negocio"
  { text: "y mantienes una", startFrame: 885, endFrame: 912 },
  { text: "base de datos real 📊", startFrame: 913, endFrame: 948, isKeyWord: true, accentColor: "#2F6BFF" },
  { text: "actualizada de tu negocio", startFrame: 949, endFrame: 982, isKeyWord: true, accentColor: "#34C759" },

  // 983 - 1045: "Deja de perder clientes todos los días"
  { text: "deja de perder", startFrame: 983, endFrame: 1008 },
  { text: "clientes 🛑", startFrame: 1009, endFrame: 1024, isKeyWord: true, accentColor: "#FF3B30" },
  { text: "todos los días", startFrame: 1025, endFrame: 1045 },

  // 1046 - 1140: "Comenta la palabra Tarjetica y te enviamos la información"
  { text: "comenta la palabra", startFrame: 1046, endFrame: 1074 },
  { text: "TARJETICA 💬", startFrame: 1075, endFrame: 1108, isKeyWord: true, accentColor: "#FFCC00" },
  { text: "y te enviamos la información", startFrame: 1109, endFrame: 1140, isKeyWord: true, accentColor: "#2F6BFF" },

  // 1141 - 1200: Cierre con logo y URL
  { text: "Empieza hoy en", startFrame: 1141, endFrame: 1170 },
  { text: "mitarjetica.com 🚀", startFrame: 1171, endFrame: 1200, isKeyWord: true, accentColor: "#2F6BFF" },
];
