import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender } from "remotion";
import * as THREE from "three";

/**
 * Texturas dibujadas en <canvas> (letreros, menús, ventanas, halos). Se crean después de
 * que carguen Inter y Fraunces para que el texto no salga con la fuente de respaldo.
 */
let fontsReady: Promise<unknown> | null = null;
const waitFonts = () => {
  fontsReady ??= Promise.all([
    document.fonts.load("800 80px Inter"),
    document.fonts.load("600 80px Inter"),
    document.fonts.load("italic 600 80px Fraunces"),
    document.fonts.load("700 80px Fraunces"),
  ]).catch(() => undefined);
  return fontsReady;
};

const make = (w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

/**
 * Hook: devuelve la textura cuando las fuentes están listas. Retiene el render hasta que la
 * textura existe y se volvió a dibujar el cuadro 3D con ella (si no, la foto sale sin letrero).
 */
export const useCanvasTexture = (key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const handle = useRef<number | null>(null);
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    handle.current = delayRender(`textura ${key}`);
    let alive = true;
    waitFonts().then(() => {
      if (alive) setTex(make(w, h, draw));
      else if (handle.current !== null) continueRender(handle.current);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!tex || handle.current === null) return;
    const hnd = handle.current;
    handle.current = null;
    setTimeout(() => {
      advance(performance.now());
      continueRender(hnd);
    }, 0);
  }, [tex, advance]);
  return tex;
};

/** Halo radial (para bombillos, letreros y charcos de luz; usar con AdditiveBlending). */
let glowTex: THREE.CanvasTexture | null = null;
export const getGlow = () => {
  glowTex ??= make(256, 256, (c, w) => {
    const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.45)");
    g.addColorStop(0.6, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, w);
  });
  return glowTex;
};

/** Fachada con ventanas (unas encendidas, otras apagadas). Determinista con `seed`. */
export const windowsTexture = (seed: number, cols: number, rows: number, litRatio = 0.35, warm = true) =>
  make(cols * 32, rows * 40, (c, w, h) => {
    let s = seed * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    c.fillStyle = "#0d1116";
    c.fillRect(0, 0, w, h);
    for (let r = 0; r < rows; r++)
      for (let k = 0; k < cols; k++) {
        const lit = rnd() < litRatio;
        const x = k * 32 + 7;
        const y = r * 40 + 9;
        if (lit) {
          const tone = rnd();
          c.fillStyle = warm ? (tone < 0.6 ? "#ffcf8a" : tone < 0.85 ? "#ffe2b8" : "#a9c8ff") : "#a9c8ff";
          c.globalAlpha = 0.55 + rnd() * 0.45;
        } else {
          c.fillStyle = "#1a222b";
          c.globalAlpha = 1;
        }
        c.fillRect(x, y, 18, 24);
        c.globalAlpha = 1;
      }
  });
