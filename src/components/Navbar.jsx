import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/navbar.css';

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
    let rafId = null;

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

    const handleScrollThrottled = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        checkSection();
        rafId = null;
      });
    };

    checkSection(); // Initial check
    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    window.addEventListener('resize', handleScrollThrottled, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollThrottled);
      window.removeEventListener('resize', handleScrollThrottled);
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
        } catch (e) { // eslint-disable-line no-unused-vars
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
    </>
  );
};

export default Navbar;
