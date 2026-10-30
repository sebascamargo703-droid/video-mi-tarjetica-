import React from "react";

/** Código QR decorativo (no escaneable): 3 marcas de posición + módulos pseudoaleatorios. */
export const QrCode: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const n = 21;
  const finders = [
    [0, 0],
    [14, 0],
    [0, 14],
  ];
  const inFinder = (x: number, y: number) => finders.some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (!inFinder(x, y) && (x * 31 + y * 17 + x * y * 7) % 5 < 2) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} style={{ display: "block" }} shapeRendering="crispEdges">
      <g fill={color}>
        {finders.map(([fx, fy]) => (
          <g key={`${fx}-${fy}`}>
            <path d={`M${fx} ${fy} h7 v7 h-7 Z M${fx + 1} ${fy + 1} v5 h5 v-5 Z`} fillRule="evenodd" />
            <rect x={fx + 2} y={fy + 2} width={3} height={3} />
          </g>
        ))}
        {cells}
      </g>
    </svg>
  );
};
