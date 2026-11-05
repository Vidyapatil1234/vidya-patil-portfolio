// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file — never hard-code
// personal content inside a component.
// ============================================================

export const personalInfo = {
  name: "Vidya Patil",
  brandName: "Vidya Patil",
  role: "Aspiring Data Analyst",
  city: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "vmpatil1892003@gmail.com",
  phone: "+91 72045 67193",
  availability: "Open to Data Analyst Opportunities",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/Vidyapatil1234",
  linkedin: "https://www.linkedin.com/in/vidya-patil-86a065266/",
  instagram: "", // not provided — hidden automatically
};

export const navLinks = [
  { label: "About",   href: "#about"   },
  { label: "Work",    href: "#projects" },
  { label: "Journey", href: "#journey"  },
  { label: "Contact", href: "#contact"  },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro:
    "Turning raw data into meaningful insights through Python, SQL, Excel and Power BI.",
  statusLines: [
    "Exploring Data Analytics",
    "Learning Python & SQL",
    "Building Data-Driven Projects",
  ],
  ctaPrimary:   { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch",  href: "#contact"  },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Turning data into decisions.",
  paragraph:
    "I'm a Computer Science and Engineering graduate with a strong interest in Data Analytics and problem-solving. I've developed skills in Python, SQL, NumPy, Pandas, Statistics and Data Visualization, and I'm currently strengthening my knowledge of Excel and Power BI through the placement training program at TAP Academy. I enjoy exploring datasets, identifying patterns, creating visualizations and converting data into actionable insights while continuously learning new tools and technologies.",
  stats: [
    { value: 1,  suffix: "",  label: "B.Tech Degree"            },
    { value: 4,  suffix: "",  label: "Core Analytics Tools"     },
    { value: 2,  suffix: "+", label: "Data Analytics Projects"  },
  ],
};

// No self-introduction video was provided, so the introVideo export is omitted.

export const skillGroups = [
  {
    title: "Programming",
    items: ["Python", "SQL"],
  },
  {
    title: "Python Libraries",
    items: ["NumPy", "Pandas", "Matplotlib", "Seaborn"],
  },
  {
    title: "Data Analytics",
    items: [
      "Data Cleaning",
      "Data Analysis",
      "Exploratory Data Analysis (EDA)",
      "Statistical Analysis",
    ],
  },
  {
    title: "Tools",
    items: [
      "Microsoft Excel",
      "Power BI",
      "MySQL",
      "Jupyter Notebook",
      "Git",
      "GitHub",
    ],
  },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Employee Data Analysis",
    description:
      "Explored employee data to understand salary distribution, department-wise employee counts and workforce trends.",
    tags: ["Python", "Pandas", "Power BI"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/Vidyapatil1234",
    // No project video was provided; field is omitted intentionally.
  },
];

export const experience = [
  {
    period: "2026",
    role: "Data Analytics Training",
    org: "TAP Academy",
    description:
      "Developing practical skills in Python, SQL, Excel and Power BI through hands-on project-based training.",
  },
  {
    period: "2025",
    role: "Full Stack Development Intern",
    org: "Infosys Springboard",
    description:
      "Worked on a role-based learning platform, building dashboards and backend features.",
  },
  {
    period: "2022 — 2026",
    role: "B.Tech in Computer Science and Engineering",
    org: "Alliance University, Bengaluru",
    description:
      "Studied core CS subjects including DBMS, algorithms, software engineering and networks.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's work with data together.",
  note: "Have a role, a project or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId:  import.meta.env.VITE_EMAILJS_SERVICE_ID  || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey:  import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "YOUR_EMAILJS_PUBLIC_KEY",
};
