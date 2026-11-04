import React, { useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";

type V3 = [number, number, number];

/* ---------------- texturas desde public/screens ---------------- */
const cache = new Map<string, Promise<THREE.Texture>>();
const loadTex = (src: string) => {
  if (!cache.has(src)) {
    cache.set(
      src,
      new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
          staticFile(src),
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 8;
            resolve(t);
          },
          undefined,
          reject,
        );
      }),
    );
  }
  return cache.get(src)!;
};
const ready = new Map<string, THREE.Texture>();

/** Textura de una imagen; retiene el render hasta que está cargada y dibujada (como useCanvasTexture). */
export const useTex = (src: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(ready.get(src) ?? null);
  const handle = useRef<number | null>(null);
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (tex) return;
    handle.current = delayRender(`textura ${src}`);
    let alive = true;
    loadTex(src).then((t) => {
      ready.set(src, t);
      if (alive) setTex(t);
      else if (handle.current !== null) continueRender(handle.current);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
  useEffect(() => {
    if (!tex || handle.current === null) return;
    const h = handle.current;
    handle.current = null;
    setTimeout(() => {
      advance(performance.now());
      continueRender(h);
    }, 0);
  }, [tex, advance]);
  return tex;
};

/* ---------------- geometría ---------------- */
const rrShape = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};
/** Rectángulo redondeado plano con UV 0–1 (para pantallas). */
export const roundedPlane = (w: number, h: number, r: number) => {
  const g = new THREE.ShapeGeometry(rrShape(w, h, r), 12);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
};
const slab = (w: number, h: number, r: number, depth: number, bevel: number, hole?: { x: number; y: number; r: number }) => {
  const shape = rrShape(w - bevel * 2, h - bevel * 2, Math.max(0.001, r - bevel));
  if (hole) {
    const p = new THREE.Path();
    p.absarc(hole.x, hole.y, hole.r, 0, Math.PI * 2, true);
    shape.holes.push(p);
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 12 });
  g.translate(0, 0, -depth / 2);
  return g;
};

/* ---------------- pantalla con fundidos ---------------- */
export type Layer = [src: string, opacity: number];
const ScreenLayer: React.FC<{ src: string; o: number; geo: THREE.BufferGeometry; z: number; brightness: number }> = ({ src, o, geo, z, brightness }) => {
  const tex = useTex(src);
  if (!tex || o <= 0.001) return null;
  return (
    <mesh geometry={geo} position={[0, 0, z]} renderOrder={5}>
      <meshBasicMaterial map={tex} transparent opacity={o} toneMapped={false} color={new THREE.Color(brightness, brightness, brightness)} depthWrite={false} />
    </mesh>
  );
};
const Screen: React.FC<{ layers: Layer[]; geo: THREE.BufferGeometry; z: number; brightness?: number }> = ({ layers, geo, z, brightness = 1 }) => (
  <>
    {layers.map(([src, o], i) => (
      <ScreenLayer key={src} src={src} o={o} geo={geo} z={z + i * 0.0006} brightness={brightness} />
    ))}
  </>
);

