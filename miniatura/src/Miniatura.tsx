import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Html5Audio, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_INOUT, clamp } from "./motion";
import { CarStage, Ferrari, type Cam, type V3 } from "./three";

/**
 * "Miniatura": un Ferrari a escala sobre el borde de la ventana de un tren (paisaje pasando,
 * efecto tilt-shift) que de pronto es real: túnel con luces y autopista de noche con la ciudad.
 * Sin textos ni voz; solo música y efectos.
 */
export const FPS = 30;
export const DURATION_SEC = 11;
export const CUT1 = 4.0; // ventana → túnel
export const CUT2 = 7.6; // túnel → autopista

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const ease = (x: number) => EASE_INOUT(Math.max(0, Math.min(1, x)));

/* ------------------------------------------------------------------ */
/* 1 · Miniatura en la ventana del tren */

/** Paisaje que pasa por la ventana: capas de colinas y árboles con desenfoque de movimiento. */
const Landscape: React.FC<{ t: number; dark: number }> = ({ t, dark }) => {
  const layer = (speed: number, seed: string, color: string, top: number, h: number, blur: number, n: number, kind: "hill" | "tree") => {
    const span = 2400;
    const off = (t * speed) % span;
    return (
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: h, overflow: "hidden", filter: `blur(${blur}px)` }}>
        {[0, 1].map((rep) =>
          Array.from({ length: n }).map((_, i) => {
            const x = ((i / n) * span + random(`${seed}${i}`) * 140 + off - rep * span) % (span * 2) - 300;
            const w = kind === "hill" ? 500 + random(`${seed}w${i}`) * 500 : 120 + random(`${seed}w${i}`) * 160;
            const hh = kind === "hill" ? h * (0.55 + random(`${seed}h${i}`) * 0.45) : h * (0.5 + random(`${seed}h${i}`) * 0.5);
            return (
              <div
                key={`${rep}-${i}`}
                style={{
                  position: "absolute",
                  left: x,
                  bottom: kind === "tree" ? -10 : -h * 0.2,
                  width: w,
                  height: hh,
                  borderRadius: kind === "hill" ? "50% 50% 0 0 / 100% 100% 0 0" : "45% 45% 30% 30%",
                  background: `radial-gradient(ellipse at 40% 30%, ${color}, rgba(0,0,0,0.25) 140%)`,
                  opacity: 0.95,
                }}
              />
            );
          }),
        )}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #BFD9EA 0%, #D5E6E4 28%, #8DB574 52%, #4F8A3C 100%)", filter: `brightness(${1 - 0.85 * dark})` }}>
      {layer(380, "far", "#86AE6E", 380, 560, 10, 6, "hill")}
      {layer(900, "mid", "#5A8F3F", 520, 620, 14, 7, "hill")}
      {layer(2200, "near", "#3C6E2A", 640, 640, 22, 14, "tree")}
      {/* postes que pasan muy rápido */}
      {[0, 1].map((i) => {
        const x = ((t * 3800 + i * 1900) % 3800) - 600;
        return <div key={i} style={{ position: "absolute", left: x, top: 0, width: 70, height: 1500, background: "linear-gradient(90deg, rgba(200,205,210,0), rgba(225,228,232,0.85) 40%, rgba(200,205,210,0))", filter: "blur(14px)" }} />;
      })}
      {/* rayas de velocidad */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 60px)", transform: `translateX(${(t * 1800) % 60}px)`, mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};

/** Borde de ventana (alféizar) de plástico con textura fina. */
const Sill: React.FC = () => {
  const tex = React.useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 512;
    const c = cv.getContext("2d")!;
    c.fillStyle = "#CFC8BE";
    c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4000; i++) {
      const v = 180 + Math.floor(random(`g${i}`) * 50);
      c.fillStyle = `rgba(${v},${v - 6},${v - 14},0.25)`;
      c.fillRect(random(`gx${i}`) * 512, random(`gy${i}`) * 512, 2, 2);
    }
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 2);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <group>
      <mesh position={[0, -0.6, 0.4]} receiveShadow>
        <boxGeometry args={[60, 1.2, 4.8]} />
        <meshStandardMaterial map={tex} color="#E4DDD2" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.6, 2.8]} rotation={[0, 0, Math.PI / 2]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 60, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial map={tex} color="#E4DDD2" roughness={0.5} />
      </mesh>
      {/* pared interior del vagón, debajo del borde */}
      <mesh position={[0, -4.8, 3.1]} receiveShadow>
        <boxGeometry args={[60, 7.2, 0.2]} />
        <meshStandardMaterial color="#3E4248" roughness={0.6} />
      </mesh>
      {/* sello de caucho al pie del vidrio */}
      <mesh position={[0, 0.08, -1.95]}>
        <boxGeometry args={[60, 0.16, 0.25]} />
        <meshStandardMaterial color="#1B1D20" roughness={0.8} />
      </mesh>
    </group>
  );
};

