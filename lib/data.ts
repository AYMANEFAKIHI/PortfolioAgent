// Every fact on the site comes from resume.md. Nothing here is invented.

export const profile = {
  name: "Aymane Fakihi",
  role: "Full Stack Developer & Designer",
  city: "Rabat, Morocco",
  status: "Available for freelance projects and internship opportunities",
  email: "faymane12@gmail.com",
  github: "https://github.com/AYMANEFAKIHI",
  linkedin: "https://www.linkedin.com/in/aymane-fakihi-9a3435335/",
  instagram: null as string | null, // (none provided) -> hidden
  resumePdf: "/aymane_fakihi.pdf",
  bio: [
    "Full-Stack Developer building scalable web ecosystems at the intersection of performance and design.",
    "I ship real products used by 5,000+ students and faculty across the EMSI network.",
  ],
};

export const seo = {
  title: "Aymane Fakihi | Full Stack Developer & Designer",
  description:
    "Full Stack Developer based in Rabat, Morocco. Specializing in Next.js, Node.js and scalable web applications. Building platforms used by 5,000+ users.",
  keywords: [
    "Aymane Fakihi",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Node.js",
    "MERN Stack",
    "Web Developer",
    "Morocco",
    "Rabat",
    "EMSI",
  ],
};

export const stats = [
  { value: "5,000+", label: "students and faculty served across the EMSI network" },
  { value: "11", label: "shipped projects" },
  { value: "28", label: "certifications" },
];

export type Project = {
  n: string;
  slug: string;
  title: string;
  category: string;
  bullets: string[];
  tech: string[];
  live: string | null;
  code: string | null;
};