/* ---------------- celular ---------------- */
export const PHONE_W = 0.76;
export const PHONE_H = PHONE_W * 2.06;
export const Phone3D: React.FC<{ position?: V3; rotation?: V3; scale?: number; screens: Layer[]; frame?: string; brightness?: number; glow?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screens,
  frame = "#2B3036",
  brightness = 1,
  glow = 0,
}) => {
  const body = useMemo(() => slab(PHONE_W, PHONE_H, 0.125, 0.05, 0.014), []);
  const front = useMemo(() => roundedPlane(PHONE_W - 0.028, PHONE_H - 0.028, 0.112), []);
  const scr = useMemo(() => roundedPlane(PHONE_W * (665 / 720), PHONE_H * (1428 / 1483), 0.098), []);
  const z = 0.025 + 0.014;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={body} castShadow>
        <meshStandardMaterial color={frame} metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh geometry={front} position={[0, 0, z + 0.0005]}>
        <meshStandardMaterial color="#050607" roughness={0.15} metalness={0.2} />
      </mesh>
      <Screen layers={screens} geo={scr} z={z + 0.0015} brightness={brightness} />
      {/* isla */}
      <mesh position={[0, PHONE_H / 2 - 0.072, z + 0.004]} renderOrder={8}>
        <planeGeometry args={[0.2, 0.052]} />
        <meshBasicMaterial color="#000" transparent opacity={0.98} depthWrite={false} />
      </mesh>
      {/* vidrio: reflejo de estudio */}
      <mesh geometry={front} position={[0, 0, z + 0.005]} renderOrder={9}>
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.05} metalness={0} clearcoat={1} depthWrite={false} />
      </mesh>
      {glow > 0 ? (
        <pointLight position={[0, 0, 0.6]} intensity={2.5 * glow} distance={3} color="#8FE3C0" />
      ) : null}
      {/* cámaras traseras */}
      <mesh position={[-0.2, PHONE_H / 2 - 0.2, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
        <meshStandardMaterial color="#1a1c1f" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};

/* ---------------- tablet ---------------- */
export const TAB_W = 1.9;
export const TAB_H = TAB_W * (860 / 1280) + 0.12;
export const Tablet3D: React.FC<{ position?: V3; rotation?: V3; scale?: number; screens: Layer[]; stand?: boolean }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, screens, stand = true }) => {
  const W = TAB_W + 0.12;
  const body = useMemo(() => slab(W, TAB_H, 0.1, 0.045, 0.012), [W]);
  const scr = useMemo(() => roundedPlane(TAB_W, TAB_W * (860 / 1280), 0.03), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={body} castShadow>
        <meshStandardMaterial color="#1C1F23" metalness={0.7} roughness={0.35} />
      </mesh>
      <Screen layers={screens} geo={scr} z={0.0375} />
      <mesh position={[0, 0, 0.042]} renderOrder={9}>
        <planeGeometry args={[TAB_W, TAB_W * (860 / 1280)]} />
        <meshPhysicalMaterial color="#fff" transparent opacity={0.06} roughness={0.05} clearcoat={1} depthWrite={false} />
      </mesh>
      {stand ? (
        <group position={[0, -TAB_H / 2 + 0.05, -0.25]}>
          <mesh rotation={[0.35, 0, 0]} position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.5, 0.6, 0.04]} />
            <meshStandardMaterial color="#9AA2A9" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.5, 0.1]} castShadow>
            <boxGeometry args={[0.8, 0.04, 0.6]} />
            <meshStandardMaterial color="#9AA2A9" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

/* ---------------- láminas y piezas con textura ---------------- */
/** Imagen con transparencia sobre un plano (logo, notificación flotante, sellos redondos). */
export const Plate: React.FC<{ src: string; w: number; h: number; position?: V3; rotation?: V3; scale?: number; opacity?: number; lit?: boolean }> = ({ src, w, h, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1, lit = false }) => {
  const tex = useTex(src);
  if (!tex) return null;
  return (
    <mesh position={position} rotation={rotation} scale={scale} renderOrder={6}>
      <planeGeometry args={[w, h]} />
      {lit ? (
        <meshStandardMaterial map={tex} transparent opacity={opacity} roughness={0.4} side={THREE.DoubleSide} />
      ) : (
        <meshBasicMaterial map={tex} transparent opacity={opacity} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
      )}
    </mesh>
  );
};

