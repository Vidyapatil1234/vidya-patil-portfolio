// ScrambleText.jsx
// Renders text with a "decode" glitch effect — characters scramble through
// random glyphs then lock into the real letter from left to right.
// Screen readers always see the real text via aria-label.
import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * @param {string}  text      - The final text to display.
 * @param {string}  as        - HTML tag to render (default 'span').
 * @param {string}  className - Extra Tailwind / CSS classes.
 * @param {number}  delay     - Ms to wait before starting (default 0).
 * @param {number}  speed     - Interval in ms between frames (default 30).
 * @param {'view'|'mount'} trigger - Start on mount or when 40% visible.
 */
export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
  ...rest
}) {
  // Derive reduced-motion preference once at render time.
  const isReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Start with the real text; it stays real when motion is reduced.
  const [display, setDisplay] = useState(text);

  // Refs for tracking playback and cleanup.
  const playedRef   = useRef(false);
  const intervalRef = useRef(null);
  const timeoutRef  = useRef(null);
  const observerRef = useRef(null);
  const elRef       = useRef(null);

  useEffect(() => {
    // With prefers-reduced-motion it just shows the text.
    if (isReduced) return;

    // ── Core scramble animation ───────────────────────────────────────────
    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;

      let lockedCount = 0; // how many chars from the left are finalised
      let frame = 0;       // frame counter to control lock speed

      intervalRef.current = setInterval(() => {
        frame++;

        // Lock one more real character every 2 frames.
        if (frame % 2 === 0 && lockedCount < text.length) {
          lockedCount++;
        }

        // Build the display string: locked chars + scrambling chars.
        const chars = text.split('').map((char, i) => {
          if (i < lockedCount) return char; // already locked in
          if (char === ' ')    return ' ';  // spaces stay spaces
          return randomGlyph();             // still scrambling
        });

        setDisplay(chars.join(''));

        // All characters locked — stop the interval.
        if (lockedCount >= text.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setDisplay(text); // guarantee exact final text
        }
      }, speed);
    };

    // ── Trigger: mount ────────────────────────────────────────────────────
    if (trigger === 'mount') {
      timeoutRef.current = setTimeout(play, delay);
    }

    // ── Trigger: view (IntersectionObserver at 40% threshold) ─────────────
    if (trigger === 'view') {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
            timeoutRef.current = setTimeout(play, delay);
          }
        },
        { threshold: 0.4 }
      );
      if (elRef.current) {
        observerRef.current.observe(elRef.current);
      }
    }

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [text, delay, speed, trigger, isReduced]);

  return (
    <Tag ref={elRef} aria-label={text} className={className} {...rest}>
      {/* aria-hidden so screen readers use the aria-label above, not glyphs */}
      <span aria-hidden="true">{isReduced ? text : display}</span>
    </Tag>
  );
}