export const projects: Project[] = [
  {
    n: "01",
    slug: "emsi-central-portal",
    title: "EMSI Central Portal",
    category: "Academic Platform",
    bullets: [
      "The central digital gateway for the EMSI ecosystem.",
      "Aggregates news, schedules and institutional announcements for thousands of students.",
    ],
    tech: ["Next.js", "Tailwind CSS", "REST API"],
    live: "https://aymanefakihi.github.io/info/",
    code: "https://github.com/AYMANEFAKIHI/info",
  },
  {
    n: "02",
    slug: "emsi-connect",
    title: "EMSI Connect",
    category: "Social Networking",
    bullets: [
      "Social and professional networking platform connecting current students with alumni.",
      "Features real-time messaging and event management.",
    ],
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    live: "https://aymanefakihi.github.io/connect/",
    code: "https://github.com/AYMANEFAKIHI/connect",
  },
  {
    n: "03",
    slug: "emsi-studyhub",
    title: "EMSI StudyHub",
    category: "EMSI-Learning / LMS",
    bullets: [
      "Academic resource repository to access course materials and share notes.",
      "Optimized for performance during high-traffic exam periods.",
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "AWS S3"],
    live: "https://aymanefakihi.github.io/studyhub/",
    code: "https://github.com/AYMANEFAKIHI/studyhub",
  },
  {
    n: "04",
    slug: "emsi-delegation-system",
    title: "EMSI-Delegation System",
    category: "Management Tool",
    bullets: [
      "Administrative tool streamlining the operations of student representatives (délégués).",
      "Facilitates secure voting and feedback collection.",
    ],
    tech: ["MERN Stack", "Redux", "JWT Auth"],
    live: "https://aymanefakihi.github.io/delgation/",
    code: "https://github.com/aymanefakihi/delegation",
  },
  {
    n: "05",
    slug: "solar-system-explorer",
    title: "Solar System Explorer",
    category: "3D Visualisation & Data",
    bullets: [
      "Interactive web app rendering a scaled model of the solar system.",
      "Demonstrates complex physics concepts using pure JavaScript.",
    ],
    tech: ["HTML5", "CSS3", "Vanilla JavaScript", "3D Library"],
    live: "https://aymanefakihi.github.io/solar-system-explorar",
    code: "https://github.com/AYMANEFAKIHI/solar-system-explorar",
  },
  {
    n: "06",
    slug: "offline-chatbot-rule-editor",
    title: "Offline Chatbot & Rule Editor",
    category: "Front-end Fundamentals & Logic",
    bullets: [
      "Standalone, offline-capable chatbot with a custom rule editor.",
      "Demonstrates strong command of vanilla JavaScript logic and JSON data handling.",
    ],
    tech: ["HTML5", "CSS3", "Vanilla JavaScript", "JSON"],
    live: "https://aymanefakihi.github.io/chatbot-offline/",
    code: "https://github.com/AYMANEFAKIHI/chatbot-offline",
  },
  {
    n: "07",
    slug: "webslide-generator",
    title: "WebSlide Generator",
    category: "Declarative UI & Export Tooling",
    bullets: [
      "Developer-centric tool for creating responsive HTML/CSS presentations from declarative templates.",
      "Supports PDF and ZIP export.",
    ],
    tech: ["Next.js", "TypeScript", "HTML/CSS Generation", "Export Tooling"],
    live: "https://presentation-pied-nine.vercel.app/",
    code: "https://github.com/AYMANEFAKIHI/presentation",
  },
  {
    n: "08",
    slug: "arduino-student-lab",
    title: "The Arduino Student Lab",
    category: "Technical Education / IoT",
    bullets: [
      "Educational platform with clear, project-based tutorials for mastering Arduino programming.",
      "Focus on electronics and physical computing.",
    ],
    tech: ["HTML5", "CSS3", "Vanilla JavaScript", "Technical Writing"],
    live: "https://aymanefakihi.github.io/ARDUINO/",
    code: "https://github.com/AYMANEFAKIHI/ARDUINO",
  },
  {
    n: "09",
    slug: "exambuilder",
    title: "ExamBuilder",
    category: "AI-Powered EdTech",
    bullets: [
      "Intelligent platform powered by Google Gemini AI for educators.",
      "Generates professional, formatted exams in seconds.",
      "Instant PDF export.",
    ],
    tech: ["Next.js", "Google Gemini AI", "Tailwind CSS", "TypeScript", "PDF Generation"],
    live: "https://exam-builder-frontend.vercel.app/",
    code: "https://github.com/AYMANEFAKIHI/Exam-Builder",
  },
  {
    n: "10",
    slug: "interniq",
    title: "InternIQ",
    category: "AI-Powered JobTech / SaaS",
    bullets: [
      "Specialized AI platform for Moroccan students that automates internship hunting.",
      "Scrapes local job boards and scores CV matches.",
      "Generates tailored cover letters.",
    ],
    tech: ["React", "Vite", "Tailwind", "Supabase", "Groq AI", "Node.js"],
    live: "https://resume-cyan-pi.vercel.app/",
    code: "https://github.com/AYMANEFAKIHI/resume",
  },
  {
    n: "11",
    slug: "tipe-cpge",
    title: "TIPE CPGE",
    category: "EdTech / Coaching Platform",
    bullets: [
      "French-language coaching platform helping CPGE (French preparatory classes) students succeed in their TIPE research project.",
      "Includes experimental simulations, oral prep and scientific mentoring.",
    ],
    tech: ["React", "Vite", "Tailwind CSS"],
    live: "https://tipecpge.vercel.app/",
    code: null, // (none provided) -> hidden
  },
];

export const skillGroups: { title: string; items: string[] }[] = [
  { title: "Frontend", items: ["JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5"] },
  { title: "Backend", items: ["Node.js", "Python", "MongoDB", "PostgreSQL", "REST APIs", "GraphQL"] },
  { title: "Databases", items: ["MySQL", "T-SQL (SQL Server)", "PL/SQL (Oracle)"] },
  { title: "DevOps & Cloud", items: ["Git", "Docker", "AWS", "Firebase", "Vercel", "Linux"] },
  { title: "Testing & Tools", items: ["Jest", "Cypress", "Figma", "Adobe XD", "Redis", "Socket.io"] },
  { title: "AI tools", items: ["Google Gemini AI", "Groq AI"] },
];

