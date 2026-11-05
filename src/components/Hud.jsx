// Hud.jsx
// Fixed top navigation bar with live clock, rotating status line,
// initials badge, and a mobile slide-down menu.
import { useEffect, useMemo, useState } from 'react';

import { heroContent, navLinks, personalInfo } from '../data/portfolioData';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive initials from a name string (up to 2 characters). */
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Build an Intl formatter for HH:MM:SS in the given IANA timezone. */
function makeFormatter(tz) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Hud() {
  const initials  = getInitials(personalInfo.brandName);
  const formatter = useMemo(() => makeFormatter(personalInfo.timezone), []);

  // Scroll-based frosted background
  const [scrolled,    setScrolled]    = useState(false);
  // Mobile menu open/closed
  const [menuOpen,    setMenuOpen]    = useState(false);
  // Live clock string
  const [clockStr,    setClockStr]    = useState(() => formatter.format(new Date()));
  // Index into heroContent.statusLines
  const [statusIndex, setStatusIndex] = useState(0);

  // ── Scroll listener (> 40px toggles frosted state) ─────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Live Clock — updates every second ──────────────────────────────────────
  useEffect(() => {
    const clockId = setInterval(() => {
      setClockStr(formatter.format(new Date()));
    }, 1000);
    return () => clearInterval(clockId);
  }, [formatter]);

  // ── Status line — rotates every 3.5 s ─────────────────────────────────────
  useEffect(() => {
    const lines = heroContent?.statusLines || [];
    if (lines.length <= 1) return;
    const statusId = setInterval(() => {
      setStatusIndex((i) => (i + 1) % lines.length);
    }, 3500);
    return () => clearInterval(statusId);
  }, []);

  // ── Close mobile menu on resize to md+ ────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Frosted bar when scrolled OR mobile menu is open
  const isFrosted = scrolled || menuOpen;
  const statusLines = heroContent?.statusLines || [];
  const currentStatus = statusLines[statusIndex] || '';

  return (
    <header
      role="banner"
      className={[
        'fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300',
        isFrosted
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-full flex items-center justify-between gap-4">

        {/* ── Left: badge + brand name ──────────────────────────────────── */}
        <a
          href="#home"
          className="flex items-center gap-3 shrink-0 group"
          aria-label={`${personalInfo.brandName} — scroll to top`}
        >
          {/* 32px square badge */}
          <span className="flex items-center justify-center w-8 h-8 shrink-0 border border-signal font-mono text-xs font-semibold text-signal select-none">
            {initials}
          </span>

          {/* Brand name — sm and up */}
          <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-[0.2em] text-bone/80 group-hover:text-bone transition-colors">
            {personalInfo.brandName}
          </span>
        </a>

        {/* ── Centre: pulsing dot + rotating status line (lg+) ─────────── */}
        <div
          className="hidden lg:flex items-center gap-2 min-w-0"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Pulsing 6px signal dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shrink-0" />
          {/* Status text */}
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim truncate">
            {currentStatus}
          </span>
        </div>

        {/* ── Right: nav links + clock (md+) + mobile menu button ──────── */}
        <div className="flex items-center gap-6">

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Live clock (md+) */}
          <time
            className="hidden md:block font-mono text-xs tabular-nums text-dim"
            title={personalInfo.timezone}
            dateTime={clockStr}
          >
            {clockStr}
          </time>

          {/* Mobile menu toggle (below md) */}
          <button
            type="button"
            className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown panel ─────────────────────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-ink/95 backdrop-blur-md border-b border-bone/10 px-5"
        >
          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block border-b border-bone/10 py-4 text-2xl font-semibold text-bone hover:text-signal transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* City + clock in the mobile panel */}
          <div className="flex items-center justify-between py-4 font-mono text-xs uppercase tracking-[0.18em] text-dim">
            <span>{personalInfo.city}</span>
            <time
              className="tabular-nums"
              title={personalInfo.timezone}
              dateTime={clockStr}
            >
              {clockStr}
            </time>
          </div>
        </div>
      )}
    </header>
  );
}
