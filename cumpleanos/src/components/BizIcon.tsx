import React from "react";
import { business } from "../copy";

/** Ícono del negocio (línea), según `business.icon` en copy.ts. */
export const BizIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const c = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {business.icon === "nail" ? (
        <>
          <rect x="9.5" y="2.5" width="5" height="7" rx="1.2" {...c} />
          <path d="M8 9.5h8a1.5 1.5 0 0 1 1.5 1.5v8A2.5 2.5 0 0 1 15 21.5H9A2.5 2.5 0 0 1 6.5 19v-8A1.5 1.5 0 0 1 8 9.5z" {...c} />
          <path d="M9.5 13.5l2 -1.5" {...c} />
        </>
      ) : business.icon === "scissors" ? (
        <>
          <circle cx="6" cy="7" r="3" {...c} />
          <circle cx="6" cy="17" r="3" {...c} />
          <path d="M8.5 8.5L20 18M8.5 15.5L20 6" {...c} />
        </>
      ) : business.icon === "coffee" ? (
        <>
          <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" {...c} />
          <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" {...c} />
        </>
      ) : (
        <>
          <path d="M12 20c-4-2-6-5-6-9 2 0 4.5 1 6 3 1.5-2 4-3 6-3 0 4-2 7-6 9z" {...c} />
          <path d="M12 14c-1.2-2.4-1.2-5.6 0-9 1.2 3.4 1.2 6.6 0 9z" {...c} />
        </>
      )}
    </svg>
  );
};
