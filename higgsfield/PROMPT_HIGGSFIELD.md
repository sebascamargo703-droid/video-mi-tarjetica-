# MiTarjetica × Higgsfield — paquete de prompts (comercial 9:16 · 40 s)

> Adaptación del brief de Remotion a **Higgsfield.ai** como **dirección de fotografía + shot list**.
> Higgsfield genera **planos** (clips de 5–10 s) con control de cámara cinematográfico. **No es un editor**:
> los titulares, subtítulos, contadores, QR y logo **se montan después** (Remotion, que ya está en este repo, o CapCut/Premiere).
> Los modelos de IA deforman el texto y las interfaces, así que **nunca les pidas texto legible en pantalla**.

---

## 0. Cómo usar este documento

1. **Toma real del presentador = sigue siendo real.** La locución y los planos a cámara salen de tus clips (`public/user_clips/`). Higgsfield solo hace los **B-roll e inserts** que intercalas encima.
2. Para cada plano: genera primero la **imagen inicial** (modelo de imagen de Higgsfield: Soul / Nano Banana / Seedream) → elige la mejor → anímala con **Image-to-Video** (Kling, Veo, Seedance, Sora o el modelo que tengas disponible) aplicando el **preset de cámara** indicado.
3. Escribe los prompts **en inglés** (los modelos responden mejor); las notas en español son para ti.
4. Pega siempre el **Style Bible** (sección 1) al final de cada prompt para mantener coherencia entre planos.
5. Genera **3–4 variaciones por plano**, quédate con una y anota el seed para repetirlo.
6. Formato: **9:16**, la mayor resolución disponible, 24 fps (se conforma a 30 fps en la edición sin problema). Después pasa los elegidos por el **upscale** de Higgsfield para llegar a 4K (2160×3840).

---

## 1. STYLE BIBLE (pegar en todos los prompts)

```
Premium tech commercial aesthetic, Apple / Stripe / Linear product film style.
Shot on ARRI Alexa 35, 35mm and 50mm cinema prime lenses, shallow depth of field, creamy bokeh.
Low-key moody lighting, deep blacks (#0A0A0F), soft electric-blue (#2F6BFF) and violet (#7A5CFF) rim lights,
warm practical highlights. Subtle teal shadows, warm skin tones, gentle S-curve contrast, 105% saturation.
Fine 35mm film grain, soft vignette. Minimalist composition with generous negative space,
subject placed in the upper two thirds of a 9:16 frame (bottom 12% kept clean for captions).
Slow, deliberate, motivated camera movement. Photorealistic, high-end, intentional, calm.
```

**Negative prompt (usar siempre que el modelo lo permita):**

```
text, letters, words, captions, subtitles, logos, watermark, UI text, numbers on screen,
distorted hands, extra fingers, warped phone, bent screen, glitch, camera shake, fast cuts,
lens flare overload, oversaturated, cartoon, CGI look, plastic skin, cheap stock footage look,
neon cyberpunk, cluttered background, low resolution, flicker, morphing
```

> **Nota de marca:** tus archivos en `public/brand/` usan el **verde** de MiTarjetica. Si prefieres que el comercial se vea 100 % de marca, reemplaza `electric-blue (#2F6BFF) and violet (#7A5CFF)` por el verde de tu logo en el Style Bible. No mezcles ambos.

---

## 2. LÍNEA DE TIEMPO MAESTRA (sincronizada con tu locución real)

| Tiempo | Locución (de `master_fluid_subs.json`) | Imagen | Plano Higgsfield |
|---|---|---|---|
| 0:00–0:04.4 | "No necesitas clientes nuevos, necesitas que los que ya te compraron te vuelvan a elegir." | Presentador real + inserto | **H1** |
| 0:04.4–0:08 | "Conseguir un cliente nuevo cuesta hasta cinco veces más que retener uno actual." | Presentador real + B-roll | **H2** |
| 0:08–0:11.8 | "Si no regresan, no es tu servicio, es que no les estás dando una razón para volver." | B-roll | **H3** |
| 0:11.8–0:18.5 | "…que cada compra de hoy sea una visita asegurada para mañana, con MiTarjetica…" | Hero de producto | **H4** |
| 0:18.5–0:25 | "Premia la fidelidad de tus clientes… acumula sellos y obtiene descuentos y recompensas." | B-roll de uso | **H5** |
| 0:25–0:29.4 | "Con aviso de proximidad, le avisa a tu cliente cada vez que pasa cerca de tu negocio." | B-roll lifestyle | **H6** |
| 0:29.4–0:32.5 | "Y mantienes una base de datos real actualizada de tu negocio." | B-roll dueño | **H7** |
| 0:32.5–0:37.4 | "Deja de perder clientes todos los días, comenta TARJETICA…" | Presentador real (CTA) | — |
| 0:37.4–0:40 | (música) | End card | **H8** |