const WindowScene: React.FC = () => {
  const { t } = useT();
  const k = ease(t / CUT1);
  const rumble = Math.sin(t * 41) * 0.008 + Math.sin(t * 23) * 0.006;
  const cam: Cam = { pos: lerp3([14.5, 1.75 + rumble, 11.0], [12.2, 1.5 + rumble, 9.4], k), target: [0.3, 0.75 + rumble * 0.5, 0], fov: 30 };
  const dark = ease((t - (CUT1 - 0.55)) / 0.5);
  if (t > CUT1 + 0.1) return null;
  return (
    <AbsoluteFill>
      <Landscape t={t} dark={dark} />
      {/* reflejo tenue del vidrio */}
      <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0) 80%)" }} />
      {/* muro del túnel que entra desde la izquierda */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, #0C0D0F 0%, #24272B 70%, rgba(36,39,43,0) 100%)", transform: `translateX(${-1300 + 1500 * ease((t - (CUT1 - 0.7)) / 0.6)}px)`, filter: "blur(10px)" }} />
      <CarStage cam={cam} env={1.05} envRot={1.2} exposure={1.05}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[-6, 9, -8]} intensity={2.4 * (1 - 0.8 * dark)} color="#FFF3DF" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
        <Sill />
        <Ferrari rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0.45]} />
      </CarStage>
      {/* poste del marco de la ventana (derecha) */}
      <div style={{ position: "absolute", right: -40, top: 0, width: 150, height: 1920, background: "linear-gradient(90deg, #2A2C30, #0D0E10 60%)", boxShadow: "-20px 0 40px rgba(0,0,0,0.45)", filter: "blur(2px)" }} />
      {/* tilt-shift: arriba y abajo desenfocados */}
      <AbsoluteFill style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", maskImage: "linear-gradient(180deg, black 0%, transparent 40%, transparent 60%, black 100%)", WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 40%, transparent 60%, black 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: dark }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · El carro es real: túnel */
const SPEED = 26; // m/s del mundo pasando

