import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SketchCtx, type V3 } from "./City";

export type Cam = { pos: V3; target: V3; fov: number };

const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...cam.pos);
  camera.fov = cam.fov;
  camera.near = 0.03;
  camera.far = 700;
  camera.up.set(0, 1, 0);
  camera.lookAt(...cam.target);
  camera.updateProjectionMatrix();
  return null;
};

/** Lienzo 3D del tamaño del panel. `sketch` cambia todos los materiales a papel + contorno. */
export const Panel3D: React.FC<{ w: number; h: number; cam: Cam; sketch: boolean; children: React.ReactNode }> = ({ w, h, cam, sketch, children }) => {
  const fogNear = 25 + cam.pos[1] * 1.2;
  return (
    <ThreeCanvas
      width={w}
      height={h}
      shadows={!sketch}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ fov: cam.fov, position: cam.pos }}
      style={{ position: "absolute", inset: 0 }}
    >
      <SketchCtx.Provider value={sketch}>
        <Rig cam={cam} />
        {sketch ? null : (
          <>
            <fog attach="fog" args={["#EBD8BF", fogNear, fogNear + 170]} />
            <hemisphereLight args={["#D6E6F2", "#7A6A58", 1.05]} />
            <ambientLight intensity={0.25} />
            <directionalLight
              position={[-45, 42, 28]}
              intensity={2.4}
              color="#FFE2B8"
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-70}
              shadow-camera-right={70}
              shadow-camera-top={70}
              shadow-camera-bottom={-70}
              shadow-camera-near={1}
              shadow-camera-far={200}
              shadow-bias={-0.0006}
              shadow-normalBias={0.04}
            />
            <directionalLight position={[30, 20, -20]} intensity={0.5} color="#A9C8FF" />
          </>
        )}
        {children}
      </SketchCtx.Provider>
    </ThreeCanvas>
  );
};