Regla de montaje: **ningún inserto dura más de 2–3 s** sobre la voz; vuelve siempre al presentador para mantener la conexión humana.

---

## 3. SHOT LIST — PROMPTS POR PLANO

### H1 · Hook · "la tarjeta de cartón" (inserto 1.5–2 s)
- **Preset de cámara:** Dolly In lento / Super Dolly In (nunca Crash Zoom).
- **Imagen inicial:**
```
Extreme close-up macro of a man's hand slowly crumpling a worn paper coffee loyalty punch card
with a few faded stamps, dark minimal background, single soft key light from the side,
blue rim light on the fingers, paper fibers visible, shallow depth of field.
```
- **Prompt de video:**
```
The hand slowly crushes the paper loyalty card in slow motion, paper creases catching the light,
camera performs a slow, smooth dolly-in toward the card. 120fps slow-motion feel, calm and dramatic.
```
- **Edición:** sobre "clientes nuevos". Titular "No necesitas más clientes" en rojo #FF3B30 se monta en post.

### H2 · El costo · "el cliente que vuelve" (2–3 s)
- **Preset:** Arc / Orbit lento a la izquierda.
- **Imagen inicial:**
```
Inside a premium minimalist specialty coffee shop at dusk, a barista warmly greeting a returning
customer by name across the counter, both smiling naturally, warm practical lights, dark walls,
blue window light from the street, cinematic 50mm, shallow depth of field.
```
- **Prompt de video:**
```
Slow arc camera move around the counter, the barista hands over a coffee cup, genuine smile,
steam rising from the cup, soft natural motion, no fast movement.
```
- **Edición:** debajo va la gráfica de barras "5x" (se hace en Remotion). Mezcla este plano al 40 % detrás de la gráfica.

### H3 · El problema · "sin razón para volver" (2–3 s)
- **Preset:** Static con micro Dolly Out / Handheld muy sutil desactivado.
- **Imagen inicial:**
```
A crumpled paper loyalty card falling into a matte black trash bin in a dark minimalist room,
dramatic top light, dust particles floating in the beam, deep shadows, macro lens.
```
- **Prompt de video:**
```
The crumpled paper card drops in slow motion and lands inside the bin, tiny dust particles drift
through the light beam, camera slowly pulls back. Melancholic, quiet, cinematic.
```

### H4 · La solución · hero de producto (4–6 s) ★ plano más importante
- **Preset:** 360 Orbit lento o Turning / Levitation.
- **Imagen inicial:**
```
A titanium iPhone 15 Pro floating in a dark void, slightly tilted in 3D perspective, screen fully
lit with a SOLID PURE GREEN (#00FF00) chroma screen, soft electric-blue radial glow behind it,
slow floating light particles, soft reflection on the titanium frame, studio product photography,
ultra-detailed, centered in the upper two thirds of the frame.
```
- **Prompt de video:**
```
The phone floats and rotates very slowly on its Y axis with a gentle tilt, light sweeps across
the titanium frame, particles drift slowly, smooth elegant product reveal, perfectly stable screen.
```
- **Truco pro:** la pantalla **verde croma** te permite poner encima la tarjeta real de MiTarjetica (logo, sellos, barra de progreso) con tracking en la edición. Si el modelo deforma el croma, pide `screen completely black and off` y composita igual.
- **Texto en post:** "Fidelización directa en el celular".

