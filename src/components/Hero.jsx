// Hero.jsx
// Hero section with technical Signal HUD aesthetic.
// Features dual-line typography (solid + outlined) with decode text effects,
// lazy-loaded Three.js 3D signal core, and GSAP entrance animations.
import { lazy, Suspense, useEffect, useRef } from 'react';

import gsap from 'gsap';

import { heroContent, personalInfo } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// Lazy load the Three.js 3D scene so that Three.js is loaded in its own separate bundle.
const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero() {
  const sectionRef = useRef(null);
  const dividerRef = useRef(null);

  // Split name into first word (solid text) and remaining words (outlined text).
  const nameParts = (personalInfo.name || '').trim().split(' ');
  const firstWord = nameParts[0] || '';
  const restWords = nameParts.slice(1).join(' ') || '';

  // ── GSAP Entrance Animation ────────────────────────────────────────────────
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Elements marked data-hero="fade" animate from { opacity: 0, y: 30 }
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3,
        }
      );

      // Divider scales from scaleX 0 to 1 originating from the left
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.inOut',
            delay: 0.3,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative hud-grid min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      {/* ── Main Two-Column Grid ─────────────────────────────────────────── */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 my-auto">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 md:gap-7">

          {/* (1) Eyebrow */}
          <div data-hero="fade">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium">
              {heroContent.eyebrow}
            </span>
          </div>

          {/* (2) Dual-line Name Heading */}
          <div data-hero="fade">
            <h1 className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] flex flex-col select-none">
              <span className="text-bone">
                <ScrambleText text={firstWord} trigger="mount" delay={200} />
              </span>
              <span className="text-transparent [-webkit-text-stroke:1.5px_#e8e6df]">
                <ScrambleText text={restWords} trigger="mount" delay={500} />
              </span>
            </h1>
          </div>

          {/* (3) Divider Line */}
          <div
            ref={dividerRef}
            className="h-px max-w-xl w-full bg-bone/25 origin-left"
            aria-hidden="true"
          />

          {/* (4) Role & Intro paragraph */}
          <div data-hero="fade" className="space-y-3 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {personalInfo.role}
            </p>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed font-light">
              {heroContent.intro}
            </p>
          </div>

          {/* (5) Square-Cornered Action Buttons */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4 pt-2">
            {/* Primary Button */}
            <a
              href={heroContent.ctaPrimary?.href || '#projects'}
              className="group font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 bg-signal text-ink hover:bg-bone transition-colors inline-flex items-center gap-2.5 select-none"
            >
              <span>{heroContent.ctaPrimary?.label || 'View projects'}</span>
              <span
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </a>

            {/* Secondary Button */}
            <a
              href={heroContent.ctaSecondary?.href || '#contact'}
              className="group font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 border border-bone/30 text-bone hover:border-signal hover:text-signal transition-colors inline-flex items-center gap-2 select-none"
            >
              <span>{heroContent.ctaSecondary?.label || 'Get in touch'}</span>
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN: 3D Signal Core in HUD Frame ───────────────────── */}
        <div data-hero="fade" className="w-full">
          <div className="w-full h-[48vh] min-h-[320px] lg:h-[70vh] relative hud-frame border border-bone/10 bg-panel/40 overflow-hidden flex items-center justify-center">
            {/* Top-left label */}
            <span
              className="absolute top-4 left-4 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none"
              aria-hidden="true"
            >
              core.view — drag to rotate
            </span>

            {/* Bottom-right label */}
            <span
              className="absolute bottom-4 right-4 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none"
              aria-hidden="true"
            >
              {personalInfo.city}
            </span>

            {/* Lazy-loaded 3D Scene */}
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ── Bottom HUD Information Strip ─────────────────────────────────── */}
      <div
        data-hero="fade"
        className="w-full max-w-[1440px] mx-auto mt-10 border-t border-bone/10 pt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim"
      >
        {/* Availability status */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shrink-0" />
          <span>{personalInfo.availability}</span>
        </div>

        {/* Scroll indicator */}
        <span className="hidden sm:inline-block tracking-[0.25em] text-bone/60 select-none">
          Scroll &darr;
        </span>
      </div>
    </section>
  );
}
