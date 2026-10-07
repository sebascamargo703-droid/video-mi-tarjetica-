import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SUBTITLE_MUTES } from "../data/timeline";
import { ACCENT_KEYWORDS, SUBTITLE_WORDS, SubtitleWord } from "../data/subtitles";
import { clamp } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { colors, fonts, springs, weights } from "../theme";

type Page = { words: (SubtitleWord & { isAccent: boolean })[]; startMs: number; endMs: number };

const MAX_WORDS = 3;
const MAX_CHARS_FOR_4 = 16;
const GAP_BREAK_MS = 220;

const normalize = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ]/g, "");

/** Marca como acento las palabras que forman alguna frase de ACCENT_KEYWORDS. */
const markAccents = (words: SubtitleWord[]) => {
  const flags = words.map((w) => w.accent);
  const norm = words.map((w) => normalize(w.text));
  for (const kw of ACCENT_KEYWORDS) {
    const parts = kw.split(" ").map(normalize);
    for (let i = 0; i + parts.length <= words.length; i++) {
      if (parts.every((p, j) => norm[i + j] === p)) parts.forEach((_, j) => (flags[i + j] = true));
    }
  }
  return words.map((w, i) => ({ ...w, isAccent: flags[i] }));
};

/**
 * Agrupa en "páginas" de 3 palabras (4 si son cortas). Corta en signos de
 * puntuación y en pausas, y nunca separa una frase clave de varias palabras.
 */
const buildPages = (all: SubtitleWord[]): Page[] => {
  const words = markAccents(all);
  const pages: Page[] = [];
  let cur: Page["words"] = [];
  const flush = () => {
    if (cur.length) pages.push({ words: cur, startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs });
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const chars = [...cur, w].reduce((a, x) => a + x.text.length, 0);
    const keepsPhrase = prev && prev.isAccent && w.isAccent;
    const full = cur.length >= MAX_WORDS && !(cur.length < 4 && chars <= MAX_CHARS_FOR_4) && !keepsPhrase;
    const gap = prev && w.startMs - prev.endMs > GAP_BREAK_MS;
    if (cur.length && (full || gap)) flush();
    cur.push(w);
    if (/[.,?!:;]$/.test(w.text)) flush();
  });
  flush();
  // cada página se queda hasta que entra la siguiente (máx. 600 ms de cola)
  return pages.map((p, i) => ({
    ...p,
    endMs: Math.min(pages[i + 1]?.startMs ?? Infinity, p.endMs + 600),
  }));
};

/**
 * Subtítulos dinámicos palabra por palabra, en el tercio inferior.
 * Palabra activa: blanco puro + escala 1.08 · resto: blanco 55%.
 * Palabras clave: color acento.
 */
export const WordSubtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, subtitleBottom, subtitleCenterX, subtitleMaxWidth, H, isVertical } = useLayout();
  const pages = useMemo(() => buildPages(SUBTITLE_WORDS), []);
  const ms = (frame / fps) * 1000;

  if (SUBTITLE_MUTES.some(([a, b]) => frame >= a && frame < b)) return null;
  const page = pages.find((p) => ms >= p.startMs && ms < p.endMs);
  if (!page) return null;

  const pageFrame = frame - Math.round((page.startMs / 1000) * fps);
  const pageIn = spring({ frame: pageFrame, fps, config: springs.smooth, durationInFrames: 8 });
  const size = (isVertical ? 66 : 58) * u;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: subtitleCenterX - subtitleMaxWidth / 2,
          width: subtitleMaxWidth,
          bottom: H - subtitleBottom,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: size * 0.3,
          fontFamily: fonts.display,
          fontWeight: weights.bold,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: fonts.tracking,
          opacity: interpolate(pageIn, [0, 1], [0, 1], clamp),
          transform: `translateY(${(1 - pageIn) * 18 * u}px)`,
          filter: `blur(${(1 - pageIn) * 6 * u}px)`,
        }}
      >
        {page.words.map((w, i) => {
          const wStart = (w.startMs / 1000) * fps;
          const active = ms >= w.startMs && ms < (page.words[i + 1]?.startMs ?? page.endMs);
          const spoken = ms >= w.startMs;
          const pop = spring({ frame: frame - wStart, fps, config: springs.settle, durationInFrames: 10 });
          const scale = active ? interpolate(pop, [0, 1], [1, 1.08]) : 1;
          const opacity = active ? 1 : 0.55;
          const color = w.isAccent ? colors.blueText : colors.white;
          return (
            <span
              key={`${w.startMs}-${i}`}
              style={{
                display: "inline-block",
                // el margen absorbe el crecimiento de la escala 1.08
                margin: `0 ${size * 0.04}px`,
                color,
                opacity: w.isAccent && spoken ? Math.max(opacity, 0.85) : opacity,
                transform: `scale(${scale})`,
                transformOrigin: "50% 80%",
                textShadow: `0 ${2 * u}px ${14 * u}px rgba(0,0,0,0.65), 0 0 ${2 * u}px rgba(0,0,0,0.35)`,
              }}
            >
              {w.text.replace(/[,]$/, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
