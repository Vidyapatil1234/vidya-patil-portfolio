// Cursor.jsx
// Custom crosshair cursor — a small dot + a larger ring.
// Visible only on fine-pointer (mouse) devices without reduced-motion.
import { useEffect, useRef } from 'react';

import gsap from 'gsap';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Only activate on real mouse devices without reduced-motion.
    const isFine    = window.matchMedia('(pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || isReduced) return;

    // Hide the native cursor via the CSS rule in index.css.
    document.body.classList.add('has-cursor');

    // Centre both elements and make them visible.
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 1 });

    // quickTo gives the ring its characteristic "lag" behind the dot.
    const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    // ── Move ──────────────────────────────────────────────────────────────
    const onMove = (e) => {
      // Dot snaps instantly.
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      // Ring follows with delay.
      moveRingX(e.clientX);
      moveRingY(e.clientY);
    };

    // ── Hover state ───────────────────────────────────────────────────────
    const HOT_SELECTOR = 'a, button, input, textarea, [data-cursor="hot"]';

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target : e.target?.parentElement;
      const isHot = !!target?.closest?.(HOT_SELECTOR);
      if (isHot) {
        gsap.to(ring, { scale: 1.8, borderColor: '#ff5b1f', duration: 0.2 });
      } else {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(232, 230, 223, 0.6)', duration: 0.2 });
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerover', onOver);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.body.classList.remove('has-cursor');
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <>
      {/* Small 6px signal-orange dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 z-[999] pointer-events-none w-[6px] h-[6px] rounded-full bg-signal"
      />

      {/* 36px ring with a thin bone/60 border */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 z-[999] pointer-events-none w-[36px] h-[36px] rounded-full border border-bone/60"
      />
    </>
  );
}
