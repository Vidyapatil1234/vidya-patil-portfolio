# Vidya Patil — Portfolio

A data analyst portfolio built with a dark, motion-led "Signal HUD" aesthetic — showcasing Python, SQL, Power BI and data analytics projects.

**Live site:** https://my-portfolio-zeta-seven-89.vercel.app/

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI | React 19 |
| Bundler | Vite |
| Styles | Tailwind CSS 4 |
| Animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| 3D scene | three.js |
| Contact form | EmailJS |

---

## Run Locally

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

---

## Environment Variables

Create a `.env.local` file in the project root with your EmailJS credentials:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The contact form falls back to a `mailto:` link when these values are absent.

---

## Credits

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).
