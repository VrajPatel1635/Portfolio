import { useState, useEffect, useRef, useCallback } from 'react';

const navItems = [
  { num: '01', label: 'HOME', href: '#home', desc: 'Back to the beginning' },
  { num: '02', label: 'ABOUT', href: '#about', desc: 'Who I am & what drives me' },
  { num: '03', label: 'SKILLS', href: '#skills', desc: 'Technologies & expertise' },
  { num: '04', label: 'PROJECTS', href: '#work', desc: 'Selected works & case studies' },
  { num: '05', label: 'CONTACT', href: '#contact', desc: 'Let\'s build something together' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [onLightSection, setOnLightSection] = useState(false);
  const overlayRef = useRef(null);
  const hamburgerRef = useRef(null);

  const openMenu = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsClosing(false);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 900);
  };

  const closeMenu = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsClosing(true);
    setIsOpen(false);
    // Wait for close animation to fully complete, then remove from DOM
    setTimeout(() => {
      setIsClosing(false);
      setIsAnimating(false);
    }, 900);
  }, [isAnimating]);

  // Keyboard: Escape key closes the overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  // Detect if hamburger is over a light-background section
  useEffect(() => {
    const checkSection = () => {
      if (!hamburgerRef.current || isOpen) return;
      const btn = hamburgerRef.current;
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Temporarily hide button to get element behind it
      btn.style.pointerEvents = 'none';
      const el = document.elementFromPoint(centerX, centerY);
      btn.style.pointerEvents = 'auto';

      if (el) {
        // Walk up to find the nearest section or element with a background
        let current = el;
        while (current && current !== document.body) {
          const bg = window.getComputedStyle(current).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            // Parse RGB values
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
              const r = parseInt(match[1]);
              const g = parseInt(match[2]);
              const b = parseInt(match[3]);
              // Luminance check — light if > 180
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
              setOnLightSection(luminance > 180);
              return;
            }
          }
          current = current.parentElement;
        }
        setOnLightSection(false);
      }
    };

    checkSection();
    window.addEventListener('scroll', checkSection, { passive: true });
    window.addEventListener('resize', checkSection, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkSection);
      window.removeEventListener('resize', checkSection);
    };
  }, [isOpen]);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const hash = `#${entry.target.id}`;
            const index = navItems.findIndex((item) => item.href === hash);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    const timeoutId = setTimeout(() => {
      navItems.forEach((item) => {
        try {
          const el = document.querySelector(item.href);
          if (el) observer.observe(el);
        } catch (e) {
          // ignore invalid selectors if any
        }
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!isClosing) {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isClosing]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 700);
  };

  const displayNum = hoveredIndex >= 0 ? navItems[hoveredIndex].num : navItems[activeIndex]?.num || '00';
  const displayDesc = hoveredIndex >= 0 ? navItems[hoveredIndex].desc : navItems[activeIndex]?.desc || 'Navigate';

  // Determine overlay class
  const overlayClass = isOpen ? 'open' : isClosing ? 'closing' : '';

  return (
    <>
      {/* ─── HAMBURGER BUTTON ─── */}
      <button
        ref={hamburgerRef}
        id="nav-hamburger-btn"
        className={`nav-hamburger ${isOpen ? 'active' : ''} ${onLightSection && !isOpen ? 'on-light' : ''}`}
        onClick={isOpen ? closeMenu : openMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="nav-overlay"
      >
        <div className="hamburger-box">
          <span className="hamburger-line line-1" />
          <span className="hamburger-line line-2" />
          <span className="hamburger-line line-3" />
        </div>
        {/* Rotating border ring */}
        <svg className="hamburger-ring" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="46"
            fill="none"
            className="hamburger-ring-bg"
            strokeWidth="1"
          />
          <circle
            cx="50" cy="50" r="46"
            fill="none"
            className="hamburger-ring-dash"
            strokeWidth="1"
            strokeDasharray="30 258"
          />
        </svg>
      </button>

      {/* ─── FULLSCREEN OVERLAY ─── */}
      <div className={`nav-overlay ${overlayClass}`} ref={overlayRef} id="nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
        {/* Curtain panels */}
        <div className="curtain-left" />
        <div className="curtain-right" />

        {/* Content layer (above curtains) */}
        <div className="nav-overlay-content">

          {/* Top bar inside overlay */}
          <div className="nav-overlay-topbar">
            <div className="nav-overlay-logo">VP</div>
            <div className="nav-overlay-menu-label">MENU</div>
          </div>

          {/* Main nav area — split layout */}
          <div className="nav-overlay-main">

            {/* Left: nav links */}
            <div className="nav-links-col">
              {navItems.map((item, i) => (
                <a
                  key={item.num}
                  href={item.href}
                  className={`nav-link-item hover-trigger ${hoveredIndex === i ? 'hovered' : ''} ${hoveredIndex >= 0 && hoveredIndex !== i ? 'dimmed' : ''}`}
                  style={{ transitionDelay: isOpen ? `${0.35 + i * 0.07}s` : `${0.05 + (navItems.length - 1 - i) * 0.04}s` }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span className="nav-link-num">{item.num}</span>
                  <span className="nav-link-dash">——</span>
                  <span className="nav-link-text">{item.label}</span>
                </a>
              ))}
            </div>

            {/* Right: decorative giant number + description */}
            <div className="nav-decor-col">
              <div className="nav-giant-num" key={displayNum}>
                {displayNum}
              </div>
              <div className="nav-decor-line" />
              <div className="nav-decor-desc">{displayDesc}</div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="nav-overlay-bottom">
            <div className="nav-bottom-socials">
              <a href="https://github.com/VrajPatel1635" target="_blank" rel="noopener noreferrer" className="nav-social-link hover-trigger">
                GITHUB
              </a>
              <a href="https://www.linkedin.com/in/vraj-patel-b5111a25b/" target="_blank" rel="noopener noreferrer" className="nav-social-link hover-trigger">
                LINKEDIN
              </a>
            </div>
            <div className="nav-bottom-email uppercase">
              Vraj Patel
            </div>
          </div>
        </div>
      </div>

      {/* ─── STYLES ─── */}
      <style>{`
        /* ════════════════════════════════════════
           HAMBURGER BUTTON
        ════════════════════════════════════════ */
        .nav-hamburger {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          width: 60px;
          height: 60px;
          background: rgba(5, 5, 5, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.4s ease, transform 0.3s ease, border-color 0.4s ease;
          mix-blend-mode: normal;
          pointer-events: auto;
        }
        .nav-hamburger:hover {
          background: rgba(10, 10, 10, 0.85);
          border-color: rgba(255, 255, 255, 0.15);
          transform: scale(1.08);
        }
        .nav-hamburger:hover .hamburger-ring-dash {
          stroke: rgba(255, 255, 255, 0.6);
        }

        /* ── Light-section variant (over white/light backgrounds) ── */
        .nav-hamburger.on-light {
          background: rgba(10, 10, 10, 0.85);
          border-color: rgba(0, 0, 0, 0.1);
        }
        .nav-hamburger.on-light:hover {
          background: rgba(10, 10, 10, 0.95);
          transform: scale(1.08);
        }
        .nav-hamburger.on-light .hamburger-line {
          background: #ffffff;
        }
        .nav-hamburger.on-light .hamburger-ring-bg {
          stroke: rgba(255, 255, 255, 0.1);
        }
        .nav-hamburger.on-light .hamburger-ring-dash {
          stroke: rgba(255, 255, 255, 0.4);
        }
        .nav-hamburger.on-light:hover .hamburger-ring-dash {
          stroke: rgba(255, 255, 255, 0.7);
        }

        /* Ring */
        .hamburger-ring {
          position: absolute;
          inset: -4px;
          width: calc(100% + 8px);
          height: calc(100% + 8px);
          animation: ring-spin 8s linear infinite;
          pointer-events: none;
        }
        .hamburger-ring-bg {
          stroke: rgba(255, 255, 255, 0.08);
          transition: stroke 0.4s ease;
        }
        .hamburger-ring-dash {
          stroke: rgba(255, 255, 255, 0.3);
          transition: stroke 0.3s ease;
        }
        @keyframes ring-spin {
          100% { transform: rotate(360deg); }
        }

        /* Hamburger lines — staggered asymmetric */
        .hamburger-box {
          position: relative;
          width: 22px;
          height: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
        }
        .hamburger-line {
          display: block;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.5s cubic-bezier(0.76, 0, 0.24, 1);
          transform-origin: center;
        }
        .line-1 {
          width: 22px;
        }
        .line-2 {
          width: 14px;
        }
        .line-3 {
          width: 18px;
        }

        /* Hover: lines equalize */
        .nav-hamburger:hover .line-2 {
          width: 22px;
        }
        .nav-hamburger:hover .line-3 {
          width: 22px;
        }

        /* Active state: morph to X */
        .nav-hamburger.active {
          background: rgba(10, 10, 10, 0.6);
          border-color: rgba(255, 255, 255, 0.08);
        }
        .nav-hamburger.active .hamburger-box {
          align-items: center;
        }
        .nav-hamburger.active .line-1 {
          width: 22px;
          transform: translateY(7px) rotate(45deg);
        }
        .nav-hamburger.active .line-2 {
          width: 0;
          opacity: 0;
        }
        .nav-hamburger.active .line-3 {
          width: 22px;
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ════════════════════════════════════════
           OVERLAY — with closing animation
        ════════════════════════════════════════ */
        .nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 900;
          pointer-events: none;
          visibility: hidden;
        }
        .nav-overlay.open {
          pointer-events: auto;
          visibility: visible;
        }
        /* Keep visible during close animation */
        .nav-overlay.closing {
          pointer-events: none;
          visibility: visible;
        }

        /* Curtain panels */
        .curtain-left,
        .curtain-right {
          position: absolute;
          top: 0;
          width: 51%;
          height: 100%;
          background: #0a0a0a;
          transition: transform 0.7s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 1;
        }
        .curtain-left {
          left: 0;
          transform: translateX(-100%);
        }
        .curtain-right {
          right: 0;
          transform: translateX(100%);
        }
        /* Open: curtains slide in */
        .nav-overlay.open .curtain-left {
          transform: translateX(0);
        }
        .nav-overlay.open .curtain-right {
          transform: translateX(0);
        }
        /* Closing: curtains slide back out */
        .nav-overlay.closing .curtain-left {
          transform: translateX(-100%);
          transition-delay: 0.15s;
        }
        .nav-overlay.closing .curtain-right {
          transform: translateX(100%);
          transition-delay: 0.15s;
        }

        /* Content layer */
        .nav-overlay-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 2.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          transition-delay: 0s;
        }
        .nav-overlay.open .nav-overlay-content {
          opacity: 1;
          transition-delay: 0.4s;
        }
        /* Closing: content fades out first */
        .nav-overlay.closing .nav-overlay-content {
          opacity: 0;
          transition-delay: 0s;
          transition-duration: 0.2s;
        }

        /* Top bar */
        .nav-overlay-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .nav-overlay-logo {
          font-family: "Orbitron", sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.08em;
        }
        .nav-overlay-menu-label {
          font-family: "Rajdhani", sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
        }

        /* Main area — flex row */
        .nav-overlay-main {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 4rem;
          padding: 2rem 0;
        }

        /* Left column: links */
        .nav-links-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-left: 2rem;
        }

        /* Each nav link */
        .nav-link-item {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          text-decoration: none;
          padding: 1rem 0;
          transform: translateY(40px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.5s ease,
                      color 0.3s ease,
                      padding-left 0.4s ease;
        }
        .nav-overlay.open .nav-link-item {
          transform: translateY(0);
          opacity: 1;
        }
        /* Closing: links slide back down */
        .nav-overlay.closing .nav-link-item {
          transform: translateY(40px);
          opacity: 0;
        }
        .nav-link-item.dimmed {
          opacity: 0.2 !important;
        }
        .nav-link-item.hovered {
          padding-left: 1.5rem;
        }

        .nav-link-num {
          font-family: "Rajdhani", sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.08em;
          min-width: 1.5rem;
        }
        .nav-link-dash {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.12);
          letter-spacing: 0.15em;
        }
        .nav-link-text {
          font-family: "Orbitron", sans-serif;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.03em;
          line-height: 1.1;
          transition: text-shadow 0.3s ease;
        }
        .nav-link-item.hovered .nav-link-text {
          text-shadow: 0 0 40px rgba(255, 255, 255, 0.12);
        }

        /* Right column: decorative */
        .nav-decor-col {
          flex: 0 0 35%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding-right: 2rem;
        }
        .nav-giant-num {
          font-family: "Orbitron", sans-serif;
          font-size: clamp(100px, 18vw, 250px);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
          line-height: 0.85;
          transition: -webkit-text-stroke-color 0.4s ease;
          user-select: none;
        }
        .nav-decor-line {
          width: 60px;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
          margin: 1.5rem 0;
        }
        .nav-decor-desc {
          font-family: "Rajdhani", sans-serif;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.05em;
          max-width: 220px;
          line-height: 1.5;
        }

        /* Bottom bar */
        .nav-overlay-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .nav-bottom-socials {
          display: flex;
          gap: 2rem;
        }
        .nav-social-link {
          font-family: "Rajdhani", sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }
        .nav-social-link:hover {
          color: #ffffff;
        }
        .nav-bottom-email {
          font-family: "Rajdhani", sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.2);
        }

        /* ════════════════════════════════════════
           RESPONSIVE
        ════════════════════════════════════════ */
        @media (max-width: 768px) {
          .nav-overlay-content {
            padding: 1.5rem 1.5rem;
          }
          .nav-overlay-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 2rem;
          }
          .nav-links-col {
            padding-left: 0;
          }
          .nav-link-text {
            font-size: clamp(1.8rem, 8vw, 2.8rem);
          }
          .nav-decor-col {
            display: none;
          }
          .nav-link-item {
            padding: 0.7rem 0;
          }
          .nav-hamburger {
            width: 50px;
            height: 50px;
            top: 1rem;
            right: 1rem;
          }
          .hamburger-box {
            width: 18px;
            height: 14px;
          }
          .line-1 { width: 18px; }
          .line-2 { width: 11px; }
          .line-3 { width: 15px; }
          .nav-hamburger:hover .line-2 { width: 18px; }
          .nav-hamburger:hover .line-3 { width: 18px; }
          .nav-hamburger.active .line-1 {
            transform: translateY(6px) rotate(45deg);
            width: 18px;
          }
          .nav-hamburger.active .line-3 {
            transform: translateY(-6px) rotate(-45deg);
            width: 18px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
