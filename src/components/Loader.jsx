// src/components/Loader.jsx
import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [percent, setPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Slower random jumps for a more premium, unhurried fluid fill
      current += Math.floor(Math.random() * 3) + 1;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        
        // Wait 400ms for wave to settle, then begin fade out
        setTimeout(() => {
          setIsFading(true);
          // Remove from DOM entirely following 1-second CSS transition
          setTimeout(() => setIsVisible(false), 1000);
        }, 400);
      }
      setPercent(current);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Map 0% -> 240 (just below text) and 100% -> 60 (just above text)
  // This tightly synchronizes the visual water level exactly against the typography height
  const yOffset = 240 - (percent / 100) * 180;

  if (!isVisible) return null;

  return (
    <div 
      id="loader" 
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="relative w-full max-w-7xl px-4 flex flex-col items-center justify-center h-full">
        
        {/* SVG Liquid Text Container */}
        <div className="relative w-full h-[30vh] sm:h-[40vh] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <mask id="text-mask">
                <rect width="100%" height="100%" fill="black" />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="font-sans font-black tracking-tighter"
                  fill="white"
                  style={{ fontSize: '140px' }}
                >
                  Vraj Patel
                </text>
              </mask>

              <linearGradient id="mercury-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Empty Outline State */}
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="font-sans font-black tracking-tighter"
              fill="rgba(255, 255, 255, 0.03)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
              style={{ fontSize: '140px' }}
            >
              Vraj Patel
            </text>

            {/* Liquid Fill Group via Mask */}
            <g mask="url(#text-mask)">
              {/* CSS Transform group for vertical fill */}
              <g style={{ transform: `translateY(${yOffset}px)`, transition: 'transform 0.4s ease-out' }}>
                {/* 
                  SVG animateTransform for seamless horizontal wave.
                  The path is exactly 2000 units wide. The repeating segment is 500 units.
                  Panning by -500 perfectly loops the sine wave.
                */}
                <path 
                  fill="url(#mercury-gradient)" 
                  d="M 0,0 Q 125,40 250,0 T 500,0 T 750,0 T 1000,0 T 1250,0 T 1500,0 L 1500,1000 L 0,1000 Z"
                >
                  <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    from="0 0" 
                    to="-500 0" 
                    dur="2.5s" 
                    repeatCount="indefinite" 
                  />
                </path>
              </g>
            </g>
          </svg>
        </div>

        {/* Repositioned Counter styled for premium tech aesthetics */}
        <div className="absolute right-8 bottom-8 md:right-16 md:bottom-16 flex flex-col items-end">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-slate-500 mb-2">
            System Initialization
          </div>
          <div className="font-mono text-3xl md:text-5xl font-light text-slate-200 tabular-nums tracking-widest relative">
            {percent.toString().padStart(3, '0')}
            <span className="text-slate-600 ml-1 text-xl md:text-3xl">%</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loader;
