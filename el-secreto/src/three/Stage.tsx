import React, { useEffect } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useVideoConfig } from "remotion";
import type { Cam } from "./camera";

const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...cam.pos);
  camera.fov = cam.fov;
  camera.near = 0.05;
  camera.far = 200;
  camera.lookAt(...cam.target);
  camera.updateProjectionMatrix();
  return null;
};

/** Mapa de entorno de estudio: da reflejos reales al dorado y al vaso. */
const Env: React.FC<{ intensity: number }> = ({ intensity }) => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = intensity;
    return () => {
      tex.dispose();
      pm.dispose();
    };
  }, [gl, scene, intensity]);
  return null;
};

/**
 * Lienzo 3D transparente (el fondo degradado lo pone la escena en 2D detrás), con luz de estudio:
 * principal cálida, relleno frío, contraluz y mapa de entorno.
 */
export const Stage: React.FC<{ cam: Cam; children: React.ReactNode; env?: number; exposure?: number; shadows?: boolean }> = ({ cam, children, env = 0.8, exposure = 1.05, shadows = true }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows={shadows}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure }}
      camera={{ fov: cam.fov, position: cam.pos }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Env intensity={env} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 8, 6]} intensity={2.2} color="#FFF1DA" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
      <directionalLight position={[-6, 3, 2]} intensity={0.7} color="#9CC7FF" />
      <directionalLight position={[0, 4, -8]} intensity={1.4} color="#FFD98A" />
      <Rig cam={cam} />
      {children}
    </ThreeCanvas>
  );
};
