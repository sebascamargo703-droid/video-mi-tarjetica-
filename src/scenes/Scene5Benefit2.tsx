import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BenefitHeader } from "../components/BenefitHeader";
import { DashboardMock } from "../components/DashboardMock";
import { ChartIcon } from "../components/Icons";
import { BENEFIT_NUMBER, SCENE_TIMING, USE_DASHBOARD_SCREENSHOT } from "../data/timeline";
import { useLayout } from "../lib/layout";
import { colors, springs } from "../theme";
import type { SceneProps } from "./types";

const { visitsStart, visitsStep } = SCENE_TIMING.database;

/**
 * ESCENA 5 · BENEFICIO · Tu propia base de datos 📊
 * Dashboard recreado en React (filas en cascada + visitas en vivo) o, si
 * USE_DASHBOARD_SCREENSHOT = true, public/dashboard.png en un marco con zoom lento.
 */
export const Scene5Benefit2: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, isVertical, safe, W, H } = useLayout();
  const drift = spring({ frame, fps, config: springs.slow });

  const header = (
    <BenefitHeader
      number={BENEFIT_NUMBER.database}
      align="left"
      title={[
        [{ text: "Tu" }, { text: "propia" }],
        [
          { text: "base de datos", gradient: true },
          { text: "", icon: (s) => <ChartIcon size={s} color={colors.blueText} /> },
        ],
      ]}
    />
  );

  const dashboard = (
    <div style={{ transform: `translateY(${(1 - drift) * 40 * u}px)` }}>
      <DashboardMock
        width={(isVertical ? 900 : 940) * u}
        u={u}
        delay={6}
        visitsStart={visitsStart}
        visitsStep={visitsStep}
        screenshot={USE_DASHBOARD_SCREENSHOT}
      />
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop glowY={isVertical ? 58 : 50} glowX={isVertical ? 50 : 62} particles={12} intensity={0.8} />
      {isVertical ? (
        <>
          <div style={{ position: "absolute", left: safe.x, top: safe.y, width: safe.w }}>{header}</div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: H * 0.27,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {dashboard}
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: safe.x, top: H * 0.26, width: W * 0.36 }}>{header}</div>
          <div style={{ position: "absolute", right: safe.x, top: H * 0.08 }}>{dashboard}</div>
        </>
      )}
    </AbsoluteFill>
  );
};
