// useSmoothScroll.js
// Sets up Lenis smooth-scrolling driven by GSAP's ticker so that
// every ScrollTrigger and every animation share ONE RAF loop.
import { useEffect } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register ScrollTrigger once at module level (safe to call multiple times).
gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    // Respect the user's motion preference.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // ── 1. Create Lenis instance ──────────────────────────────────────────
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // Keep ScrollTrigger in sync with Lenis scroll position.
    lenis.on('scroll', ScrollTrigger.update);

    // ── 2. Drive Lenis from GSAP's ticker (one shared loop) ──────────────
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0); // prevent large jumps after tab switch

    // ── 3. Smooth in-page anchor links ────────────────────────────────────
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      try {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60 });
      } catch {
        // Ignore invalid selectors
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // ── 4. Refresh ScrollTrigger once the page is fully loaded ────────────
    let refreshTimeout;
    const onLoad = () => {
      ScrollTrigger.refresh();
      // Second refresh after images / fonts finish settling layout.
      refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 800);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    // ── 5. Cleanup on unmount ─────────────────────────────────────────────
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', onLoad);
      clearTimeout(refreshTimeout);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []); // runs once
}
