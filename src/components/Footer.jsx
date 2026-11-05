// Footer.jsx
// Site-wide footer with navigation columns, social links, watermark and credit row.
import {
  academy,
  footerContent,
  navLinks,
  personalInfo,
  socialLinks,
} from '../data/portfolioData';

// Computed once at module level so it is stable across renders.
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const year = CURRENT_YEAR;

  // Build social links, skipping empty ones.
  const socials = [
    { label: 'GitHub',    url: socialLinks.github    },
    { label: 'LinkedIn',  url: socialLinks.linkedin  },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => item.url && item.url.trim());

  const colTitle = 'font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-4 block';
  const linkClass = 'block font-mono text-xs text-bone/75 hover:text-signal transition-colors py-0.5 select-none';

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8 relative z-10">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Three-Column Link Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">

          {/* Column 1: Navigate */}
          <div>
            <span className={colTitle}>Navigate</span>
            <nav aria-label="Footer navigation">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Elsewhere (social links) */}
          <div>
            <span className={colTitle}>Elsewhere</span>
            {socials.length > 0 ? (
              socials.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-center gap-1`}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">&nearr;</span>
                </a>
              ))
            ) : (
              <span className="font-mono text-xs text-dim">—</span>
            )}
          </div>

          {/* Column 3: Say hello (right-aligned on md+) */}
          <div className="md:text-right">
            <span className={colTitle}>Say hello</span>
            <a
              href={`mailto:${personalInfo.email}`}
              className={`${linkClass} md:ml-auto`}
            >
              {personalInfo.email}
            </a>
            <span className="font-mono text-xs text-dim py-0.5 block select-none">
              {personalInfo.city}
            </span>
          </div>
        </div>

        {/* ── Giant Watermark ─────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="w-full text-center whitespace-nowrap text-[13.5vw] font-bold leading-none tracking-[-0.05em] text-bone/[0.07] uppercase select-none pointer-events-none mb-8 overflow-hidden"
        >
          {personalInfo.brandName}
        </div>

        {/* ── Bottom Row ──────────────────────────────────────────────────── */}
        <div className="border-t border-bone/10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
          {/* Left: copyright + tagline */}
          <span className="select-none">
            &copy; {year} {personalInfo.name} &middot; {footerContent.tagline}
          </span>

          {/* Right: TAP Academy credit */}
          <span>
            Trained at&nbsp;
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-signal transition-colors"
            >
              {academy.name}
            </a>
          </span>
        </div>

      </div>
    </footer>
  );
}
