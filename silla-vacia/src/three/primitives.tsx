import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender } from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { COLORS, type V3 } from "../constants";
import { fontsReady } from "../fonts";

/**
 * Piezas base del mundo low-poly: cajas, cilindros y texturas hechas en un <canvas>.
 * Todo es procedural: no se carga ningún modelo ni imagen externa.
 */

/** true dentro del grupo "reflejo" (la copia invertida que simula el piso mojado). */
export const ReflectCtx = createContext(false);
export const useReflect = () => useContext(ReflectCtx);

const cache = new Map<string, THREE.BufferGeometry>();
const geo = (key: string, make: () => THREE.BufferGeometry) => {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g;
};

type MatProps = {
  color: string;
  rough?: number;
  metal?: number;
  emissive?: string;
  emissiveIntensity?: number;
  env?: number;
  opacity?: number;
  flat?: boolean;
};
type MeshProps = MatProps & {
  position?: V3;
  rotation?: V3;
  scale?: number | V3;
  cast?: boolean;
  receive?: boolean;
};

const Mat: React.FC<MatProps> = ({ color, rough = 0.8, metal = 0, emissive, emissiveIntensity = 1, env = 1, opacity = 1, flat = true }) => (
  <meshStandardMaterial
    color={color}
    roughness={rough}
    metalness={metal}
    emissive={emissive ?? "#000000"}
    emissiveIntensity={emissive ? emissiveIntensity : 0}
    envMapIntensity={env}
    transparent={opacity < 1}
    opacity={opacity}
    flatShading={flat}
  />
);

/** Caja (con `radius` usa bordes redondeados). */
export const Box: React.FC<MeshProps & { size: V3; radius?: number }> = ({ size, radius = 0, position, rotation, scale, cast = true, receive = true, ...mat }) => {
  const reflect = useReflect();
  const g = radius > 0 ? geo(`rb${size}|${radius}`, () => new RoundedBoxGeometry(size[0], size[1], size[2], 2, radius)) : geo(`b${size}`, () => new THREE.BoxGeometry(size[0], size[1], size[2]));
  return (
    <mesh geometry={g} position={position} rotation={rotation} scale={scale} castShadow={cast && !reflect} receiveShadow={receive && !reflect}>
      <Mat {...mat} flat={radius > 0 ? false : mat.flat} />
    </mesh>
  );
};

/** Cilindro / cono truncado (pocos lados = low-poly). */
export const Cyl: React.FC<MeshProps & { r: number; r2?: number; h: number; seg?: number }> = ({ r, r2, h, seg = 12, position, rotation, scale, cast = true, receive = true, ...mat }) => {
  const reflect = useReflect();
  const g = geo(`c${r}|${r2 ?? r}|${h}|${seg}`, () => new THREE.CylinderGeometry(r, r2 ?? r, h, seg));
  return (
    <mesh geometry={g} position={position} rotation={rotation} scale={scale} castShadow={cast && !reflect} receiveShadow={receive && !reflect}>
      <Mat {...mat} flat={mat.flat ?? seg <= 10} />
    </mesh>
  );
};

export const Sphere: React.FC<MeshProps & { r: number; detail?: number }> = ({ r, detail = 1, position, rotation, scale, cast = true, receive = true, ...mat }) => {
  const reflect = useReflect();
  const g = geo(`s${r}|${detail}`, () => new THREE.IcosahedronGeometry(r, detail));
  return (
    <mesh geometry={g} position={position} rotation={rotation} scale={scale} castShadow={cast && !reflect} receiveShadow={receive && !reflect}>
      <Mat {...mat} />
    </mesh>
  );
};

/** Cromo: metal pulido que refleja el entorno. */
export const CHROME = { color: COLORS.chrome, metal: 1, rough: 0.2, env: 5, flat: false } as const;

/** Plano que solo emite luz (letreros, ventanas encendidas, charcos de luz). */
export const Glow: React.FC<{ size: [number, number]; position?: V3; rotation?: V3; color: string; opacity?: number; map?: THREE.Texture | null; additive?: boolean; double?: boolean }> = ({ size, position, rotation, color, opacity = 1, map, additive = true, double = false }) => (
  <mesh position={position} rotation={rotation} renderOrder={2}>
    <planeGeometry args={size} />
    <meshBasicMaterial color={color} map={map ?? undefined} transparent opacity={opacity} toneMapped={false} depthWrite={false} blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending} side={double ? THREE.DoubleSide : THREE.FrontSide} fog={false} />
  </mesh>
);

/* ───────────── Texturas en canvas ───────────── */
const toTexture = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};
const makeCanvas = (w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  return c;
};

/** Textura inmediata (sin texto): baldosas, franjas, degradados. */
export const useDrawTexture = (w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number]) =>
  useMemo(() => {
    const t = toTexture(makeCanvas(w, h, draw));
    if (repeat) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
    }
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

/** Textura con texto: espera a que carguen las fuentes de Google antes de dibujar. */
export const useTextTexture = (w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const advance = useThree((s) => s.advance);
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const handle = useRef<number | null>(null);
  useEffect(() => {
    let alive = true;
    handle.current = delayRender("Textura de letrero");
    fontsReady.then(() => {
      if (alive) setTex(toTexture(makeCanvas(w, h, draw)));
    });
    return () => {
      alive = false;
      if (handle.current !== null) continueRender(handle.current);
      handle.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (tex && handle.current !== null) {
      advance(performance.now()); // dibuja un cuadro con la textura ya puesta
      continueRender(handle.current);
      handle.current = null;
    }
  }, [tex, advance]);
  return tex;
};
