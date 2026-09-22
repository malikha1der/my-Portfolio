import { Project, SkillItem, ExperienceItem, SocialLink } from '../types';

export const PERSONAL_INFO = {
  name: 'Malik Haider',
  title: 'Frontend Developer & Creative Technologist',
  tagline: 'Crafting high-performance digital experiences at the intersection of creative coding, 3D interaction, and clean interface design.',
  bio: `I am a frontend developer specializing in building modern web applications, interactive 3D graphics, and intuitive digital products. With a deep passion for smooth interactions, performance optimization, and refined typography, I bridge the gap between creative visual design and rock-solid engineering.`,
  email: 'malikhaider48008@gmail.com',
  github: 'https://github.com/malikha1der',
  linkedin: 'https://www.linkedin.com/in/malik-haider-1a5017393/',
  status: 'Open for opportunities & select freelance projects',
  location: 'Remote / Available Worldwide',
  stats: [
    { value: '5+', label: 'Years Experience' },
    { value: '30+', label: 'Projects Shipped' },
    { value: '99%', label: 'Avg Performance Score' },
    { value: '100%', label: 'Accessibility Standards' },
  ],
};

export const EMAILJS_CONFIG = {
  serviceId: 'service_8anc4l4',
  templateId: 'template_g624qwg',
  publicKey: 'wzaxxIRdEwK_yuzCG',
};

