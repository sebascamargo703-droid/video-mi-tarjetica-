import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { AppleWalletIcon, GoogleWalletIcon, StopIcon } from "./components/Icons";
import { KineticTitle } from "./components/KineticTitle";
import { useLayout } from "./lib/layout";
import { colors, fonts, shadows, weights } from "./theme";

/**
 * PORTADA (miniatura) del video. Se renderiza como imagen fija:
 *   npx remotion still Portada out/portada.png --frame=59
 * El texto clave queda dentro del recorte 3:4 y 1:1 de la cuadrícula de
 * Instagram/TikTok, y fuera del 12% inferior.
 */
export const Portada: React.FC = () => {
  const { u } = useLayout();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      {/* foto original, sin filtros */}
      <Img
        src={staticFile("assets/portada-foto.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }}
      />
      {/* degradados para legibilidad (arriba logo, abajo titular) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,17,14,0.55) 0%, rgba(4,17,14,0) 16%, rgba(4,17,14,0) 44%, rgba(4,17,14,0.82) 66%, rgba(4,17,14,0.96) 100%)",
        }}
      />

      {/* logo */}
      <div style={{ position: "absolute", top: 110 * u, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("brand/mi-tarjetica-logo-blanco.png")} style={{ width: 330 * u }} />
      </div>

      {/* titular */}
      <div
        style={{
          position: "absolute",
          left: 70 * u,
          right: 70 * u,
          top: 1100 * u,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textShadow: shadows.text(u),
        }}
      >
        <KineticTitle
          u={u}
          size={128 * u}
          delay={0}
          stagger={0}
          lineHeight={0.98}
          lines={[
            [{ text: "No" }, { text: "necesitas" }],
            [
              { text: "más", color: colors.red },
              { text: "clientes", color: colors.red, icon: (s) => <StopIcon size={s} /> },
            ],
          ]}
        />
        <div
          style={{
            marginTop: 34 * u,
            fontFamily: fonts.display,
            fontWeight: weights.semibold,
            fontSize: 50 * u,
            letterSpacing: fonts.tracking,
            color: colors.white,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Haz que <span style={{ color: colors.brandText }}>vuelvan</span>
          <br />
          los que ya te compraron
        </div>
        <div
          style={{
            marginTop: 44 * u,
            display: "flex",
            alignItems: "center",
            gap: 18 * u,
            padding: `${16 * u}px ${30 * u}px ${16 * u}px ${18 * u}px`,
            borderRadius: 999,
            background: colors.brand,
            boxShadow: `${shadows.glowBrand(u, 0.35)}, inset 0 ${1.5 * u}px 0 rgba(255,255,255,0.18)`,
            fontFamily: fonts.text,
            fontWeight: weights.semibold,
            fontSize: 30 * u,
            color: colors.white,
            whiteSpace: "nowrap",
          }}
        >
          <AppleWalletIcon size={50 * u} />
          <GoogleWalletIcon size={50 * u} />
          Tarjeta de fidelidad digital · sin apps
        </div>
      </div>
    </AbsoluteFill>
  );
};