### H5 · Beneficio "sellos y recompensas" (2–3 s)
- **Preset:** Dolly In macro / Focus Change (rack focus).
- **Imagen inicial:**
```
Close-up of a woman's hand holding a smartphone near a café payment counter, phone screen glowing
softly with an abstract blurred card (no readable text), warm café bokeh lights in the background,
blue rim light on the phone edge, 85mm lens, shallow depth of field.
```
- **Prompt de video:**
```
Rack focus from the background café lights to the phone in her hand, she gently taps the screen,
a soft glow pulses from the screen, slow push-in. Satisfying, premium, calm.
```

### H6 · Beneficio "aviso de proximidad" (3 s)
- **Preset:** Tracking lateral / Follow (steadicam).
- **Imagen inicial:**
```
A young professional walking on a city sidewalk at golden hour blue-hour transition, phone in hand,
a warm-lit specialty coffee shop storefront softly blurred behind, long lens compression,
cinematic street photography, natural candid expression.
```
- **Prompt de video:**
```
Smooth steadicam tracking shot alongside the person walking, the phone lights up in their hand,
they glance down at the screen and smile, then turn their head toward the coffee shop.
Natural pace, smooth stabilized motion.
```
- **Edición:** encima va la notificación iOS "¡Estás cerca! Tu café te espera" + ondas desde el pin (Remotion). Este plano funciona como el b-roll al 40 % que pedía el brief.

### H7 · Beneficio "tu propia base de datos" (2–3 s)
- **Preset:** Over-the-shoulder Push In.
- **Imagen inicial:**
```
Over-the-shoulder shot of a café owner standing behind the counter after closing, looking at a
laptop with a clean dark dashboard glowing (abstract shapes, rows and charts, no readable text),
blue screen light on their face, dim warm café in the background, 35mm lens.
```
- **Prompt de video:**
```
Slow push-in over the shoulder toward the laptop screen, soft screen light flickers gently on the
owner's face as they nod with satisfaction. Quiet, confident, premium.
```
- **Edición:** termina en un match-cut por escala hacia el `DashboardMock` real de Remotion.

### H8 · End card (2.5 s)
- **Preset:** Static / micro Dolly In.
- **Imagen inicial:**
```
A sleek minimal digital loyalty card made of glass, floating in a pure black void, soft electric-blue
and violet edge glow, glassmorphism, rounded corners, light particles slowly converging,
large empty negative space above and below, no text, no logo.
```
- **Prompt de video:**
```
Light particles slowly converge and form the glass card, a soft light sweep crosses its surface,
then everything gently fades to pure black. Elegant, minimal, final.
```
- **Edición:** logo de MiTarjetica (`public/brand/mi-tarjetica-logo-blanco.png`) + "mitarjetica.com" encima del negro final.

---

## 4. Plano de reserva (opcional) · Cero descargas / Wallet
```
Close-up of a hand holding an iPhone, the thumb swipes a glowing glass card upward into a
digital wallet stack on screen (abstract, no readable text), soft blue glow, dark background,
macro lens, smooth satisfying motion.
```
Úsalo detrás del cronómetro "2 segundos" si decides mantener la escena de Wallet.

---

## 5. Qué NO pedirle a Higgsfield (y dónde hacerlo)

| Elemento | Dónde |
|---|---|
| Titulares, subtítulos palabra por palabra, "5x", cronómetro, contador | Remotion (`src/`) |
| Logos reales de Apple Wallet / Google Wallet / MiTarjetica | Post (assets oficiales, nunca generados) |
| QR (`public/assets/qr_mitarjetica.png`) | Post — un QR generado por IA no escanea |
| Interfaz real de la tarjeta y del dashboard | Post sobre la pantalla croma |
| Voz, música, SFX y ducking | Edición (la voz real siempre se mantiene) |

---

## 6. Checklist de calidad antes de aprobar un plano
- [ ] Manos con 5 dedos y sin deformarse durante todo el clip.
- [ ] El teléfono no se dobla ni cambia de modelo a mitad del plano.
- [ ] Nada de texto inventado en pantallas, letreros o tazas.
- [ ] Movimiento de cámara suave y continuo, sin saltos ni morphing.
- [ ] La iluminación y el color coinciden con la toma real del presentador (si no, ajusta el grading en post).
- [ ] El 12 % inferior queda limpio para subtítulos y el 8 % lateral para la interfaz de redes.
