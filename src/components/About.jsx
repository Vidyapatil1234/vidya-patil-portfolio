// About.jsx
// "About" section featuring a technical HUD-frame portrait with orange tint,
// responsive typography, scroll-triggered counting stats, and modular skill cards.
import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { aboutContent, personalInfo, skillGroups } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

// Eagerly resolve the portrait asset with import.meta.glob.
const portraitModules = import.meta.glob('../assets/about/about-portrait.*', {
  eager: true,
  import: 'default',
});
const portraitSrc = Object.values(portraitModules)[0];

export default function About() {
  const sectionRef = useRef(null);
  const statRefs = useRef([]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // ── 1. Reveal Animation for marked elements ─────────────────────────
      gsap.fromTo(
        '[data-about="reveal"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      // ── 2. Stat Number Count-Up Animation ───────────────────────────────
      statRefs.current.forEach((el, index) => {
        if (!el) return;
        const targetVal = aboutContent.stats[index]?.value ?? 0;
        const counter = { val: 0 };

        el.textContent = '0';

        gsap.to(counter, {
          val: targetVal,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.round(counter.val).toString();
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40 relative z-10"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* ── Section Label ────────────────────────────────────────────────── */}
        <div data-about="reveal" className="mb-10">
          <ScrambleText
            text={aboutContent.label}
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium inline-block"
            trigger="view"
          />
        </div>

        {/* ── Two-Column Layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">

          {/* ── LEFT COLUMN: Portrait in HUD Frame ─────────────────────────── */}
          <div data-about="reveal" className="w-full flex justify-center lg:justify-start">
            <div className="hud-frame aspect-[4/5] w-full max-w-[420px] border border-bone/10 bg-panel overflow-hidden relative">
              {portraitSrc ? (
                <img
                  src={portraitSrc}
                  alt="Vidya Patil — Aspiring Data Analyst, TAP Academy student"
                  className="w-full h-full object-cover grayscale contrast-125 select-none"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-dim font-mono text-xs uppercase tracking-[0.2em]">
                  <span>[ Image Unavailable ]</span>
                </div>
              )}

              {/* Orange tint layer */}
              <div
                className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none"
                aria-hidden="true"
              />

              {/* Bottom-left ID tag */}
              <span
                className="absolute bottom-3 left-3 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-dim select-none pointer-events-none"
                aria-hidden="true"
              >
                ID &middot; {personalInfo.brandName}
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Narrative, Stats & Skill Cards ───────────────── */}
          <div className="space-y-10">

            {/* (1) Heading */}
            <div data-about="reveal">
              <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
                {aboutContent.heading}
              </h2>
            </div>

            {/* (2) Paragraph */}
            <div data-about="reveal">
              <p className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl font-light">
                {aboutContent.paragraph}
              </p>
            </div>

            {/* (3) Stats Grid (<dl>) */}
            <div data-about="reveal">
              <dl className="grid grid-cols-3 gap-4 md:gap-8 border-y border-bone/10 py-8 my-2">
                {aboutContent.stats.map((stat, idx) => (
                  <div key={stat.label} className="flex flex-col gap-1.5">
                    <dd className="text-4xl md:text-6xl font-bold tracking-tight text-bone font-sans">
                      <span ref={(el) => (statRefs.current[idx] = el)}>
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-signal">{stat.suffix}</span>
                      )}
                    </dd>
                    <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* (4) Skill Modules Grid */}
            <div data-about="reveal">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10">
                {skillGroups.map((group, groupIdx) => {
                  const groupNum = String(groupIdx + 1).padStart(2, '0');
                  return (
                    <div
                      key={group.title}
                      className="bg-ink p-6 hover:bg-panel transition-colors flex flex-col justify-between"
                    >
                      {/* Header Row */}
                      <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-bone/10">
                        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-medium">
                          {group.title}
                        </span>
                        <span className="font-mono text-xs text-dim tabular-nums select-none">
                          {groupNum}
                        </span>
                      </div>

                      {/* Small square-cornered skill tags */}
                      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                        {group.items.map((skill) => (
                          <li
                            key={skill}
                            className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/85 hover:border-signal/50 hover:text-bone transition-colors select-none"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
