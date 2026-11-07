// Titles, issuers and dates are read from the certificate files themselves (public/certificates/*.pdf).
import type { Lang } from "./content";

type Raw = { slug: string; title: string; issuer: string; date: string }; // date: YYYY-MM or YYYY-MM-DD

const RAW: Raw[] = [
  { slug: "oci-architect-associate", title: "Oracle Cloud Infrastructure Certified Architect Associate", issuer: "Oracle University", date: "2026-10-17" },
  { slug: "aws-cloud-practitioner-essentials", title: "AWS Cloud Practitioner Essentials (Français)", issuer: "AWS Training & Certification", date: "2026-07-06" },
  { slug: "introduction-to-software-development", title: "Introduction to Software Development", issuer: "Coursera (Amazon)", date: "2026-04-04" },
  { slug: "cs50x", title: "CS50x: Introduction to Computer Science", issuer: "Harvard University", date: "2026-04" },
  { slug: "aws-ai-practitioner-challenge", title: "AWS AI Practitioner Challenge", issuer: "Udacity", date: "2026-03-30" },
  { slug: "data-science-essentials-python", title: "Data Science Essentials with Python", issuer: "Cisco Networking Academy", date: "2026-03-15" },
  { slug: "oci-2025-ai-foundations", title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate", issuer: "Oracle University", date: "2026-03-14" },
  { slug: "oci-2025-foundations", title: "Oracle Cloud Infrastructure 2025 Certified Foundations Associate", issuer: "Oracle University", date: "2026-03-14" },
  { slug: "oracle-data-platform-2025", title: "Oracle Data Platform 2025 Certified Foundations Associate", issuer: "Oracle University", date: "2026-03-14" },
  { slug: "ibm-cybersecurity-fundamentals", title: "Cybersecurity Fundamentals", issuer: "IBM SkillsBuild", date: "2026-03-14" },
  { slug: "software-engineering-design-project", title: "Software Engineering: Software Design and Project Management", issuer: "Coursera (Hong Kong University of Science and Technology)", date: "2026-03-13" },
  { slug: "python-web-data", title: "Using Python to Access Web Data", issuer: "Coursera (University of Michigan)", date: "2026-03-13" },
  { slug: "javascript-jquery-json", title: "JavaScript, jQuery, and JSON", issuer: "Coursera (University of Michigan)", date: "2025-11-20" },
  { slug: "oop-in-cpp-epfl", title: "Introduction to Object-Oriented Programming (in C++)", issuer: "Coursera (École Polytechnique Fédérale de Lausanne)", date: "2025-11-19" },
  { slug: "emotional-intelligence", title: "Developing Your Emotional Intelligence", issuer: "LinkedIn Learning", date: "2025-07-09" },
  { slug: "career-skills-data-analytics", title: "Introduction to Career Skills in Data Analytics", issuer: "LinkedIn Learning", date: "2025-07-09" },
  { slug: "what-is-generative-ai", title: "What Is Generative AI?", issuer: "LinkedIn Learning", date: "2025-07-03" },
  { slug: "career-preparation-workshop", title: "Career Preparation Workshop", issuer: "Cisco Networking Academy", date: "2025-04-07" },
  { slug: "english-for-it-2", title: "English for IT 2", issuer: "Cisco Networking Academy", date: "2025-04-01" },
  { slug: "english-for-it-1", title: "English for IT 1", issuer: "Cisco Networking Academy", date: "2025-03-30" },
  { slug: "css-essentials", title: "CSS Essentials", issuer: "Cisco Networking Academy", date: "2025-03-09" },
  { slug: "html-essentials", title: "HTML Essentials", issuer: "Cisco Networking Academy", date: "2025-03-09" },
  { slug: "javascript-essentials-2", title: "JavaScript Essentials 2", issuer: "Cisco Networking Academy", date: "2025-03-09" },
  { slug: "javascript-essentials-1", title: "JavaScript Essentials 1", issuer: "Cisco Networking Academy", date: "2025-03-08" },
  { slug: "python-essentials-1", title: "Python Essentials 1", issuer: "Cisco Networking Academy", date: "2025-03-08" },
  { slug: "python-essentials-2", title: "Python Essentials 2", issuer: "Cisco Networking Academy", date: "2025-03-08" },
  { slug: "networking-basics", title: "Networking Basics", issuer: "Cisco Networking Academy", date: "2025-03-07" },
  { slug: "ethical-hacker", title: "Ethical Hacker", issuer: "Cisco Networking Academy", date: "2025-03-02" },
  { slug: "introduction-to-modern-ai", title: "Introduction to Modern AI", issuer: "Cisco Networking Academy", date: "2025-02-26" },
];

export type CertFile = { slug: string; title: string; issuer: string; dateLabel: string; image: string; pdf: string };

export function getCertificateFiles(lang: Lang): CertFile[] {
  const loc = lang === "fr" ? "fr-FR" : "en-US";
  return RAW.map((c) => {
    const [y, m, d] = c.date.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d || 1));
    const dateLabel = new Intl.DateTimeFormat(loc, d ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" } : { month: "long", year: "numeric", timeZone: "UTC" }).format(dt);
    return { slug: c.slug, title: c.title, issuer: c.issuer, dateLabel, image: `/certificates/${c.slug}.webp`, pdf: `/certificates/${c.slug}.pdf` };
  });
}
