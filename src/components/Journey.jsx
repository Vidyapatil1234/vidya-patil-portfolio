// Journey.jsx
// "Journey" section displaying education, internships, and training timeline.
// Features a sticky left header, an ordered timeline list with an animated
// scroll-fill line, active square node markers, and entrance reveals.
import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { experience } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const fillRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const section = sectionRef.current;
    const list = listRef.current;
    const fill = fillRef.current;
    if (!section || !list) return;

    // Under reduced motion, show the completed timeline immediately without animations.
    if (isReduced) {
      if (fill) fill.style.transform = 'scaleY(1)';
      itemRefs.current.forEach((item) => {
        if (item) {
          item.classList.add('is-on');
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // ── 1. Vertical Fill Line Animation (fills as list scrolls through) ──
      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: list,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: true,
            },
          }
        );
      }

      // ── 2. Item Highlight and Entrance Animations ───────────────────────
      itemRefs.current.forEach((item) => {
        if (!item) return;

        // Toggle 'is-on' class when the scroll fill reaches the item
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          onEnter: () => item.classList.add('is-on'),
          onLeaveBack: () => item.classList.remove('is-on'),
        });

        // Item entrance animation: fades in from x: 30 once
        gsap.fromTo(
          item,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40 relative z-10"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">

        {/* ── LEFT COLUMN (Sticky on lg screens) ───────────────────────────── */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
          <div className="mb-2">
            <ScrambleText
              text="03 / Journey"
              className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium inline-block"
              trigger="view"
            />
          </div>

          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Where I&apos;ve been learning and building.
          </h2>
        </div>

        {/* ── RIGHT COLUMN: Timeline Ordered List ──────────────────────────── */}
        <div className="relative">
          <ol
            ref={listRef}
            className="relative pl-10 space-y-16 list-none m-0"
          >
            {/* 1px Vertical Base Line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-bone/15 pointer-events-none"
              aria-hidden="true"
            />

            {/* 1px Animated Orange Fill Line on top */}
            <div
              ref={fillRef}
              className="absolute left-[7px] top-2 bottom-2 w-px bg-signal origin-top scale-y-0 pointer-events-none"
              aria-hidden="true"
            />

            {/* Timeline Entries */}
            {experience.map((item, idx) => (
              <li
                key={`${item.role}-${item.period}`}
                ref={(el) => (itemRefs.current[idx] = el)}
                className="relative [&.is-on_.node]:bg-signal [&.is-on_.node]:scale-100 space-y-2.5"
              >
                {/* 15px Square Node Marker */}
                <div
                  className="node absolute -left-10 top-1.5 w-[15px] h-[15px] border border-signal bg-ink scale-75 transition-all duration-300 pointer-events-none select-none"
                  aria-hidden="true"
                />

                {/* Period */}
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-dim select-none">
                  {item.period}
                </div>

                {/* Role */}
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone">
                  {item.role}
                </h3>

                {/* Organisation */}
                <div className="font-mono text-sm text-signal select-none">
                  {item.org}
                </div>

                {/* Description */}
                <p className="text-bone/70 leading-relaxed font-light text-sm md:text-base max-w-2xl pt-1">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
