import * as THREE from "three";
import { Easing } from "remotion";

export type V3 = [number, number, number];
export type Cam = { pos: V3; target: V3; fov: number };
export type Key = { t: number; pos: V3; target: V3; fov?: number; ease?: (x: number) => number };

const inout = Easing.bezier(0.65, 0, 0.35, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Interpola keyframes de cámara (posición, objetivo y fov) con ease in-out entre cada par. */
export const camAt = (keys: Key[], t: number): Cam => {
  if (t <= keys[0].t) return { pos: keys[0].pos, target: keys[0].target, fov: keys[0].fov ?? 36 };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const k = (b.ease ?? inout)((t - a.t) / (b.t - a.t));
      return { pos: lerp3(a.pos, b.pos, k), target: lerp3(a.target, b.target, k), fov: lerp(a.fov ?? 36, b.fov ?? 36, k) };
    }
  }
  const z = keys[keys.length - 1];
  return { pos: z.pos, target: z.target, fov: z.fov ?? 36 };
};

const tmp = new THREE.PerspectiveCamera();
/** Proyecta un punto del mundo a píxeles del lienzo (para etiquetas HTML sobre el 3D). */
export const toScreen = (p: V3, cam: Cam, w = 1080, h = 1920) => {
  tmp.fov = cam.fov;
  tmp.aspect = w / h;
  tmp.near = 0.1;
  tmp.far = 300;
  tmp.position.set(...cam.pos);
  tmp.lookAt(...cam.target);
  tmp.updateMatrixWorld();
  tmp.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(tmp);
  return { x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h, visible: v.z < 1 };
};