const TunnelScene: React.FC = () => {
  const { t } = useT();
  if (t < CUT1 - 0.05 || t > CUT2 + 0.1) return null;
  const lt = t - CUT1;
  const k = ease(lt / (CUT2 - CUT1));
  const sway = Math.sin(lt * 1.3) * 0.12;
  const cam: Cam = { pos: lerp3([11.5, 1.35, 5.2], [9.8, 1.75, 7.0], k), target: [0.4, 0.7, 0.2 + sway * 0.3], fov: 34 };
  const off = (lt * SPEED) % 6;
  const flash = interpolate(lt, [0, 0.06, 0.35], [1, 0.8, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#07080A" }}>
      <CarStage cam={cam} env={0.35} envRot={2.4} exposure={1.15}>
        <ambientLight intensity={0.12} />
        {/* piso */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 14]} />
          <meshStandardMaterial color="#25272A" roughness={0.42} metalness={0.15} />
        </mesh>
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-60 + i * 6 + off, 0.005, -1.9]}>
            <planeGeometry args={[3, 0.12]} />
            <meshBasicMaterial color="#D9D5C9" />
          </mesh>
        ))}
        {/* paredes y techo */}
        <mesh position={[0, 2.6, -5.2]}>
          <boxGeometry args={[200, 5.2, 0.2]} />
          <meshStandardMaterial color="#3B3E42" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.6, 10.5]}>
          <boxGeometry args={[200, 5.2, 0.2]} />
          <meshStandardMaterial color="#34373B" roughness={0.8} />
        </mesh>
        <mesh position={[0, 5.2, 2.6]}>
          <boxGeometry args={[200, 0.2, 16]} />
          <meshStandardMaterial color="#1C1E21" roughness={0.9} />
        </mesh>
        {/* franjas de luz que pasan */}
        {Array.from({ length: 28 }).map((_, i) => {
          const x = -80 + i * 6 + off;
          return (
            <group key={i}>
              <mesh position={[x, 3.4, -5.08]}>
                <planeGeometry args={[4.2, 0.16]} />
                <meshBasicMaterial color="#E9F2FF" toneMapped={false} />
              </mesh>
              <mesh position={[x, 5.08, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4.2, 0.22]} />
                <meshBasicMaterial color="#FFE7C2" toneMapped={false} />
              </mesh>
            </group>
          );
        })}
        {[0, 1, 2].map((i) => (
          <pointLight key={i} position={[((i * 6 + off * 1) % 18) - 9, 4.6, 0.6]} intensity={14} distance={10} color="#FFE2B8" />
        ))}
        <pointLight position={[2, 3.2, -4.5]} intensity={8} distance={9} color="#CFE2FF" />
        <Ferrari rotation={[0, Math.PI / 2, 0]} position={[0, 0, sway]} spin={lt * 22} lights={1} />
      </CarStage>
      {/* desenfoque de movimiento en los bordes */}
      <AbsoluteFill style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", maskImage: "radial-gradient(ellipse 60% 45% at 50% 55%, transparent 55%, black 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 45% at 50% 55%, transparent 55%, black 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.55, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · Autopista de noche con la ciudad al fondo */
const Skyline: React.FC<{ t: number }> = ({ t }) => {
  const shift = -t * 18;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #05070D 0%, #0E1830 30%, #24304E 44%, #3A2E44 52%, #12131A 70%, #0A0B0E 100%)" }}>
      <div style={{ position: "absolute", left: shift - 200, top: 560, width: 1600, height: 260 }}>
        {Array.from({ length: 46 }).map((_, i) => {
          const w = 24 + random(`bw${i}`) * 50;
          const h = 40 + random(`bh${i}`) * (i % 9 === 0 ? 230 : 120);
          const x = i * 34 + random(`bx${i}`) * 12;
          return (
            <div key={i} style={{ position: "absolute", left: x, bottom: 0, width: w, height: h, background: "#0D111B" }}>
              {Array.from({ length: Math.floor(h / 14) }).map((__, r) =>
                Array.from({ length: Math.max(1, Math.floor(w / 10)) }).map((___, c) =>
                  random(`win${i}-${r}-${c}`) > 0.55 ? <div key={`${r}-${c}`} style={{ position: "absolute", left: 3 + c * 10, top: 5 + r * 14, width: 4, height: 6, background: random(`wc${i}${r}${c}`) > 0.3 ? "#FFD79A" : "#BFD8FF", opacity: 0.85 }} /> : null,
                ),
              )}
            </div>
          );
        })}
      </div>
      {/* bokeh de luces de la ciudad */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: ((random(`kx${i}`) * 1300 + shift * 1.6) % 1300) - 110,
            top: 660 + random(`ky${i}`) * 180,
            width: 18 + random(`ks${i}`) * 34,
            height: 18 + random(`ks${i}`) * 34,
            borderRadius: "50%",
            background: random(`kc${i}`) > 0.5 ? "rgba(255,200,120,0.55)" : "rgba(170,205,255,0.45)",
            filter: "blur(3px)",
          }}
        />
      ))}
      <AbsoluteFill style={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }} />
    </AbsoluteFill>
  );
};

