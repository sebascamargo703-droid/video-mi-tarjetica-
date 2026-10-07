import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";
import { ProgressBar } from "./ProgressBar";
import { Subtitles } from "./Subtitles";
import { ProximityBanner } from "./ProximityBanner";

export const FluidCreatorVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =========================================================================
  // DYNAMIC CAMERA PUNCH-IN & PUNCH-OUT ZOOMS (Alex Hormozi / Top Creator Style)
  // Alternates between Medium Shot (1.02x) and Close-Up Punch (1.15x - 1.18x)
  // =========================================================================
  const getCameraZoom = (f: number): number => {
    // 0 -> 50: Hook medium shot (1.02)
    if (f < 51) return 1.02;
    // 51 -> 130: Punch-in on "Te vuelvan a elegir" (1.15)
    if (f < 131) return 1.15;
    // 131 -> 185: Reset to medium (1.03)
    if (f < 186) return 1.03;
    // 186 -> 241: Punch-in on "5 veces más caro" (1.16)
    if (f < 242) return 1.16;
    // 242 -> 295: Reset to medium (1.03)
    if (f < 296) return 1.03;
    // 296 -> 355: Punch-in on "Motivo real para volver" (1.15)
    if (f < 356) return 1.15;
    // 356 -> 445: Reset to medium (1.03)
    if (f < 446) return 1.03;
    // 446 -> 554: Punch-in on "Tarjeta digital en su celular" (1.14)
    if (f < 555) return 1.14;
    // 555 -> 650: Reset to medium (1.03)
    if (f < 651) return 1.03;
    // 651 -> 748: Punch-in on "Acumulan sellos y premios" (1.16)
    if (f < 749) return 1.16;
    // 749 -> 884: Proximity notice medium view (1.04)
    if (f < 885) return 1.04;
    // 885 -> 982: Punch-in on "Base de datos real" (1.15)
    if (f < 983) return 1.15;
    // 983 -> 1045: Medium shot on hook closing (1.03)
    if (f < 1046) return 1.03;
    // 1046 -> end: Punch-in on CTA "Comenta Tarjetica" (1.15)
    return 1.15;
  };

  const targetZoom = getCameraZoom(frame);

  // CTA button pop spring at frame 980
  const ctaSpring = spring({
    frame: Math.max(0, frame - 980),
    fps,
    config: { damping: 11, mass: 0.45, stiffness: 160 },
  });
  const ctaPulse = 1 + Math.sin(frame * 0.22) * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020408", overflow: "hidden" }}>
      {/* =========================================================================
          1. AUDIO & SOUND DESIGN (SFX to capture maximum attention)
         ========================================================================= */}

      {/* Subtle, elegant background music (42s track, fading out smoothly towards frame 1210) */}
      <Audio
        src={staticFile("audio/tech_beat_42s.wav")}
        volume={(f) =>
          interpolate(f, [0, 20, 1150, 1210], [0, 0.045, 0.045, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* Pristine 48kHz User Voiceover Audio Track (unclipped, complete sentence to the end) */}
      <Audio
        src={staticFile("user_clips/master_creador_audio.wav")}
        volume={1.0}
      />

      {/* SFX 1: Sub Bass Impact at frame 0 (scroll-stopping hook impact) */}
      {frame >= 0 && frame < 40 && (
        <Audio
          src={staticFile("audio/sub_bass_impact.wav")}
          startFrom={0}
          volume={0.5}
        />
      )}

      {/* SFX 2: Dynamic Punch Whoosh at frame 51 ("Te vuelvan a elegir") */}
      {frame >= 51 && frame < 75 && (
        <Audio
          src={staticFile("audio/whoosh.wav")}
          startFrom={0}
          volume={0.3}
        />
      )}

      {/* SFX 3: Whoosh on Take 2 at frame 130 */}
      {frame >= 130 && frame < 155 && (
        <Audio
          src={staticFile("audio/whoosh.wav")}
          startFrom={0}
          volume={0.25}
        />
      )}

      {/* SFX 4: Click Pop at frame 186 ("5 Veces más caro") */}
      {frame >= 186 && frame < 205 && (
        <Audio
          src={staticFile("audio/click_pop.wav")}
          startFrom={0}
          volume={0.4}
        />
      )}

      {/* SFX 5: Whoosh on Take 3 at frame 241 */}
      {frame >= 241 && frame < 265 && (
        <Audio
          src={staticFile("audio/whoosh.wav")}
          startFrom={0}
          volume={0.25}
        />
      )}

      {/* SFX 6: Click Pop on "Motivo para volver" at frame 296 */}
      {frame >= 296 && frame < 315 && (
        <Audio
          src={staticFile("audio/click_pop.wav")}
          startFrom={0}
          volume={0.35}
        />
      )}

      {/* SFX 7: Whoosh on "Mi Tarjetica" at frame 355 */}
      {frame >= 355 && frame < 380 && (
        <Audio
          src={staticFile("audio/whoosh.wav")}
          startFrom={0}
          volume={0.25}
        />
      )}

      {/* SFX 8: Chime Success at frame 446 ("Tarjeta digital en su celular") */}
      {frame >= 446 && frame < 490 && (
        <Audio
          src={staticFile("audio/chime_success.wav")}
          startFrom={0}
          volume={0.35}
        />
      )}

      {/* SFX 9: Whoosh on Take 5 at frame 554 */}
      {frame >= 554 && frame < 580 && (
        <Audio
          src={staticFile("audio/whoosh.wav")}
          startFrom={0}
          volume={0.25}
        />
      )}

      {/* SFX 10: Stamp Thud at frame 651 ("Acumulan sellos y premios") */}
      {frame >= 651 && frame < 685 && (
        <Audio
          src={staticFile("audio/stamp_thud.wav")}
          startFrom={0}
          volume={0.45}
        />
      )}

      {/* SFX 11: Apple Notification Chime at frame 750 (Proximity Banner) */}
      {frame >= 750 && frame < 800 && (
        <Audio
          src={staticFile("audio/apple_notification.wav")}
          startFrom={0}
          volume={0.7}
        />
      )}

      {/* SFX 12: Whoosh on Take 7 at frame 884 ("Base de datos real") */}
      {frame >= 884 && frame < 910 && (
        <Audio
          src={staticFile("audio/whoosh.wav")}
          startFrom={0}
          volume={0.25}
        />
      )}

      {/* SFX 13: Sub Bass Impact on CTA Hook at frame 982 */}
      {frame >= 982 && frame < 1020 && (
        <Audio
          src={staticFile("audio/sub_bass_impact.wav")}
          startFrom={0}
          volume={0.45}
        />
      )}

      {/* SFX 14: Click Pop on CTA Button entrance at frame 1046 */}
      {frame >= 1046 && frame < 1070 && (
        <Audio
          src={staticFile("audio/click_pop.wav")}
          startFrom={0}
          volume={0.5}
        />
      )}

      {/* Top Progress Bar */}
      <ProgressBar />

      {/* =========================================================================
          2. CINEMATIC 4K VIDEO LAYER WITH DYNAMIC PUNCH ZOOMS
         ========================================================================= */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${targetZoom})`,
          transformOrigin: "center 42%",
          transition: "transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <Video
          src={staticFile("user_clips/master_creador_fluid.mp4")}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            /* 4K Cinema Color Grading: Deep film contrast, rich warm skin tones, crisp clarity */
            filter:
              "contrast(1.15) saturate(1.22) brightness(1.03) hue-rotate(-1deg)",
          }}
        />
      </div>

      {/* =========================================================================
          3. CINEMATIC LIGHTING & COLOR GRADING OVERLAYS
         ========================================================================= */}

      {/* Warm Golden Key Light Glow on Speaker */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 820,
          height: 820,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 195, 110, 0.12) 0%, rgba(255, 180, 80, 0.04) 45%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Cool Teal Ambient Film Shadows in Corners */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, transparent 45%, rgba(6, 16, 26, 0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Cinema Depth & Vignette (Protects top pills and bottom subtitles) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(3, 7, 18, 0.7) 0%, transparent 22%, transparent 60%, rgba(2, 6, 14, 0.94) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* =========================================================================
          4. FLOATING TOP BADGES (Contextual to speech blocks)
         ========================================================================= */}

      {/* Segment 1 (0 -> 130): Hook badge */}
      {frame < 130 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 23, 68, 0.95)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: "999px",
            fontFamily: "var(--font-montserrat, sans-serif)",
            fontWeight: 900,
            fontSize: "26px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 10px 40px rgba(255, 23, 68, 0.5)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 40,
            border: "2px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <span>🛑</span>
          <span>NO NECESITAS CLIENTES NUEVOS</span>
        </div>
      )}

      {/* Segment 2 (130 -> 241): 5x Cost pill */}
      {frame >= 130 && frame < 241 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "2px solid #FF5252",
            borderRadius: "999px",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 10px 40px rgba(255, 82, 82, 0.4)",
            zIndex: 40,
          }}
        >
          <span style={{ fontSize: "28px" }}>📉</span>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "26px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            CONSEGUIR CLIENTE NUEVO: <span style={{ color: "#FF5252" }}>5X MÁS CARO</span>
          </span>
        </div>
      )}

      {/* Segment 3 (241 -> 355): Reason to return pill */}
      {frame >= 241 && frame < 355 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "2px solid #FFE600",
            borderRadius: "999px",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 10px 40px rgba(255, 230, 0, 0.35)",
            zIndex: 40,
          }}
        >
          <span style={{ fontSize: "28px" }}>💡</span>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "26px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            DALES UN <span style={{ color: "#FFE600" }}>MOTIVO REAL</span> PARA VOLVER
          </span>
        </div>
      )}

      {/* Segment 4 (355 -> 554): Digital Card Pill */}
      {frame >= 355 && frame < 554 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(6, 78, 59, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "2px solid #00E676",
            borderRadius: "999px",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 10px 40px rgba(0, 230, 118, 0.4)",
            zIndex: 40,
          }}
        >
          <span style={{ fontSize: "28px" }}>📲</span>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "26px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            MI TARJETICA: <span style={{ color: "#00E676" }}>DIGITAL EN SU CELULAR</span>
          </span>
        </div>
      )}

      {/* Segment 5 (554 -> 748): Stamps and Rewards Pill */}
      {frame >= 554 && frame < 748 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "2px solid #FFE600",
            borderRadius: "999px",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 10px 40px rgba(255, 230, 0, 0.4)",
            zIndex: 40,
          }}
        >
          <span style={{ fontSize: "28px" }}>🎁</span>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "26px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            ACUMULAN SELLOS • <span style={{ color: "#FFE600" }}>DESCUENTOS Y PREMIOS</span>
          </span>
        </div>
      )}

      {/* Segment 7 (884 -> 982): Real Database Pill */}
      {frame >= 884 && frame < 982 && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "2px solid #00E676",
            borderRadius: "999px",
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 10px 40px rgba(0, 230, 118, 0.35)",
            zIndex: 40,
          }}
        >
          <span style={{ fontSize: "28px" }}>📊</span>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-montserrat, sans-serif)",
              fontWeight: 900,
              fontSize: "26px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            BASE DE DATOS REAL • <span style={{ color: "#00E676" }}>NOMBRES Y VISITAS</span>
          </span>
        </div>
      )}

      {/* =========================================================================
          5. PROXIMITY NOTIFICATION (Apple Wallet Dynamic Island Banner)
         ========================================================================= */}
      <ProximityBanner startFrame={750} durationFrames={134} />

      {/* =========================================================================
          6. GRAND FINALE & OUTRO CTA (Frames 982 -> 1210)
         ========================================================================= */}
      {frame >= 982 && (
        <>
          {/* Official Website Brand Pill */}
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 40,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.82)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                padding: "12px 32px",
                borderRadius: "999px",
                border: "2px solid rgba(0, 230, 118, 0.6)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: "0 10px 35px rgba(0, 0, 0, 0.8)",
              }}
            >
              <Img
                src={staticFile("brand/mi-tarjetica-icono-verde.png")}
                style={{ width: 38, height: 38, objectFit: "contain" }}
              />
              <span
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-montserrat, sans-serif)",
                  fontWeight: 900,
                  fontSize: "26px",
                  letterSpacing: "1px",
                }}
              >
                www.mitarjetica.com
              </span>
              <span
                style={{
                  backgroundColor: "#00E676",
                  color: "#000",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                ✓
              </span>
            </div>
          </div>

          {/* High-Converting Glowing CTA Button with Energetic Bounce */}
          <div
            style={{
              position: "absolute",
              bottom: 140,
              left: "50%",
              transform: `translateX(-50%) scale(${ctaSpring * ctaPulse})`,
              zIndex: 50,
              width: "92%",
              maxWidth: "940px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
                borderRadius: "32px",
                padding: "24px 20px",
                textAlign: "center",
                boxShadow:
                  "0 20px 60px rgba(0, 230, 118, 0.65), 0 0 50px rgba(0, 230, 118, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)",
                border: "4px solid #FFFFFF",
              }}
            >
              <div
                style={{
                  color: "#000000",
                  fontFamily: "var(--font-montserrat, sans-serif)",
                  fontWeight: 900,
                  fontSize: "44px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <span>COMENTA</span>
                <span
                  style={{
                    backgroundColor: "#000000",
                    color: "#FFE600",
                    padding: "4px 22px",
                    borderRadius: "14px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                  }}
                >
                  TARJETICA
                </span>
                <span>👇</span>
              </div>

              <div
                style={{
                  color: "#003b14",
                  fontSize: "22px",
                  fontWeight: 800,
                  marginTop: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ✨ Y te enviamos la demo y toda la información por DM
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "24px",
                fontSize: "44px",
                transform: `translateY(${Math.sin(frame * 0.3) * 8}px)`,
              }}
            >
              <span>👇</span>
              <span>👇</span>
              <span>👇</span>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          7. HORMOZI KINETIC SUBTITLES (Meticulously Synced to Speech Timings)
         ========================================================================= */}

      {/* Segment 1: Hook */}
      <Subtitles
        startFrame={0}
        endFrame={50}
        words={[
          { text: "NO" },
          { text: "NECESITAS" },
          { text: "CLIENTES", highlight: true, highlightColor: "red" },
          { text: "NUEVOS 🛑", highlight: true, highlightColor: "red" },
        ]}
        yOffset={380}
      />
      <Subtitles
        startFrame={51}
        endFrame={130}
        words={[
          { text: "NECESITAS QUE" },
          { text: "TE VUELVAN A ELEGIR", highlight: true, highlightColor: "green", emoji: "⚡" },
        ]}
        yOffset={380}
      />

      {/* Segment 2: Cost 5x */}
      <Subtitles
        startFrame={131}
        endFrame={185}
        words={[
          { text: "CONSEGUIR UN" },
          { text: "CLIENTE NUEVO", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />
      <Subtitles
        startFrame={186}
        endFrame={241}
        words={[
          { text: "CUESTA HASTA" },
          { text: "5 VECES MÁS 📉", highlight: true, highlightColor: "red" },
          { text: "QUE RETENERLO" },
        ]}
        yOffset={380}
      />

      {/* Segment 3: Reason to return */}
      <Subtitles
        startFrame={242}
        endFrame={295}
        words={[
          { text: "SI NO REGRESAN," },
          { text: "NO ES TU SERVICIO ❌", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />
      <Subtitles
        startFrame={296}
        endFrame={355}
        words={[
          { text: "NO LES ESTÁS DANDO UN" },
          { text: "MOTIVO PARA VOLVER 🔄", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />

      {/* Segment 4: Solution & Digital Card */}
      <Subtitles
        startFrame={356}
        endFrame={445}
        words={[
          { text: "CADA COMPRA DE HOY = " },
          { text: "VISITA ASEGURADA MAÑANA 🗓️", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />
      <Subtitles
        startFrame={446}
        endFrame={500}
        words={[
          { text: "CON" },
          { text: "MI TARJETICA 📲", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />
      <Subtitles
        startFrame={501}
        endFrame={554}
        words={[
          { text: "UNA TARJETA DIGITAL" },
          { text: "EN EL CELULAR DE TUS CLIENTES", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />

      {/* Segment 5: Stamps & Rewards */}
      <Subtitles
        startFrame={555}
        endFrame={650}
        words={[
          { text: "PREMIA LA FIDELIDAD" },
          { text: "DE TUS CLIENTES 🎁", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />
      <Subtitles
        startFrame={651}
        endFrame={748}
        words={[
          { text: "ACUMULAN SELLOS Y OBTIENEN" },
          { text: "DESCUENTOS Y RECOMPENSAS ⭐", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />

      {/* Segment 6: Proximity Notice */}
      <Subtitles
        startFrame={749}
        endFrame={815}
        words={[
          { text: "CON AVISO DE" },
          { text: "PROXIMIDAD 📍", highlight: true, highlightColor: "yellow" },
        ]}
        yOffset={380}
      />
      <Subtitles
        startFrame={816}
        endFrame={884}
        words={[
          { text: "LE AVISA A TU CLIENTE" },
          { text: "CADA VEZ QUE PASA CERCA 🔔", highlight: true, highlightColor: "green" },
        ]}
        yOffset={380}
      />

      {/* Segment 7: Real Database */}
      <Subtitles
        startFrame={885}
        endFrame={982}
        words={[
          { text: "Y MANTIENES UNA" },
          { text: "BASE DE DATOS REAL 📊", highlight: true, highlightColor: "green" },
          { text: "ACTUALIZADA DE TU NEGOCIO" },
        ]}
        yOffset={380}
      />

      {/* Segment 8: Final CTA */}
      <Subtitles
        startFrame={983}
        endFrame={1045}
        words={[
          { text: "DEJA DE PERDER" },
          { text: "CLIENTES TODOS LOS DÍAS 🛑", highlight: true, highlightColor: "red" },
        ]}
        yOffset={580}
      />
      <Subtitles
        startFrame={1046}
        endFrame={1140}
        words={[
          { text: "COMENTA LA PALABRA" },
          { text: "TARJETICA", highlight: true, highlightColor: "yellow", emoji: "💬" },
          { text: "Y TE ENVIAMOS LA INFORMACIÓN" },
        ]}
        yOffset={580}
      />
    </AbsoluteFill>
  );
};
