import React, { useEffect } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COLORS, VIDEO } from "../constants";
import type { AndresState, Cam } from "../story";
import { Andres } from "./Andres";
import { Facade, Interior } from "./Barbershop";
import { ReflectCtx } from "./primitives";
import { StreetLights, StreetProps, WetGround } from "./Street";

/** Coloca la cámara en cada cuadro (todo sale del frame actual, nada de useFrame). */
const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...cam.pos);
  camera.fov = cam.fov;
  camera.near = 0.05;
  camera.far = 120;
  camera.lookAt(...cam.target);
  camera.updateProjectionMatrix();
  return null;
};

/** Entorno de estudio procedural: solo para que el cromo tenga algo que reflejar. */
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.16;
    return () => {
      scene.environment = null;
      tex.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
};

export type WorldState = {
  T: number;
  cam: Cam;
  andres: AndresState;
  lamp: number;
  interior: number;
  door: number;
  fog: number;
};

/**
 * El mundo 3D completo en un solo lienzo: barbería + calle + Andrés.
 * La copia invertida (scale y = -1) bajo el piso semitransparente es el
 * "reflejo" del piso mojado: barato de renderizar y sin texturas externas.
 */
export const Stage: React.FC<WorldState> = ({ T, cam, andres, lamp, interior, door, fog }) => (
  <ThreeCanvas
    width={VIDEO.width}
    height={VIDEO.height}
    shadows
    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
    camera={{ fov: cam.fov, position: cam.pos }}
    style={{ position: "absolute", inset: 0 }}
  >
    <color attach="background" args={[COLORS.night]} />
    <fogExp2 attach="fog" args={[COLORS.fog, fog]} />
    <Rig cam={cam} />
    <Env />
    {/* noche: relleno azul muy suave + luna */}
    <hemisphereLight args={[COLORS.moon, "#04060C", 0.3]} />
    <directionalLight position={[-6, 10, 8]} intensity={0.32} color={COLORS.moon} />

    <Interior lamp={lamp} interior={interior} T={T} />
    <Facade door={door} lamp={lamp} interior={interior} T={T} />
    <StreetProps T={T} />
    <StreetLights door={door} interior={interior} />
    <Andres state={andres} />
    <WetGround door={door} interior={interior} lamp={lamp} />

    {/* reflejo en el piso mojado */}
    <ReflectCtx.Provider value={true}>
      <group scale={[1, -1, 1]}>
        <Facade door={door} lamp={lamp} interior={interior} T={T} />
        <StreetProps T={T} />
        {andres.pos[2] > -0.3 ? <Andres state={andres} /> : null}
      </group>
    </ReflectCtx.Provider>
  </ThreeCanvas>
);
