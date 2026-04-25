// src/components/Loader.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import '../styles/loader.css';

/* ── Loading phase labels ── */
const PHASES = [
  'Initializing',
  'Loading Assets',
  'Building Interface',
  'Calibrating',
  'Rendering',
  'Almost Ready',
  'Launching',
];

const DIGIT_HEIGHT = 56; // must match --digit-h CSS var (desktop)

/* ── Single rolling digit column ── */
const DigitRoller = memo(({ digit }) => (
  <div className="loader-digit-window">
    <div
      className="loader-digit-track"
      style={{ transform: `translateY(-${digit * DIGIT_HEIGHT}px)` }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
        <div key={d} className="loader-digit-cell">{d}</div>
      ))}
    </div>
  </div>
));
DigitRoller.displayName = 'DigitRoller';

/* ── Main Loader ── */
const Loader = ({ onComplete }) => {
  const [percent, setPercent]       = useState(0);   // integer — drives digits only
  const [isVisible, setIsVisible]   = useState(true);
  const [isFading, setIsFading]     = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [phaseIdx, setPhaseIdx]     = useState(0);

  // DOM refs — wave & bar updated directly in rAF (no React re-render overhead)
  const waveGroupRef = useRef(null);
  const barFillRef   = useRef(null);
  const rafRef       = useRef(null);
  const startRef     = useRef(null);

  const DURATION_MS = 3600;

  /* Trigger entry classes after first paint */
  useEffect(() => {
    const t = setTimeout(() => setHasEntered(true), 40);
    return () => clearTimeout(t);
  }, []);

  /* rAF loop — single source of truth for all animations */
  useEffect(() => {
    let lastInt = -1;

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;

      const elapsed = Math.min(ts - startRef.current, DURATION_MS);
      const raw     = elapsed / DURATION_MS;

      // ease-out cubic — fast start, decelerates near 100
      const eased = 1 - Math.pow(1 - raw, 2.8);

      /* ── Wave: direct DOM mutation — perfectly in sync, no CSS transition lag ── */
      if (waveGroupRef.current) {
        const yOffset = 240 - eased * 180;
        waveGroupRef.current.style.transform = `translateY(${yOffset}px)`;
      }

      /* ── Progress bar: also direct DOM ── */
      if (barFillRef.current) {
        barFillRef.current.style.width = `${eased * 100}%`;
      }

      /* ── Digits & phase: integer state (low-frequency, ~100 updates total) ── */
      const newInt = Math.min(Math.floor(eased * 100), 100);
      if (newInt !== lastInt) {
        lastInt = newInt;
        setPercent(newInt);
        setPhaseIdx(
          Math.min(Math.floor((newInt / 100) * (PHASES.length - 1)), PHASES.length - 1)
        );
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        /* Done — hold 500ms, then fade */
        setTimeout(() => {
          setIsFading(true);
          if (onComplete) onComplete();
          setTimeout(() => setIsVisible(false), 1000);
        }, 500);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  /* Digits */
  const hundreds = Math.floor(percent / 100);
  const tens     = Math.floor((percent % 100) / 10);
  const ones     = percent % 10;

  const entered = hasEntered ? 'in' : '';
  const exit    = isFading   ? 'exit' : '';

  if (!isVisible) return null;

  return (
    <div id="loader" className={isFading ? 'loader-fading' : ''}>

      {/* Ambient depth */}
      <div className="loader-ambient" aria-hidden="true" />

      {/* Corner brackets */}
      <div className={`loader-corner loader-corner--tl ${entered}`} aria-hidden="true" />
      <div className={`loader-corner loader-corner--tr ${entered}`} aria-hidden="true" />
      <div className={`loader-corner loader-corner--bl ${entered}`} aria-hidden="true" />
      <div className={`loader-corner loader-corner--br ${entered}`} aria-hidden="true" />

      {/* ── Liquid text SVG ── */}
      <div className={`loader-svg-wrapper ${entered} ${exit}`}>
        <svg
          className="loader-svg"
          viewBox="0 0 1000 300"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <mask id="ldr-text-mask">
              <rect width="100%" height="100%" fill="black" />
              <text
                x="50%" y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                style={{
                  fontSize: '140px',
                  fontFamily: 'Inter, ui-sans-serif, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-4px',
                }}
              >
                Vraj Patel
              </text>
            </mask>

            <linearGradient id="ldr-wg1" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"   stopColor="#94a3b8" />
              <stop offset="55%"  stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Ghost outline */}
          <text
            x="50%" y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1.5"
            style={{
              fontSize: '140px',
              fontFamily: 'Inter, ui-sans-serif, sans-serif',
              fontWeight: 900,
              letterSpacing: '-4px',
            }}
          >
            Vraj Patel
          </text>

          {/* Liquid fill — ref updated directly in rAF, NO CSS transition */}
          <g mask="url(#ldr-text-mask)">
            <g ref={waveGroupRef} style={{ transform: 'translateY(240px)' }}>
              {/* Layer 1 — primary fill (fastest wave) */}
              <path fill="url(#ldr-wg1)"
                d="M 0,0 Q 125,40 250,0 T 500,0 T 750,0 T 1000,0 T 1250,0 T 1500,0 L 1500,1000 L 0,1000 Z">
                <animateTransform attributeName="transform" type="translate"
                  from="0 0" to="-500 0" dur="2.2s" repeatCount="indefinite" />
              </path>
              {/* Layer 2 — mid ripple */}
              <path fill="rgba(255,255,255,0.14)"
                d="M 0,18 Q 100,52 200,18 T 400,18 T 600,18 T 800,18 T 1000,18 T 1200,18 T 1400,18 L 1400,1000 L 0,1000 Z">
                <animateTransform attributeName="transform" type="translate"
                  from="-180 0" to="-680 0" dur="3.4s" repeatCount="indefinite" />
              </path>
              {/* Layer 3 — surface shimmer */}
              <path fill="rgba(255,255,255,0.06)"
                d="M 0,32 Q 80,62 160,32 T 320,32 T 480,32 T 640,32 T 800,32 T 960,32 T 1120,32 T 1280,32 T 1440,32 L 1440,1000 L 0,1000 Z">
                <animateTransform attributeName="transform" type="translate"
                  from="-80 0" to="-400 0" dur="5s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </svg>
      </div>

      {/* ── Slot-machine counter ── */}
      <div
        className={`loader-counter ${entered} ${exit}`}
        role="status"
        aria-live="polite"
        aria-label={`Loading ${percent} percent`}
      >
        {/* Phase label */}
        <div className="loader-phase">{PHASES[phaseIdx]}</div>

        {/* Rolling digits */}
        <div className="loader-digits" aria-hidden="true">
          <DigitRoller digit={hundreds} />
          <DigitRoller digit={tens} />
          <DigitRoller digit={ones} />
          <span className="loader-pct">%</span>
        </div>

        {/* Thin progress bar — ref updated directly in rAF */}
        <div className="loader-bar-track" aria-hidden="true">
          <div ref={barFillRef} className="loader-bar-fill" style={{ width: '0%' }} />
        </div>
      </div>

      {/* Scan line */}
      <div className={`loader-scanline ${entered}`} aria-hidden="true" />

    </div>
  );
};

export default Loader;
