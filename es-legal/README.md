# "¿Es legal?" — el aviso por cercanía explicado

Reel/TikTok de **Mi Tarjetica** (1080×1920, 30 fps, 44 s) con locución de ElevenLabs, subtítulos animados,
música y efectos. Responde la duda típica del cliente: *¿es legal que un negocio me mande una
notificación solo por pasar por el frente?* → no te están siguiendo: es la tarjeta de sellos que
tú guardaste en el Wallet, trae la ubicación del negocio y es **tu celular** el que la muestra; el
negocio no ve tu ubicación y lo puedes apagar. Cierra con el beneficio para el negocio y el CTA
**"Comenta TARJETA"**.

| Escena | Frase |
|---|---|
| Fachada del café, la persona pasa y le llega la notificación · "¿ESTO ES LEGAL?" | q1, q2 |
| Mapa 3D: "RASTREANDO UBICACIÓN…" se borra → "SIN RASTREO" | calm |
| Wallet con la tarjeta de sellos → cámara escaneando el QR → "Agregada a tu Wallet" | card, scan |
| Mapa: el local se ilumina, pin, geocerca; el cliente entra y su celular muestra el aviso · "Lo que ve el negocio: No disponible" | loc, near, nosabe |
| Detalles de la tarjeta: se apaga "Sugerir en pantalla bloqueada" | off |
| Frente a la puerta: notificación → tarjeta 4/5 con el sello que falta · "¡Te falta 1!" | biz, door, stamp |
| Abanico de tarjetas de otros negocios | want |
| COMENTA **TARJETA** ↓ + comentario escribiéndose + logo | cta |

Zonas seguras de Reels/TikTok: subtítulos desde y=262, nada importante debajo de y=1500 ni en los
120 px de la derecha (todo se centra en x=480).

## Comandos

```bash
npm install
npx remotion studio                                    # vista previa
npx remotion render EsLegal out/es-legal.mp4 --codec=h264 --crf=16 --audio-bitrate=192k
bash scripts/master-audio.sh out/es-legal.mp4          # audio al estándar de redes
```
Sin internet: antepón `REMOTION_LOCAL_FONTS=1`.

## Cambiar textos, voz o tiempos

- **Locución:** voz **"Lina – Colombian Warm & Confident"** de ElevenLabs (modelo eleven_v4), una
  frase por archivo en `public/voz/<id>.wav`; el texto de cada frase está en `src/voiceover.json`
  (`say`) y `pause` es el silencio después. Para cambiar una frase: genérala en ElevenLabs con la misma
  voz, guárdala como `<id>.mp3` en una carpeta y corre `python3 scripts/import-voice.py <carpeta>`:
  recorta silencios, guarda la duración (`dur`) y **todo el video se reacomoda solo**
  (`src/timeline.ts`); luego `python3 scripts/make-audio.py` para ajustar la música a la nueva duración.
  Sin ElevenLabs: `scripts/make-voice.py` genera una voz abierta local (Kokoro), con algunas palabras
  escritas como suenan ("Uálet", "cú erre").
- **Subtítulos:** `captions` en `src/copy.ts` (`*palabra*` cursiva menta, `[palabra]` resaltador).
- **Negocio de ejemplo, notificación, tarjeta, otras tarjetas, CTA:** `src/copy.ts`.
- **Colores y volúmenes:** `src/brand.ts`. La música baja sola cuando habla la voz.
- **Música y efectos:** `python3 scripts/make-audio.py` (sintetizados, libres de derechos; la
  música se ajusta a la duración de la voz). Para pauta, cambia `public/music.mp3` por una pista con licencia.
- **QR:** `src/qr.ts` es un QR real a https://mitarjetica.com.