export const experience = [
  {
    role: "Web Developer",
    org: "Brief&Nous",
    place: "Rabat, Morocco",
    dates: "Summer 2025 · Internship",
    bullets: [
      "Developed and maintained modern web interfaces using React, Next.js and TailwindCSS.",
      "Designed and optimized backend services with Node.js and PostgreSQL.",
      "Improved page performance and SEO across production pages.",
    ],
    tech: ["React", "Next.js", "TailwindCSS", "Node.js", "PostgreSQL"],
    highlight: null as string | null,
  },
  {
    role: "Founder & Project Lead",
    org: "TIPE, independent technical project",
    place: "Meknès / Rabat, Morocco",
    dates: "2022 – Present",
    bullets: [
      "Designed and built a complete technical project spanning data processing, embedded systems and software architecture.",
      "Led prototype development, technical documentation and performance analysis from concept to working system.",
      "Increased project efficiency by 30% through optimized processes.",
    ],
    tech: [],
    highlight: "+30%",
  },
];

export const certifications = [
  { name: "Oracle Cloud Infrastructure Certified Architect Associate", issuer: "Oracle University", date: "Oct. 2026" },
  { name: "CS50x: Introduction to Computer Science", issuer: "Harvard University", date: "April 2026" },
  { name: "Introduction to Software Development", issuer: "Coursera (Amazon)", date: "April 2026" },
  { name: "AWS AI Practitioner Challenge", issuer: "Udacity", date: "March 2026" },
  { name: "AWS Cloud Practitioner Essentials (Français)", issuer: "AWS Training & Certification", date: "Jul. 2026" },
  { name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations", issuer: "Oracle University", date: "Mar. 2026" },
  { name: "Oracle Cloud Infrastructure 2025 Certified Foundations", issuer: "Oracle University", date: "Mar. 2026" },
  { name: "Oracle Data Platform 2025 Certified Foundations", issuer: "Oracle University", date: "Mar. 2026" },
  { name: "Data Science Essentials with Python", issuer: "Cisco Networking Academy", date: "Mar. 2026" },
  { name: "Software Engineering: Design and Project Management", issuer: "HKUST", date: "Mar. 2026" },
];

export const education = [
  { dates: "2024 – Present", note: "Expected graduation 2027", title: "EMSI Rabat", detail: "Engineering Student in Software Informatics" },
  { dates: "2023 – 2024", note: "", title: "First Preparatory Classes (CPGE)", detail: "MP (Mathematics-Physics)" },
  { dates: "2022 – 2023", note: "", title: "First Preparatory Classes (CPGE)", detail: "MPSI (Mathematics-Physics-Engineering Sciences)" },
  { dates: "2021 – 2022", note: "", title: "Almansour Edahbi High School", detail: "High School Diploma (Mathematics Science)" },
];

export const about = [
  "Full-Stack Developer specializing in scalable web ecosystems. My focus is the intersection of performance and design: applications that look modern and handle complex data efficiently. I'm currently pursuing an Engineering degree at EMSI Rabat, and I've shipped platforms serving 5,000+ students and faculty across the EMSI network, from a central portal aggregating real-time academic data to a full MERN-stack social networking platform.",
  "My stack of choice is the JavaScript ecosystem (Next.js, Node.js) combined with cloud architecture on AWS. Outside of coding, I'm exploring DevOps tooling and building AI-integrated applications.",
];

export const principles = [
  "Performance and design go together.",
  "Build real products for real users.",
  "Make data-heavy apps efficient and scalable.",
  "Keep learning: cloud, DevOps and AI tooling.",
];

export const services = [
  "Full Stack Web Development",
  "Next.js / React Applications",
  "REST API & Backend Design",
  "UI/UX Design (Figma)",
  "Cloud Deployment (AWS/Vercel)",
];

export const marqueeTools = skillGroups.flatMap((g) => g.items);