const HighwayScene: React.FC = () => {
  const { t } = useT();
  if (t < CUT2 - 0.05) return null;
  const lt = t - CUT2;
  const k = ease(lt / (DURATION_SEC - CUT2));
  const sway = Math.sin(lt * 1.1) * 0.15;
  const cam: Cam = { pos: lerp3([11.5, 1.7, 7.5], [3.0, 1.45, 12.0], k), target: [0.2, 0.8, 0.2], fov: 33 };
  const off = (lt * SPEED) % 8;
  const fadeIn = interpolate(lt, [0, 0.25], [0, 1], clamp);
  const fadeOut = interpolate(t, [DURATION_SEC - 0.6, DURATION_SEC], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <Skyline t={lt} />
      <CarStage cam={cam} env={0.45} envRot={3.6} exposure={1.1}>
        <ambientLight intensity={0.15} />
        <directionalLight position={[3, 8, 6]} intensity={0.6} color="#AFC6FF" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[200, 16]} />
          <meshStandardMaterial color="#2B2D31" roughness={0.38} metalness={0.2} />
        </mesh>
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-80 + i * 8 + off, 0.005, 2.6]}>
            <planeGeometry args={[3.2, 0.14]} />
            <meshBasicMaterial color="#E7E3D8" />
          </mesh>
        ))}
        {/* baranda metálica (atrás) */}
        {[0.55, 0.8].map((y) => (
          <mesh key={y} position={[0, y, -3.4]}>
            <boxGeometry args={[200, 0.14, 0.06]} />
            <meshStandardMaterial color="#9AA1A8" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {Array.from({ length: 50 }).map((_, i) => (
          <mesh key={i} position={[-100 + i * 4 + (off % 4), 0.4, -3.42]}>
            <boxGeometry args={[0.08, 0.8, 0.08]} />
            <meshStandardMaterial color="#6E757C" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
        {/* postes de luz que pasan */}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = -40 + i * 16 + ((lt * SPEED) % 16);
          return (
            <group key={i} position={[x, 0, -4.2]}>
              <mesh position={[0, 3, 0]}>
                <cylinderGeometry args={[0.08, 0.1, 6, 12]} />
                <meshStandardMaterial color="#3A3F45" metalness={0.7} roughness={0.4} />
              </mesh>
              <mesh position={[0, 6, 0.9]}>
                <boxGeometry args={[0.5, 0.12, 0.3]} />
                <meshBasicMaterial color="#FFE3B0" toneMapped={false} />
              </mesh>
            </group>
          );
        })}
        {[0, 1].map((i) => (
          <pointLight key={i} position={[((i * 16 + (lt * SPEED) % 16) % 32) - 16, 5.8, -3]} intensity={30} distance={14} color="#FFD9A0" />
        ))}
        <Ferrari rotation={[0, Math.PI / 2, 0]} position={[0, 0, sway]} spin={lt * 22} lights={1} />
      </CarStage>
      <AbsoluteFill style={{ backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", maskImage: "linear-gradient(90deg, black 0%, transparent 22%, transparent 78%, black 100%)", WebkitMaskImage: "linear-gradient(90deg, black 0%, transparent 22%, transparent 78%, black 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 110% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
    <Grain />
  </>
);
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: 0.07,
        mixBlendMode: "overlay",
        backgroundImage: "repeating-radial-gradient(circle at 17% 32%, #fff 0 1px, transparent 1px 3px), repeating-radial-gradient(circle at 73% 61%, #000 0 1px, transparent 1px 4px)",
        backgroundPosition: `${(frame * 37) % 200}px ${(frame * 53) % 200}px`,
        pointerEvents: "none",
      }}
    />
  );
};

export const Miniatura: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <WindowScene />
    <TunnelScene />
    <HighwayScene />
    <Grade />
    <Html5Audio src={staticFile("audio.wav")} />
  </AbsoluteFill>
);
