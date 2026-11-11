import React from "react";

type V3 = [number, number, number];

/** Anillo de cercanía (geocerca) sobre el piso, con pulso. */
export const Geofence: React.FC<{ center: V3; r: number; on: number; pulse: number; flash: number }> = ({ center, r, on, pulse, flash }) => {
  if (on <= 0.001) return null;
  return (
    <group position={[center[0], 0.07, center[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh renderOrder={3}>
        <circleGeometry args={[r * on, 72]} />
        <meshBasicMaterial color="#69D3BE" transparent opacity={(0.07 + 0.18 * flash) * on} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh renderOrder={4}>
        <ringGeometry args={[r * on - 0.14, r * on, 96]} />
        <meshBasicMaterial color="#8FE3C0" transparent opacity={0.9 * on} depthWrite={false} toneMapped={false} />
      </mesh>
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const rr = r * on * 0.82;
        return (
          <mesh key={i} position={[Math.cos(a) * rr, Math.sin(a) * rr, 0]} rotation={[0, 0, a]} renderOrder={4}>
            <planeGeometry args={[0.06, 0.4]} />
            <meshBasicMaterial color="#69D3BE" transparent opacity={0.5 * on} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
      {pulse > 0 && pulse < 1 ? (
        <mesh renderOrder={4}>
          <ringGeometry args={[r * (0.2 + pulse * 0.9) - 0.1, r * (0.2 + pulse * 0.9), 96]} />
          <meshBasicMaterial color="#8FE3C0" transparent opacity={(1 - pulse) * 0.8} depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
};
