// Contact.jsx
// "Contact" section featuring high-impact typography, quick direct communication links,
// and an interactive terminal-style contact form integrated with EmailJS / mailto fallback.
import { useEffect, useRef, useState } from 'react';

import {
  contactContent,
  emailjsConfig,
  personalInfo,
  socialLinks,
} from '../data/portfolioData';
import ScrambleText from './ScrambleText';

export default function Contact() {
  const formRef = useRef(null);
  const statusTimeoutRef = useRef(null);

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // Derive first name in lowercase for the terminal prompt line.
  const firstName = (personalInfo.name || '').trim().split(' ')[0]?.toLowerCase() || 'user';

  // Filter available social links.
  const socials = [
    { label: 'GitHub', url: socialLinks.github },
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url && item.url.trim()));

  // Auto-clear status message after 4 seconds.
  const setStatusWithTimeout = (val) => {
    setStatus(val);
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => {
      setStatus(null);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get('user_name') || '';
    const email = formData.get('user_email') || '';
    const message = formData.get('message') || '';

    // Check if real EmailJS credentials are provided in the environment.
    const isConfigured = Boolean(
      emailjsConfig.serviceId &&
      emailjsConfig.templateId &&
      emailjsConfig.publicKey &&
      emailjsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'
    );

    if (!isConfigured) {
      // Fallback: open mailto link with prefilled subject and message body.
      const subject = encodeURIComponent('Portfolio contact');
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;

      window.open(mailtoUrl, '_blank');
      form.reset();
      setStatusWithTimeout('success');
      return;
    }

    // Configured EmailJS delivery.
    setSending(true);
    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        form,
        emailjsConfig.publicKey
      );
      form.reset();
      setStatusWithTimeout('success');
    } catch (err) {
      console.error('EmailJS send error:', err);
      setStatusWithTimeout('error');
    } finally {
      setSending(false);
    }
  };

  const fieldClasses =
    'w-full bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone placeholder:text-bone/30 font-mono text-sm rounded-none outline-none focus:outline-none focus:ring-0 py-2.5 transition-colors';

  return (
    <section
      id="contact"
      className="relative hud-grid w-full px-5 md:px-10 py-28 md:py-40 z-10"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

        {/* ── LEFT COLUMN: Narrative & Direct Links ────────────────────────── */}
        <div className="space-y-8">
          {/* Label */}
          <div className="mb-2">
            <ScrambleText
              text={contactContent.label}
              className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-medium inline-block"
              trigger="view"
            />
          </div>

          {/* Heading */}
          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone">
            {contactContent.heading}
          </h2>

          {/* Note */}
          <p className="text-lg text-bone/70 max-w-md leading-relaxed font-light">
            {contactContent.note}
          </p>

          {/* Direct Contact Links */}
          <div className="space-y-4 pt-4">
            {/* Email mailto link */}
            <div>
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-mono text-lg md:text-2xl text-bone underline decoration-signal decoration-2 underline-offset-8 hover:text-signal transition-colors break-all inline-block select-all"
              >
                {personalInfo.email}
              </a>
            </div>

            {/* Phone link (only if set) */}
            {personalInfo.phone && (
              <div>
                <a
                  href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                  className="font-mono text-sm text-dim hover:text-bone transition-colors inline-block select-none"
                >
                  {personalInfo.phone}
                </a>
              </div>
            )}

            {/* Social links */}
            {socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 pt-4">
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors inline-flex items-center gap-1 select-none"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">&nearr;</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Terminal-Style HUD Form ───────────────────────── */}
        <div className="w-full">
          <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10 relative space-y-6">

            {/* Terminal Top Line */}
            <div className="font-mono text-xs text-dim flex items-center gap-2 pb-2 border-b border-bone/10 select-none">
              <span className="text-signal font-semibold">$</span>
              <span>new message --to {firstName}</span>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="user_name"
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block select-none"
                >
                  &gt; name
                </label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className={fieldClasses}
                />
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="user_email"
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block select-none"
                >
                  &gt; email
                </label>
                <input
                  id="user_email"
                  name="user_email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={fieldClasses}
                />
              </div>

              {/* Message field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal block select-none"
                >
                  &gt; message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the role or project…"
                  className={`${fieldClasses} resize-none`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                <span>{sending ? 'Sending…' : 'Send message'}</span>
                <span aria-hidden="true">&rarr;</span>
              </button>

              {/* Status Line */}
              {status && (
                <p
                  role="status"
                  className={`font-mono text-xs select-none transition-opacity ${
                    status === 'success' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {status === 'success'
                    ? '✓ Message sent. Talk soon.'
                    : '✕ Something went wrong. Please try again.'}
                </p>
              )}
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