/** Tarjeta gruesa con imagen al frente (tarjeta de sellos, mini tarjetas, letrero QR). */
export const Card3D: React.FC<{ src: string; w: number; h: number; r?: number; depth?: number; position?: V3; rotation?: V3; scale?: number; tint?: THREE.ColorRepresentation; back?: string }> = ({
  src,
  w,
  h,
  r = 0.06,
  depth = 0.02,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  tint = "#ffffff",
  back = "#1F2A33",
}) => {
  const tex = useTex(src);
  const body = useMemo(() => slab(w, h, r, depth, Math.min(0.008, depth / 3)), [w, h, r, depth]);
  const face = useMemo(() => roundedPlane(w, h, r), [w, h, r]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial color={back} roughness={0.5} />
      </mesh>
      {tex ? (
        <mesh geometry={face} position={[0, 0, depth / 2 + Math.min(0.008, depth / 3) + 0.001]}>
          <meshPhysicalMaterial map={tex} color={tint} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.2} />
        </mesh>
      ) : null}
    </group>
  );
};

/** Moneda / medalla con imagen en ambas caras. */
export const Disc3D: React.FC<{ src: string; r: number; t?: number; position?: V3; rotation?: V3; scale?: number; edge?: string; metal?: boolean; emissive?: number }> = ({
  src,
  r,
  t = 0.08,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  edge = "#E8B84A",
  metal = true,
  emissive = 0,
}) => {
  const tex = useTex(src);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[r, r, t, 64]} />
        <meshStandardMaterial color={edge} metalness={metal ? 1 : 0.1} roughness={metal ? 0.25 : 0.5} emissive={edge} emissiveIntensity={emissive} />
      </mesh>
      {tex
        ? [1, -1].map((side) => (
            <mesh key={side} position={[0, 0, (side * t) / 2 + side * 0.001]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
              <circleGeometry args={[r, 64]} />
              <meshStandardMaterial map={tex} transparent roughness={metal ? 0.3 : 0.5} metalness={metal ? 0.35 : 0} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.25 + emissive} />
            </mesh>
          ))
        : null}
    </group>
  );
};

/** Piso brillante (refleja la luz de estudio) que recibe sombras. */
export const GlossFloor: React.FC<{ y?: number; color?: string }> = ({ y = 0, color = "#0A1311" }) => (
  <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[60, 60]} />
    <meshLambertMaterial color={color} />
  </mesh>
);

/** Mesón (mostrador) de madera oscura con borde de piedra clara. */
export const Counter: React.FC<{ position?: V3; w?: number; d?: number; top?: string; body?: string }> = ({ position = [0, 0, 0], w = 8, d = 2.4, top = "#23282C", body = "#1E1712" }) => (
  <group position={position}>
    <mesh position={[0, -0.06, 0]} receiveShadow castShadow>
      <boxGeometry args={[w, 0.12, d]} />
      <meshPhysicalMaterial color={top} roughness={0.45} specularIntensity={0.25} />
    </mesh>
    <mesh position={[0, -0.75, 0.05]} receiveShadow>
      <boxGeometry args={[w - 0.1, 1.3, d - 0.1]} />
      <meshLambertMaterial color={body} />
    </mesh>
  </group>
);

