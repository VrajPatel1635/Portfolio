import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Logo URL via Simple Icons CDN ───────────────────────────────
// Some slugs use overrides due to Simple Icons removals/renames
// no global overrides needed — slugs fixed directly in data
const logoUrl = (slug, color) =>
  `https://cdn.simpleicons.org/${slug}/${color.replace("#", "")}`;

// ─── Skills Data ──────────────────────────────────────────────────
const LANES = [
  {
    id: "frontend",
    label: "FRONTEND",
    num: "01",
    direction: "left",
    duration: 40,
    skills: [
      { name: "React",       color: "#61DAFB", slug: "react"            },
      { name: "Next.js",    color: "#FFFFFF", slug: "nextdotjs"         },
      { name: "JavaScript", color: "#F7DF1E", slug: "javascript"        },
      { name: "Tailwind",   color: "#06B6D4", slug: "tailwindcss"       },
      { name: "HTML5",      color: "#E34F26", slug: "html5"             },
      { name: "CSS3",       color: "#1572B6", slug: "css"               },
    ],
  },
  {
    id: "backend",
    label: "BACKEND",
    num: "02",
    direction: "right",
    duration: 48,
    skills: [
      { name: "Node.js",    color: "#339933", slug: "nodedotjs"         },
      { name: "Express.js", color: "#FFFFFF", slug: "express"           },
      { name: "MongoDB",    color: "#47A248", slug: "mongodb"           },
      { name: "MySQL",      color: "#4479A1", slug: "mysql"             },
      { name: "JWT Auth",   color: "#FB015B", slug: "jsonwebtokens"     },
      { name: "REST API",   color: "#85EA2D", slug: "swagger"           },
    ],
  },
  {
    id: "tools",
    label: "TOOLS",
    num: "03",
    direction: "left",
    duration: 36,
    skills: [
      { name: "Git",        color: "#F05032", slug: "git"               },
      { name: "GitHub",     color: "#FFFFFF", slug: "github"            },
      { name: "VS Code",    color: "#007ACC", slug: "vscodium"          },
      { name: "Postman",    color: "#FF6C37", slug: "postman"           },
      { name: "Python",     color: "#3776AB", slug: "python"            },
      { name: "Java",       color: "#ED8B00", slug: "openjdk"           },
    ],
  },
];

