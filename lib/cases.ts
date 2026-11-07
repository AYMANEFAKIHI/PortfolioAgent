// Case-study text for each project (provided by Aymane). Keys match Project.n.

export type Solution = string | { label: string; text: string }[];
export type Case = { intro: string; problem: string; solution: Solution; results: string };

export const cases: Record<string, { en: Case; fr: Case }> = {
  "01": {
    en: {
      intro: "The Central Portal acts as the primary digital hub for the entire EMSI ecosystem, serving thousands of students and faculty across multiple campuses.",
      problem: "The institution lacked a single, unified source for real-time academic information, leading to fragmented communication across different departments and outdated paper announcements. The goal was to consolidate news, schedules, and administrative announcements into one responsive, high-availability platform.",
      solution: "Built with a Next.js frontend for rapid rendering and SEO, the platform consumes data via a secure REST API. The architecture is designed for scalability, ensuring it handles high concurrent traffic volumes, particularly during critical periods like registration and exam results announcements.",
      results: "Significantly improved institutional transparency and reduced administrative load by automating the distribution of essential academic and regulatory information. This platform is now the first point of contact for students seeking official updates.",
    },
    fr: {
      intro: "Le Portail Central est le principal hub numérique de tout l'écosystème EMSI, au service de milliers d'étudiants et d'enseignants sur plusieurs campus.",
      problem: "L'établissement n'avait pas de source unique et unifiée pour l'information académique en temps réel, ce qui fragmentait la communication entre les départements et laissait place à des annonces papier dépassées. L'objectif : regrouper actualités, emplois du temps et annonces administratives sur une seule plateforme responsive et hautement disponible.",
      solution: "Construite avec un frontend Next.js pour un rendu rapide et un bon SEO, la plateforme récupère ses données via une API REST sécurisée. L'architecture est pensée pour la montée en charge et absorbe un fort trafic simultané, notamment lors des périodes critiques comme les inscriptions et l'annonce des résultats d'examens.",
      results: "Transparence institutionnelle nettement améliorée et charge administrative réduite grâce à l'automatisation de la diffusion des informations académiques et réglementaires essentielles. La plateforme est aujourd'hui le premier point de contact des étudiants qui cherchent des informations officielles.",
    },
  },
  "02": {
    en: {
      intro: "EMSI Connect is a dedicated professional and social networking platform engineered to bridge the gap between current students and the extensive alumni network.",
      problem: "Students needed a formal, career-focused networking tool dedicated to the school environment, distinct from general social media. The goal was to foster professional mentoring, career guidance, and community building.",
      solution: "This is a full MERN stack application using Node.js and MongoDB for flexible backend data storage. The key technical challenge was real-time communication, achieved with Socket.io for features like instant messaging and live event updates. The platform offers user directories, event management, and group creation tailored for professional growth.",
      results: "Successfully facilitated professional connections, boosted event attendance, and established a private, secure environment for alumni mentorship and job postings, enhancing the overall student experience and career readiness.",
    },
    fr: {
      intro: "EMSI Connect est une plateforme de réseautage professionnel et social conçue pour créer un pont entre les étudiants actuels et le vaste réseau des alumni.",
      problem: "Les étudiants avaient besoin d'un outil de réseautage formel, orienté carrière et propre à l'école, distinct des réseaux sociaux généralistes. L'objectif : favoriser le mentorat professionnel, l'orientation de carrière et la vie de communauté.",
      solution: "Une application MERN complète, avec Node.js et MongoDB pour un stockage backend flexible. Le principal défi technique était la communication en temps réel, réalisée avec Socket.io pour la messagerie instantanée et les mises à jour d'événements en direct. La plateforme propose des annuaires d'utilisateurs, la gestion d'événements et la création de groupes pensés pour la progression professionnelle.",
      results: "Elle a facilité les mises en relation professionnelles, augmenté la participation aux événements et créé un espace privé et sécurisé pour le mentorat des alumni et les offres d'emploi, améliorant l'expérience étudiante et la préparation à la carrière.",
    },
  },
  "03": {
    en: {
      intro: "StudyHub is a comprehensive Learning Management System (LMS) and academic resource repository, optimized for high traffic and reliability.",
      problem: "Students needed a reliable, centralized location to access and share learning materials. Existing file-sharing methods were slow and unorganized, especially during high-demand periods like final exams.",
      solution: "Engineered with Next.js and TypeScript for robust, type-safe code, the system uses PostgreSQL for structured metadata storage and AWS S3 for secure, high-speed storage and delivery of large course materials (notes, videos, past exams). The deployment and caching strategy were specifically optimized to maintain performance under the peak load of exam periods.",
      results: "Provided a significantly faster and more reliable resource access experience, enabling thousands of students to prepare for exams effectively without site downtime or performance degradation.",
    },
    fr: {
      intro: "StudyHub est un système de gestion de l'apprentissage (LMS) et un dépôt de ressources académiques complet, optimisé pour le fort trafic et la fiabilité.",
      problem: "Les étudiants avaient besoin d'un endroit fiable et centralisé pour accéder aux supports de cours et les partager. Les méthodes de partage de fichiers existantes étaient lentes et désorganisées, surtout pendant les périodes de forte demande comme les examens finaux.",
      solution: "Conçu avec Next.js et TypeScript pour un code robuste et typé, le système utilise PostgreSQL pour les métadonnées structurées et AWS S3 pour le stockage et la diffusion sécurisés et rapides de supports volumineux (notes, vidéos, anciens examens). Le déploiement et la stratégie de cache ont été optimisés pour tenir la charge des pics d'examens.",
      results: "Un accès aux ressources nettement plus rapide et plus fiable, qui permet à des milliers d'étudiants de bien préparer leurs examens sans interruption du site ni baisse de performance.",
    },
  },
  "04": {
    en: {
      intro: "The E-Delegation System is a vital administrative tool designed to streamline student representation and administrative workflows.",
      problem: "The process of electing student representatives (délégués), collecting student feedback, and communicating with administration was manual and inefficient. The goal was to digitize and formalize these administrative operations.",
      solution: "Built with the MERN Stack (MongoDB, Express, React, Node) and Redux for predictable state management across complex voting and communication interfaces. JWT Authentication ensures secure, verifiable voting and role-based access control (administration vs. student delegates). Features include secure voting mechanisms, automated feedback collection forms, and specialized communication channels.",
      results: "Reduced manual administrative overhead, ensured the transparency and integrity of student elections, and provided a structured method for collecting actionable feedback from the student body.",
    },
    fr: {
      intro: "Le système E-Delegation est un outil administratif essentiel conçu pour simplifier la représentation étudiante et les processus administratifs.",
      problem: "L'élection des représentants étudiants (délégués), la collecte des retours des étudiants et la communication avec l'administration étaient manuelles et peu efficaces. L'objectif : numériser et formaliser ces opérations administratives.",
      solution: "Construit avec la stack MERN (MongoDB, Express, React, Node) et Redux pour une gestion d'état prévisible dans des interfaces de vote et de communication complexes. L'authentification JWT garantit un vote sécurisé et vérifiable ainsi qu'un contrôle d'accès par rôle (administration ou délégués étudiants). Au programme : mécanismes de vote sécurisés, formulaires de collecte de retours automatisés et canaux de communication spécialisés.",
      results: "Moins de charge administrative manuelle, transparence et intégrité des élections étudiantes assurées, et une méthode structurée pour recueillir des retours exploitables auprès des étudiants.",
    },
  },
  "05": {
    en: {
      intro: "The Solar System Explorer is an interactive front-end application focused on data visualization and educational rendering.",
      problem: "To create an engaging, technical demonstration of core front-end skills by modeling complex, dynamic data (orbital paths, relative sizes, and positions of planets) without relying on large frameworks.",
      solution: "Developed using Vanilla JavaScript (HTML5 and CSS3) augmented with a 3D Library to handle the geometric rendering. The focus was on optimizing rendering performance and accurately translating real-world astronomical data into a scaled, interactive digital model.",
      results: "Successfully created a highly interactive demonstration proving deep competence in foundational JavaScript, DOM manipulation, and performance-critical front-end rendering techniques.",
    },
    fr: {
      intro: "Solar System Explorer est une application front-end interactive centrée sur la visualisation de données et le rendu pédagogique.",
      problem: "Créer une démonstration technique et engageante des compétences front-end fondamentales, en modélisant des données complexes et dynamiques (trajectoires orbitales, tailles relatives et positions des planètes) sans s'appuyer sur de gros frameworks.",
      solution: "Développée en JavaScript vanilla (HTML5 et CSS3), avec une bibliothèque 3D pour le rendu géométrique. L'accent a été mis sur l'optimisation des performances de rendu et sur la traduction fidèle de données astronomiques réelles en un modèle numérique interactif à l'échelle.",
      results: "Une démonstration très interactive qui prouve une solide maîtrise du JavaScript fondamental, de la manipulation du DOM et des techniques de rendu front-end exigeantes en performance.",
    },
  },
  "06": {
    en: {
      intro: "The Offline Chatbot & Rule Editor is a standalone application built to demonstrate mastery of client-side logic and state persistence.",
      problem: "To create a functional, customizable chatbot that operates entirely client-side, proving strong command over core JavaScript fundamentals, parsing, and data manipulation.",
      solution: "A Vanilla JavaScript application where conversational rules are defined and managed within a JSON structure. A custom front-end editor lets users define new rule patterns and responses, stored locally (via localStorage or IndexedDB, enabling offline capability). The core technical challenge was developing efficient logic to parse user input against the dynamic rule set.",
      results: "A clean, functional demonstration of fundamental JavaScript logic, JSON processing, and reliable client-side state management — skills essential for any modern front-end developer.",
    },
    fr: {
      intro: "Offline Chatbot & Rule Editor est une application autonome conçue pour démontrer la maîtrise de la logique côté client et de la persistance d'état.",
      problem: "Créer un chatbot fonctionnel et personnalisable qui tourne entièrement côté client, et prouver une bonne maîtrise des bases de JavaScript, de l'analyse de texte et de la manipulation de données.",
      solution: "Une application JavaScript vanilla où les règles de conversation sont définies et gérées dans une structure JSON. Un éditeur front-end sur mesure permet de créer de nouveaux motifs de règles et de réponses, stockés localement (via localStorage ou IndexedDB, ce qui permet le mode hors ligne). Le principal défi technique : une logique efficace pour analyser la saisie de l'utilisateur par rapport à un ensemble de règles dynamique.",
      results: "Une démonstration claire et fonctionnelle de la logique JavaScript fondamentale, du traitement JSON et d'une gestion d'état côté client fiable — des compétences essentielles pour tout développeur front-end moderne.",
    },
  },
  "07": {
    en: {
      intro: "WebSlide Generator was conceived in direct response to the surge of AI-driven presentation tools. While these tools offer speed, they often compromise on design control, thematic coherence, and portability of the final asset.",
      problem: "To provide a robust, developer-centric solution: a declarative template system built on Next.js. The architecture guarantees a \"high-fidelity, dependency-free HTML/CSS export\", giving the user aesthetic mastery and technical longevity that automated tools cannot match.",
      solution: "Uses a Next.js framework with TypeScript for type-safe rendering of complex, nested slide structures. Implements a custom export mechanism to generate clean, self-contained HTML/CSS packaged as a ZIP file. The generated code is dependency-free, promoting portability and longevity.",
      results: "A professional-grade presentation tool highly valued by developers and designers who require full control over their output without heavy third-party software.",
    },
    fr: {
      intro: "WebSlide Generator est né en réponse directe à l'essor des outils de présentation pilotés par l'IA. Rapides, ces outils sacrifient souvent le contrôle du design, la cohérence thématique et la portabilité du livrable final.",
      problem: "Proposer une solution robuste, pensée pour les développeurs : un système de modèles déclaratifs construit sur Next.js. L'architecture garantit un « export HTML/CSS haute fidélité et sans dépendances », qui donne à l'utilisateur une maîtrise esthétique et une longévité technique que les outils automatisés ne peuvent pas offrir.",
      solution: "Utilise Next.js avec TypeScript pour un rendu typé de structures de diapositives complexes et imbriquées. Un mécanisme d'export sur mesure génère un HTML/CSS propre et autonome, livré dans une archive ZIP. Le code généré est sans dépendances, ce qui favorise la portabilité et la durabilité.",
      results: "Un outil de présentation de niveau professionnel, très apprécié des développeurs et designers qui veulent un contrôle total sur leur résultat sans logiciel tiers lourd.",
    },
  },
  "08": {
    en: {
      intro: "The Arduino Student Lab bridges the gap between theoretical electrical/physical concepts and practical application. It serves as a comprehensive educational resource for students interested in hardware programming and IoT.",
      problem: "Existing Arduino tutorials are often fragmented or overly technical. The goal was to create a single, clear, highly visual learning path using a project-based approach to master fundamental concepts like digital/analog I/O, PWM, and sensor integration.",
      solution: "Developed using pure HTML5, CSS3, and JavaScript (Vanilla JS) for maximum compatibility and lightweight performance. Features detailed, step-by-step tutorials with embedded circuit diagrams and runnable code snippets, making complex concepts accessible.",
      results: "Provides a reliable starting point for physical computing, demonstrating the ability to translate technical knowledge into clear, structured, and user-friendly documentation.",
    },
    fr: {
      intro: "The Arduino Student Lab fait le lien entre les concepts théoriques d'électricité et de physique et leur application pratique. C'est une ressource éducative complète pour les étudiants intéressés par la programmation matérielle et l'IoT.",
      problem: "Les tutoriels Arduino existants sont souvent fragmentés ou trop techniques. L'objectif : créer un parcours d'apprentissage unique, clair et très visuel, par projets, pour maîtriser les concepts fondamentaux comme les E/S numériques et analogiques, la PWM et l'intégration de capteurs.",
      solution: "Développé en HTML5, CSS3 et JavaScript pur (Vanilla JS) pour une compatibilité maximale et des performances légères. Propose des tutoriels détaillés, pas à pas, avec schémas de circuits intégrés et extraits de code exécutables, pour rendre accessibles des concepts complexes.",
      results: "Un point de départ fiable en informatique physique, qui montre la capacité à transformer un savoir technique en documentation claire, structurée et agréable à utiliser.",
    },
  },
  "09": {
    en: {
      intro: "ExamBuilder (L'Examen Parfait) is an AI-driven solution designed to streamline the workflow for demanding educators. By leveraging large language models, it removes the friction of manual exam drafting and formatting.",
      problem: "Teachers spend significant time creating balanced exam questions and managing layout. The goal was to build a tool that generates high-quality content instantly while ensuring a clean, printable output.",
      solution: "Integrated the Google Gemini API to generate contextually relevant questions based on teacher input. Built with a focus on speed and data security. Implemented an instant PDF export engine converting AI-generated content into a professional, ready-to-print document. Fully localized in French for the target market.",
      results: "A 100% free, secure, and highly efficient tool that can save teachers hours of preparation time per week.",
    },
    fr: {
      intro: "ExamBuilder (L'Examen Parfait) est une solution propulsée par l'IA qui simplifie le quotidien des enseignants exigeants. Grâce aux grands modèles de langage, elle supprime la lourdeur de la rédaction et de la mise en forme manuelles des examens.",
      problem: "Les enseignants passent beaucoup de temps à créer des questions d'examen équilibrées et à gérer la mise en page. L'objectif : un outil qui génère instantanément du contenu de qualité tout en garantissant un résultat propre et imprimable.",
      solution: "Intégration de l'API Google Gemini pour générer des questions pertinentes selon le contexte fourni par l'enseignant, avec un accent sur la rapidité et la sécurité des données. Un moteur d'export PDF instantané transforme le contenu généré par l'IA en document professionnel prêt à imprimer. Entièrement localisé en français pour le marché visé.",
      results: "Un outil 100 % gratuit, sécurisé et très efficace, qui peut faire gagner aux enseignants des heures de préparation par semaine.",
    },
  },
  "10": {
    en: {
      intro: "InternIQ was built to disrupt the inefficient manual internship search process. It provides an automated, intelligence-driven bridge between students and recruiters in the Moroccan market (Rekrute.ma, Emploi.ma, LinkedIn).",
      problem: "Most students use generic applications that yield low response rates. The goal was to build a tool that provides \"10x speed\" by automating the search, analysis, and customization phases of the job hunt.",
      solution: [
        { label: "AI Engine", text: "Integrated Groq AI for ultra-fast natural language processing to score CVs against job descriptions and generate personalized cover letters in seconds." },
        { label: "Smart Scraping", text: "Developed a simultaneous search mechanism for major Moroccan and international job boards." },
        { label: "Backend Architecture", text: "Leveraged Supabase for secure user data management and application tracking, with Vercel Serverless functions for scalable backend logic." },
        { label: "User Experience", text: "Built with React and Vite for a high-performance, minimalist UI that includes a centralized dashboard for tracking application status." },
      ],
      results: "A free-to-use platform that empowers students with data-driven insights and professional-grade application materials, significantly increasing their chances of landing a PFA or stage.",
    },
    fr: {
      intro: "InternIQ a été créé pour bousculer la recherche de stage manuelle et peu efficace. Il offre un pont automatisé et intelligent entre les étudiants et les recruteurs du marché marocain (Rekrute.ma, Emploi.ma, LinkedIn).",
      problem: "La plupart des étudiants envoient des candidatures génériques qui obtiennent peu de réponses. L'objectif : un outil qui apporte une « vitesse x10 » en automatisant les phases de recherche, d'analyse et de personnalisation.",
      solution: [
        { label: "Moteur d'IA", text: "Intégration de Groq AI pour un traitement du langage naturel ultra-rapide : évaluer les CV par rapport aux offres et générer des lettres de motivation personnalisées en quelques secondes." },
        { label: "Scraping intelligent", text: "Mécanisme de recherche simultanée sur les principaux sites d'emploi marocains et internationaux." },
        { label: "Architecture backend", text: "Supabase pour la gestion sécurisée des données utilisateur et le suivi des candidatures, avec des fonctions serverless Vercel pour une logique backend évolutive." },
        { label: "Expérience utilisateur", text: "Construit avec React et Vite pour une interface minimaliste et performante, avec un tableau de bord centralisé pour suivre l'état des candidatures." },
      ],
      results: "Une plateforme gratuite qui donne aux étudiants des analyses basées sur les données et des documents de candidature de niveau professionnel, et augmente nettement leurs chances de décrocher un PFA ou un stage.",
    },
  },
  "11": {
    en: {
      intro: "TIPE CPGE is a coaching platform built to support French preparatory-class (CPGE) students through their TIPE — a mandatory personal research project that plays a major role in admission to top engineering schools (Grandes Écoles).",
      problem: "TIPE season is high-stakes and time-constrained: students need to design an experimental setup, produce simulations, and defend their subject orally, often without structured guidance. The goal was to package that guidance into a self-serve platform.",
      solution: "Built with React and Vite for a fast, minimal SPA experience. The platform offers experimental simulation walkthroughs (physics/engineering models rendered with Python-style scientific tooling), an oral-defense preparation track, a \"Guide TIPE\" resource library, and yearly-specific content (e.g. CNC exam session). Positioned as an independent side project run alongside my engineering studies.",
      results: "Has supported 200+ students preparing their TIPE, with a reported 95% success rate and students admitted to 50+ Grandes Écoles.",
    },
    fr: {
      intro: "TIPE CPGE est une plateforme de coaching qui accompagne les étudiants de classes préparatoires (CPGE) dans leur TIPE — un projet de recherche personnel obligatoire qui pèse lourd dans l'admission aux grandes écoles d'ingénieurs.",
      problem: "La saison des TIPE est à fort enjeu et sous contrainte de temps : les étudiants doivent concevoir un montage expérimental, produire des simulations et défendre leur sujet à l'oral, souvent sans accompagnement structuré. L'objectif : intégrer cet accompagnement dans une plateforme en libre-service.",
      solution: "Construite avec React et Vite pour une expérience SPA rapide et minimale. La plateforme propose des parcours de simulations expérimentales (modèles de physique et d'ingénierie rendus avec des outils scientifiques de type Python), un parcours de préparation à l'oral, une bibliothèque de ressources « Guide TIPE » et du contenu propre à chaque année (par exemple la session du concours CNC). Pensée comme un projet personnel indépendant, mené en parallèle de mes études d'ingénieur.",
      results: "A accompagné plus de 200 étudiants dans la préparation de leur TIPE, avec un taux de réussite annoncé de 95 % et des étudiants admis dans plus de 50 grandes écoles.",
    },
  },
};
