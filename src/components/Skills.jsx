import React from "react";
import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "FRONTEND",
    label: "[CLIENT]",
    skills: [
      { name: "React", key: true, color: "#61DAFB", icon: "fa-brands fa-react" },
      { name: "Next.js", key: true, color: "#ffffff", icon: "fa-solid fa-n" },
      { name: "JavaScript", key: false, color: "#F7DF1E", icon: "fa-brands fa-js" },
      { name: "Tailwind CSS", key: false, color: "#38B2AC", icon: "fa-solid fa-wind" },
      { name: "HTML & CSS", key: false, color: "#E34F26", icon: "fa-brands fa-html5" },
    ],
  },
  {
    title: "BACKEND",
    label: "[SERVER]",
    skills: [
      { name: "Node.js", key: true, color: "#339933", icon: "fa-brands fa-node" },
      { name: "Express.js", key: false, color: "#ffffff", icon: "fa-solid fa-server" },
      { name: "REST APIs", key: false, color: "#ffffff", icon: "fa-solid fa-network-wired" },
      { name: "JWT Auth", key: false, color: "#FF0088", icon: "fa-solid fa-key" },
      { name: "API Design", key: false, color: "#ffffff", icon: "fa-solid fa-bezier-curve" },
    ],
  },
  {
    title: "DATABASE",
    label: "[DATA]",
    skills: [
      { name: "MongoDB", key: true, color: "#47A248", icon: "fa-solid fa-database" },
      { name: "MySQL", key: false, color: "#00758F", icon: "fa-solid fa-table" },
    ],
  },
  {
    title: "TOOLS & LANGUAGES",
    label: "[CORE]",
    skills: [
      { name: "Git & GitHub", key: true, color: "#F05032", icon: "fa-brands fa-github" },
      { name: "VS Code", key: false, color: "#007ACC", icon: "fa-solid fa-code" },
      { name: "Postman", key: false, color: "#FF6C37", icon: "fa-solid fa-user-astronaut" },
      { name: "Java", key: false, color: "#fca311", icon: "fa-brands fa-java" },
      { name: "Python", key: false, color: "#3776AB", icon: "fa-brands fa-python" },
    ],
  },
];

const diagramNodes = [
  { id: "SYSTEM", x: 400, y: 400, label: "SYS.CORE" },
  { id: "FRONTEND", x: 140, y: 150, label: "FRONTEND", path: "M 400 400 L 400 150 L 140 150" },
  { id: "BACKEND", x: 660, y: 150, label: "BACKEND", path: "M 400 400 L 400 150 L 660 150" },
  { id: "TOOLS", x: 100, y: 400, label: "TOOLS", path: "M 400 400 L 100 400" },
  { id: "DATABASE", x: 700, y: 400, label: "DATABASE", path: "M 400 400 L 700 400" },
  { id: "LANGUAGES", x: 140, y: 650, label: "LANGUAGES", path: "M 400 400 L 400 650 L 140 650" },
];

const ArchitectureDiagram = () => {
  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[700px] relative pointer-events-none select-none">
      <svg viewBox="0 0 800 800" className="w-full h-full absolute inset-0 drop-shadow-2xl">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Drawn Connections */}
        {diagramNodes.map(
          (node, i) =>
            node.path && (
              <motion.path
                key={`path-${i}`}
                d={node.path}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              />
            )
        )}

        {/* Node Points & Labels */}
        {diagramNodes.map((node, i) => (
          <motion.g
            key={`node-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "backOut", delay: 1.2 + i * 0.1 }}
          >
            {/* Outer ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r="14"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            {/* Inner solid node */}
            <circle cx={node.x} cy={node.y} r="4" fill="rgba(255,255,255,0.8)" />

            <text
              x={node.x}
              y={node.y - 24}
              fill="rgba(255,255,255,0.5)"
              fontSize="12"
              fontFamily="monospace"
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              {node.label}
            </text>
          </motion.g>
        ))}

        {/* Central Pulse */}
        <motion.circle
          cx="400"
          cy="400"
          r="6"
          fill="#fff"
          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="400"
          cy="400"
          r="14"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="relative min-h-screen flex items-center justify-center py-20 px-6 md:px-20 overflow-hidden bg-black/10 backdrop-blur-md">
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 overflow-hidden w-full flex justify-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-[18vw] font-black text-white/1.5 tracking-tighter leading-none whitespace-nowrap"
        >
          SKILLS
        </motion.h1>
      </div>

      <div className="w-full max-w-[1400px] mx-auto z-10 flex flex-col pt-10">
        {/* Header matching site style */}
        <motion.div 
          className="flex flex-col mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-white/30" />
            <span className="text-[10px] tracking-[0.4em] font-light text-white/50 uppercase">
              Architecture & Tech
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight uppercase leading-[1.1]">
            03 —— <br className="md:hidden" /><span className="font-bold">Stack Architecture.</span>
          </h2>
        </motion.div>

        {/* Split Layout Container */}
        <div className="flex flex-col lg:flex-row w-full gap-12 lg:gap-24">
          
          {/* Left Diagram Container */}
          <motion.div 
            className="w-full lg:w-[45%] lg:sticky lg:top-32 relative border border-white/5 bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden self-start"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Subtle Gradient Glow in bg */}
            <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent pointer-events-none" />
            <ArchitectureDiagram />
          </motion.div>

          {/* Right Skills List */}
          <div className="w-full lg:w-[55%] flex flex-col gap-10 lg:gap-14 lg:py-10">
            {skillCategories.map((cat, index) => (
              <motion.div
                key={index}
                className="flex flex-col border-t border-white/8 pt-6 group/cat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono tracking-[0.2em] text-white/30 group-hover/cat:text-white/50 transition-colors duration-500">
                    {cat.label}
                  </span>
                  <span className="text-sm font-semibold tracking-widest text-white/50 uppercase">
                    {cat.title}
                  </span>
                </div>

                {/* Skill Items */}
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  {cat.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="group relative flex items-center gap-3 cursor-crosshair py-1"
                      style={{ "--brand-color": skill.color }}
                    >
                      {/* Indicator Dot */}
                      {skill.key ? (
                        <div className="relative w-1.5 h-1.5 flex items-center justify-center">
                          <span className="absolute w-full h-full rounded-full bg-white/20 group-hover:bg-[var(--brand-color)] group-hover:shadow-[0_0_8px_var(--brand-color)] transition-colors duration-300" />
                          <span className="absolute w-full h-full rounded-full bg-[var(--brand-color)] opacity-0 group-hover:animate-ping" />
                        </div>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-sm border border-white/10 group-hover:border-[var(--brand-color)] group-hover:bg-white/20 transition-all duration-300" />
                      )}

                      {/* Brand Logo */}
                      <i className={`${skill.icon} text-xl md:text-2xl text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.25)] transition-all duration-300 group-hover:[-webkit-text-stroke:0px] group-hover:text-[var(--brand-color)] group-hover:scale-110 will-change-transform`} />

                      {/* Text Outline to Fill Effect */}
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.25)] transition-all duration-300 group-hover:[-webkit-text-stroke:0px] group-hover:text-[var(--brand-color)] group-hover:translate-x-2 will-change-transform">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Skills;
