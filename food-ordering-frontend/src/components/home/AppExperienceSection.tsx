/**
 * AppExperienceSection — Product-showcase grade section
 *
 * Motion design philosophy:
 *  — Orchestrated choreography: bg lights → phone → satellite cards → typography → CTA
 *  — Clip-reveal on headline lines (overflow-hidden parent, y: "110%" → "0%")
 *    identical technique used by Vercel / Linear / Apple hero sections
 *  — Spring-physics 3D tilt on phone mockup driven by mouse position
 *  — Nested motion divs separate entrance from infinite float on satellite cards
 *  — Scroll parallax on the phone column (lags slightly behind page scroll)
 *  — Everything reduced / disabled when prefers-reduced-motion is set
 */

import { memo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import appOrderImage from "@/assets/hero/photo-1734056650036-7002ede7b8f8.avif";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ── Easing ────────────────────────────────────────────────────────────────────
const EXPO = [0.16, 1, 0.3, 1] as const;
const SOFT = [0.22, 1, 0.36, 1] as const;

// ── Section data ──────────────────────────────────────────────────────────────

/** Headline broken into reveal-lines with individual weight / colour tokens */
const HEADLINE = [
  {
    text: "Commandez sur l'App,",
    size: "clamp(1rem, 2.2vw, 1.4rem)",
    weight: 500,
    color: "rgba(255,255,255,0.75)",
    tracking: "0.02em",
  },
  {
    text: "Finalisez",
    size: "clamp(2.8rem, 6.5vw, 5rem)",
    weight: 900,
    gradient:
      "linear-gradient(135deg, #FFFFFF 0%, #F5E8C0 25%, #E5C76B 55%, #D4AF37 75%, #C9A227 100%)",
    tracking: "-0.045em",
  },
  {
    text: "en Un Instant.",
    size: "clamp(2.2rem, 5vw, 3.8rem)",
    weight: 900,
    color: "rgba(255,255,255,0.92)",
    tracking: "-0.04em",
  },
] as const;

const FEATURES = [
  {
    index: "01",
    label: "Personnalisez chaque crêpe",
    detail: "Garnitures, portions, extras — tout en un clic.",
  },
  {
    index: "02",
    label: "Accompagnement VIP WhatsApp",
    detail: "Notre équipe vous répond en moins de 2 minutes.",
  },
  {
    index: "03",
    label: "Livraison ou retrait express",
    detail: "Livraison premium ou retrait en boutique, selon votre rythme.",
  },
] as const;

// ── Animated section background ───────────────────────────────────────────────
const SectionBackground = memo(function SectionBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Dominant purple orb — top left (static for performance) */}
      <div
        className="absolute -top-48 -left-32 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.45) 0%, transparent 68%)",
          filter: "blur(80px)",
        }}
      />
      {/* Gold accent orb — upper right */}
      <div
        className="absolute -top-20 right-0 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 70%)",
          filter: "blur(88px)",
        }}
      />
      {/* Deep violet orb — bottom center */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-64 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(76,29,149,0.6) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      {/* Fine noise grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
    </div>
  );
});

// ── CSS Phone Mockup ──────────────────────────────────────────────────────────
/**
 * Fully rendered HTML phone frame — no image required for the chrome.
 * Simulates an iOS-style app UI to create a genuine product-launch feel.
 * Spring-physics rotateX / rotateY respond to mouse position.
 */
const PhoneMockup = memo(function PhoneMockup({
  parallaxY,
  reduced,
}: {
  parallaxY: MotionValue<number>;
  reduced: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  // Gentle spring for natural feel
  const rotateX = useSpring(useTransform(rawY, [0, 1], [7, -7]), {
    stiffness: 160,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(rawX, [0, 1], [-10, 10]), {
    stiffness: 160,
    damping: 22,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || reduced) return;
      const r = containerRef.current.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width);
      rawY.set((e.clientY - r.top) / r.height);
    },
    [rawX, rawY, reduced]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.5);
  }, [rawX, rawY]);

  return (
    /* Scroll parallax wrapper */
    <motion.div
      style={reduced ? undefined : { y: parallaxY }}
      ref={containerRef}
      className="relative [perspective:1200px] cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3-D tilt layer */}
      <motion.div
        style={
          reduced
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        {/* ── Outer phone frame ── */}
        <div
          style={{
            width: "clamp(188px, 22vw, 254px)",
            height: "clamp(380px, 44vw, 516px)",
            borderRadius: 44,
            background:
              "linear-gradient(160deg, #26263a 0%, #181828 45%, #0e0e1c 100%)",
            boxShadow: [
              "0 0 0 1.5px rgba(255,255,255,0.09)",
              "0 0 0 3px rgba(255,255,255,0.04)",
              "0 48px 96px rgba(0,0,0,0.65)",
              "0 0 72px rgba(109,40,217,0.22)",
              "inset 0 1px 0 rgba(255,255,255,0.12)",
            ].join(", "),
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* ── Screen ── */}
          <div
            style={{
              position: "absolute",
              inset: 6,
              borderRadius: 38,
              overflow: "hidden",
              background: "#0a0a14",
            }}
          >
            {/* App wallpaper / hero image — dimmed */}
            <img
              src={appOrderImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* ── Status bar ── */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1">
              <span
                className="text-[11px] font-semibold"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                9:41
              </span>
              <div className="flex items-center gap-1.5">
                {/* Signal bars */}
                <div className="flex items-end gap-[2px]">
                  {[3, 5, 7, 9].map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-sm"
                      style={{
                        height: h,
                        background:
                          i < 3
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.3)",
                      }}
                    />
                  ))}
                </div>
                {/* Battery */}
                <div className="flex items-center gap-0.5">
                  <div
                    className="rounded-sm"
                    style={{
                      width: 20,
                      height: 10,
                      border: "1px solid rgba(255,255,255,0.4)",
                      padding: 1.5,
                    }}
                  >
                    <div
                      className="h-full rounded-[1px]"
                      style={{
                        width: "75%",
                        background: "rgba(255,255,255,0.8)",
                      }}
                    />
                  </div>
                  <div
                    className="rounded-r-[2px]"
                    style={{
                      width: 2,
                      height: 5,
                      background: "rgba(255,255,255,0.4)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── App header ── */}
            <div className="relative z-10 flex items-center justify-between px-4 py-2 mt-1">
              <div>
                <p
                  className="text-[9px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: "#D4AF37" }}
                >
                  Crêpe Time
                </p>
                <p className="text-sm font-bold text-white leading-tight">
                  Ma commande
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  border: "1px solid rgba(212,175,55,0.3)",
                }}
              >
                <span
                  className="text-[10px] font-black"
                  style={{ color: "#D4AF37" }}
                >
                  CT
                </span>
              </div>
            </div>

            {/* ── Divider ── */}
            <div
              className="mx-4"
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
              }}
            />

            {/* ── Order card ── */}
            <div
              className="relative z-10 mx-3 mt-3 p-3 rounded-2xl"
              style={{
                background: "rgba(15,10,31,0.88)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(212,175,55,0.18)",
              }}
            >
              <div className="flex items-center gap-2.5">
                {/* Thumbnail */}
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: 40, height: 40 }}
                >
                  <img
                    src={appOrderImage}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    Crêpe Nutella Banane
                  </p>
                  <p
                    className="text-[10px] font-medium"
                    style={{ color: "#D4AF37" }}
                  >
                    × 2 · 15.000 TND
                  </p>
                </div>
                {/* Status pill */}
                <span
                  className="flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(16,185,129,0.14)",
                    color: "rgb(52,211,153)",
                    border: "1px solid rgba(16,185,129,0.28)",
                  }}
                >
                  ✓
                </span>
              </div>

              {/* ETA row */}
              <div
                className="flex items-center justify-between mt-2.5 pt-2.5"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-[10px]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Livraison estimée
                </span>
                <span className="text-xs font-bold text-white">~25 min</span>
              </div>
            </div>

            {/* ── Delivery steps ── */}
            <div className="relative z-10 mx-4 mt-3">
              <p
                className="text-[9px] font-bold tracking-[0.14em] uppercase mb-2"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Suivi de livraison
              </p>
              <div className="flex items-center gap-1">
                {["Reçue", "En cours", "En route"].map((step, i) => (
                  <div key={step} className="flex items-center gap-1 flex-1">
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div className="flex items-center w-full gap-1">
                        <div
                          className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{
                            background:
                              i < 2
                                ? "rgba(16,185,129,0.18)"
                                : "rgba(212,175,55,0.15)",
                            border: `1px solid ${
                              i < 2
                                ? "rgba(16,185,129,0.4)"
                                : "rgba(212,175,55,0.4)"
                            }`,
                          }}
                        >
                          {i < 2 ? (
                            <span
                              className="text-[7px] font-bold"
                              style={{ color: "rgb(52,211,153)" }}
                            >
                              ✓
                            </span>
                          ) : (
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "#D4AF37" }}
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                            />
                          )}
                        </div>
                        {i < 2 && (
                          <div
                            className="flex-1 h-px"
                            style={{
                              background:
                                i === 0
                                  ? "rgba(16,185,129,0.4)"
                                  : "rgba(212,175,55,0.3)",
                            }}
                          />
                        )}
                      </div>
                      <p
                        className="text-[8px] font-medium leading-tight"
                        style={{
                          color:
                            i < 2
                              ? "rgba(255,255,255,0.7)"
                              : "#D4AF37",
                        }}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Bottom nav ── */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-4 pt-2 pb-5"
              style={{
                background: "rgba(10,10,20,0.95)",
                backdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {(["🏠", "🍽️", "📦", "👤"] as const).map((icon, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-0.5 opacity-40 aria-selected:opacity-100"
                  style={{ opacity: i === 2 ? 1 : 0.35 }}
                  aria-label={icon}
                >
                  <span className="text-sm leading-none">{icon}</span>
                  {i === 2 && (
                    <motion.div
                      className="w-1 h-1 rounded-full"
                      style={{ background: "#D4AF37" }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Screen edge glow */}
            <div
              className="absolute inset-0 rounded-[38px] pointer-events-none"
              style={{
                boxShadow:
                  "inset 0 0 40px rgba(109,40,217,0.12), inset 0 0 80px rgba(212,175,55,0.04)",
              }}
            />
          </div>

          {/* ── Dynamic Island notch ── */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 96,
              height: 26,
              borderRadius: 14,
              background: "#09090f",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#18182a",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "rgba(52,211,153,0.35)",
                  margin: "2px auto",
                }}
              />
            </div>
            <div
              style={{
                width: 40,
                height: 6,
                borderRadius: 4,
                background: "#18182a",
              }}
            />
          </div>

          {/* Left side buttons */}
          <div
            style={{
              position: "absolute",
              left: -3,
              top: "22%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 3,
                height: 28,
                borderRadius: "2px 0 0 2px",
                background: "rgba(255,255,255,0.07)",
              }}
            />
            <div
              style={{
                width: 3,
                height: 36,
                borderRadius: "2px 0 0 2px",
                background: "rgba(255,255,255,0.07)",
              }}
            />
          </div>
          {/* Right side button */}
          <div
            style={{
              position: "absolute",
              right: -3,
              top: "34%",
              width: 3,
              height: 48,
              borderRadius: "0 2px 2px 0",
              background: "rgba(255,255,255,0.07)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});

// ── Satellite floating cards ──────────────────────────────────────────────────

/** Order progress tracker — floats to bottom-left of phone */
const ProgressCard = memo(function ProgressCard({ reduced }: { reduced: boolean }) {
  const steps = [
    { label: "Confirmée", done: true },
    { label: "En préparation", done: true },
    { label: "En livraison", active: true },
  ];
  return (
    /* entrance */
    <motion.div
      className="absolute -bottom-8 -left-10 z-20"
      initial={reduced ? {} : { opacity: 0, x: -16, y: 16 }}
      whileInView={reduced ? {} : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.75, duration: 0.65, ease: EXPO }}
    >
      {/* float loop */}
      <motion.div
        animate={reduced ? {} : { y: [0, -9, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="p-3.5 rounded-2xl w-52"
          style={{
            background: "rgba(12,8,28,0.9)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 20px 56px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.07)",
          }}
        >
          <p
            className="text-[9px] font-black tracking-[0.2em] uppercase mb-3"
            style={{ color: "#D4AF37" }}
          >
            Suivi commande
          </p>
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  style={{
                    background: s.done
                      ? "rgba(16,185,129,0.16)"
                      : s.active
                      ? "rgba(212,175,55,0.14)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      s.done
                        ? "rgba(16,185,129,0.45)"
                        : s.active
                        ? "rgba(212,175,55,0.38)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                  }}
                >
                  {s.done ? (
                    <span
                      className="text-[8px] font-black"
                      style={{ color: "rgb(52,211,153)" }}
                    >
                      ✓
                    </span>
                  ) : s.active ? (
                    <motion.div
                      className="w-[7px] h-[7px] rounded-full"
                      style={{ background: "#D4AF37" }}
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.55, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  ) : null}
                </div>
                <span
                  className="text-[11px] font-medium"
                  style={{
                    color: s.done
                      ? "rgba(255,255,255,0.8)"
                      : s.active
                      ? "#D4AF37"
                      : "rgba(255,255,255,0.22)",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

/** ETA chip — floats to top-right of phone */
const ETAChip = memo(function ETAChip({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="absolute -top-5 -right-8 z-20"
      initial={reduced ? {} : { opacity: 0, y: -14, scale: 0.85 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.62, duration: 0.6, ease: EXPO }}
    >
      <motion.div
        animate={reduced ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full"
          style={{
            background: "rgba(12,8,28,0.9)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(212,175,55,0.22)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.4), 0 0 24px rgba(212,175,55,0.08)",
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "rgb(52,211,153)" }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span
            className="text-xs font-black"
            style={{ color: "#D4AF37" }}
          >
            ~25 min
          </span>
          <span
            className="text-[10px]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            · Nabeul
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
});

/** Rating micro-card — floats mid-right of phone */
const RatingCard = memo(function RatingCard({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="absolute top-[38%] -right-14 z-20"
      initial={reduced ? {} : { opacity: 0, x: 16 }}
      whileInView={reduced ? {} : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.88, duration: 0.6, ease: EXPO }}
    >
      <motion.div
        animate={reduced ? {} : { y: [0, 10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div
          className="px-3.5 py-3 rounded-2xl"
          style={{
            background: "rgba(12,8,28,0.9)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.38)",
          }}
        >
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className="text-[10px]"
                style={{ color: "#D4AF37" }}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs font-black text-white leading-none">4.9 / 5.0</p>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            200+ avis
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ── Clip-reveal headline line ──────────────────────────────────────────────────
/**
 * Each headline line is wrapped in overflow-hidden so the motion span,
 * starting at y:"110%", rises into view — the exact same technique
 * used on Vercel, Linear, and Apple product showcase pages.
 */
const RevealLine = memo(function RevealLine({
  line,
  index,
  reduced,
}: {
  line: (typeof HEADLINE)[number];
  index: number;
  reduced: boolean;
}) {
  const isGold = "gradient" in line && line.gradient;
  return (
    <div className="overflow-hidden" style={{ lineHeight: 1.05 }}>
      <motion.span
        className="block font-heading"
        initial={reduced ? {} : { y: "112%", opacity: 0 }}
        whileInView={reduced ? {} : { y: "0%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.9,
          ease: SOFT,
          delay: 0.18 + index * 0.13,
        }}
        style={{
          fontSize: line.size,
          fontWeight: line.weight,
          letterSpacing: line.tracking,
          ...(isGold
            ? {
                background: (line as { gradient: string }).gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 16px rgba(212,175,55,0.25))",
              }
            : { color: (line as { color: string }).color }),
          display: "block",
        }}
      >
        {line.text}
      </motion.span>
    </div>
  );
});

// ── Main section ──────────────────────────────────────────────────────────────
const AppExperienceSection = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-driven parallax: phone lags slightly on upward scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const phoneParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [50, -70]
  );

  // Constant zero-value passed to PhoneMockup on mobile (parallax disabled there).
  const mobilePhoneY = useMotionValue(0);

  return (
    <div
      ref={sectionRef}
      className="relative mt-8 sm:mt-10 lg:mt-12 rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #4C1D95 0%, #3B0764 42%, #2D064E 72%, #3B0764 100%)",
        boxShadow:
          "0 24px 64px rgba(76,29,149,0.32), 0 0 0 1px rgba(212,175,55,0.1)",
      }}
    >
      <SectionBackground />

      {/*
       * ── MOBILE-ONLY: phone as ambient background visual ─────────────────
       *
       * Rendered exclusively on screens < lg (1024 px).
       * The phone mockup is centered (slight right offset so it peeks through
       * the content area without fully competing with text), set to a very low
       * opacity, and overlaid with a multi-stop gradient veil that:
       *   — darkens the left edge heavily  (primary text zone)
       *   — softens the right/top/bottom perimeter (clean frame)
       *   — leaves the centre semi-transparent so the phone shape reads through
       *
       * Animation:
       *   • Fade-in  : viewport-triggered opacity + scale entrance
       *   • Float    : perpetual gentle y-oscillation (no scroll listener)
       *   • Tilt     : disabled (reduced=true) — far too heavy for mobile
       *   • Parallax : disabled (mobilePhoneY = constant 0)
       */}
      <motion.div
        className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
        aria-hidden="true"
        initial={reduced ? {} : { opacity: 0, scale: 1.06 }}
        whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: SOFT, delay: 0.55 }}
      >
        {/*
         * Phone — centered, clearly visible, perpetual float.
         *
         * opacity : 0.48  — prominent enough to read as a hero visual on mobile
         * filter  : two-stop purple drop-shadow creates a soft luminous halo
         *           that separates the frame from the section background and
         *           adds the premium "device floating in light" feel.
         */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={reduced ? {} : { y: [0, -11, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            style={{
              opacity: 0.48,
              willChange: "transform",
              filter:
                "drop-shadow(0 0 28px rgba(167,139,250,0.45)) " +
                "drop-shadow(0 0 56px rgba(124,58,237,0.22))",
            }}
          >
            <PhoneMockup parallaxY={mobilePhoneY} reduced={true} />
          </motion.div>
        </div>

        {/*
         * Gradient veil — edge-only darkening.
         *
         * All four stops are significantly lighter than before so the phone
         * reads clearly in the centre while the perimeter blends into the
         * section background.  Layer order (first = topmost):
         *   1. Left-edge cover  — still heaviest; primary text zone
         *   2. Right-edge fade  — soft close, much lighter
         *   3. Top-edge cap     — thin feather
         *   4. Bottom-edge seal — thin feather
         */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to right, rgba(59,7,100,0.90) 0%, rgba(59,7,100,0.58) 20%, rgba(59,7,100,0.10) 46%, transparent 62%)",
              "linear-gradient(to left,  rgba(59,7,100,0.68) 0%, transparent 32%)",
              "linear-gradient(to bottom, rgba(45,6,78,0.48) 0%, transparent 20%)",
              "linear-gradient(to top,    rgba(45,6,78,0.52) 0%, transparent 24%)",
            ].join(", "),
          }}
        />
      </motion.div>

      {/* ── Two-column grid ── */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0 min-h-[520px]">

        {/* ══ LEFT — Phone showcase ══════════════════════════════════════════ */}
        {/*
         * Desktop: phone centred with generous padding for satellite cards.
         * Mobile: collapsed — only the editorial text is visible,
         *         giving a clean reading experience on small screens.
         */}
        <motion.div
          className="relative hidden lg:flex items-center justify-center py-16 pl-12 pr-6"
          initial={reduced ? {} : { opacity: 0, x: -28 }}
          whileInView={reduced ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.75, ease: SOFT }}
        >
          {/* Phone + cards container */}
          <div className="relative">
            <PhoneMockup parallaxY={phoneParallaxY} reduced={reduced} />
            <ProgressCard reduced={reduced} />
            <ETAChip reduced={reduced} />
            <RatingCard reduced={reduced} />
          </div>

          {/* Subtle vertical rule */}
          <div
            className="absolute right-0 top-[10%] bottom-[10%] w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(212,175,55,0.12), transparent)",
            }}
          />
        </motion.div>

        {/* ══ RIGHT — Editorial text column ════════════════════════════════= */}
        <div className="relative flex flex-col justify-center gap-7 sm:gap-8 px-7 sm:px-10 lg:px-12 py-12 sm:py-14 lg:py-16">
          {/* Mobile-only dark glass veil — sits behind all text content */}
          <div
            className="absolute inset-0 lg:hidden rounded-t-2xl sm:rounded-t-3xl"
            aria-hidden="true"
            style={{
              background: "linear-gradient(160deg, rgba(30,8,68,0.78) 0%, rgba(20,5,50,0.72) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              zIndex: 0,
            }}
          />

          {/* ─ Content layer — sits above mobile glass veil ─ */}
          <div className="relative flex flex-col gap-7 sm:gap-8" style={{ zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3"
            initial={reduced ? {} : { opacity: 0, x: 16 }}
            whileInView={reduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: SOFT, delay: 0.1 }}
          >
            {/* Short rule */}
            <motion.span
              className="h-px"
              initial={reduced ? {} : { scaleX: 0 }}
              whileInView={reduced ? {} : { scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: SOFT, delay: 0.25 }}
              style={{ transformOrigin: "left", height: 1, width: 28, background: "rgba(212,175,55,0.65)" }}
            />
            <span
              className="text-[11px] sm:text-xs font-black tracking-[0.22em] uppercase"
              style={{ color: "rgba(212,175,55,0.88)" }}
            >
              Commande digitale
            </span>
          </motion.div>

          {/* ── Clip-reveal headline ── */}
          <h2 className="flex flex-col gap-1">
            {HEADLINE.map((line, i) => (
              <RevealLine
                key={i}
                line={line}
                index={i}
                reduced={reduced}
              />
            ))}
          </h2>

          {/* ── Feature list — styled as a vertical numbered timeline ── */}
          <div className="flex flex-col gap-0">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.index}
                className="flex gap-4 group"
                initial={reduced ? {} : { opacity: 0, x: -14 }}
                whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.55 + i * 0.12,
                  duration: 0.6,
                  ease: SOFT,
                }}
              >
                {/* Timeline spine */}
                <div className="flex flex-col items-center gap-0 pt-3">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(212,175,55,0.14)",
                      border: "1px solid rgba(212,175,55,0.4)",
                      boxShadow: "0 0 10px rgba(212,175,55,0.12)",
                    }}
                  >
                    <span
                      className="text-[9px] font-black"
                      style={{ color: "#D4AF37" }}
                    >
                      {feat.index}
                    </span>
                  </div>
                  {i < FEATURES.length - 1 && (
                    <div
                      className="w-px"
                      style={{
                        height: 32,
                        background:
                          "linear-gradient(to bottom, rgba(212,175,55,0.18), transparent)",
                      }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="pb-6">
                  <p
                    className="text-sm font-bold leading-snug"
                    style={{ color: "rgba(255,255,255,0.93)" }}
                  >
                    {feat.label}
                  </p>
                  <p
                    className="text-[13px] sm:text-xs mt-1 leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.62)" }}
                  >
                    {feat.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── CTA ── */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 14 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 0.6, ease: SOFT }}
          >
            {/*
             * Gradient-border pill button — premium purple glassmorphism style.
             *
             * Technique: two-layer CSS `background` with `padding-box` / `border-box`
             * background-clip keywords.  Layer 1 fills only the padding area (the
             * button interior).  Layer 2 covers the full border-box but sits beneath
             * layer 1, so only the 1.5 px transparent border area shows the gradient
             * stroke.  Result: a luminous lavender-to-violet gradient border around
             * a deep-purple semi-solid fill — no wrapper div required.
             *
             * Interactions:
             *   • Ambient pulse  : box-shadow ring expands from 0 → 11 px, looping
             *   • Hover          : scale + top-light radial highlight + arrow slides
             *   • Active         : scale compresses to 0.97 for tactile feel
             *   • Focus-visible  : accessible violet ring offset from the button edge
             */}
            <Link
              to="/menu"
              className="group relative inline-flex items-center gap-3.5 px-7 sm:px-8 py-3.5 rounded-full text-sm font-black text-white tracking-wide transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50"
              style={{
                background: [
                  "linear-gradient(135deg, rgba(91,33,182,0.96) 0%, rgba(109,40,217,0.92) 50%, rgba(91,33,182,0.95) 100%) padding-box",
                  "linear-gradient(135deg, #7C3AED 0%, #A78BFA 30%, #EDE9FE 50%, #A78BFA 70%, #7C3AED 100%) border-box",
                ].join(", "),
                border: "1.5px solid transparent",
                boxShadow: [
                  "0 0 0 5px rgba(109,40,217,0.10)",
                  "0 8px 30px rgba(109,40,217,0.48)",
                  "0 2px 8px rgba(45,6,78,0.30)",
                  "inset 0 1px 0 rgba(255,255,255,0.14)",
                  "inset 0 -1px 0 rgba(0,0,0,0.12)",
                ].join(", "),
              }}
            >
              {/* Ambient pulse ring — expands outward from the button edge */}
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={
                  reduced
                    ? {}
                    : {
                        boxShadow: [
                          "0 0 0 0px rgba(139,92,246,0.55)",
                          "0 0 0 11px rgba(139,92,246,0)",
                        ],
                      }
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                aria-hidden
              />

              {/* Hover: top-light radial highlight — premium glass surface feel */}
              <span
                className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% -10%, rgba(196,181,253,0.30) 0%, transparent 65%)",
                }}
                aria-hidden
              />

              {/* Label */}
              <span className="relative z-10">Commander maintenant</span>

              {/*
               * Arrow icon badge — small frosted circle that slides right on hover.
               * `group-hover:translate-x-1` is a Tailwind utility that adds
               * translateX(4px) via CSS, composited on the GPU.
               */}
              <span
                className="relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.16)",
                }}
                aria-hidden
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 5h6M5.5 2.5 8 5l-2.5 2.5"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>

          </div>{/* /content z-layer */}
        </div>
      </div>
    </div>
  );
};

export default memo(AppExperienceSection);
