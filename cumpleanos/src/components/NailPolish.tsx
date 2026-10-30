import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { biz } from "../brand";
import { business } from "../copy";
import { ease } from "../motion";

/** Frasco de esmalte en SVG: vidrio con esmalte rosa empolvado, tapa dorada y brillo diagonal que lo recorre. */
export const NailPolish: React.FC<{ width: number; shineAt: number }> = ({ width, shineAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shine = ease(frame, shineAt, Math.round(fps * 1.0));
  const h = (width * 330) / 220;
  return (
    <svg width={width} height={h} viewBox="0 0 220 330" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.35))" }}>
      <defs>
        <linearGradient id="np-cap" x1="0" x2="1">
          <stop offset="0" stopColor="#9C7A45" />
          <stop offset="0.35" stopColor="#E6CC95" />
          <stop offset="0.6" stopColor={biz.accent} />
          <stop offset="1" stopColor="#8A6A3A" />
        </linearGradient>
        <linearGradient id="np-liq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1C9CC" />
          <stop offset="1" stopColor="#D8969C" />
        </linearGradient>
        <clipPath id="np-bottle">
          <rect x="22" y="128" width="176" height="196" rx="40" />
        </clipPath>
        <linearGradient id="np-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Tapa dorada */}
      <rect x="72" y="6" width="76" height="112" rx="14" fill="url(#np-cap)" />
      <rect x="82" y="14" width="10" height="96" rx="5" fill="#fff" opacity="0.35" />
      <rect x="64" y="108" width="92" height="26" rx="8" fill="#B8945A" />
      {/* Frasco */}
      <rect x="22" y="128" width="176" height="196" rx="40" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.7)" strokeWidth="3" />
      <g clipPath="url(#np-bottle)">
        <rect x="22" y="146" width="176" height="180" fill="url(#np-liq)" />
        <rect x="22" y="146" width="176" height="8" fill="#fff" opacity="0.35" />
        {/* Etiqueta */}
        <rect x="56" y="214" width="108" height="46" rx="10" fill={biz.deep} opacity="0.92" />
        <text x="110" y="244" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="17" fill="#fff" letterSpacing="0.5">
          {business.name.toUpperCase().slice(0, 12)}
        </text>
        {/* Brillo diagonal que recorre el frasco */}
        <rect x={-120 + shine * 360} y="100" width="70" height="260" fill="url(#np-shine)" transform="rotate(20 110 226)" />
        <rect x="36" y="150" width="16" height="150" rx="8" fill="#fff" opacity="0.4" />
      </g>
    </svg>
  );
};

/** Alternativa genérica para cualquier negocio: caja de regalo. */
export const GiftBox: React.FC<{ width: number }> = ({ width }) => {
  const h = (width * 300) / 240;
  return (
    <svg width={width} height={h} viewBox="0 0 240 300" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.35))" }}>
      <rect x="20" y="120" width="200" height="170" rx="18" fill={biz.primary} />
      <rect x="10" y="90" width="220" height="52" rx="14" fill="#D8969C" />
      <rect x="104" y="90" width="32" height="200" fill={biz.accent} />
      <path d="M120 90c-20-40-70-48-70-18 0 22 40 18 70 18zM120 90c20-40 70-48 70-18 0 22-40 18-70 18z" fill="none" stroke={biz.accent} strokeWidth="14" strokeLinejoin="round" />
    </svg>
  );
};
