import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { containerVariants, itemVariants, scaleLine } from '../utils/animations';
import { Button } from './ui/Button';
import '../styles/index.css';
import '../styles/hero.css';

const Hero = () => {
  // True parallax with framer-motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Inverse transforms for parallax depth
  const moveX_large = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const moveY_large = useTransform(smoothY, [-0.5, 0.5], [-25, 25]);

  const moveX_medium = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const moveY_medium = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  const moveX_small = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const moveY_small = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalizes scroll safely between -0.5 and 0.5
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToProjects = () => {
    const el = document.getElementById('work')
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Dot grid generator
  const dotGrid = [];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 8; col++) {
      dotGrid.push(
        <circle
          key={`${row}-${col}`}
          cx={col * 28 + 14}
          cy={row * 28 + 14}
          r="2"
          fill="#d4d4d4"
        />
      );
    }
  }

  return (
    // id="home" added so the Navbar #home anchor resolves correctly
    <section
      id="home"
      className="relative w-full min-h-dvh flex flex-col justify-center overflow-hidden z-10 pointer-events-none"
      style={{ background: '#ffffff' }}
    >
      {/* Top & Bottom thin horizontal lines */}
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: '#e5e5e5' }} />
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: '#e5e5e5' }} />

      {/* Large "01" watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.1 }}
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          left: '-2%',
          fontSize: 'clamp(200px, 28vw, 400px)',
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 900,
          color: '#f5f5f5',
          lineHeight: 1,
          x: moveX_large,
          y: moveY_large,
        }}
      >
        01
      </motion.div>

      {/* "+" Crosshair markers */}
      {[
        { top: '8%', left: '6%' },
        { top: '12%', right: '8%' },
        { bottom: '15%', left: '48%' },
        { bottom: '8%', right: '12%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
          viewport={{ once: false, amount: 0.1 }}
          className="absolute pointer-events-none select-none"
          aria-hidden="true"
          style={{
            ...pos,
            color: '#d4d4d4',
            fontSize: '18px',
            fontWeight: 300,
            fontFamily: 'monospace',
            x: moveX_small,
            y: moveY_small,
          }}
        >
          +
        </motion.div>
      ))}

      {/* Dot grid background (right side) */}
      <motion.svg
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        viewport={{ once: false, amount: 0.1 }}
        className="absolute pointer-events-none select-none"
        aria-hidden="true"
        style={{
          right: '5%',
          top: '15%',
          width: '224px',
          height: '336px',
          x: moveX_medium,
          y: moveY_medium,
        }}
      >
        {dotGrid}
      </motion.svg>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-20 w-full max-w-350 mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-8">

          {/* ── LEFT COLUMN ── */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="flex-1 lg:max-w-[55%]"
          >
            {/* Giant Name */}
            <div className="mb-2">
              <div className="overflow-hidden pb-2">
                <motion.h1
                  variants={{
                    hidden: { y: "110%" },
                    visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="leading-[0.85] font-black uppercase tracking-tighter"
                  style={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: 'clamp(60px, 10vw, 140px)',
                    color: '#0a0a0a',
                    margin: 0,
                  }}
                >
                  VRAJ
                </motion.h1>
              </div>
              <div className="overflow-hidden pb-4">
                <motion.h1
                  variants={{
                    hidden: { y: "110%" },
                    visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="leading-[0.85] font-black uppercase tracking-tighter"
                  style={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: 'clamp(60px, 10vw, 140px)',
                    color: 'transparent',
                    WebkitTextStroke: '2px #0a0a0a',
                    margin: 0,
                  }}
                >
                  PATEL
                </motion.h1>
              </div>
            </div>

            {/* Divider line */}
            <motion.div
              variants={scaleLine}
              style={{ transformOrigin: "left" }}
              className="my-7 w-15 h-0.5 bg-[#0a0a0a]"
            />

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg leading-relaxed max-w-md mb-9 font-medium"
              style={{
                color: '#888',
                fontFamily: '"Rajdhani", sans-serif',
              }}
            >
              Engineering student building modern web applications — focused on the MERN stack, AI exploration, and real-world problem solving.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 pointer-events-auto"
            >
              <Button onClick={scrollToProjects} variant="primary" className="group">
                <span>VIEW PROJECTS</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>

              <Button onClick={scrollToContact} variant="outline">
                LET'S TALK
              </Button>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 5, y: 0 }}
            animate={{ opacity: 1, x: 0, rotate: 0, y: [-4, 4, -4] }}
            transition={{
              opacity: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
              x: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
              rotate: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="flex-1 lg:max-w-[42%] w-full"
          >
            {/* Code editor card */}
            <div
              className="relative"
              style={{
                border: '1px solid #e5e5e5',
                background: '#fafafa',
                boxShadow: '4px 4px 0px #0a0a0a',
              }}
            >
              {/* Window bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '1px solid #e5e5e5' }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: '#FF605C', border: '1px solid #d4d4d4' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#FFBD44', border: '1px solid #d4d4d4' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#00CA4E', border: '1px solid #d4d4d4' }} />
                <span
                  className="ml-3 text-xs tracking-wider uppercase"
                  style={{ color: '#282828', fontFamily: 'monospace' }}
                >
                  developer.js
                </span>
              </div>

              {/* Code content */}
              <div className="px-5 py-5" style={{ fontFamily: '"Fira Code", "Courier New", monospace', fontSize: '13px', lineHeight: '1.9' }}>
                {[
                  { num: '1', code: <><span style={{ color: '#7c7c7c' }}>const</span> <span style={{ color: '#0a0a0a' }}>developer</span> <span style={{ color: '#7c7c7c' }}>=</span> {'{'}</> },
                  { num: '2', code: <>&nbsp;&nbsp;name: <span style={{ color: '#555' }}>"Vraj Patel"</span>,</> },
                  { num: '3', code: <>&nbsp;&nbsp;role: <span style={{ color: '#555' }}>"Full-Stack Dev"</span>,</> },
                  { num: '4', code: <>&nbsp;&nbsp;stack: [<span style={{ color: '#555' }}>"React"</span>, <span style={{ color: '#555' }}>"Node"</span>, <span style={{ color: '#555' }}>"MongoDB"</span>],</> },
                  { num: '5', code: <>&nbsp;&nbsp;passion: <span style={{ color: '#555' }}>"Building things"</span>,</> },
                  { num: '6', code: <>{'};'}</> },
                ].map((line) => (
                  <div key={line.num} className="flex items-start gap-4">
                    <span className="select-none w-5 text-right" style={{ color: '#ccc', fontSize: '12px' }}>
                      {line.num}
                    </span>
                    <span style={{ color: '#0a0a0a' }}>{line.code}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== ROTATING SCROLL BADGE ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        viewport={{ once: false, amount: 0.1 }}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 pointer-events-auto z-30"
      >
        <div
          onClick={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center"
          role="button"
          aria-label="Scroll down to About section"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {/* Rotating text */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            aria-hidden="true"
            style={{ animation: 'spin-slow 12s linear infinite' }}
          >
            <defs>
              <path
                id="scrollCirclePath"
                d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
              />
            </defs>
            <text
              style={{
                fontSize: '10.5px',
                letterSpacing: '3.5px',
                fill: '#999',
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              <textPath href="#scrollCirclePath">
                SCROLL DOWN · SCROLL DOWN · 
              </textPath>
            </text>
          </svg>
          {/* Center arrow */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0a0a0a" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
