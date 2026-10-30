import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useVideoConfig } from "remotion";
import type { Cam } from "./camera";

const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...cam.pos);
  camera.fov = cam.fov;
  camera.near = 0.1;
  camera.far = 300;
  camera.lookAt(...cam.target);
  camera.updateProjectionMatrix();
  return null;
};

/** Lienzo 3D: noche azul con niebla, luz de luna con sombras y la cámara del plano actual. */
export const Stage: React.FC<{ cam: Cam; children: React.ReactNode; exposure?: number }> = ({ cam, children, exposure = 1.05 }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure }}
      camera={{ fov: cam.fov, position: cam.pos }}
    >
      <color attach="background" args={["#05080b"]} />
      <fog attach="fog" args={["#06090d", 30, 85]} />
      <hemisphereLight args={["#3a5488", "#0a0a0c", 0.55]} />
      <directionalLight
        position={[-18, 30, 14]}
        intensity={0.55}
        color="#a9c1ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-far={90}
        shadow-bias={-0.0005}
      />
      <Rig cam={cam} />
      {children}
    </ThreeCanvas>
  );
};
