import React, { useEffect, useMemo, useRef, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export type V3 = [number, number, number];
export type Cam = { pos: V3; target: V3; fov: number };

/* ---------------- carga con espera de Remotion ---------------- */
const cache = new Map<string, Promise<unknown>>();
const once = <T,>(key: string, load: () => Promise<T>) => {
  if (!cache.has(key)) cache.set(key, load());
  return cache.get(key) as Promise<T>;
};
const done = new Map<string, unknown>();

/** Carga un recurso una sola vez; retiene el render hasta tenerlo y redibujar el cuadro 3D. */
const useAsset = <T,>(key: string, load: () => Promise<T>): T | null => {
  const [val, setVal] = useState<T | null>((done.get(key) as T) ?? null);
  const handle = useRef<number | null>(null);
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (val) return;
    handle.current = delayRender(`carga ${key}`, { timeoutInMilliseconds: 280000 });
    let alive = true;
    once(key, load).then((v) => {
      done.set(key, v);
      if (alive) setVal(v);
      else if (handle.current !== null) continueRender(handle.current);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!val || handle.current === null) return;
    const h = handle.current;
    handle.current = null;
    setTimeout(() => {
      advance(performance.now());
      continueRender(h);
    }, 0);
  }, [val, advance]);
  return val;
};

const loadGltf = () =>
  new Promise<THREE.Group>((resolve, reject) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath(staticFile("draco/") + (staticFile("draco/").endsWith("/") ? "" : "/"));
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.load(staticFile("car/ferrari.glb"), (g) => resolve(g.scene.children[0] as THREE.Group), undefined, reject);
  });
const loadAo = () => new THREE.TextureLoader().loadAsync(staticFile("car/ferrari_ao.png"));
const loadHdr = () =>
  new RGBELoader().loadAsync(staticFile("car/venice_sunset_1k.hdr")).then((t) => {
    t.mapping = THREE.EquirectangularReflectionMapping;
    return t;
  });

/* ---------------- cámara y entorno ---------------- */
const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...cam.pos);
  camera.fov = cam.fov;
  camera.near = 0.02;
  camera.far = 600;
  camera.lookAt(...cam.target);
  camera.updateProjectionMatrix();
  return null;
};

/** Mapa de entorno HDR (atardecer real) para reflejos de pintura, vidrio y rines. */
const Env: React.FC<{ intensity: number; rotation: number }> = ({ intensity, rotation }) => {
  const { gl, scene } = useThree();
  const hdr = useAsset("hdr", loadHdr);
  const env = useMemo(() => {
    if (!hdr) return null;
    const pm = new THREE.PMREMGenerator(gl);
    const t = pm.fromEquirectangular(hdr).texture;
    pm.dispose();
    return t;
  }, [hdr, gl]);
  if (env) {
    scene.environment = env;
    scene.environmentIntensity = intensity;
    scene.environmentRotation.set(0, rotation, 0);
  }
  return null;
};

export const CarStage: React.FC<{ cam: Cam; children: React.ReactNode; env?: number; envRot?: number; exposure?: number }> = ({ cam, children, env = 1, envRot = 0, exposure = 1 }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure }}
      camera={{ fov: cam.fov, position: cam.pos }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Env intensity={env} rotation={envRot} />
      <Rig cam={cam} />
      {children}
    </ThreeCanvas>
  );
};

/* ---------------- el carro ---------------- */
/**
 * Ferrari 458 Italia (modelo de vicent091036, CC BY 4.0, vía los ejemplos de three.js) con pintura
 * de laca: color + barniz transparente. El frente mira hacia −z. `spin` gira las ruedas (radianes),
 * `lights` ilumina en rojo detrás de las luces traseras, `shadow` es la sombra de contacto horneada.
 */
export const Ferrari: React.FC<{ position?: V3; rotation?: V3; scale?: number; spin?: number; paint?: string; lights?: number; shadow?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  spin = 0,
  paint = "#A30B14",
  lights = 0,
  shadow = 1,
}) => {
  const src = useAsset("ferrari", loadGltf);
  const ao = useAsset("ao", loadAo);
  const model = useMemo(() => {
    if (!src) return null;
    const m = src.clone(true);
    const body = new THREE.MeshPhysicalMaterial({ color: paint, metalness: 0.6, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.03 });
    const details = new THREE.MeshStandardMaterial({ color: "#C9CDD2", metalness: 1, roughness: 0.25 });
    const glass = new THREE.MeshPhysicalMaterial({ color: "#0B0E12", metalness: 0.2, roughness: 0, transparent: true, opacity: 0.55, clearcoat: 1 });
    (m.getObjectByName("body") as THREE.Mesh).material = body;
    for (const n of ["rim_fl", "rim_fr", "rim_rr", "rim_rl", "trim"]) {
      const o = m.getObjectByName(n) as THREE.Mesh | undefined;
      if (o) o.material = details;
    }
    (m.getObjectByName("glass") as THREE.Mesh).material = glass;
    m.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    return m;
  }, [src, paint]);
  if (!model) return null;
  for (const n of ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"]) {
    const w = model.getObjectByName(n);
    if (w) w.rotation.x = spin;
  }
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
      {ao && shadow > 0 ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} renderOrder={2}>
          <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
          <meshBasicMaterial map={ao} blending={THREE.MultiplyBlending} toneMapped={false} transparent premultipliedAlpha opacity={shadow} depthWrite={false} />
        </mesh>
      ) : null}
      {lights > 0 ? (
        <>
          {[-0.6, 0.6].map((x) => (
            <pointLight key={x} position={[x, 0.75, 2.45]} intensity={4 * lights} distance={3.5} color="#FF1A1A" />
          ))}
        </>
      ) : null}
    </group>
  );
};