export const SKILLS_DATA: SkillItem[] = [
  {
    name: 'Three.js & WebGL',
    level: 95,
    category: '3D & Creative',
    icon: 'Boxes',
    description: 'Custom shaders, scene optimization, procedural geometry, lighting & post-processing.',
    highlight: true,
  },
  {
    name: 'React 19 & Next.js',
    level: 98,
    category: 'Core Frontend',
    icon: 'Atom',
    description: 'Component architecture, concurrent rendering, Server Components, and custom hooks.',
    highlight: true,
  },
  {
    name: 'TypeScript',
    level: 96,
    category: 'Core Frontend',
    icon: 'FileCode2',
    description: 'Strict typing, generic systems, modular architectures, and compile-time safety.',
    highlight: true,
  },
  {
    name: 'Motion & Framer Motion',
    level: 94,
    category: '3D & Creative',
    icon: 'Sparkles',
    description: 'Kinetic typography, layout animations, gesture handling, and physics-based transitions.',
  },
  {
    name: 'Tailwind CSS',
    level: 98,
    category: 'Core Frontend',
    icon: 'Palette',
    description: 'Modern utility-first styling, custom design tokens, dark mode systems, and responsive layouts.',
  },
  {
    name: 'Performance & Optimization',
    level: 95,
    category: 'Architecture & Frameworks',
    icon: 'Gauge',
    description: 'Core Web Vitals, memory leak prevention, GPU profiling, and 60-120fps fluid runtimes.',
    highlight: true,
  },
  {
    name: 'State Management (Zustand/Redux)',
    level: 92,
    category: 'Architecture & Frameworks',
    icon: 'Layers',
    description: 'Predictable state stores, atomic updates, persistent caches, and middleware integrations.',
  },
  {
    name: 'Vite & Modern Tooling',
    level: 94,
    category: 'Tools & Ecosystem',
    icon: 'Zap',
    description: 'ESBuild plugins, bundle splitting, asset pipelines, and ultra-fast dev environments.',
  },
  {
    name: 'REST & GraphQL APIs',
    level: 90,
    category: 'Architecture & Frameworks',
    icon: 'Network',
    description: 'Resilient data fetching, optimistic UI updates, error boundary fallbacks, and caching.',
  },
  {
    name: 'UI/UX & Design Systems',
    level: 93,
    category: 'Core Frontend',
    icon: 'LayoutTemplate',
    description: 'Figma to code translation, design tokens, micro-interactions, and WCAG AA accessibility.',
  },
  {
    name: 'Git & Automated CI/CD',
    level: 91,
    category: 'Tools & Ecosystem',
    icon: 'GitBranch',
    description: 'Branch workflows, automated linting, test pipelines, and semantic version releases.',
  },
  {
    name: 'HTML5 & Semantic Web',
    level: 99,
    category: 'Core Frontend',
    icon: 'Code2',
    description: 'Strict accessibility standards, ARIA landmarking, keyboard navigation, and SEO precision.',
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'weather-app',
    title: 'Atmosphere Weather Intelligence',
    subtitle: 'Live Meteorological Dashboard & Real-Time Forecasts',
    description: 'Modern weather forecasting web application developed with React.js, HTML, and CSS. Features instant city meteorological search, dynamic environmental forecasts, humidity and wind telemetry, and responsive temperature trends.',
    longDescription: 'Built with React.js, HTML, and CSS. Features automated city geolocation lookup, semantic HTML layouts, custom responsive CSS styling, dynamic theme switching reflecting real-time weather conditions, temperature trend charts, and optimized client-side state management.',
    category: 'Applications',
    technologies: ['React.js', 'HTML', 'CSS', 'Weather API', 'JavaScript', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    metrics: '<150ms live meteorological updates & offline caching',
  },
  {
    id: 'trucking-logistics-platform',
    title: 'FreightFlow Trucking & Logistics',
    subtitle: 'Commercial Freight Carrier & Fleet Dispatch Platform',
    description: 'Commercial freight carrier and logistics web platform built with Vite, React.js, HTML, CSS, and EmailJS. Features instant shipping rate calculators, fleet capacity showcases, and direct dispatch inquiry submissions.',
    longDescription: 'Production logistics web application built with Vite, React.js, HTML, CSS, and EmailJS. Provides instant freight rate quote calculators, clean semantic HTML structure, responsive CSS layouts, interactive fleet capacity showcases (Dry Van, Reefer, Flatbed), and direct driver dispatch inquiry routing powered by EmailJS.',
    category: 'Applications',
    technologies: ['Vite', 'React.js', 'HTML', 'CSS', 'EmailJS', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    metrics: 'Integrated instant quote calculator & automated dispatch flow',
  },
  {
    id: 'interactive-3d-portfolio',
    title: 'Interactive 3D Developer Portfolio',
    subtitle: 'Creative WebGL Portfolio with Interactive 3D Mannequin',
    description: 'Personal 3D interactive portfolio website engineered using Three.js, React 19, TypeScript, Tailwind CSS, EmailJS, Vite, HTML, CSS, and WebGL. Features an interactive 3D mannequin with mouse cursor tracking, auto-scrolling capabilities, and contact form integration.',
    longDescription: 'Engineered using Three.js, React 19, TypeScript, Tailwind CSS, EmailJS, Vite, HTML, CSS, and WebGL. Incorporates real-time 3D geometry rendering, procedural fragment assembly with smooth mathematical easing, cursor look-at kinematics, infinite smooth auto-scrolling skill marquee with pause controls, and direct client-side email delivery via verified EmailJS service.',
    category: '3D & WebGL',
    technologies: ['Three.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'EmailJS', 'Vite', 'HTML', 'CSS', 'WebGL'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    metrics: '60-120 FPS WebGL pipeline & 100/100 Accessibility score',
  },
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    period: '2023 — Present',
    role: 'Senior Frontend Developer & Creative Technologist',
    company: 'Independent / Digital Studio Contracts',
    location: 'Remote',
    description: [
      'Architected bespoke interactive web applications and 3D landing experiences with Three.js, React, and TypeScript.',
      'Achieved average Lighthouse performance scores of 95+ through strategic lazy loading, GPU transform caching, and tree-shaking.',
      'Created custom GLSL shaders and kinetic animation systems for premium global brand launches.',
    ],
    skills: ['Three.js', 'React', 'TypeScript', 'Motion', 'WebGL', 'Tailwind CSS'],
  },
  {
    period: '2021 — 2023',
    role: 'Frontend Engineer',
    company: 'NextGen Digital Labs',
    location: 'Remote / Hybrid',
    description: [
      'Developed high-traffic SaaS client interfaces, data visualizations, and custom component libraries.',
      'Reduced initial bundle sizes by 42% through code-splitting, dynamic imports, and asset optimization.',
      'Collaborated closely with UX designers to translate complex Figma prototypes into pixel-perfect responsive code.',
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'REST APIs', 'Performance Optimization'],
  },
  {
    period: '2019 — 2021',
    role: 'UI/UX & Web Developer',
    company: 'Creative Media Works',
    location: 'Contract',
    description: [
      'Built responsive client websites, bespoke portfolio showcases, and high-converting marketing experiences.',
      'Implemented cross-browser compatible animations and semantic HTML adhering to strict accessibility guidelines.',
    ],
    skills: ['JavaScript (ES6+)', 'HTML5 / CSS3', 'Git', 'UI/UX Prototyping'],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/malikha1der', iconName: 'Github', username: '@malikha1der' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/malik-haider-1a5017393/', iconName: 'Linkedin', username: 'in/malik-haider' },
  { label: 'Email', href: 'mailto:malikhaider48008@gmail.com', iconName: 'Mail', username: 'malikhaider48008@gmail.com' },
];
