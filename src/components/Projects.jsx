// Projects.jsx
// "Projects" section with technical Signal HUD aesthetic.
// Features horizontal pinned scrolling on desktop with ScrollTrigger,
// interactive project cards with grayscale-to-colour reveal, and progress indicator.
import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { projects } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

// Eagerly resolve any project cover images located in src/assets/projects.
const projectCovers = import.meta.glob(
  '../assets/projects/*.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' }
);

/** Helper to retrieve the cover image URL for a given project ID. */
function getProjectCover(id) {
  if (!id) return null;
  const match = Object.entries(projectCovers).find(([filePath]) =>
    filePath.includes(`/${id}.`)
  );
  return match ? match[1] : null;
}

/** Individual Project Card component */
function ProjectCard({ project }) {
  const coverSrc = getProjectCover(project.id);

  return (
    <article
      data-cursor="hot"
      className="group w-full md:w-[min(560px,42vw)] shrink-0 border border-bone/10 bg-panel/60 flex flex-col overflow-hidden transition-colors"
    >
      {/* ── Top Cover Area ─────────────────────────────────────────────────── */}
      <div className="aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden relative">
        {/* Badge: Number / Year */}
        <span className="absolute top-3 left-3 z-10 bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-signal select-none pointer-events-none">
          {project.number} / {project.year}
        </span>

        {/* Cover image or HUD grid placeholder */}
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700 ease-out select-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full hud-grid flex items-center justify-center p-6 select-none">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {project.id}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base text-bone/70 leading-relaxed font-light">
            {project.description}
          </p>
        </div>

        <div className="space-y-4">
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-dim select-none">
              {project.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}

          {/* Square Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 bg-signal text-ink hover:bg-bone transition-colors select-none"
              >
                Live &nearr;
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 border border-bone/30 text-bone hover:border-signal hover:text-signal transition-colors select-none"
              >
                Code &nearr;
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressLine = progressLineRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Horizontal pinned scroll only on desktop devices with no motion reduction preference.
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const getDistance = () => {
        const rawDistance = track.scrollWidth - window.innerWidth + 80;
        // If the track content overflows the screen, slide the full difference.
        // Otherwise, provide a comfortable slide distance so the pinning effect is active.
        return rawDistance > 0 ? rawDistance : 200;
      };

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + getDistance(),
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressLine) {
              progressLine.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    });

    return () => mm.revert();
  }, []);

  const projectCount = projects.length;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:justify-center md:pt-20 md:pb-6"
    >
      {/* ── Section Header ────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] w-full mx-auto px-5 md:px-10 mb-8 md:mb-12">
        <div className="mb-3">
          <ScrambleText
            text="02 / Selected work"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium inline-block"
            trigger="view"
          />
        </div>

        <div className="flex items-end justify-between gap-6">
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>

          <span className="hidden md:block font-mono text-xs uppercase tracking-[0.2em] text-dim select-none pb-1">
            {projectCount} {projectCount === 1 ? 'project' : 'projects'} &middot; scroll &rarr;
          </span>
        </div>
      </div>

      {/* ── The Track ──────────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="flex flex-col gap-6 w-full px-5 md:px-10 md:flex-row md:w-max md:gap-8 will-change-transform"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* ── Desktop Horizontal Scroll Progress Indicator ──────────────────── */}
      <div className="hidden md:block max-w-[1440px] w-full mx-auto px-5 md:px-10 mt-8 md:mt-10">
        <div className="h-0.5 w-full bg-bone/10 overflow-hidden">
          <div
            ref={progressLineRef}
            className="h-full bg-signal origin-left scale-x-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