// ─── Arc Lane ────────────────────────────────────────────────────
const ArcLane = ({ lane, containerRef }) => {
  const chipRefs = useRef([]);
  // duplicate 2× for seamless infinite loop
  const chips = [...lane.skills, ...lane.skills];

  useEffect(() => {
    let rafId;

    const tick = () => {
      const container = containerRef.current;
      if (!container) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const cr  = container.getBoundingClientRect();
      const cx  = cr.left + cr.width / 2;
      const hw  = cr.width / 2;

      chipRefs.current.forEach((el) => {
        if (!el) return;

        const r = el.getBoundingClientRect();

        // hide chips outside visible section
        if (r.right < cr.left - 80 || r.left > cr.right + 80) {
          el.style.opacity = "0";
          return;
        }

        const chipCx = r.left + r.width / 2;
        const dist   = Math.min(Math.abs(chipCx - cx) / hw, 1);

        // ── Arc transforms ──
        const ty = -(Math.pow(dist, 1.5) * 70);
        const sc = 1 - dist * 0.46;
        const op = Math.max(0.06, 1 - dist * 0.63);

        el.style.transform = `translateY(${ty}px) scale(${sc})`;
        el.style.opacity   = op;

        // ── Color intensity (brand color ↔ grayscale) ──
        const ci = Math.max(0, 1 - dist * 3.0); // 1 at center, 0 beyond dist≈0.33
        const logo = el.querySelector(".arc-logo");
        const name = el.querySelector(".arc-name");
        if (logo) {
          const gs = 1 - ci;
          const br = 0.35 + 0.65 * ci;
          logo.style.filter = `grayscale(${gs.toFixed(2)}) brightness(${br.toFixed(2)})`;
        }
        if (name) {
          name.style.opacity = (0.25 + 0.75 * ci).toFixed(2);
        }

        // ── Glow (simple — to be refined later) ──
        const colHex = el.dataset.color || "#ffffff";
        const rr = parseInt(colHex.slice(1, 3), 16);
        const gg = parseInt(colHex.slice(3, 5), 16);
        const bb = parseInt(colHex.slice(5, 7), 16);

        if (ci > 0.04) {
          el.style.borderColor = `rgba(${rr},${gg},${bb},${(ci * 0.8).toFixed(2)})`;
          el.style.boxShadow   =
            `0 0 20px rgba(${rr},${gg},${bb},${(ci * 0.4).toFixed(2)}), ` +
            `0 0 50px rgba(${rr},${gg},${bb},${(ci * 0.14).toFixed(2)})`;
        } else {
          el.style.borderColor = "rgba(255,255,255,0.08)";
          el.style.boxShadow   = "none";
        }
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="arc-lane-wrapper">
      {/* left/right dark fade overlays */}
      <div className="arc-fade arc-fade--left"  />
      <div className="arc-fade arc-fade--right" />

      {/* scrolling row */}
      <div
        className={`arc-row arc-row--${lane.direction}`}
        style={{ animationDuration: `${lane.duration}s` }}
      >
        {chips.map((skill, i) => (
          <div
            key={i}
            ref={(el) => (chipRefs.current[i] = el)}
            className="arc-chip"
            data-color={skill.color}
          >
            <img
              className="arc-logo"
              src={logoUrl(skill.slug, skill.color)}
              alt={skill.name}
              draggable={false}
            />
            <span className="arc-name">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Skills Section ──────────────────────────────────────────
const Skills = () => {
  const containerRef = useRef(null);

  return (
    <section id="skills" className="arc-section">

      {/* Watermark */}
      <div className="arc-watermark" aria-hidden="true">SKILLS</div>

      {/* Crosshair markers */}
      <span className="arc-cross" style={{ top: "10%",  left:  "5%" }}>+</span>
      <span className="arc-cross" style={{ bottom: "12%", right: "6%" }}>+</span>

      {/* Inner container — used as the center reference for arc math */}
      <div className="arc-inner" ref={containerRef}>

        {/* ── Section Header ── */}
        <motion.div
          className="arc-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="arc-header-eyebrow">
            <span className="arc-header-rule" />
            <span className="arc-header-sub">Architecture &amp; Tech</span>
          </div>
          <h2 className="arc-header-title">
            TECHNOLOGY <span className="arc-title-stroke">STACK.</span>
          </h2>
        </motion.div>

        {/* ── Lane Labels row ── */}
        <motion.div
          className="arc-lane-labels"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {LANES.map((lane) => (
            <div key={lane.id} className="arc-lane-meta">
              <span className="arc-lane-num">{lane.num}</span>
              <span className="arc-lane-lbl">{lane.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Arc Lanes ── */}
        <motion.div
          className="arc-lanes"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {LANES.map((lane) => (
            <ArcLane key={lane.id} lane={lane} containerRef={containerRef} />
          ))}
        </motion.div>

        {/* ── Footer metadata ── */}
        <motion.div
          className="arc-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span>16 TECHNOLOGIES</span>
          <span className="arc-dot">·</span>
          <span>CONSTANTLY EVOLVING</span>
          <span className="arc-dot">·</span>
          <span>MERN STACK CORE</span>
        </motion.div>

      </div>

      {/* ── Styles ── */}
      <style>{`

        /* ════ Section ══════════════════════════════════════════ */
        .arc-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 80px 0;
          background: rgba(5, 5, 5, 0.15);
          backdrop-filter: blur(2px);
        }

        .arc-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: "Orbitron", sans-serif;
          font-size: clamp(80px, 15vw, 210px);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.035);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 0;
          letter-spacing: 0.05em;
        }

        .arc-cross {
          position: absolute;
          font-size: 18px;
          font-weight: 300;
          color: rgba(255,255,255,0.18);
          font-family: monospace;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        /* ════ Inner ════════════════════════════════════════════ */
        .arc-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ════ Header ═══════════════════════════════════════════ */
        .arc-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 36px;
          padding: 0 64px;
        }

        .arc-header-eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .arc-header-rule {
          display: block;
          width: 48px;
          height: 1px;
          background: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }

        .arc-header-sub {
          font-family: "Rajdhani", sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }

        .arc-header-title {
          font-family: "Orbitron", sans-serif;
          font-size: clamp(28px, 4.5vw, 56px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0;
          text-transform: uppercase;
        }

        .arc-title-stroke {
          color: transparent;
          -webkit-text-stroke: 2px #ffffff;
        }

        /* ════ Lane labels row ══════════════════════════════════ */
        .arc-lane-labels {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0 64px;
          margin-bottom: 4px;
        }

        .arc-lane-meta {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding: 10px 0 0 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .arc-lane-meta:first-child { border-top: none; }

        .arc-lane-num {
          font-family: "Rajdhani", sans-serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.2);
        }

        .arc-lane-lbl {
          font-family: "Orbitron", sans-serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.28);
          text-transform: uppercase;
        }

        /* ════ Lanes ════════════════════════════════════════════ */
        .arc-lanes {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ════ Single lane wrapper ══════════════════════════════ */
        .arc-lane-wrapper {
          position: relative;
          overflow: hidden; /* clips horizontal overflow */
        }

        /* dark gradient fade — left & right edges */
        .arc-fade {
          position: absolute;
          top: 0;
          height: 100%;
          width: 200px;
          z-index: 10;
          pointer-events: none;
        }
        .arc-fade--left  {
          left: 0;
          background: linear-gradient(to right, #050505 0%, rgba(5,5,5,0.7) 60%, transparent 100%);
        }
        .arc-fade--right {
          right: 0;
          background: linear-gradient(to left, #050505 0%, rgba(5,5,5,0.7) 60%, transparent 100%);
        }

        /* ════ Scrolling row ════════════════════════════════════ */
        .arc-row {
          display: flex;
          align-items: flex-end; /* chips baseline at bottom — arc pushes edges UP */
          gap: 52px;
          width: max-content;
          /* top padding ≥ max arc upward travel (70px) + some buffer */
          padding: 92px 100px 22px 100px;
          will-change: transform;
        }

        .arc-row--left {
          animation-name: arc-scroll-left;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .arc-row--right {
          animation-name: arc-scroll-right;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes arc-scroll-left {
          from { transform: translateX(0);    }
          to   { transform: translateX(-50%); }
        }
        @keyframes arc-scroll-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0);    }
        }

        /* ════ Chip ═════════════════════════════════════════════ */
        .arc-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 20px 13px 15px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          white-space: nowrap;
          flex-shrink: 0;
          cursor: default;
          user-select: none;
          transform-origin: center bottom;
          will-change: transform, opacity;
        }

        .arc-logo {
          width: 26px;
          height: 26px;
          object-fit: contain;
          flex-shrink: 0;
          display: block;
          will-change: filter;
          pointer-events: none;
        }

        .arc-name {
          font-family: "Orbitron", sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #ffffff;
          text-transform: uppercase;
          will-change: opacity;
        }

        /* ════ Footer ═══════════════════════════════════════════ */
        .arc-footer {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 40px;
          padding: 0 64px;
          font-family: "Rajdhani", sans-serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          color: rgba(255,255,255,0.22);
          text-transform: uppercase;
        }
        .arc-dot { color: rgba(255,255,255,0.1); }

        /* ════ Responsive ═══════════════════════════════════════ */
        @media (max-width: 900px) {
          .arc-header,
          .arc-lane-labels,
          .arc-footer     { padding: 0 28px; }
          .arc-row         { gap: 36px; padding: 80px 50px 18px 50px; }
          .arc-fade        { width: 100px; }
        }

        @media (max-width: 600px) {
          .arc-header,
          .arc-lane-labels,
          .arc-footer     { padding: 0 20px; }
          .arc-row         { gap: 28px; padding: 72px 36px 16px 36px; }
          .arc-chip        { padding: 10px 14px 10px 11px; gap: 9px; }
          .arc-logo        { width: 20px; height: 20px; }
          .arc-name        { font-size: 8.5px; letter-spacing: 0.1em; }
          .arc-fade        { width: 68px; }
          .arc-header-title { font-size: clamp(24px, 7vw, 36px); }
          .arc-footer      { font-size: 9px; gap: 12px; }
        }
      `}</style>
    </section>
  );
};

export default Skills;