/* ---------------- lavadora ---------------- */
export const Washer3D: React.FC<{ spin: number; shake?: number; cardTex: THREE.Texture | null; position?: V3 }> = ({ spin, shake = 0, cardTex, position = [0, 0, 0] }) => {
  const W = 2;
  const H = 2.3;
  const D = 1.7;
  const doorY = -0.12;
  const R = 0.66;
  const clothes = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        a: (i / 9) * Math.PI * 2,
        rr: 0.3 + (i % 3) * 0.1,
        s: 0.13 + ((i * 37) % 10) / 120,
        c: ["#2F4A6E", "#1E2B3E", "#3C5B85", "#2B2F36", "#6E7C8C"][i % 5],
      })),
    [],
  );
  return (
    <group position={[position[0] + Math.sin(shake * 40) * 0.015 * shake, position[1], position[2]]}>
      {/* cuerpo */}
      <mesh geometry={useMemo(() => slab(W, H, 0.12, D - 0.1, 0.05, { x: 0, y: doorY, r: R + 0.04 }), [])} position={[0, 0, -D / 2]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ECEFF1" roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>
      {/* panel de control */}
      <mesh position={[0, H / 2 - 0.2, 0.005]}>
        <planeGeometry args={[W - 0.2, 0.26]} />
        <meshStandardMaterial color="#D5DADF" roughness={0.4} />
      </mesh>
      <mesh position={[0.62, H / 2 - 0.2, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 32]} />
        <meshStandardMaterial color="#B9C0C6" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[-0.35, H / 2 - 0.2, 0.01]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial color="#0E1A17" toneMapped={false} />
      </mesh>
      <mesh position={[-0.35, H / 2 - 0.2, 0.012]}>
        <planeGeometry args={[0.2, 0.05]} />
        <meshBasicMaterial color="#69D3BE" toneMapped={false} />
      </mesh>
      {/* tambor: hueco oscuro con ropa y la tarjeta girando */}
      <group position={[0, doorY, -0.35]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R, R, 0.7, 48, 1, true]} />
          <meshStandardMaterial color="#8E979F" metalness={0.9} roughness={0.35} side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, 0, -0.34]}>
          <circleGeometry args={[R, 48]} />
          <meshStandardMaterial color="#3A4148" metalness={0.8} roughness={0.4} />
        </mesh>
        <group rotation={[0, 0, spin]}>
          {clothes.map((c, i) => (
            <mesh key={i} position={[Math.cos(c.a) * c.rr, Math.sin(c.a) * c.rr - 0.05, -0.32 - (i % 3) * 0.06]} scale={[c.s * 1.7, c.s, c.s]} rotation={[0, 0, c.a]}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={c.c} roughness={0.95} />
            </mesh>
          ))}
          {cardTex ? (
            <mesh position={[0.05, -0.12, 0.12]} rotation={[0.05, 0.1, 0.35]}>
              <planeGeometry args={[0.74, 0.46]} />
              <meshStandardMaterial map={cardTex} roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
          ) : null}
        </group>
        <pointLight position={[0, 0.3, 0.3]} intensity={1.2} distance={2} color="#DDEBFF" />
      </group>
      {/* aro de la puerta */}
      <mesh position={[0, doorY, 0.06]}>
        <torusGeometry args={[0.75, 0.085, 24, 64]} />
        <meshStandardMaterial color="#C5CCD2" metalness={0.95} roughness={0.18} />
      </mesh>
      {/* vidrio */}
      <mesh position={[0, doorY, 0.08]} renderOrder={9}>
        <circleGeometry args={[0.7, 64]} />
        <meshPhysicalMaterial color="#B8D4E8" transparent opacity={0.18} roughness={0.02} clearcoat={1} depthWrite={false} />
      </mesh>
    </group>
  );
};

/** Poste de barbería (cilindro de vidrio con franjas que giran). */
export const BarberPole: React.FC<{ position: V3; t: number; scale?: number }> = ({ position, t, scale = 1 }) => {
  const tex = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = 256;
    cv.height = 256;
    const c = cv.getContext("2d")!;
    c.fillStyle = "#fff";
    c.fillRect(0, 0, 256, 256);
    const cols = ["#D7263D", "#ffffff", "#1B4F9C", "#ffffff"];
    for (let i = -8; i < 16; i++) {
      c.fillStyle = cols[((i % 4) + 4) % 4];
      c.beginPath();
      c.moveTo(i * 32, 0);
      c.lineTo(i * 32 + 32, 0);
      c.lineTo(i * 32 + 32 + 128, 256);
      c.lineTo(i * 32 + 128, 256);
      c.fill();
    }
    const tx = new THREE.CanvasTexture(cv);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    tx.repeat.set(1, 2);
    return tx;
  }, []);
  tex.offset.y = -t * 0.6;
  return (
    <group position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.9, 32]} />
        <meshStandardMaterial map={tex} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      {[0.5, -0.5].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          <meshStandardMaterial color="#C5CCD2" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};
